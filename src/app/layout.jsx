"use client";                                                      // Exécution côté client (wheel/touch/RAF)

// === IMPORTS (styles + composants globaux)
import "../styles/tools/_tailwind.css";                            // Styles utilitaires Tailwind
import "../styles/globals.scss";                                   // SCSS global
import Header from "@/components/Header";                          // En-tête (menu)
import Footer from "@/components/Footer";                          // Pied de page (présentation)
import { useEffect, useRef } from "react";                         // Hooks React
import RealisticWaveEffect from "@/components/RealisticWaveEffect";// Vague décorative en haut
import { SectionProvider } from "@/components/SectionProvider";    // Contexte sections (si utilisé)
import { I18nProvider } from "@/i18n/I18nProvider";                // Provider i18n

export default function RootLayout({ children }) {                 // Composant racine (Layout)
  // --- Refs UI (DOM)
  const footerWrapRef = useRef(null);                               // Wrapper FIXE du footer (animé en transform)

  // --- Refs d'animation (pas de re-render)
  const footerHRef = useRef(140);                                   // Hauteur mesurée du footer
  const revealRef = useRef(0);                                      // Révélation affichée [0..1]
  const targetRef = useRef(0);                                      // Révélation cible [0..1]
  const rafRef = useRef(null);                                      // ID requestAnimationFrame
  const settleTimerRef = useRef(null);                              // Timer snap (0/1)
  const reverseTimerRef = useRef(null);                             // Timer repli (scroll inverse)

  // --- Gate / Gestes
  const activatedRef = useRef(false);                               // Gate anti-accident (false = verrouillé)
  const activateSumRef = useRef(0);                                 // Accumulation de scroll (desktop)
  const lastWheelTsRef = useRef(0);                                 // Timestamp dernier wheel
  const touchStartYRef = useRef(0);                                 // Y de départ (mobile)
  const touchStartRevealRef = useRef(0);                            // Révélation de départ (mobile)

  // --- Auto-hide / Hover lock
  const autoHideTimerRef = useRef(null);                            // Timer d’auto-fermeture
  const hoverLockRef = useRef(false);                               // Lock si hover/focus

  // --- Réglages (sensibilité/rythme)
  const ACTIVATE_THRESHOLD = 240;                                    // ▲ Gate desktop (exigeant)
  const REVERSE_HIDE_DELAY = 600;                                    // Délai repli si on remonte
  const SETTLE_DELAY = 220;                                          // Délai snap 0/1
  const HALF_THRESHOLD = 0.5;                                        // Seuil 50% (snap)
  const LERP_ALPHA = 0.12;                                           // ▼ Lerp plus lent (progressif)
  const AUTO_HIDE_MS = 5000;                                         // Auto-hide
  const DESKTOP_SCROLL_TO_FULL = 2.0;                                // ▲ 0→1 ≈ 2× hauteur footer (desktop)
  const MOBILE_SCROLL_FACTOR   = 1.35;                               // ▲ Drag mobile plus “lourd”
  const MOBILE_GATE_RATIO      = 0.35;                               // ▲ Tirer ≥35% pour démarrer (mobile)

  // --- Applique l'état d'anim (on anime UNIQUEMENT le footer overlay)
  const applyTransforms = () => {                                    // Met à jour le DOM sans re-render
    const h = footerHRef.current || 120;                             // Hauteur footer
    const r = revealRef.current;                                     // Révélation 0..1
    if (footerWrapRef.current) {                                     // Si wrapper présent
      footerWrapRef.current.style.transform =                        // Slide depuis le bas
        `translateY(${Math.round((1 - r) * h)}px)`;                  // r=0→caché, r=1→visible
      footerWrapRef.current.style.pointerEvents = r >= 0.75 ? "auto" : "none"; // Évite clics prématurés
      footerWrapRef.current.style.opacity = r > 0 ? "1" : "0";       // Discret quand 0
    }
  };

  // --- Boucle RAF (lerp reveal → target)
  useEffect(() => {                                                  // Démarre RAF une fois
    const loop = () => {                                             // Frame d’anim
      const x = revealRef.current;                                   // Position actuelle
      const t = targetRef.current;                                   // Cible
      revealRef.current = Math.max(0, Math.min(1, x + (t - x) * LERP_ALPHA)); // Lerp + clamp
      applyTransforms();                                             // Applique au DOM
      rafRef.current = requestAnimationFrame(loop);                  // Prochaine frame
    };
    rafRef.current = requestAnimationFrame(loop);                    // Lance la boucle
    return () => cancelAnimationFrame(rafRef.current);               // Nettoyage
  }, []);                                                            // Une fois

  // --- Mesure dynamique de la hauteur du footer
  useEffect(() => {                                                  // Observe la taille réelle
    const measure = () => {                                          // Fonction de mesure
      const h = footerWrapRef.current?.offsetHeight || 0;            // Hauteur réelle
      if (h > 0) footerHRef.current = h;                             // Stocke
      applyTransforms();                                             // Re-applique
    };
    const ro = new ResizeObserver(measure);                          // Observer de taille
    if (footerWrapRef.current) ro.observe(footerWrapRef.current);    // Observe le footer
    window.addEventListener("load", measure, { once: true });        // Re-mesure après chargement
    window.addEventListener("orientationchange", measure);           // Re-mesure à la rotation
    measure();                                                       // Mesure immédiate
    return () => { ro.disconnect(); window.removeEventListener("orientationchange", measure); }; // Cleanup
  }, []);                                                            // Une fois

  // --- Snap 0/1 après courte inaction
  const scheduleSettle = () => {                                     // Programme la décision 0/1
    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);// Reset timer
    settleTimerRef.current = setTimeout(() => {                      // Lance timer
      const r = revealRef.current;                                   // Révélation actuelle
      targetRef.current = r >= HALF_THRESHOLD ? 1 : 0;               // ≥50% → 1 ; sinon → 0
      if (r < HALF_THRESHOLD) { activatedRef.current = false; activateSumRef.current = 0; } // Re-lock gate
    }, SETTLE_DELAY);                                                // Délai
  };

  // --- Auto-hide quand ouvert et pas survolé
  const armAutoHide = () => {                                        // Programme auto-fermeture
    if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current); // Reset
    if (!hoverLockRef.current) {                                     // Uniquement si pas verrouillé par hover/focus
      autoHideTimerRef.current = setTimeout(() => {                  // Lance
        targetRef.current = 0;                                       // Ferme
        activatedRef.current = false;                                // Gate OFF
        activateSumRef.current = 0;                                  // Reset
      }, AUTO_HIDE_MS);                                              // Délai
    }
  };

  // --- Hover / Focus lock (empêche auto-hide)
  useEffect(() => {                                                  // Écoute sur le footer
    const el = footerWrapRef.current; if (!el) return;               // Sécurité
    const onEnter = () => { hoverLockRef.current = true; if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current); }; // Lock
    const onLeave = () => { hoverLockRef.current = false; if (revealRef.current >= 0.999) armAutoHide(); };                         // Unlock
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("focusin", onEnter);
    el.addEventListener("focusout", onLeave);
    return () => { el.removeEventListener("mouseenter", onEnter); el.removeEventListener("mouseleave", onLeave); el.removeEventListener("focusin", onEnter); el.removeEventListener("focusout", onLeave); }; // Cleanup
  }, []);                                                            // Une fois

  // --- Wheel (desktop) : normalisation + gate + friction + repli inverse
  useEffect(() => {                                                  // Ajoute l'écouteur wheel
    const onWheel = (e) => {                                         // Handler molette
      // Normalise deltaY (0=pixels, 1=ligne, 2=page)
      let dy = e.deltaY;                                             // Delta brut
      if (e.deltaMode === 1) dy *= 16;                               // ≈16px/ligne
      else if (e.deltaMode === 2) dy *= window.innerHeight;          // ≈1 page

      if (Math.abs(dy) < 6) return;                                  // Filtre micro-impulsions

      // Gate d’activation (évite l’ouverture accidentelle)
      if (dy > 0 && revealRef.current === 0 && !activatedRef.current) {
        const now = performance.now();                               // Horodatage
        const dt = now - (lastWheelTsRef.current || now);            // Temps depuis la dernière impulsion
        if (dt > 600) activateSumRef.current = 0;                    // Scroll non continu → reset
        else if (dt > 280) activateSumRef.current *= 0.5;            // Demi-vie si impulsions espacées
        lastWheelTsRef.current = now;                                // MàJ timestamp
        activateSumRef.current += dy;                                // Accumule l'intention
        if (activateSumRef.current < ACTIVATE_THRESHOLD) return;     // Pas assez → on ignore
        activatedRef.current = true;                                 // Gate franchie
      }

      // Progression avec friction progressive (lent au début)
      const h = footerHRef.current || 140;                           // Hauteur footer
      const factor = h * DESKTOP_SCROLL_TO_FULL;                     // Coût 0→1 (ex: 2.0 * h)
      const r = revealRef.current;                                   // Révélation actuelle
      const friction = 0.35 + 0.65 * r;                              // 0.35→lent au début →1 vers la fin
      const inc = (dy / factor) * friction;                          // Incrément freiné
      targetRef.current = Math.max(0, Math.min(1, targetRef.current + inc)); // Mise à jour cible (clamp)

      // Repli différé si on remonte
      if (dy > 0 && reverseTimerRef.current) clearTimeout(reverseTimerRef.current);   // On annule un repli programmé
      if (dy < 0 && revealRef.current >= 0.5) {                                     // Si on remonte à moitié ou plus
        if (reverseTimerRef.current) clearTimeout(reverseTimerRef.current);          // Reset timer
        reverseTimerRef.current = setTimeout(() => {                                 // Programme repli
          targetRef.current = 0; activatedRef.current = false; activateSumRef.current = 0; // Ferme + re-lock gate
        }, REVERSE_HIDE_DELAY);                                                      // Délai
      }

      if (revealRef.current >= 0.999) armAutoHide();                 // Arme auto-hide si 100%
      scheduleSettle();                                              // Snap 0/1 si pause
    };

    window.addEventListener("wheel", onWheel, { passive: true });    // Listener performant
    return () => window.removeEventListener("wheel", onWheel);       // Cleanup
  }, []);                                                            // Une fois

  // --- Touch (mobile) : gate plus haute + friction + snap
  useEffect(() => {                                                  // Écouteurs tactiles
    const onStart = (e) => {                                         // Début geste
      const t = e.touches?.[0]; if (!t) return;                      // Sécurité
      touchStartYRef.current = t.clientY;                            // Mémorise Y départ
      touchStartRevealRef.current = revealRef.current;               // Mémorise révélation départ
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current); // Stop snap en cours
    };
    const onMove = (e) => {                                          // Geste en cours
      const t = e.touches?.[0]; if (!t) return;                      // Sécurité
      const dy = touchStartYRef.current - t.clientY;                 // Vers le haut = positif
      const h = footerHRef.current || 140;                           // Hauteur footer

      // Gate mobile : tirer ≥35% pour démarrer
      if (!activatedRef.current && dy > 0 && revealRef.current === 0) {
        if (dy < h * MOBILE_GATE_RATIO) return;                      // Pas assez → ignore
        activatedRef.current = true;                                 // Gate franchie
      }

      const r = revealRef.current;                                   // Révélation actuelle
      const friction = 0.4 + 0.6 * r;                                // Frein au début
      const next = touchStartRevealRef.current +                     // Révélation de départ
                   (dy / (h * MOBILE_SCROLL_FACTOR)) * friction;     // Δ normalisé + friction + facteur “lourd”
      targetRef.current = Math.max(0, Math.min(1, next));            // Clamp 0..1
    };
    const onEnd = () => {                                            // Fin geste
      const r = revealRef.current;                                   // Révélation atteinte
      targetRef.current = r >= HALF_THRESHOLD ? 1 : 0;               // Snap 0/1
      if (targetRef.current === 1) armAutoHide();                    // Auto-hide si ouvert
      if (targetRef.current === 0) { activatedRef.current = false; activateSumRef.current = 0; } // Re-lock gate
    };

    window.addEventListener("touchstart", onStart, { passive: true });// Abonne touchstart
    window.addEventListener("touchmove", onMove, { passive: true });  // Abonne touchmove
    window.addEventListener("touchend", onEnd, { passive: true });    // Abonne touchend
    return () => { window.removeEventListener("touchstart", onStart); window.removeEventListener("touchmove", onMove); window.removeEventListener("touchend", onEnd); }; // Cleanup
  }, []);                                                            // Une fois

  // --- Événement global : bouton “hideFooter”
  useEffect(() => {                                                  // Écoute le CustomEvent
    const onHide = () => {                                           // Handler
      targetRef.current = 0;                                         // Ferme
      activatedRef.current = false;                                  // Gate OFF
      activateSumRef.current = 0;                                    // Reset
      if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current); // Stop auto-hide
      if (reverseTimerRef.current) clearTimeout(reverseTimerRef.current);   // Stop repli planifié
      scheduleSettle();                                              // Assure le snap 0/1
    };
    document.addEventListener("hideFooter", onHide);                 // Abonne
    return () => document.removeEventListener("hideFooter", onHide); // Cleanup
  }, []);                                                            // Une fois

  // ⚠️ IMPORTANT: AUCUN espace/retour-ligne entre <html> et <body>, sinon nœud texte (hydration error)
  return (<html lang="fr"><body style={{ overflow: "hidden", height: "100svh" }}>
        <I18nProvider>                                               {/* Provider i18n */}
          {/* Fond fixe : dégradé + vague top */}
          <div className="fixed inset-0 -z-10 pointer-events-none">  {/* Décor non interactif */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50" /> {/* Dégradé */}
            <div className="absolute top-0 inset-x-0 h-[90px]">      {/* Bande supérieure */}
              <RealisticWaveEffect height={110} amplitude={11} frequency={0.009} speed={0.015} color="#009ee0" opacity={0.9} layers={8} /> {/* Vague */}
            </div>
          </div>

          <SectionProvider>                                          {/* Contexte sections (si utilisé) */}
            <Header />                                               {/* Menu fixe top */}

            {/* Viewport figé : aucun scroll */}
            <main className="fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>{children}</main> {/* Contenu plein écran */}

            {/* Footer overlay animé en transform */}
            <div ref={footerWrapRef} className="fixed left-0 right-0 bottom-0 z-50 transform-gpu will-change-transform">
              <Footer />                                             {/* Présentation uniquement */}
            </div>
          </SectionProvider>
        </I18nProvider>
      </body></html>);                                               // ⚠️ Garder html/body sur la même ligne (pas d’espace)
}
