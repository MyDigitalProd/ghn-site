"use client";
import { useEffect, useRef } from "react";

// Composant de particules d'eau flottantes pour effet de profondeur
export default function WaterParticles({ 
  count = 8, 
  color = "#e0f7fa", 
  size = { min: 3, max: 8 },
  speed = { min: 15, max: 35 }
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const particles = [];
    const container = containerRef.current;

    // Création des particules
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      
      // Style de base de la particule
      particle.style.position = 'absolute';
      particle.style.borderRadius = '50%';
      particle.style.background = `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), ${color}90, ${color}60)`;
      particle.style.pointerEvents = 'none';
      particle.style.filter = 'blur(0.3px)';
      particle.style.boxShadow = `0 0 8px ${color}40`;
      
      // Taille aléatoire
      const particleSize = Math.random() * (size.max - size.min) + size.min;
      particle.style.width = `${particleSize}px`;
      particle.style.height = `${particleSize}px`;
      
      // Position initiale aléatoire
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Animation CSS personnalisée (mouvement d'eau stagnante)
      const duration = Math.random() * (speed.max - speed.min) + speed.min;
      const delay = Math.random() * 8;
      const xMovement = (Math.random() - 0.5) * 30; // Mouvement horizontal très léger
      const yMovement = (Math.random() - 0.5) * 20; // Mouvement vertical subtil
      
      particle.style.animation = `
        waterFloat${i} ${duration}s ${delay}s infinite ease-in-out,
        waterGlow${i} ${duration * 1.2}s ${delay}s infinite alternate ease-in-out
      `;
      
      // Injection des keyframes dynamiques
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        @keyframes waterFloat${i} {
          0% { 
            transform: translateY(0px) translateX(0px) scale(1) rotate(0deg);
            opacity: 0.6;
          }
          25% { 
            transform: translateY(${yMovement * 0.3}px) translateX(${xMovement * 0.4}px) scale(1.08) rotate(45deg);
            opacity: 0.8;
          }
          50% { 
            transform: translateY(${yMovement}px) translateX(${xMovement}px) scale(0.92) rotate(90deg);
            opacity: 1;
          }
          75% { 
            transform: translateY(${yMovement * 0.6}px) translateX(${xMovement * 0.7}px) scale(1.05) rotate(135deg);
            opacity: 0.7;
          }
          100% { 
            transform: translateY(0px) translateX(0px) scale(1) rotate(180deg);
            opacity: 0.6;
          }
        }
        
        @keyframes waterGlow${i} {
          0% { filter: blur(0.2px) brightness(1) saturate(1.2); }
          100% { filter: blur(0.6px) brightness(1.3) saturate(1.4); }
        }
      `;
      
      document.head.appendChild(styleSheet);
      container.appendChild(particle);
      particles.push({ element: particle, style: styleSheet });
    }

    // Nettoyage au démontage
    return () => {
      particles.forEach(({ element, style }) => {
        if (element.parentNode) element.parentNode.removeChild(element);
        if (style.parentNode) style.parentNode.removeChild(style);
      });
    };
  }, [count, color, size.min, size.max, speed.min, speed.max]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        overflow: "hidden"
      }}
      className="water-particles-container"
    />
  );
}
