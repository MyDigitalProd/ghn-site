"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* Sections & labels */
const SECTION_IDS = [
  "accueil","construction","renovation","depannage",
  "hivernage","entretien","terrasses","nos-realisations","contact",
];
const LABELS = {
  accueil:"Accueil", construction:"Construction", renovation:"Rénovation",
  depannage:"Dépannage", hivernage:"Hivernage", entretien:"Entretien",
  terrasses:"Terrasses", "nos-realisations":"Nos Réalisations", contact:"Contact"
};
const mod = (n, m) => ((n % m) + m) % m;

export default function NavBar() {
  /* State */
  const [activeId, setActiveId]   = useState("accueil");
  const [pickerOpen, setOpen]     = useState(false);
  const [pickerIndex, setIndex]   = useState(0); // 0..N-1
  const [hovered, setHovered]     = useState("");
  const [waveVisible, setWave]    = useState(true);

  /* Refs */
  const pickerRef        = useRef(null);
  const overlayClickRef  = useRef(false);
  const hideWaveTimer    = useRef(null);
  const scrollSpyTicking = useRef(false);
  const lastMoves        = useRef([]); // pour momentum

  /* Const */
  const ITEMS_COUNT = SECTION_IDS.length;
  const LOOPED_LIST = [...SECTION_IDS, ...SECTION_IDS, ...SECTION_IDS];

  /* -------- Scrollspy fiable (rAF + debounce, sans dépendance à activeId) -------- */
  useEffect(() => {
    let debounceId;
    let rafId;
    const onScroll = () => {
      if (scrollSpyTicking.current) return;
      scrollSpyTicking.current = true;

      clearTimeout(debounceId);
      debounceId = setTimeout(() => {
        rafId = requestAnimationFrame(() => {
          const viewportMiddle = window.innerHeight / 2;
          const navH = 72; // ~4.5rem

          let bestId = "accueil";
          let bestDist = Infinity;

          for (const id of SECTION_IDS) {
            const el = document.getElementById(id);
            if (!el) continue;
            const r = el.getBoundingClientRect();

            // Ignore sections totalement hors zone utile
            if (r.bottom <= navH || r.top >= window.innerHeight * 0.92) continue;

            const mid = (r.top + r.bottom) / 2;
            const dist = Math.abs(mid - viewportMiddle);
            if (dist < bestDist) { bestDist = dist; bestId = id; }
          }

          setActiveId(bestId);
          setIndex(SECTION_IDS.indexOf(bestId));

          scrollSpyTicking.current = false;
        });
      }, 120);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(debounceId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  /* Vague visible uniquement hors scroll */
  const hideWaveThenShow = useCallback((delay = 220) => {
    if (hideWaveTimer.current) clearTimeout(hideWaveTimer.current);
    setWave(false);
    hideWaveTimer.current = setTimeout(() => setWave(true), delay);
  }, []);

  /* Centre la roulette à l’ouverture (bande du milieu) */
  useEffect(() => {
    if (!pickerOpen || !pickerRef.current) return;
    const target = ITEMS_COUNT + pickerIndex;
    pickerRef.current.children[target]?.scrollIntoView({ behavior: "auto", block: "center" });
  }, [pickerOpen, ITEMS_COUNT, pickerIndex]);

  /* Lock scroll body quand ouvert */
  useEffect(() => {
    if (!pickerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [pickerOpen]);

  /* Sélection logique avec transition douce */
  const selectIndex = useCallback((idx) => {
    // Immediate UI feedback
    setIndex(idx);
    const targetId = SECTION_IDS[idx];
    
    // Pause animation pendant la transition
    setWave(false);
    
    // Update active après un délai pour smooth transition
    setTimeout(() => {
      setActiveId(targetId);
      setOpen(false);
    }, 100);
    
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        el.setAttribute("tabindex", "-1");
        setWave(true); // Reactive animation
      }, 300);
    }
  }, []);
  const handleClickLooped = useCallback((loopedIdx) => {
    selectIndex(mod(loopedIdx, ITEMS_COUNT));
  }, [ITEMS_COUNT, selectIndex]);

  /* Trouver l’item le plus centré */
  const getClosestIndexAtCenter = useCallback(() => {
    const picker = pickerRef.current;
    if (!picker) return { closest: ITEMS_COUNT, trueIdx: pickerIndex };
    const rect = picker.getBoundingClientRect();
    const centerY = (rect.top + rect.bottom) / 2;

    let closest = 0, minDiff = Infinity;
    for (let i = 0; i < picker.children.length; i++) {
      const r = picker.children[i].getBoundingClientRect();
      const mid = (r.top + r.bottom) / 2;
      const d = Math.abs(mid - centerY);
      if (d < minDiff) { minDiff = d; closest = i; }
    }
    const trueIdx = mod(closest, ITEMS_COUNT);
    return { closest, trueIdx };
  }, [ITEMS_COUNT, pickerIndex]);

  /* MAJ actif pendant le scroll + recaler dans la bande du milieu */
  const updateActiveFromCenter = useCallback(() => {
    hideWaveThenShow();
    const { closest, trueIdx } = getClosestIndexAtCenter();
    const picker = pickerRef.current;
    if (!picker) return;

    if (closest < ITEMS_COUNT || closest >= 2 * ITEMS_COUNT) {
      picker.children[ITEMS_COUNT + trueIdx]?.scrollIntoView({ behavior: "auto", block: "center" });
    }
    setIndex(trueIdx);
    setActiveId(SECTION_IDS[trueIdx]);
  }, [ITEMS_COUNT, getClosestIndexAtCenter, hideWaveThenShow]);

  /* -------- Momentum (swipe) natif + snap assisté -------- */
  const onOpenTouchStart = (e) => {
    const y = e.touches[0].clientY;
    lastMoves.current = [{ t: performance.now(), y }];
    setWave(false);
  };
  const onOpenTouchMove = (e) => {
    const y = e.touches[0].clientY;
    const t = performance.now();
    lastMoves.current.push({ t, y });
    if (lastMoves.current.length > 6) lastMoves.current.shift();
  };
  const onOpenTouchEnd = () => {
    const moves = lastMoves.current;
    if (moves.length < 2) { updateActiveFromCenter(); return; }
    const tail = moves.slice(-5);
    const dy = tail[tail.length - 1].y - tail[0].y;
    const dt = tail[tail.length - 1].t - tail[0].t || 1;
    const v  = dy / dt; // px/ms  (>0 vers le bas)

    let delta = Math.round(v * 10);
    if (Math.abs(delta) === 0) delta = Math.sign(v);
    delta = Math.max(-3, Math.min(3, delta));

    const targetIdx = mod(pickerIndex - delta, ITEMS_COUNT);
    const targetEl  = pickerRef.current?.children[ITEMS_COUNT + targetIdx];
    targetEl?.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => hideWaveThenShow(160), 240);
  };

  /* Swipe-down pour ouvrir quand fermé (sur la zone nav) */
  const closedStart = useRef({ x: 0, y: 0, dir: null });
  const DRAG_OPEN_MIN = 45;
  const onClosedTouchStart = (e) => {
    const t = e.touches[0];
    closedStart.current = { x: t.clientX, y: t.clientY, dir: null };
  };
  const onClosedTouchMove = (e) => {
    const t = e.touches[0];
    const dx = t.clientX - closedStart.current.x;
    const dy = t.clientY - closedStart.current.y;
    if (!closedStart.current.dir) {
      closedStart.current.dir = Math.abs(dy) > Math.abs(dx) ? "v" : "h";
    }
    if (closedStart.current.dir === "v" && dy > DRAG_OPEN_MIN) {
      setOpen(true);
      e.preventDefault();
    }
  };

  /* ESC pour fermer */
  useEffect(() => {
    if (!pickerOpen) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pickerOpen]);

  // Désactivation du picker mobile : ne rien rendre sur mobile
  const renderPickerClosed = () => null;

  // Désactivation de la flèche mobile
  const renderMobileArrowHeader = () => null;

  // Désactivation du menu mobile ouvert
  const renderPickerOpen = () => null;

  /* Render */
  return (
    <nav
      className="navbar fixed top-0 left-0 w-full z-50 bg-transparent border-0 shadow-none transition-all duration-300"
      style={{ background: "transparent", minHeight: "4.5rem" }}
      aria-label="Menu principal"
    >
      {/*
        RÉGLAGES FOND NAVBAR (dégradé blanc -> transparent)
        - height: ajuste la hauteur couverte par le dégradé (ex: '6rem', '8rem').
        - background: linear-gradient avec plusieurs stops (opacités à modifier pour plus/moins de blanc).
          • 0%   = opacité en haut (plus proche du logo)
          • 40-60% = opacité intermédiaire (milieu de la navbar)
          • 80% = opacité résiduelle (quasi fondu)
          • 100% = totalement transparent (aucun effet)
        Astuce: baisse les valeurs (0.92 -> 0.88 / 0.7 -> 0.6) pour mieux voir les vagues; augmente-les pour plus de lisibilité.
        Remarque: pointer-events: none garde la navbar cliquable.
      */}
      <div
        className="absolute left-0 right-0 top-0 pointer-events-none"
        aria-hidden="true"
        style={{
      height: '7rem',
      background: 'linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.90) 35%, rgba(255,255,255,0.12) 55%, rgba(255,255,255,0) 100%)'
        }}
      />
      <div
        className="max-w-7xl mx-auto flex items-center justify-between px-2 md:px-4 py-2 relative z-10 overflow-hidden"
        style={{ maxWidth: '100vw', boxSizing: 'border-box' }}
      >
        {/* Logo */}
        <a
          href="#accueil"
          className="relative z-10 text-2xl md:text-3xl font-extrabold text-[#009ee0] font-bebas select-none whitespace-nowrap"
          onClick={(e) => { e.preventDefault(); selectIndex(Math.max(0, SECTION_IDS.indexOf("accueil"))); }}
        >
          GHN-Pool
        </a>

        {/* Desktop menu */}
        <div className="relative z-10 hidden lg:flex flex-1 justify-center max-w-0 lg:max-w-none overflow-hidden">
          <ul className="flex gap-2 lg:gap-5 xl:gap-7 items-center font-nunito font-bold text-[#1567db] flex-wrap justify-center">
            {SECTION_IDS.map((item) => {
              const isActive = activeId === item;
              const isHovered = hovered === item;
              return (
                <li
                  key={item}
                  className={`relative flex flex-col items-center nav-link ${isActive ? 'nav-link--active' : ''} ${isHovered ? 'nav-link--hover' : ''}`}
                  onMouseEnter={() => setHovered(item)}
                  onMouseLeave={() => setHovered("")}
                >
                  <a
                    href={`#${item}`}
                    className={`px-2 lg:px-3 py-1.5 rounded-md z-10 transition-colors duration-200 text-sm lg:text-base whitespace-nowrap ${
                      isActive ? "text-[#009ee0]" : "text-[#1567db]"
                    } hover:text-[#009ee0] focus:text-[#009ee0] outline-none focus-visible:ring-2 focus-visible:ring-[#009ee0]/50`}
                    onClick={(e) => { e.preventDefault(); setHovered(""); selectIndex(SECTION_IDS.indexOf(item)); }}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {LABELS[item]}
                  </a>
                  <div 
                    className="nav-wave"
                    style={{ width: '80px', height: '8px', left: '50%', transform: 'translateX(-50%)', position: 'absolute', pointerEvents: 'none', zIndex: 1 }}
                  >
                    <svg 
                      className="nav-wave__svg" 
                      width="80" height="8" viewBox="0 0 64 8" fill="none"
                      style={{ width: '80px', height: '8px', display: 'block' }}
                    >
                      <path
                        className="nav-wave__path"
                        d="M0 4 Q 16 8 32 4 Q 48 0 64 4"
                        fill="none"
                      />
                    </svg>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
