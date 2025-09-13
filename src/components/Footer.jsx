"use client";                                                     // Exécute côté client (hooks & DOM)

import React from "react";                                        // JSX + hooks
import ConfidentialiteModal from "./ConfidentialiteModal";        // Modal Politique de confidentialité
import RealisticWaveEffect from "./RealisticWaveEffect";          // Vague (Canvas)

export default function Footer() {
  const [showConfidentialite, setShowConfidentialite] = React.useState(false); // État modal
  const [isMobile, setIsMobile] = React.useState(false);                       // Flag mobile

  React.useEffect(() => {                                                      // Détection viewport
    const onResize = () => setIsMobile(window.innerWidth <= 600);              // ≤600px → mobile
    onResize();                                                                // Init
    window.addEventListener("resize", onResize);                               // Écoute
    return () => window.removeEventListener("resize", onResize);               // Cleanup
  }, []);

  // --- Fond/vague (inchangé) ---
  const waveHeight   = isMobile ? 110 : 180;                                   // Hauteur canvas vague
  const overlapRatio = isMobile ? 0.42 : 0.48;                                 // % vague sous le texte (réserve)
  const overlapPx    = Math.round(waveHeight * overlapRatio);                  // Chevauchement pour la réserve
  const reservedPx   = waveHeight - overlapPx;                                 // Padding-bottom réel

  // --- Descente visuelle (ne touche pas au layout/fond) ---
  const extraDrop = isMobile ? 15 : 30;                                        // TranslateY du bloc texte

  // --- Tailles typographiques (légèrement réduites en mobile) ---
  const fontBase   = isMobile ? "0.9rem"  : "1rem";                            // Taille de base
  const fontLabel  = isMobile ? "0.9rem"  : "1rem";                            // Politique
  const fontCredit = isMobile ? "0.88rem" : "0.98rem";                         // Crédit + réseaux

  return (
    <footer
      className="relative w-full text-white footer--fade"                      // Masque/fondu (SCSS)
      style={{
        background: "transparent",                                             // Pas de fond (limite invisible)
        paddingBottom: `calc(${reservedPx}px + env(safe-area-inset-bottom,0px))`, // Réserve inchangée
        marginBottom: 0,                                                       // Pas d’espace externe
        overflow: "visible",                                                   // Ne coupe pas la vague
        isolation: "isolate",                                                  // Contexte z-index
      }}
    >
      {/* Bouton flottant (visible au-dessus) */}
      <button
        type="button" aria-label="Réduire le footer" title="Réduire le footer" // Accessibilité
        onClick={() => document.dispatchEvent(new CustomEvent("hideFooter"))}  // Event global (optionnel)
        className="absolute left-1/2 -translate-x-1/2 -top-5 z-[60]"           // Positionnement
        style={{
          cursor: "pointer",
          background: "rgba(255,255,255,0.88)",
          borderRadius: "9999px",
          boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
          padding: "6px",
          backdropFilter: "saturate(120%) blur(2px)",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 9l6 6 6-6" stroke="#0ea5e9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Bloc contenu (chevauche la vague, pyramidage en mobile) */}
      <div
        className="mx-auto w-full px-4"
        style={{
          maxWidth: isMobile ? "980px" : "1100px",                             // Largeur utile
          position: "relative", zIndex: 40,                                    // Au-dessus de la vague
          display: isMobile ? "grid" : "flex",                                 // Grid mobile / Flex desktop
          alignItems: "center",
          justifyContent: isMobile ? "center" : "space-between",               // Centre en mobile
          gap: isMobile ? "6px" : "28px",                                      // Marges réduites en mobile
          textAlign: "center",                                                 // Lecture sur fond ondulé
          marginBottom: `-${overlapPx}px`,                                     // Chevauchement (fond inchangé)
          paddingTop: isMobile ? "10px" : "18px",                              // Souffle haut
          transform: `translateY(${extraDrop}px)`,                             // Descente visuelle
          textShadow: "0 2px 8px rgba(0,0,0,0.28)",                            // Contraste
        }}
      >
        {/* Ligne 1 — Sommet pyramide (70% de largeur) */}
        <span
          style={{
            fontWeight: 600,
            fontSize: fontBase,
            lineHeight: 1.25,
            width: isMobile ? "70%" : "auto",                                   // Pyramide: petit sommet
            margin: "0 auto",                                                   // Centré
          }}
        >
          © 2021–{new Date().getFullYear()} GHN-Group
        </span>

        {/* Ligne 2 — Centre pyramide (100% de largeur) */}
        <button
          type="button"
          aria-label="Politique de confidentialité"
          onClick={() => setShowConfidentialite(true)}
          className="footer-conf-btn"
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
            color: "#fff", background: "transparent", border: "none", cursor: "pointer",
            padding: isMobile ? "6px 8px" : "6px 10px", borderRadius: "8px",
            textDecoration: "none", whiteSpace: "nowrap", fontWeight: 700,
            fontSize: fontLabel, lineHeight: 1.25,
            width: isMobile ? "100%" : "auto",                                   // Pyramide: base la plus large
            margin: "0 auto",
          }}
        >
          <span role="img" aria-label="Confidentialité">🔒</span>
          Politique de confidentialité
        </button>

        {/* Ligne 3 — Base pyramide (85% de largeur) + réseaux */}
        <span
          style={{
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: isMobile ? "10px" : "6px",                                      // Icônes plus aérées en mobile
            fontSize: fontCredit,
            lineHeight: 1.25,
            width: isMobile ? "85%" : "auto",                                    // Pyramide: base moyenne
            margin: "0 auto",
            opacity: isMobile ? 0.95 : 1,                                        // Discrétion légère
          }}
        >
          Développement : MyDigitalProd.
          <a
            href="https://www.instagram.com/mydigitalprod" target="_blank" rel="noopener noreferrer"
            aria-label="Instagram MyDigitalProd" title="Instagram MyDigitalProd"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4em",
              marginLeft: isMobile ? 0 : "0.5em",
              textDecoration: "none", color: "#fff", opacity: 0.96,
              transition: "transform 200ms ease, opacity 200ms ease, filter 200ms ease",
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-1px) scale(1.05)"; e.currentTarget.style.opacity = "1"; e.currentTarget.style.filter = "drop-shadow(0 2px 6px rgba(0,0,0,0.25))"; }}
            onMouseOut ={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.opacity = "0.96"; e.currentTarget.style.filter = "none"; }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden>
              <path fill="currentColor" d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm12 1.5a1 1 0 110 2 1 1 0 010-2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
            </svg>
          </a>
          <a
            href="https://wa.me/32456833300" target="_blank" rel="noopener noreferrer"
            aria-label="WhatsApp MyDigitalProd" title="WhatsApp MyDigitalProd"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4em",
              marginLeft: isMobile ? 0 : "0.5em",
              textDecoration: "none", color: "#fff", opacity: 0.96,
              transition: "transform 200ms ease, opacity 200ms ease, filter 200ms ease",
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-1px) scale(1.05)"; e.currentTarget.style.opacity = "1"; e.currentTarget.style.filter = "drop-shadow(0 2px 6px rgba(0,0,0,0.25))"; }}
            onMouseOut ={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.opacity = "0.96"; e.currentTarget.style.filter = "none"; }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="18" height="18" aria-hidden>
              <path fill="currentColor" d="M16 3C9.383 3 4 8.383 4 15a11.9 11.9 0 0 0 1.627 6.036L4 29l8.227-1.585A12.93 12.93 0 0 0 16 27c6.617 0 12-5.383 12-12S22.617 3 16 3z" />
            </svg>
          </a>
        </span>
      </div>

      {/* Vague (sous le contenu) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          width: "100%", height: `${waveHeight}px`, zIndex: 10,
          pointerEvents: "none", overflow: "visible",
        }}
      >
        <RealisticWaveEffect
          height={waveHeight}
          amplitude={isMobile ? 16 : 12}
          frequency={isMobile ? 0.012 : 0.009}
          speed={isMobile ? 0.022 : 0.016}
          color="#009ee0"
          opacity={0.9}
          layers={8}
        />
      </div>

      {/* Modal */}
      {showConfidentialite && (
        <ConfidentialiteModal
          open={showConfidentialite}
          onClose={() => setShowConfidentialite(false)}
        />
      )}
    </footer>
  );
}
