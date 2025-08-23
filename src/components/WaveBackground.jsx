"use client"; // Exécute ce composant côté client (animations, hooks React)

import { useId } from "react"; // Génère un identifiant unique pour éviter les collisions d'IDs SVG

// Composant de vague décorative placé "en overlay" dans une section
export default function WaveBackground({ color = "#b6ecfe", height = 90, opacity = 0.7 }) {
  const uid = useId();                    // ID unique par instance (évite conflits si plusieurs vagues)
  const id1 = `${uid}-fade1`;             // ID unique pour le gradient 1
  const id2 = `${uid}-fade2`;             // ID unique pour le gradient 2

  return (
    <div style={{ position: "relative", width: "120%", left: "-10%" }}> {/* Dépassement latéral pour couvrance */}
      {/* Vague 1 (au-dessus) */}
      <svg
        width="100%"                       // Prend toute la largeur du conteneur
        height={height}                    // Hauteur paramétrable
        viewBox="0 0 1400 140"             // Vue logique de la forme
        preserveAspectRatio="none"         // Étirement vertical autorisé sans espaces
        style={{
          display: "block",                // Supprime l'espace inline
          opacity,                         // Opacité contrôlée par prop
          pointerEvents: "none",           // Non cliquable
          position: "absolute",            // Positionné dans le parent
          top: 0,                          // Collé en haut
          left: 0,                         // Collé à gauche
          zIndex: 1,                       // Au-dessus de la vague 2
        }}
        className="wave-anim1"             // Classe animée via styled-jsx ci-dessous
      >
        <defs>                             {/* Définitions (gradient) */}
          <linearGradient id={id1} x1="0" x2="0" y1="0" y2="1"> {/* Gradient vertical unique */}
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />   {/* Plus opaque en haut */}
            <stop offset="100%" stopColor={color} stopOpacity="0" />   {/* Fondu vers transparent */}
          </linearGradient>
        </defs>
        <path
          d="M0,60 C200,120 400,0 700,60 C1000,120 1200,0 1400,60 L1400,140 L0,140 Z" // Courbe de la vague
          fill={`url(#${id1})`}            // Remplissage avec gradient 1
        />
      </svg>

      {/* Vague 2 (derrière, plus douce) */}
      <svg
        width="100%"                       // Pleine largeur
        height={height}                    // Même hauteur
        viewBox="0 0 1400 140"             // Même vue
        preserveAspectRatio="none"         // Même étirement
        style={{
          display: "block",                // Pas d'espace inline
          opacity: opacity * 0.5,          // Plus discrète
          pointerEvents: "none",           // Non cliquable
          position: "absolute",            // Superposée
          top: 0,                          // En haut
          left: 0,                         // À gauche
          zIndex: 0,                       // Derrière la vague 1
        }}
        className="wave-anim2"             // Deuxième animation
      >
        <defs>                             {/* Gradient 2 */}
          <linearGradient id={id2} x1="0" x2="0" y1="0" y2="1">         {/* ID unique */}
            <stop offset="0%" stopColor="#e0f7fa" stopOpacity="0.7" />  {/* Teinte secondaire */}
            <stop offset="100%" stopColor="#e0f7fa" stopOpacity="0" />  {/* Fondu */}
          </linearGradient>
        </defs>
        <path
          d="M0,80 C300,120 600,20 900,80 C1200,140 1400,40 1400,80 L1400,140 L0,140 Z" // Courbe différente
          fill={`url(#${id2})`}            // Remplissage avec gradient 2
        />
      </svg>

      {/* Animations locales (styled-jsx, scoped au composant) */}
      <style jsx>{`
        .wave-anim1 { animation: waveMove1 12s linear infinite; }  /* Défilement lent gauche */
        .wave-anim2 { animation: waveMove2 18s linear infinite; }  /* Défilement lent droite */

        @keyframes waveMove1 {
          0% { transform: translateX(0); }
          100% { transform: translateX(-60px); }
        }
        @keyframes waveMove2 {
          0% { transform: translateX(0); }
          100% { transform: translateX(60px); }
        }
      `}</style>
    </div>
  );
} // ← Fin du composant (une seule accolade fermante)
