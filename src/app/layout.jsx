"use client";                                                      // Exécution côté client (nécessaire pour wheel/touch/RAF)

import "../styles/tools/_tailwind.css";                            // Charge Tailwind (utilitaires)
import "../styles/globals.scss";                                   // Styles SCSS globaux
import Header from "@/components/Header";                          // En-tête global
import Footer from "@/components/Footer";                          // Pied de page (présentation uniquement)
import { useEffect, useRef } from "react";                         // Hooks React
import RealisticWaveEffect from "@/components/RealisticWaveEffect";// Vague décorative haute
import { SectionProvider } from "@/components/SectionProvider";    // Contexte sections (si utilisé)
import { I18nProvider } from "@/i18n/I18nProvider";                // Provider i18n global

export default function RootLayout({ children }) {                 // Composant Layout racine
  const mainRef = useRef(null);                                    // Réf vers <main> (on le translate vers le haut)
  const footerWrapRef = useRef(null);                              // Réf vers le wrapper FIXE du footer (on le translate depuis le bas)

  const footerHRef = useRef(140);                                   // Hauteur mesurée du footer (px)
  const revealRef = useRef(0);                                      // Révélation affichée [0..1]
  const targetRef = useRef(0);                                      // Révélation cible [0..1]
  const rafRef = useRef(null);                                      // ID de la boucle requestAnimationFrame
  const settleTimerRef = useRef(null);                              // Timer de snap (vers 0 ou 1 après inaction)
  const reverseTimerRef = useRef(null);                             // Timer de repli après scroll inverse

  const activatedRef = useRef(false);                               // Gate anti-accident desktop/mobile (false = verrouillé)
  const activateSumRef = useRef(0);                                 // Accumulation du deltaY pour franchir la gate desktop

  const touchStartYRef = useRef(0);                                 // Y de départ du geste tactile
  const touchStartRevealRef = useRef(0);                            // Révélation de départ du geste tactile

  const autoHideTimerRef = useRef(null);                            // Timer d’auto-fermeture (inactivité)
  const hoverLockRef = useRef(false);                               // Verrou utilisateur (survol/focus empêche l’auto-hide)

  const ACTIVATE_THRESHOLD = 80;                                     // Δwheel cumulé pour ouvrir (desktop)
  const REVERSE_HIDE_DELAY = 600;                                    // Délai avant repli si on remonte (ms)
  const SETTLE_DELAY = 220;                                          // Délai avant snap 0/1 après inaction (ms)
  const HALF_THRESHOLD = 0.5;                                        // Seuil milieu pour snap (50%)
  const LERP_ALPHA = 0.18;                                           // Vitesse du lerp (fluidité)
  const AUTO_HIDE_MS = 5000;                                         // Durée avant auto-hide si ouvert & pas survolé (ms)

  const applyTransforms = () => {                                    // Applique les transforms au DOM (sans re-render)
    const h = footerHRef.current || 120;                             // Hauteur actuelle du footer
    const r = revealRef.current;                                     // Révélation actuelle [0..1]
    if (mainRef.current) {                                           // Si <main> est dispo
      mainRef.current.style.transform = `translateY(${-Math.round(h * r)}px)`; // Monte le contenu pour faire place au footer
    }
    if (footerWrapRef.current) {                                     // Si wrapper footer dispo
      footerWrapRef.current.style.transform = `translateY(${Math.round((1 - r) * h)}px)`; // Fait sortir le footer depuis le bas
      footerWrapRef.current.style.pointerEvents = r >= 0.75 ? "auto" : "none";            // Bloque interactions tant que pas assez visible
      footerWrapRef.current.style.opacity = r > 0 ? "1" : "0";                              // Opacité 0 quand totalement caché
    }
  };

  useEffect(() => {                                                  // Boucle RAF (lerp progress → target)
    const loop = () => {                                             // Fonction appelée à chaque frame (~60 fps)
      const x = revealRef.current;                                   // Révélation actuelle
      const t = targetRef.current;                                   // Cible souhaitée
      const nx = x + (t - x) * LERP_ALPHA;                           // Interpolation linéaire lissée
      revealRef.current = Math.max(0, Math.min(1, nx));              // Clamp [0..1] pour sécurité
      applyTransforms();                                             // Applique les transforms calculées
      rafRef.current = requestAnimationFrame(loop);                  // Planifie la prochaine frame
    };
    rafRef.current = requestAnimationFrame(loop);                    // Démarre la boucle
    return () => cancelAnimationFrame(rafRef.current);               // Nettoie à l’unmount
  }, []);                                                            // Exécute une fois

  useEffect(() => {                                                  // Mesure dynamique de la hauteur du footer
    const measure = () => {                                          // Fonction de mesure
      const h = footerWrapRef.current?.offsetHeight || 0;            // Lit la hauteur réelle
      if (h > 0) footerHRef.current = h;                             // Stocke la hauteur si valide
      applyTransforms();                                             // Ré-applique les transforms avec la bonne hauteur
    };
    const ro = new ResizeObserver(measure);                          // Observe les changements de taille
    if (footerWrapRef.current) ro.observe(footerWrapRef.current);    // Observe le wrapper footer
    window.addEventListener("load", measure, { once: true });        // Re-mesure après chargement
    window.addEventListener("orientationchange", measure);           // Re-mesure à la rotation mobile
    measure();                                                       // Mesure immédiate
    return () => {                                                   // Nettoyage
      ro.disconnect();                                               // Arrête l’observeur
      window.removeEventListener("orientationchange", measure);      // Retire l’écouteur
    };
  }, []);                                                            // Exécute une fois

  const scheduleSettle = () => {                                     // Programme le snap 0/1 après courte inaction
    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);// Annule un timer existant
    settleTimerRef.current = setTimeout(() => {                      // Lance un nouveau timer
      const r = revealRef.current;                                   // Lit la révélation actuelle
      targetRef.current = r >= HALF_THRESHOLD ? 1 : 0;               // ≥50% → 1 ; sinon → 0
      if (r < HALF_THRESHOLD) {                                      // Si on referme
        activatedRef.current = false;                                // Re-verrouille la gate
        activateSumRef.current = 0;                                  // Réinitialise l’accumulation
      }
    }, SETTLE_DELAY);                                                // Délai (ms)
  };

  const armAutoHide = () => {                                        // Arme l’auto-fermeture (si pas survolé)
    if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current); // Annule un timer précédent
    if (!hoverLockRef.current) {                                     // Seulement si pas verrouillé par hover/focus
      autoHideTimerRef.current = setTimeout(() => {                  // Lance le timer
        targetRef.current = 0;                                       // Ferme le footer
        activatedRef.current = false;                                // Re-verrouille la gate
        activateSumRef.current = 0;                                  // Reset accumulation
      }, AUTO_HIDE_MS);                                              // Délai (ms)
    }
  };

  useEffect(() => {                                                  // Gère le verrou hover/focus du footer
    const el = footerWrapRef.current;                                // Récupère l’élément
    if (!el) return;                                                 // Sécurité
    const onEnter = () => {                                          // Survol/focus
      hoverLockRef.current = true;                                   // Verrou ON
      if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current); // Stop l’auto-hide
    };
    const onLeave = () => {                                          // Sortie/blur
      hoverLockRef.current = false;                                  // Verrou OFF
      if (revealRef.current >= 0.999) armAutoHide();                 // Si ouvert, re-arme auto-hide
    };
    el.addEventListener("mouseenter", onEnter);                      // Écoute survol
    el.addEventListener("mouseleave", onLeave);                      // Écoute sortie
    el.addEventListener("focusin", onEnter);                         // Écoute focus
    el.addEventListener("focusout", onLeave);                        // Écoute blur
    return () => {                                                   // Nettoyage
      el.removeEventListener("mouseenter", onEnter);                 // Retire écouteurs
      el.removeEventListener("mouseleave", onLeave);                 // Retire écouteurs
      el.removeEventListener("focusin", onEnter);                    // Retire écouteurs
      el.removeEventListener("focusout", onLeave);                   // Retire écouteurs
    };
  }, []);                                                            // Exécute une fois

  useEffect(() => {                                                  // Handler WHEEL (desktop) : gate + proportionnel
    const onWheel = (e) => {                                         // Callback sur wheel
      const dy = e.deltaY;                                           // Δ vertical (px)
      if (Math.abs(dy) < 4) return;                                  // Ignore micro impulsions
      if (dy > 0 && revealRef.current === 0 && !activatedRef.current){ // Si fermé et on descend
        activateSumRef.current += dy;                                // Cumule le dy pour franchir la gate
        if (activateSumRef.current < ACTIVATE_THRESHOLD) return;     // Pas assez → ignore
        activatedRef.current = true;                                 // Gate franchie → autoriser l’ouverture
      }
      const h = footerHRef.current || 140;                           // Hauteur footer
      const factor = h * 0.9;                                        // Sensibilité (0→1 ≈ 0.9*h de scroll)
      const next = targetRef.current + dy / factor;                  // Nouvelle cible proportionnelle
      targetRef.current = Math.max(0, Math.min(1, next));            // Clamp [0..1]
      if (dy > 0 && reverseTimerRef.current) {                       // Si on re-descend
        clearTimeout(reverseTimerRef.current);                       // Annule un éventuel repli programmé
      }
      if (dy < 0 && revealRef.current >= 0.5) {                      // Si on remonte et footer ≥ moitié
        if (reverseTimerRef.current) clearTimeout(reverseTimerRef.current); // Reset timer
        reverseTimerRef.current = setTimeout(() => {                 // Programme repli différé
          targetRef.current = 0;                                     // Ferme le footer
          activatedRef.current = false;                              // Re-verrouille la gate
          activateSumRef.current = 0;                                // Reset accumulation
        }, REVERSE_HIDE_DELAY);                                      // Délai (ms)
      }
      if (revealRef.current >= 0.999) armAutoHide();                 // Si déjà pleinement ouvert → arme auto-hide
      scheduleSettle();                                              // Snap si on s’arrête de scroller
    };
    window.addEventListener("wheel", onWheel, { passive: true });    // Ajoute l’écouteur global
    return () => window.removeEventListener("wheel", onWheel);       // Nettoie à l’unmount
  }, []);                                                            // Exécute une fois

  useEffect(() => {                                                  // Handlers TOUCH (mobile) : gate + drag
    const onStart = (e) => {                                         // Début geste
      const t = e.touches?.[0];                                      // Premier doigt
      if (!t) return;                                                // Sécurité
      touchStartYRef.current = t.clientY;                            // Mémorise Y de départ
      touchStartRevealRef.current = revealRef.current;               // Mémorise la révélation initiale
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current); // Stoppe un snap en cours
    };
    const onMove = (e) => {                                          // Geste en cours
      const t = e.touches?.[0];                                      // Premier doigt
      if (!t) return;                                                // Sécurité
      const dy = touchStartYRef.current - t.clientY;                 // Vers le haut = positif
      const h = footerHRef.current || 140;                           // Hauteur footer
      if (!activatedRef.current && dy > 0 && revealRef.current === 0){ // Gate mobile (anti-accident)
        if (dy < h * 0.25) return;                                   // < 25% de h tiré → ignore
        activatedRef.current = true;                                 // Gate franchie → autoriser l’ouverture
      }
      const delta = dy / h;                                          // Δ normalisé
      const next = touchStartRevealRef.current + delta;              // Cible = départ + delta
      targetRef.current = Math.max(0, Math.min(1, next));            // Clamp [0..1]
    };
    const onEnd = () => {                                            // Fin geste
      const r = revealRef.current;                                   // Révélation atteinte
      targetRef.current = r >= HALF_THRESHOLD ? 1 : 0;               // Snap à 0/1
      if (targetRef.current === 1) armAutoHide();                    // Si ouvert → arme auto-hide
      if (targetRef.current === 0) {                                 // Si refermé
        activatedRef.current = false;                                // Re-verrouille la gate
        activateSumRef.current = 0;                                  // Reset accumulation
      }
    };
    window.addEventListener("touchstart", onStart, { passive: true });// Écoute touchstart
    window.addEventListener("touchmove", onMove, { passive: true });  // Écoute touchmove
    window.addEventListener("touchend", onEnd, { passive: true });    // Écoute touchend
    return () => {                                                   // Nettoyage
      window.removeEventListener("touchstart", onStart);             // Retire écouteurs
      window.removeEventListener("touchmove", onMove);               // Retire écouteurs
      window.removeEventListener("touchend", onEnd);                 // Retire écouteurs
    };
  }, []);                                                            // Exécute une fois

  useEffect(() => {                                                  // Événement global pour “cacher” (depuis le bouton)
    const onHide = () => {                                           // Handler CustomEvent("hideFooter")
      targetRef.current = 0;                                         // Vise la fermeture
      activatedRef.current = false;                                  // Re-verrouille la gate
      activateSumRef.current = 0;                                    // Reset accumulation
      if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current); // Stop auto-hide
      if (reverseTimerRef.current) clearTimeout(reverseTimerRef.current);   // Stop reverse timer
      scheduleSettle();                                              // Programmera le snap (sécurité)
    };
    document.addEventListener("hideFooter", onHide);                 // Écoute l’event
    return () => document.removeEventListener("hideFooter", onHide); // Nettoyage
  }, []);                                                            // Exécute une fois

  return (                                                           // Rendu du layout
    <html lang="fr">                                                 {/* Langue du document */}
  <body>{/* Scroll natif autorisé */}
        <I18nProvider>                                               {/* Contexte i18n */}
          <div className="fixed inset-0 -z-10 pointer-events-none">  {/* Fond décoratif non interactif */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50" /> {/* Dégradé */}
            <div className="absolute top-0 inset-x-0 h-[90px]">      {/* Bande supérieure avec vague */}
              <RealisticWaveEffect                                  // Vague décorative
                height={110}                                         // Hauteur
                amplitude={11}                                       // Amplitude
                frequency={0.009}                                    // Fréquence
                speed={0.015}                                        // Vitesse
                color="#009ee0"                                      // Couleur
                opacity={0.9}                                        // Opacité
                layers={8}                                           // Couches
              />
            </div>
          </div>

          <SectionProvider>                                          {/* Contexte de sections (si utilisé) */}
            <Header />                                               {/* En-tête global */}

            <main                                                    // Contenu principal (translaté vers le haut quand le footer sort)
              ref={mainRef}                                          // Réf pour transform GPU
              className="relative min-h-screen transform-gpu will-change-transform" // Perf/clipping
              style={{
                transition: "transform 120ms ease-out",              // Lissage des micro-ajustements
              }}
            >
              {children}                                             {/* Contenu des pages */}
            </main>

            <div                                                     // Wrapper FIXE du footer (tout le bloc bouge ensemble)
              ref={footerWrapRef}                                    // Réf pour transforms & mesure
              className="fixed left-0 right-0 bottom-0 z-50 transform-gpu will-change-transform" // Position fixe bas
              style={{
                // NOTE: pas de safe-area ici (il est déjà géré dans Footer lui-même)
              }}
            >
              <Footer />                                             {/* Footer (présentation) */}
            </div>
          </SectionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
