"use client"; // Exécute ce composant côté client (animations, hooks React)

import { useId } from "react"; // Génère un identifiant unique pour éviter les collisions d'IDs SVG
import WaterParticles from "./WaterParticles"; // Particules décoratives (optionnelles)
import StagnantWaterRipple from "./StagnantWaterRipple"; // Ondulations (optionnelles)

// Composant de vague décorative placé "en overlay" dans une section avec effet de profondeur
export default function WaveBackground({ 
  color = "#b6ecfe", 
  height = 90, 
  opacity = 0.7, 
  particles = true, // Nouvelle prop pour activer/désactiver les particules
  particleCount = 6, // Nombre de particules
  ripples = true, // Ondulations d'eau stagnante
  rippleIntensity = 0.4 // Intensité des ondulations
}) {
  const uid = useId();                    // ID unique par instance (évite conflits si plusieurs vagues)
  const id1 = `${uid}-fade1`;             // ID unique pour le gradient 1
  const id2 = `${uid}-fade2`;             // ID unique pour le gradient 2
  const id3 = `${uid}-fade3`;             // ID unique pour le gradient 3 (profondeur)

  return (
    <div style={{ position: "relative", width: "120%", left: "-10%" }}> {/* Dépassement latéral pour couvrance */}
      
      {/* Vague 3 (arrière-plan, la plus profonde) */}
      <svg
        width="100%"                       // Pleine largeur
        height={height}                    // Même hauteur
        viewBox="0 0 1400 140"             // Même vue
        preserveAspectRatio="none"         // Même étirement
        style={{
          display: "block",                // Pas d'espace inline
          opacity: opacity * 0.3,          // Très discrète (profondeur)
          pointerEvents: "none",           // Non cliquable
          position: "absolute",            // Superposée
          top: 0,                          // En haut
          left: 0,                         // À gauche
          zIndex: -1,                      // La plus en arrière
        }}
        className="wave-anim3"             // Troisième animation (lente)
      >
        <defs>                             {/* Gradient 3 */}
          <linearGradient id={id3} x1="0" x2="0" y1="0" y2="1">         {/* ID unique */}
            <stop offset="0%" stopColor="#f0f9ff" stopOpacity="0.8" />  {/* Teinte très claire */}
            <stop offset="100%" stopColor="#f0f9ff" stopOpacity="0" />  {/* Fondu */}
          </linearGradient>
        </defs>
        <path
          d="M0,100 C250,140 500,60 750,100 C1000,140 1150,80 1400,100 L1400,140 L0,140 Z" // Courbe très douce
          fill={`url(#${id3})`}            // Remplissage avec gradient 3
        />
      </svg>

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
        .wave-anim1 { animation: waveMove1 18s ease-in-out infinite; }  /* Va-et-vient doux */
        .wave-anim2 { animation: waveMove2 22s ease-in-out infinite; }  /* Mouvement lent opposé */
        .wave-anim3 { animation: waveMove3 28s ease-in-out infinite; }  /* Très lent (eau stagnante) */

        @keyframes waveMove1 {
          0% { transform: translateX(0) scale(1); }
          25% { transform: translateX(-20px) scale(1.015); }
          50% { transform: translateX(-40px) scale(1.03); }
          75% { transform: translateX(-20px) scale(1.015); }
          100% { transform: translateX(0) scale(1); }
        }
        @keyframes waveMove2 {
          0% { transform: translateX(0) scale(1); }
          33% { transform: translateX(25px) scale(0.985); }
          66% { transform: translateX(50px) scale(0.97); }
          100% { transform: translateX(25px) scale(0.985); }
        }
        @keyframes waveMove3 {
          0% { transform: translateX(0) rotateZ(0deg) scale(1); }
          25% { transform: translateX(-15px) rotateZ(0.3deg) scale(1.01); }
          50% { transform: translateX(8px) rotateZ(-0.2deg) scale(0.99); }
          75% { transform: translateX(-25px) rotateZ(0.4deg) scale(1.02); }
          100% { transform: translateX(0) rotateZ(0deg) scale(1); }
        }

        /* Respecter la préférence de réduction de mouvement */
        @media (prefers-reduced-motion: reduce) {
          .wave-anim1, .wave-anim2, .wave-anim3 { animation: none !important; transform: none !important; }
        }
      `}</style>

      {/* Ondulations d'eau stagnante (optionnelles) */}
      {ripples && (
        <StagnantWaterRipple 
          color={color}
          opacity={opacity * 0.4}
          intensity={rippleIntensity}
        />
      )}

      {/* Particules d'eau flottantes (optionnelles) */}
      {particles && (
        <WaterParticles 
          count={particleCount}
          color={color}
          size={{ min: 2, max: 6 }}
          speed={{ min: 20, max: 40 }}
        />
      )}
    </div>
  );
} // ← Fin du composant (une seule accolade fermante)
