
"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
// Removed react-icons
// import { FaBars, FaTimes } from "react-icons/fa";
import { useSection } from "./SectionProvider";
import { useI18n } from "@/i18n/I18nProvider";

const SECTIONS = [
  { id: "accueil" },
  { id: "construction" },
  { id: "renovation" },
  { id: "depannage" },
  { id: "hivernage" },
  { id: "entretien" },
  { id: "terrasses" },
  { id: "nos-realisations" },
  { id: "contact" },
];

export default function MobileNavBar() {
  const { active: ctxActive, setActive: setCtxActive } = useSection();
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("accueil");
  const [hovered, setHovered] = useState("");
  const menuRef = useRef(null);

  // Lock scroll when menu open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus trap
  useEffect(() => {
    if (open && menuRef.current) {
      menuRef.current.focus();
    }
  }, [open]);

  // Active section on scroll
  // Mode scène: pas de scrollspy, on suit le contexte
  useEffect(() => { if (ctxActive) setActive(ctxActive); }, [ctxActive]);

  const handleNav = (id) => {
    setOpen(false);
    setActive(id);
    setCtxActive(id);
    const isHome = pathname === "/" || pathname === "/fr";
    if (isHome) {
      if (history?.replaceState) history.replaceState(null, "", `#${id}`);
    } else {
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
      };
      router.push(routeById[id] || "/");
    }
  };

  return (
  <>
      {/* Hamburger button */}
      <button
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] p-3 rounded-full bg-white/90 shadow-lg backdrop-blur-md border border-sky-100 lg:hidden"
        aria-label="Ouvrir le menu"
        onClick={() => setOpen(true)}
      >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
            <path fill="currentColor" d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
          </svg>
      </button>

      {/* Overlay + Fullscreen menu */}
      {open && (
  <div style={{ overflowX: 'hidden' }}>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-gradient-to-br from-sky-200/80 via-cyan-100/80 to-blue-100/80 z-[99] animate-fadein"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          {/* Menu */}
          <nav
            ref={menuRef}
            tabIndex={-1}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 backdrop-blur-xl animate-slidein rounded-t-3xl shadow-2xl border-t-4 border-sky-200"
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
          >
            <button
              className="absolute top-5 right-5 p-3 rounded-full bg-white/80 shadow border border-sky-100"
              aria-label="Fermer le menu"
              onClick={() => setOpen(false)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
                  <path fill="currentColor" d="M18.3 5.71 12 12.01l-6.29-6.3-1.42 1.42 6.3 6.29-6.3 6.29 1.42 1.42L12 14.83l6.29 6.3 1.42-1.42-6.3-6.29 6.3-6.29z" />
                </svg>
            </button>
            <ul className="flex flex-col gap-5 w-full max-w-xs text-center mt-8">
      {SECTIONS.map((s) => (
                <li key={s.id} className="relative nav-link"
                  onMouseEnter={() => setHovered(s.id)}
                  onMouseLeave={() => setHovered("")}
                >
                  <button
                    className={`w-full py-4 text-xl font-bold rounded-xl transition-all duration-200
                      ${active === s.id ? "text-sky-600 bg-sky-50 shadow-lg" : "text-cyan-700 hover:bg-sky-100 focus:bg-sky-100"}
                      font-nunito focus:outline-none`}
                    style={{ position: 'relative', zIndex: 2 }}
                    onClick={() => handleNav(s.id)}
                  >
        {t(`nav.${s.id}`)}
                  </button>
                  {/* Vague animée sous l'item actif ou légère au hover */}
                  {(active === s.id || hovered === s.id) && (
                    <span className="nav-wave">
                      <svg className="nav-wave__svg" viewBox="0 0 64 8" width="80" height="14" fill="none">
                        <path
                          className={`nav-wave__path ${active === s.id ? "nav-link--active" : hovered === s.id ? "nav-link--hover" : ""}`}
                          d="M0 4 Q 16 8 32 4 Q 48 0 64 4"
                          fill="none"
                          stroke={active === s.id ? "#009ee0" : "#b6ecfe"}
                          strokeWidth={4}
                        />
                      </svg>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
      <style jsx global>{`
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadein { animation: fadein 0.22s; }
        @keyframes slidein { from { opacity: 0; transform: translateY(-32px); } to { opacity: 1; transform: none; } }
        .animate-slidein { animation: slidein 0.32s cubic-bezier(.44,.95,.6,1.15); }
        @keyframes waveDraw {
          from { stroke-dashoffset: 64; opacity: .2; }
          70%  { opacity: 1; }
          to   { stroke-dashoffset: 0; opacity: 1; }
        }
        .nav-wave {
          position: absolute;
          left: 0; bottom: 0;
          width: 100%; height: 14px;
          pointer-events: none; overflow: hidden;
        }
        .nav-wave__svg {
          width: 100%; height: 100%; display: block;
        }
        .nav-wave__path {
          fill: none;
          stroke-width: 4;
          stroke-linecap: round;
          stroke-dasharray: 64;
          stroke-dashoffset: 64;
          opacity: 0;
          transition: opacity .18s ease;
        }
        .nav-link--active .nav-wave__path {
          stroke: #009ee0;
          animation: waveDraw .52s cubic-bezier(.44,.95,.6,1.15) forwards;
          opacity: 1;
        }
        .nav-link--hover .nav-wave__path {
          stroke: #b6ecfe;
          animation: waveDraw .42s cubic-bezier(.44,.95,.6,1.15) forwards;
          opacity: 1;
        }
        @media (prefers-reduced-motion: reduce) {
          .nav-wave__path {
            animation: none !important;
            stroke-dashoffset: 0 !important;
            opacity: 1 !important;
          }
        }
  `}</style>
    </>
  );
}
