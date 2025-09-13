"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { useSection } from "./SectionProvider";
import { useI18n } from "@/i18n/I18nProvider";

const SECTIONS = [
  { id: "accueil" }, { id: "construction" }, { id: "renovation" },
  { id: "depannage" }, { id: "hivernage" }, { id: "entretien" },
  { id: "terrasses" }, { id: "nos-realisations" }, { id: "contact" },
];

export default function MobileNavBar() {
  const { active: ctxActive, setActive: setCtxActive } = useSection();
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("accueil");
  const [hovered, setHovered] = useState("");
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef(null);

  // éviter les soucis SSR pour portal
  useEffect(() => { setMounted(true); }, []);

  // lock scroll body quand ouvert
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // ESC pour fermer
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // focus panneau à l’ouverture
  useEffect(() => {
    if (open && menuRef.current) menuRef.current.focus();
  }, [open]);

  // suit le contexte (mode scène)
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
        accueil: "/", construction: "/construction", renovation: "/renovation",
        depannage: "/depannage", hivernage: "/hivernage", entretien: "/entretien",
        terrasses: "/terrasses", "nos-realisations": "/nos-realisations", contact: "/contact",
      };
      router.push(routeById[id] || "/");
    }
  };

  // contenu à porter dans body (bouton + panneau)
  const portalUI = (
    <>
      {/* Bouton burger centré, z-index énorme */}
      <button
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] p-3 rounded-full bg-white/90 shadow-lg backdrop-blur-md border border-sky-100 lg:hidden"
        aria-label="Ouvrir le menu"
        onClick={() => setOpen(true)}
      >
        <span aria-hidden className="relative block w-5 h-4">
          <span className="absolute left-0 top-0 block w-5 h-0.5 bg-[#1567db]" />
          <span className="absolute left-0 top-1/2 -translate-y-1/2 block w-5 h-0.5 bg-[#1567db]" />
          <span className="absolute left-0 bottom-0 block w-5 h-0.5 bg-[#1567db]" />
        </span>
      </button>

      {/* Overlay + Panneau (au-dessus de tout) */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-gradient-to-br from-sky-200/80 via-cyan-100/80 to-blue-100/80 animate-fadein"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <nav
            ref={menuRef}
            tabIndex={-1}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/95 backdrop-blur-xl animate-slidein rounded-t-3xl shadow-2xl border-t-4 border-sky-200"
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
          >
            <button
              className="absolute top-5 right-5 p-3 rounded-full bg-white/80 shadow border border-sky-100"
              aria-label="Fermer le menu"
              onClick={() => setOpen(false)}
            >
              <span aria-hidden className="relative block w-5 h-5">
                <span className="absolute inset-0 rotate-45 origin-center block w-5 h-0.5 bg-[#1567db]" />
                <span className="absolute inset-0 -rotate-45 origin-center block w-5 h-0.5 bg-[#1567db]" />
              </span>
            </button>

            <ul className="flex flex-col gap-5 w-full max-w-xs text-center mt-8">
              {SECTIONS.map((s) => (
                <li
                  key={s.id}
                  className={`relative nav-link ${active===s.id ? "nav-link--active" : ""} ${hovered===s.id ? "nav-link--hover" : ""}`}
                  onMouseEnter={() => setHovered(s.id)}
                  onMouseLeave={() => setHovered("")}
                >
                  <button
                    className={`w-full py-4 text-xl font-bold rounded-xl transition-all duration-200
                      ${active === s.id ? "text-sky-600 bg-sky-50 shadow-lg" : "text-cyan-700 hover:bg-sky-100 focus:bg-sky-100"}
                      font-nunito focus:outline-none relative z-[1]`}
                    onClick={() => handleNav(s.id)}
                  >
                    {t(`nav.${s.id}`)}
                  </button>

                  {/* Vague animée (mêmes classes que desktop) */}
                  <span className="nav-wave">
                    <svg className="nav-wave__svg" viewBox="0 0 64 8" width="80" height="14" fill="none" aria-hidden>
                      <path className="nav-wave__path" d="M0 4 Q 16 8 32 4 Q 48 0 64 4" />
                    </svg>
                  </span>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}

      {/* Styles globaux pour l’onde + animations */}
      <style jsx global>{`
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadein { animation: fadein .22s; }

        @keyframes slidein { from { opacity: 0; transform: translateY(-32px); } to { opacity: 1; transform: none; } }
        .animate-slidein { animation: slidein .32s cubic-bezier(.44,.95,.6,1.15); }

        .nav-link { position: relative; }
        .nav-wave { position: absolute; left: 0; bottom: 0; width: 100%; height: 14px; pointer-events: none; overflow: hidden; }
        .nav-wave__svg { width: 100%; height: 100%; display: block; }
        .nav-wave__path {
          fill: none; stroke: currentColor; stroke-width: 4; stroke-linecap: round;
          stroke-dasharray: 64; stroke-dashoffset: 64; opacity: .15;
          transition: opacity .18s ease; color: #b6ecfe;
        }
        .nav-link.nav-link--hover .nav-wave__path {
          animation: waveDraw .42s cubic-bezier(.44,.95,.6,1.15) forwards; opacity: 1; color: #b6ecfe;
        }
        .nav-link.nav-link--active .nav-wave__path {
          animation: waveDraw .52s cubic-bezier(.44,.95,.6,1.15) forwards; opacity: 1; color: #009ee0;
        }
        @keyframes waveDraw {
          from { stroke-dashoffset: 64; opacity: .2; }
          70%  { opacity: 1; }
          to   { stroke-dashoffset: 0; opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .nav-wave__path { animation: none !important; stroke-dashoffset: 0 !important; opacity: 1 !important; }
          .animate-fadein, .animate-slidein { animation: none !important; }
        }
      `}</style>
    </>
  );

  // on ne rend en Portal que côté client (mounted)
  return mounted ? createPortal(portalUI, document.body) : null;
}
