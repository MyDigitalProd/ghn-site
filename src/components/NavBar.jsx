"use client"; // Indique que ce composant s'exécute côté client (hooks autorisés)

import { useState, useEffect, useRef, useCallback } from "react"; // Import des hooks React
import { usePathname, useRouter } from "next/navigation"; // Hooks Next pour la navigation App Router
import { useSection } from "./SectionProvider"; // Contexte interne pour la section active (mode "scène")
import { useI18n } from "@/i18n/I18nProvider"; // Contexte i18n custom (t, lang, setLang)
import { AnimatePresence, motion } from "framer-motion"; // Framer Motion (AnimatePresence + motion fiable)

/* === Sections & labels (fallback local si t() indisponible) === */
const SECTION_IDS = [
  "accueil", "construction", "renovation", "depannage",
  "hivernage", "entretien", "terrasses", "nos-realisations", "contact",
]; // Liste des ancres/IDs de sections
const LABELS = {
  accueil: "Accueil", construction: "Construction", renovation: "Rénovation",
  depannage: "Dépannage", hivernage: "Hivernage", entretien: "Entretien",
  terrasses: "Terrasses", "nos-realisations": "Réalisations", contact: "Contact"
}; // Libellés par défaut si nécessaire

// Fonction modulo positive (utile pour faire boucler des index)
const mod = (n, m) => ((n % m) + m) % m;

export default function NavBar() {
  /* === Contextes === */
  const { active: ctxActive, setActive: setCtxActive } = useSection(); // État global de section active (mode "scène")
  const { t, lang, setLang } = useI18n(); // i18n : traduction, langue courante, setter langue

  /* === Router & Path === */
  const router = useRouter(); // Permet de pousser/remplacer l'URL
  const pathname = usePathname(); // Chemin courant (sans query ni hash)

  /* === Drapeaux (assets locaux) === */
  const FLAG_SRC = { fr: "/img/flags/fr.svg", nl: "/img/flags/nl.svg", en: "/img/flags/gb.svg" }; // Map code langue -> icône

  /* === États locaux === */
  const [activeId, setActiveId] = useState("accueil"); // ID de section active pour le rendu visuel
  const [pickerOpen, setOpen] = useState(false); // État du "picker" de sections (désactivé ici côté desktop)
  const [pickerIndex, setIndex] = useState(0); // Index de la section active (utile pour roulette mobile)
  const [hovered, setHovered] = useState(""); // ID de section survolée (effets visuels)
  const [waveVisible, setWave] = useState(true); // Contrôle de l'animation "vague" sous le lien (cosmétique)
  const [langOpen, setLangOpen] = useState(false); // OUVERTURE du sélecteur de langue (le bug venait souvent d'ici)

  /* === Refs === */
  const pickerRef = useRef(null); // Référence sur la "roulette" (mobile)
  const overlayClickRef = useRef(false); // Référence pour clic overlay (non utilisé ici)
  const hideWaveTimer = useRef(null); // Timer pour masquer/afficher la vague (cosmétique)
  const scrollSpyTicking = useRef(false); // Verrou pour scrollspy (évite les rafales)
  const lastMoves = useRef([]); // Historique des mouvements tactiles (momentum)
  const langRef = useRef(null); // Référence du conteneur du sélecteur de langue (pour détecter clic extérieur)

  /* === Const dérivées === */
  const ITEMS_COUNT = SECTION_IDS.length; // Nombre de sections
  const LOOPED_LIST = [...SECTION_IDS, ...SECTION_IDS, ...SECTION_IDS]; // Liste bouclée (roulette mobile)

  /* === Scrollspy (détermine la section visible au scroll de pages longues) === */
  useEffect(() => {
    let debounceId; // ID du timer debounce
    let rafId; // ID du requestAnimationFrame
    const onScroll = () => {
      const doc = document.documentElement; // Racine du document
      if (doc && doc.scrollHeight <= window.innerHeight + 1) return; // Si pas de scroll vertical, on sort (mode scène)
      if (scrollSpyTicking.current) return; // Si déjà en train de calculer, on ignore l'événement
      scrollSpyTicking.current = true; // Verrouille

      clearTimeout(debounceId); // Réinitialise le debounce
      debounceId = setTimeout(() => { // Attend un court délai pour éviter trop de calculs
        rafId = requestAnimationFrame(() => { // Planifie le calcul dans la frame suivante
          const viewportMiddle = window.innerHeight / 2; // Milieu de l'écran (repère)
          const navH = 72; // Hauteur approximative de la navbar (éviter le haut caché)
          let bestId = "accueil"; // Meilleure section trouvée
          let bestDist = Infinity; // Distance minimale au milieu

          for (const id of SECTION_IDS) {
            const el = document.getElementById(id); // Récupère l'élément section
            if (!el) continue; // Si absent, ignore
            const r = el.getBoundingClientRect(); // Boîte de la section

            if (r.bottom <= navH || r.top >= window.innerHeight * 0.92) continue; // Ignore sections hors zone utile

            const mid = (r.top + r.bottom) / 2; // Milieu visuel de la section
            const dist = Math.abs(mid - viewportMiddle); // Distance au centre écran
            if (dist < bestDist) { bestDist = dist; bestId = id; } // Met à jour la meilleure
          }

          setActiveId(bestId); // Applique la section active
          setIndex(SECTION_IDS.indexOf(bestId)); // Met à jour l'index associé
          scrollSpyTicking.current = false; // Déverrouille
        });
      }, 120); // Délai de 120ms (lisse le scroll)
    };

    window.addEventListener("scroll", onScroll, { passive: true }); // Abonne le scroll
    onScroll(); // Initialise une première fois
    return () => {
      window.removeEventListener("scroll", onScroll); // Nettoie l'écouteur
      clearTimeout(debounceId); // Nettoie le debounce
      if (rafId) cancelAnimationFrame(rafId); // Annule le raf si existant
    };
  }, []); // Exécute une fois au montage

  /* === Sync avec contexte "scène" (si Home mono-page anime les sections) === */
  useEffect(() => {
    if (!ctxActive) return; // Si pas de contexte, ne rien faire
    setActiveId(ctxActive); // Applique l'ID actif venant du contexte
    setIndex(SECTION_IDS.indexOf(ctxActive)); // Met à jour l'index
  }, [ctxActive]); // Réagit quand le contexte change

  /* === Utilitaire : masquer puis réafficher la vague (cosmétique) === */
  const hideWaveThenShow = useCallback((delay = 220) => {
    if (hideWaveTimer.current) clearTimeout(hideWaveTimer.current); // Annule un timer existant
    setWave(false); // Cache la vague
    hideWaveTimer.current = setTimeout(() => setWave(true), delay); // Ré-affiche après délai
  }, []); // Stable

  /* === Centrage de la roulette à l’ouverture (mobile) === */
  useEffect(() => {
    if (!pickerOpen || !pickerRef.current) return; // Si non ouvert ou pas de ref, on sort
    const target = ITEMS_COUNT + pickerIndex; // Cible au milieu de la liste bouclée
    pickerRef.current.children[target]?.scrollIntoView({ behavior: "auto", block: "center" }); // Centre l'élément
  }, [pickerOpen, ITEMS_COUNT, pickerIndex]); // Réagit à l'ouverture et l'index

  /* === Lock du scroll body quand le picker est ouvert (mobile) === */
  useEffect(() => {
    if (!pickerOpen) return; // Si fermé, ne rien faire
    const prev = document.body.style.overflow; // Sauvegarde l'overflow courant
    document.body.style.overflow = "hidden"; // Bloque le scroll de fond
    return () => { document.body.style.overflow = prev; }; // Restaure à la fermeture
  }, [pickerOpen]); // Réagit à l'ouverture/fermeture

  /* === Sélection d'une section (avec lien hash ou route SSR) === */
  const selectIndex = useCallback((idx) => {
    setIndex(idx); // Feedback immédiat sur l'UI (index)
    const targetId = SECTION_IDS[idx]; // Récupère l'ID visé
  hideWaveThenShow(160); // Masque la vague puis la réaffiche après 160ms
    setTimeout(() => {
      setActiveId(targetId); // Applique l'actif
      setCtxActive(targetId); // Met à jour le contexte (mode scène)
      setOpen(false); // Ferme le picker si ouvert
    }, 100); // Petit délai smooth

    const isHome = pathname === "/" || pathname === "/fr"; // Heuristique : Home mono-page
    if (isHome) {
      if (history?.replaceState) history.replaceState(null, "", `#${targetId}`); // Met à jour le hash sans recharger
    } else {
      // Si page SSR dédiée : on route vers la page équivalente
      const routeById = {
        accueil: "/",
        construction: "/construction",
        renovation: "/renovation",
        depannage: "/depannage",
        hivernage: "/hivernage",
        entretien: "/entretien",
        terrasses: "/terrasses",
        "nos-realisations": "/nos-realisations",
        contact: "/contact",
      }; // Table de routage
      router.push(routeById[targetId] || "/"); // Navigation vers la route ciblée
    }
  }, [pathname, router, setCtxActive]); // Stable sur les dépendances

  // Handler pour un clic dans la liste bouclée (mobile)
  const handleClickLooped = useCallback((loopedIdx) => {
    selectIndex(mod(loopedIdx, ITEMS_COUNT)); // Normalise l'index dans l'intervalle
  }, [ITEMS_COUNT, selectIndex]); // Dépend des bornes & select

  /* === Trouver l'item le plus centré (roulette mobile) === */
  const getClosestIndexAtCenter = useCallback(() => {
    const picker = pickerRef.current; // Récupère la ref
    if (!picker) return { closest: ITEMS_COUNT, trueIdx: pickerIndex }; // Fallback si absent
    const rect = picker.getBoundingClientRect(); // Boîte du picker
    const centerY = (rect.top + rect.bottom) / 2; // Y central

    let closest = 0, minDiff = Infinity; // Init accumulateurs
    for (let i = 0; i < picker.children.length; i++) {
      const r = picker.children[i].getBoundingClientRect(); // Boîte enfant
      const mid = (r.top + r.bottom) / 2; // Milieu enfant
      const d = Math.abs(mid - centerY); // Écart au centre
      if (d < minDiff) { minDiff = d; closest = i; } // Conserve le plus proche
    }
    const trueIdx = mod(closest, ITEMS_COUNT); // Réduit dans [0..N)
    return { closest, trueIdx }; // Retourne indices utiles
  }, [ITEMS_COUNT, pickerIndex]); // Stable

  /* === Mise à jour active pendant le scroll + recentrage (mobile) === */
  const updateActiveFromCenter = useCallback(() => {
    hideWaveThenShow(); // Anime la vague proprement
    const { closest, trueIdx } = getClosestIndexAtCenter(); // Récupère l'item centré
    const picker = pickerRef.current; // Ref du picker
    if (!picker) return; // Sécurité

    if (closest < ITEMS_COUNT || closest >= 2 * ITEMS_COUNT) {
      // Si l'élément centré n'est pas dans la bande du milieu, recentrer
      picker.children[ITEMS_COUNT + trueIdx]?.scrollIntoView({ behavior: "auto", block: "center" });
    }
    setIndex(trueIdx); // Met l'index courant
    setActiveId(SECTION_IDS[trueIdx]); // Met l'ID actif
  }, [ITEMS_COUNT, getClosestIndexAtCenter, hideWaveThenShow]); // Stable

  /* === Gestion tactile d'ouverture/fermeture (mobile) === */
  const onOpenTouchStart = (e) => {
    const y = e.touches[0].clientY; // Y initial du touch
    lastMoves.current = [{ t: performance.now(), y }]; // Initialise l'historique
    setWave(false); // Coupe la vague
  }; // Départ du geste
  const onOpenTouchMove = (e) => {
    const y = e.touches[0].clientY; // Y courant
    const t = performance.now(); // Temps courant
    lastMoves.current.push({ t, y }); // Ajoute le point
    if (lastMoves.current.length > 6) lastMoves.current.shift(); // Garde une taille fixe
  }; // Suivi du geste
  const onOpenTouchEnd = () => {
    const moves = lastMoves.current; // Récupère l'historique
    if (moves.length < 2) { updateActiveFromCenter(); return; } // Si peu de points, recentre
    const tail = moves.slice(-5); // Prend la queue
    const dy = tail[tail.length - 1].y - tail[0].y; // Delta Y
    const dt = tail[tail.length - 1].t - tail[0].t || 1; // Delta temps
    const v = dy / dt; // Vitesse px/ms (>0 vers le bas)

    let delta = Math.round(v * 10); // Convertit en nombre d'items
    if (Math.abs(delta) === 0) delta = Math.sign(v); // Garantit un déplacement min
    delta = Math.max(-3, Math.min(3, delta)); // Limite à [-3..3]

    const targetIdx = mod(pickerIndex - delta, ITEMS_COUNT); // Nouveau target
    const targetEl = pickerRef.current?.children[ITEMS_COUNT + targetIdx]; // Élément de la bande centrale
    targetEl?.scrollIntoView({ behavior: "smooth", block: "center" }); // Scroll doux

    setTimeout(() => hideWaveThenShow(160), 240); // Relance la vague après le mouvement
  }; // Fin du geste

  /* === Swipe-down pour ouvrir (zone nav) quand fermé (mobile) === */
  const closedStart = useRef({ x: 0, y: 0, dir: null }); // Mémoire du point de départ
  const DRAG_OPEN_MIN = 45; // Seuil d'ouverture en px
  const onClosedTouchStart = (e) => {
    const t = e.touches[0]; // Point touch
    closedStart.current = { x: t.clientX, y: t.clientY, dir: null }; // Stocke départ
  }; // Début du drag
  const onClosedTouchMove = (e) => {
    const t = e.touches[0]; // Point courant
    const dx = t.clientX - closedStart.current.x; // Delta X
    const dy = t.clientY - closedStart.current.y; // Delta Y
    if (!closedStart.current.dir) {
      closedStart.current.dir = Math.abs(dy) > Math.abs(dx) ? "v" : "h"; // Détecte direction dominante
    }
    if (closedStart.current.dir === "v" && dy > DRAG_OPEN_MIN) {
      setOpen(true); // Ouvre le picker si geste vertical suffisant
      e.preventDefault(); // Évite le scroll natif
    }
  }; // Déplacement en cours

  /* === Fermeture via touche ESC === */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return; // On ne réagit qu'à Escape
      if (pickerOpen) setOpen(false); // Ferme le picker
      if (langOpen) setLangOpen(false); // Ferme le menu langue
    };
    window.addEventListener("keydown", onKey); // Écoute le clavier
    return () => window.removeEventListener("keydown", onKey); // Nettoie
  }, [pickerOpen, langOpen]); // Dépend des états

  /* === Fermeture du sélecteur de langue au clic extérieur === */
  useEffect(() => {
    if (!langOpen) return; // Si fermé, ne rien faire
    const onDown = (e) => {
      if (!langRef.current) return; // Pas de ref → rien
      const target = e.target instanceof Node ? e.target : null; // Vérifie que la cible est un Node
      if (target && !langRef.current.contains(target)) setLangOpen(false); // Si clic hors du conteneur → fermer
    };
    document.addEventListener("mousedown", onDown); // Écouteur global
    return () => document.removeEventListener("mousedown", onDown); // Nettoyage
  }, [langOpen]); // Réagit à l'ouverture/fermeture

  /* === Renders inutilisés côté desktop (mobile désactivé ici) === */
  const renderPickerClosed = () => null; // Pas de picker fermé à rendre
  const renderMobileArrowHeader = () => null; // Pas de flèche mobile
  const renderPickerOpen = () => null; // Pas de menu mobile ouvert

  /* === Render principal === */
  return (
    <nav
      className="navbar fixed top-0 left-0 w-full z-50 bg-transparent border-0 shadow-none transition-all duration-300" // Barre nav fixe, transparente, au-dessus (z-50)
      style={{ background: "transparent", minHeight: "4.5rem" }} // Hauteur mini et fond transparent
      aria-label="Menu principal" // Label d'accessibilité
    >
      {/* Calque dégradé (doit rester SOUS le menu langue) */}
      <div
        className="absolute left-0 right-0 top-0 pointer-events-none z-0" // z-0 pour être derrière tout
        aria-hidden="true" // Purement décoratif
        style={{
          height: "7rem", // Hauteur du dégradé
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.90) 35%, rgba(255,255,255,0.12) 55%, rgba(255,255,255,0) 100%)", // Dégradé doux
        }}
      />

      {/* Conteneur de contenu nav (au-dessus du dégradé) */}
      <div
        className="max-w-7xl mx-auto flex items-center justify-between px-2 md:px-4 py-2 relative z-10 overflow-visible" // Conteneur flex + overflow visible (évite clipping)
        style={{ maxWidth: "100vw", boxSizing: "border-box" }} // Ne pas dépasser la largeur viewport
      >
        {/* Logo cliquable (ramène sur #accueil en mode scène) */}
        <a
          href="#accueil" // Lien vers l'ancre accueil
          className="relative z-10 text-[#009ee0] font-brand-serif select-none inline-flex flex-col items-center text-center ml-2 md:ml-3" // Style logo
          onClick={(e) => {
            e.preventDefault(); // Empêche la navigation par défaut
            selectIndex(Math.max(0, SECTION_IDS.indexOf("accueil"))); // Force la sélection accueil
          }}
        >
          <span className="leading-none font-bold text-2xl md:text-3xl">GHN</span> {/* Titre principal */}
          <span className="leading-none font-semibold text-[10px] md:text-xs tracking-[0.06em]">
            GROUP
          </span> {/* Sous-titre */}
        </a>

        {/* Menu desktop (centre) */}
        <div className="relative z-10 hidden lg:flex flex-1 justify-center max-w-0 lg:max-w-none overflow-hidden">
          {/* Liste des sections */}
          <ul className="flex gap-2 lg:gap-5 xl:gap-7 items-center font-nunito font-bold text-[#1567db] flex-wrap justify-center">
            {SECTION_IDS.map((item) => {
              const isActive = activeId === item; // Est-ce l'onglet actif ?
              const isHovered = hovered === item; // Est-ce l'onglet survolé ?
              return (
                <li
                  key={item} // Clé unique
                  className={`relative flex flex-col items-center nav-link ${isActive ? "nav-link--active" : ""} ${isHovered ? "nav-link--hover" : ""}`} // Classes dynamiques
                  onMouseEnter={() => setHovered(item)} // Gère le hover
                  onMouseLeave={() => setHovered("")} // Reset le hover
                >
                  <a
                    href={`#${item}`} // Lien ancre
                    className={`px-2 lg:px-3 py-1.5 rounded-md z-10 transition-colors duration-200 text-sm lg:text-base whitespace-nowrap ${
                      isActive ? "text-[#009ee0]" : "text-[#1567db]"
                    } hover:text-[#009ee0] focus:text-[#009ee0] outline-none focus-visible:ring-2 focus-visible:ring-[#009ee0]/50`} // Styles état
                    onClick={(e) => {
                      e.preventDefault(); // Empêche navigation hash brutale
                      setHovered(""); // Retire le hover
                      selectIndex(SECTION_IDS.indexOf(item)); // Sélectionne la section
                    }}
                    aria-current={isActive ? "page" : undefined} // A11y : indique l'élément courant
                  >
                    {t?.(`nav.${item}`) ?? LABELS[item]} {/* Texte i18n ou fallback */}
                  </a>

                  {/* Wave décorative sous l'onglet */}
                  {waveVisible && (
                    <div
                      className="nav-wave" // Classe personnalisée (peut être stylée via SCSS)
                      style={{
                        width: "80px", // Largeur du SVG
                        height: "8px", // Hauteur
                        left: "50%", // Centre horizontal
                        transform: "translateX(-50%)", // Décale pour centrage
                        position: "absolute", // Position absolue sous le lien
                        pointerEvents: "none", // Ne capte pas les clics
                        zIndex: 1, // Au-dessus du fond, sous le lien
                      }}
                    >
                      <svg
                        className="nav-wave__svg" // Classe pour styliser l'animation
                        width="80" // Largeur vue
                        height="8" // Hauteur vue
                        viewBox="0 0 64 8" // Vue interne
                        fill="none" // Pas de remplissage
                        style={{ width: "80px", height: "8px", display: "block" }} // Ajustements CSS
                        aria-hidden="true" // Décoratif
                      >
                        <path
                          className="nav-wave__path" // Classe du tracé (animable en CSS)
                          d="M0 4 Q 16 8 32 4 Q 48 0 64 4" // Courbe sinusoïdale
                          fill="none" // Pas de remplissage
                          stroke="currentColor" // Utilise la couleur du texte
                          strokeWidth="0.8" // Épaisseur légère
                          opacity={isActive || isHovered ? 1 : 0.25} // Plus visible si actif/hover
                        />
                      </svg>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Sélecteur de langue (droite) */}
        <div className="relative z-20 ml-2" ref={langRef}> {/* z-20 pour passer DEVANT le dégradé (z-0) */}
          <button
            type="button" // Bouton
            className="px-2 py-1 rounded text-xs font-semibold bg-white/80 text-[#1567db] hover:bg-white flex items-center gap-1" // Style bouton
            aria-haspopup="listbox" // Indique qu'un listbox va s'ouvrir
            aria-expanded={langOpen} // A11y : état ouvert/fermé
            onClick={(e) => {
              e.stopPropagation(); // Évite qu'un handler global ferme immédiatement
              setLangOpen((v) => !v); // Toggle ouverture
            }} // Click handler
            title={t?.(`lang.${lang}`) ?? lang.toUpperCase()} // Infobulle
            aria-label={t?.(`lang.${lang}`) ?? lang.toUpperCase()} // Label a11y
          >
            <img
              src={FLAG_SRC[lang]} // Drapeau de la langue courante
              alt="" // Icône décorative
              aria-hidden // Masquée des lecteurs d'écran
              width="16" // Largeur intrinsèque
              height="12" // Hauteur intrinsèque
              className="w-4 h-3 object-cover rounded-sm" // Style miniature
            />
            <span aria-hidden>▾</span> {/* Flèche visuelle (non lue) */}
          </button>

          {/* Menu déroulant de langue (avec motion + z-index + pointer-events) */}
          <AnimatePresence> {/* Gère l'animation d'apparition/disparition */}
            {langOpen && (
              <motion.ul
                role="listbox" // Rôle a11y pour liste d'options
                initial={{ opacity: 0, y: -4 }} // État initial (fade + slide léger)
                animate={{ opacity: 1, y: 0 }} // État animé visible
                exit={{ opacity: 0, y: -4 }} // Sortie (fade + slide)
                className="absolute right-0 mt-2 w-40 z-90 bg-white/95 backdrop-blur-sm border border-[#cfe8fb] rounded-md shadow-lg overflow-visible pointer-events-auto" // Z-90 (au-dessus de tout), interactions OK
              >
                {["fr", "nl", "en"].map((code) => (
                  <li
                    key={code} // Clé unique
                    role="option" // Rôle option (a11y)
                    aria-selected={lang === code} // Indique la sélection courante
                    tabIndex={0} // Focusable au clavier
                    className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between ${
                      lang === code
                        ? "bg-[#e6f6ff] text-[#009ee0]"
                        : "text-[#1567db] hover:bg-[#f5fbff]"
                    }`} // Styles selon sélection / hover
                    onClick={() => {
                      setLang(code); // Met à jour la langue dans le provider i18n
                      setLangOpen(false); // Ferme le menu

                      // Mise à jour de l'URL en ?lang=code (persistance simple + middleware éventuel)
                      try {
                        const hash = typeof window !== "undefined" ? window.location.hash : ""; // Conserve le hash si présent
                        const qs = new URLSearchParams(typeof window !== "undefined" ? window.location.search : ""); // Lit la query
                        qs.set("lang", code); // Écrit la langue
                        router.replace(`${pathname}?${qs.toString()}${hash}`); // Remplace l'URL sans recharger
                      } catch {
                        // Silencieux si indisponible (SSR)
                      }
                    }} // Clique option
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault(); // Empêche scroll avec " "
                        setLang(code); // Applique la langue
                        setLangOpen(false); // Ferme
                        try {
                          const hash = typeof window !== "undefined" ? window.location.hash : ""; // Hash courant
                          const qs = new URLSearchParams(typeof window !== "undefined" ? window.location.search : ""); // Query courante
                          qs.set("lang", code); // Met à jour
                          router.replace(`${pathname}?${qs.toString()}${hash}`); // Remplace l'URL
                        } catch {
                          // Ignore erreurs non critiques
                        }
                      }
                    }} // Sélection clavier
                  >
                    <span className="inline-flex items-center gap-2"> {/* Groupe drapeau + libellé */}
                      <img
                        src={FLAG_SRC[code]} // Icône drapeau langue
                        alt="" // Décoratif
                        aria-hidden // Non lu
                        width="16" // Largeur intrinsèque
                        height="12" // Hauteur intrinsèque
                        className="w-4 h-3 object-cover rounded-sm" // Style
                      />
                      <span className="font-semibold">{t?.(`lang.${code}`) ?? code.toUpperCase()}</span> {/* Libellé langue */}
                    </span>
                    {lang === code && <span aria-hidden className="text-[#009ee0]">✓</span>} {/* Check si sélectionnée */}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
