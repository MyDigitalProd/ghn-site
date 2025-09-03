"use client";
import { useEffect, useRef } from "react";

// Composant d'ondulations subtiles pour simuler l'eau stagnante
export default function StagnantWaterRipple({ 
  color = "#b6ecfe", 
  opacity = 0.3,
  intensity = 0.5 // Intensité des ondulations (0-1)
}) {
  const rippleRef = useRef(null);

  useEffect(() => {
    if (!rippleRef.current) return;

    // Créer plusieurs cercles d'ondulation
    const rippleContainer = rippleRef.current;
    const rippleCount = 4;

    for (let i = 0; i < rippleCount; i++) {
      const ripple = document.createElement('div');
      
      // Style de base
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.border = `1.5px solid ${color}${Math.floor(opacity * 80).toString(16)}`;
      ripple.style.pointerEvents = 'none';
      ripple.style.boxShadow = `0 0 15px ${color}30`;
      
      // Taille et position aléatoires
      const size = 60 + Math.random() * 120;
      const x = Math.random() * 100;
      const y = Math.random() * 60 + 20; // Plus centré verticalement
      
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${x}%`;
      ripple.style.top = `${y}%`;
      ripple.style.transform = 'translate(-50%, -50%)';
      
      // Animation d'ondulation
      const duration = 6 + Math.random() * 8; // 6-14 secondes
      const delay = Math.random() * 5;
      
      ripple.style.animation = `
        rippleExpand${i} ${duration}s ${delay}s infinite ease-in-out,
        rippleFade${i} ${duration}s ${delay}s infinite ease-in-out
      `;
      
      // Injection des keyframes
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        @keyframes rippleExpand${i} {
          0% { 
            transform: translate(-50%, -50%) scale(${0.8 + intensity * 0.3}); 
          }
          50% { 
            transform: translate(-50%, -50%) scale(${1.2 + intensity * 0.5}); 
          }
          100% { 
            transform: translate(-50%, -50%) scale(${0.8 + intensity * 0.3}); 
          }
        }
        
        @keyframes rippleFade${i} {
          0%, 100% { 
            opacity: ${opacity * 0.5}; 
            border-width: 1px;
          }
          50% { 
            opacity: ${opacity * 1.2}; 
            border-width: 2px;
          }
        }
      `;
      
      document.head.appendChild(styleSheet);
      rippleContainer.appendChild(ripple);
    }

    // Nettoyage
    return () => {
      while (rippleContainer.firstChild) {
        rippleContainer.removeChild(rippleContainer.firstChild);
      }
      // Nettoyer les styles injectés
      const styles = document.querySelectorAll('style');
      styles.forEach(style => {
        if (style.textContent.includes('rippleExpand')) {
          style.remove();
        }
      });
    };
  }, [color, opacity, intensity]);

  return (
    <div
      ref={rippleRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden"
      }}
      className="stagnant-water-ripples"
    />
  );
}
