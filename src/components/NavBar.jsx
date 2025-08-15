"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* Sections & labels */
const SECTION_IDS = [
  "accueil","construction","renovation","depannage",
  "hivernage","entretien","terrasses","contact",
];
const LABELS = {
  accueil:"Accueil", construction:"Construction", renovation:"Rénovation",
  depannage:"Dépannage", hivernage:"Hivernage", entretien:"Entretien",
  terrasses:"Terrasses", contact:"Contact"
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

  /* -------- Scrollspy (rAF) -------- */
  useEffect(() => {
    const onScroll = () => {
      if (scrollSpyTicking.current) return;
      scrollSpyTicking.current = true;
      requestAnimationFrame(() => {
        let found = "accueil";
        for (const id of SECTION_IDS) {
          const el = document.getElementById(id);
          if (!el) continue;
          const r = el.getBoundingClientRect();
          if (r.top <= 64 && r.bottom > 64) { found = id; break; }
        }
        setActiveId(found);
        setIndex(SECTION_IDS.indexOf(found));
        scrollSpyTicking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
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

  /* Sélection logique */
  const selectIndex = useCallback((idx) => {
    setIndex(idx);
    setActiveId(SECTION_IDS[idx]);
    setOpen(false);
    const el = document.getElementById(SECTION_IDS[idx]);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => el.setAttribute("tabindex", "-1"), 100);
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

  /* UI (fermé) */
  const renderPickerClosed = () => (
    <div className="picker-mobile-center">
      <button
        type="button"
        className="picker-closed-button"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu"
        aria-haspopup="true"
        aria-expanded={pickerOpen}
      >
        <span className="picker-active-label">{LABELS[activeId]}</span>
        {waveVisible && (
          <span className="picker-wave" aria-hidden="true">
            <svg viewBox="0 0 64 8" fill="none" className="w-full h-full">
              <path
                d="M0 4 Q 16 8 32 4 Q 48 0 64 4"
                fill="none"
                stroke="#009ee0"
                strokeWidth={4}
                className="wave-active-anim"
                style={{ strokeDasharray: 64, strokeDashoffset: 0, opacity: 1 }}
              />
            </svg>
          </span>
        )}
      </button>
    </div>
  );

  /* Petite flèche sous la nav (fermé) */
  const renderMobileArrowHeader = () => (
    <button
      type="button"
      className="picker-arrow-absolute"
      onClick={() => setOpen(true)}
      aria-label="Ouvrir le menu"
      tabIndex={0}
      style={{ display: pickerOpen ? "none" : "flex" }}
    >
      <svg width="31" height="19" viewBox="0 0 28 17" fill="none" aria-hidden="true">
        <path d="M4 6L14 13L24 6" stroke="#009ee0" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );

  /* Overlay + Sheet (Framer Motion) + flèche du bas FIXE */
  const renderPickerOpen = () => {
    const activeLoopedIdx = ITEMS_COUNT + pickerIndex;
    const activeOptionId  = `${SECTION_IDS[pickerIndex]}-${activeLoopedIdx}`;

    return (
      <AnimatePresence>
        {/* Overlay */}
        <motion.div
          key="overlay"
          className="picker-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={() => (overlayClickRef.current = true)}
          onMouseUp={() => (overlayClickRef.current = false)}
          onClick={() => !overlayClickRef.current && setOpen(false)}
        />

        {/* Sheet plein écran (sans transform parent) */}
        <motion.div
          key="sheet"
          className="picker-roulette-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Menu des sections"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: [0.44, 0.95, 0.6, 1.15] }}
        >
          <ul
            ref={pickerRef}
            className="picker-roulette-list"
            onScroll={updateActiveFromCenter}
            onTouchStart={onOpenTouchStart}
            onTouchMove={onOpenTouchMove}
            onTouchEnd={onOpenTouchEnd}
            role="listbox"
            aria-activedescendant={activeOptionId}
          >
            {LOOPED_LIST.map((id, i) => {
              const isActive =
                mod(i, ITEMS_COUNT) === pickerIndex && i >= ITEMS_COUNT && i < 2 * ITEMS_COUNT;
              return (
                <li
                  id={`${id}-${i}`}
                  key={i + id}
                  className={`picker-item${isActive ? " active" : ""}`}
                  onClick={() => handleClickLooped(i)}
                  aria-selected={isActive}
                  role="option"
                >
                  {LABELS[id]}
                  {isActive && waveVisible && (
                    <span className="picker-wave picker-wave-inside" aria-hidden="true">
                      <svg viewBox="0 0 64 8" fill="none" className="w-full h-full">
                        <path
                          d="M0 4 Q 16 8 32 4 Q 48 0 64 4"
                          fill="none"
                          stroke="#009ee0"
                          strokeWidth={4}
                          className="wave-active-anim"
                          style={{ strokeDasharray: 64, strokeDashoffset: 0, opacity: 1 }}
                        />
                      </svg>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </motion.div>

        {/* Flèche du bas FIXE (fermeture) */}
        <motion.button
          key="close-arrow"
          type="button"
          className="picker-arrow-bottom"
          onClick={() => setOpen(false)}
          aria-label="Fermer le menu"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.18 }}
        >
          <svg width="32" height="16" viewBox="0 0 28 17" fill="none" aria-hidden="true">
            <path d="M4 11L14 4L24 11" stroke="#009ee0" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      </AnimatePresence>
    );
  };

  /* Render */
  return (
    <nav
      className="navbar fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-lg shadow-md border-b border-[#009ee0]/20 transition-all duration-300"
      style={{ WebkitBackdropFilter: "blur(14px)", minHeight: "4.5rem" }}
      aria-label="Menu principal"
    >
      <div
        className="max-w-7xl mx-auto flex items-center justify-between px-3 md:px-6 py-2 relative"
        onTouchStart={!pickerOpen ? onClosedTouchStart : undefined}
        onTouchMove={!pickerOpen ? onClosedTouchMove : undefined}
      >
        {/* Logo */}
        <a
          href="#accueil"
          className="text-2xl md:text-3xl font-extrabold text-[#009ee0] font-bebas select-none whitespace-nowrap"
          onClick={(e) => { e.preventDefault(); selectIndex(Math.max(0, SECTION_IDS.indexOf("accueil"))); }}
        >
          GHN-Pool
        </a>

        {/* Titre + vague (fermé) */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:hidden flex flex-col items-center w-full pointer-events-auto"
          style={{ minWidth: "min(150px, 40vw)", maxWidth: "min(270px, 70vw)" }}
        >
          {!pickerOpen && renderPickerClosed()}
        </div>

        {/* Placeholder droite */}
        <div style={{ width: 44, height: 44 }} className="lg:hidden" aria-hidden="true" />

        {/* Desktop menu */}
        <div className="hidden lg:flex flex-1 justify-center">
          <ul className="flex gap-4 lg:gap-7 items-center font-nunito font-bold text-[#1567db]">
            {SECTION_IDS.map((item) => {
              const isActive = activeId === item;
              const isHovered = hovered === item;
              return (
                <li
                  key={item}
                  className="relative flex flex-col items-center"
                  onMouseEnter={() => setHovered(item)}
                  onMouseLeave={() => setHovered("")}
                >
                  <a
                    href={`#${item}`}
                    className={`px-3 py-1.5 rounded-md z-10 transition-colors duration-200 ${
                      isActive ? "text-[#009ee0]" : "text-[#1567db]"
                    } hover:text-[#009ee0] focus:text-[#009ee0] outline-none focus-visible:ring-2 focus-visible:ring-[#009ee0]/50`}
                    onClick={(e) => { e.preventDefault(); selectIndex(SECTION_IDS.indexOf(item)); }}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {LABELS[item]}
                  </a>
                  <span className="absolute bottom-0 left-0 w-full h-2 pointer-events-none overflow-hidden">
                    <svg viewBox="0 0 64 8" fill="none" className="w-full h-full">
                      <path
                        d="M0 4 Q 16 8 32 4 Q 48 0 64 4"
                        fill="none"
                        stroke={isActive ? "#009ee0" : isHovered ? "#b6ecfe" : "transparent"}
                        strokeWidth={4}
                        className={isActive ? "wave-active-anim" : isHovered ? "wave-hover-anim" : ""}
                        style={{ strokeDasharray: 64, strokeDashoffset: 0, opacity: isActive || isHovered ? 1 : 0, transition: "opacity 0.19s, stroke 0.19s" }}
                      />
                    </svg>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Flèche sous la nav (fermé) */}
        <div className="lg:hidden">
          {!pickerOpen && renderMobileArrowHeader()}
        </div>
      </div>

      {/* Overlay + Sheet + Flèche du bas */}
      {pickerOpen && renderPickerOpen()}
    </nav>
  );
}
