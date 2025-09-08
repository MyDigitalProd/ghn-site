"use client";
import "../styles/tools/_tailwind.css"; // Tailwind v4 d’abord
import "../styles/globals.scss";        // Styles SCSS globaux
import Header from "@/components/Header"; // En-tête global
import Footer from "@/components/Footer"; // Pied de page global
import { useEffect, useRef, useState } from "react";
import RealisticWaveEffect from "@/components/RealisticWaveEffect"; // Vague globale fixe
import { SectionProvider } from "@/components/SectionProvider";
import { I18nProvider } from "@/i18n/I18nProvider";

export default function RootLayout({ children }) {
  // Footer dynamique
  const [showFooter, setShowFooter] = useState(false);
  const [footerHovered, setFooterHovered] = useState(false);
  const footerTimeout = useRef(null);

  // Affiche le footer lors du scroll / touch vers le bas
  useEffect(() => {
    const handleShowFooter = (e) => {
      if (e.type === "wheel" && e.deltaY > 40) setShowFooter(true);
      if (e.type === "touchmove" && e.touches[0]?.clientY > window.innerHeight - 80) setShowFooter(true);
    };

    window.addEventListener("wheel", handleShowFooter, { passive: true });
    window.addEventListener("touchmove", handleShowFooter, { passive: true });
    // Permet de réduire le footer manuellement via la flèche
    const handleHideFooter = () => setShowFooter(false);
    document.addEventListener("hideFooter", handleHideFooter);

    return () => {
      window.removeEventListener("wheel", handleShowFooter);
      window.removeEventListener("touchmove", handleShowFooter);
      document.removeEventListener("hideFooter", handleHideFooter);
    };
  }, []);

  // Masque automatiquement si pas survolé
  useEffect(() => {
    if (showFooter && !footerHovered) {
      footerTimeout.current = setTimeout(() => setShowFooter(false), 5000);
    }
    return () => clearTimeout(footerTimeout.current);
  }, [showFooter, footerHovered]);

  const handleFooterMouseEnter = () => {
    setFooterHovered(true);
    clearTimeout(footerTimeout.current);
  };
  const handleFooterMouseLeave = () => {
    setFooterHovered(false);
    footerTimeout.current = setTimeout(() => setShowFooter(false), 2000);
  };

  return (
    <html lang="fr">
      <body style={{ overflow: "hidden", height: "100vh" }}>
        <I18nProvider>
          {/* Fond global fixe: dégradé + vague discrète en haut */}
          <div className="fixed inset-0 -z-10 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50" />
            <div className="absolute top-0 inset-x-0 h-[90px]">
              <RealisticWaveEffect
                height={110}
                amplitude={11}
                frequency={0.009}
                speed={0.015}
                color="#009ee0"
                opacity={0.9}
                layers={8}
              />
            </div>
          </div>

          <SectionProvider>
            <Header />

            {/* Contenu principal */}
            <main className="relative min-h-screen overflow-hidden" style={{ height: "100vh" }}>
              {children}
            </main>

            {/* Footer dynamique animé */}
            <div
              className={`
                fixed left-0 right-0 bottom-0 z-50
                transform-gpu will-change-transform
                transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                ${showFooter
                  ? "translate-y-0 opacity-100"
                  : "translate-y-full opacity-0"
                }
              `}
              onMouseEnter={handleFooterMouseEnter}
              onMouseLeave={handleFooterMouseLeave}
            >
              <Footer />
            </div>
          </SectionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
