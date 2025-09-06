// ARCHIVÉ: ce composant a été déplacé dans _archive pour nettoyage.
// Il est conservé ici uniquement comme proxy temporaire.
export { default } from "./PS3WaveEffect";

"use client";
import { useEffect, useRef, useState } from "react";

// Composant d'effet de vagues style PlayStation 3 avec ondulations en contre-sens
export default function PS3WaveEffect({ 
  height = 120, 
  color = "#009ee0",
  opacity = 0.3
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Redimensionnement responsive
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width: rect.width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [height]);

  // Animation principale style PS3
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Configuration du canvas
    canvas.width = dimensions.width * window.devicePixelRatio;
    canvas.height = dimensions.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      const time = timeRef.current * 0.002; // Vitesse très fluide comme PS3
      
      // Vagues principales (sens normal) - Style PS3 avec courbes fluides
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        ctx.moveTo(0, dimensions.height);
        
        const layerOffset = layer * 30;
        const layerOpacity = opacity * (1 - layer * 0.3);
        
        for (let x = 0; x <= dimensions.width; x += 2) {
          // Ondulations principales style PS3 (longues et fluides)
          const wave1 = Math.sin((x * 0.003) + time + layerOffset) * 25;
          const wave2 = Math.sin((x * 0.005) + (time * 1.3) + layerOffset) * 15;
          const wave3 = Math.sin((x * 0.002) + (time * 0.8) + layerOffset) * 20;
          
          const y = (dimensions.height * 0.7) + wave1 + wave2 + wave3 + layerOffset;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        // Fermer le chemin
        ctx.lineTo(dimensions.width, dimensions.height);
        ctx.lineTo(0, dimensions.height);
        ctx.closePath();
        
        // Gradient vertical style PS3
        const gradient = ctx.createLinearGradient(0, 0, 0, dimensions.height);
        gradient.addColorStop(0, hexToRgba(color, layerOpacity));
        gradient.addColorStop(1, hexToRgba(color, 0));
        
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      // Vagues en CONTRE-SENS (effet PS3 signature)
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        ctx.moveTo(0, dimensions.height);
        
        const layerOffset = layer * 25;
        const layerOpacity = opacity * (0.8 - layer * 0.2);
        
        for (let x = 0; x <= dimensions.width; x += 2) {
          // Ondulations en contre-sens (vitesse négative)
          const counterWave1 = Math.sin((x * 0.004) - (time * 1.5) + layerOffset) * 20;
          const counterWave2 = Math.sin((x * 0.006) - (time * 1.8) + layerOffset) * 12;
          const counterWave3 = Math.sin((x * 0.0025) - (time * 1.1) + layerOffset) * 18;
          
          const y = (dimensions.height * 0.5) + counterWave1 + counterWave2 + counterWave3 + layerOffset * 0.5;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        // Fermer le chemin
        ctx.lineTo(dimensions.width, dimensions.height);
        ctx.lineTo(0, dimensions.height);
        ctx.closePath();
        
        // Gradient pour contre-vagues (plus subtil)
        const gradient = ctx.createLinearGradient(0, 0, 0, dimensions.height);
        gradient.addColorStop(0, hexToRgba(color, layerOpacity * 0.7));
        gradient.addColorStop(1, hexToRgba(color, 0));
        
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      // Effet de surface brillante style PS3 (ondulations rapides)
      ctx.beginPath();
      for (let x = 0; x <= dimensions.width; x += 1) {
        const surfaceWave = Math.sin((x * 0.008) + (time * 3)) * 8;
        const counterSurface = Math.sin((x * 0.012) - (time * 4)) * 5;
        const y = (dimensions.height * 0.3) + surfaceWave + counterSurface;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.6})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Deuxième surface en contre-sens
      ctx.beginPath();
      for (let x = 0; x <= dimensions.width; x += 2) {
        const surfaceWave = Math.sin((x * 0.006) - (time * 2.5)) * 6;
        const y = (dimensions.height * 0.2) + surfaceWave;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.4})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      
      // Incrémenter le temps
      timeRef.current += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, color, opacity]);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: `${height}px` }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          width: dimensions.width,
          height: dimensions.height,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}

// Fonction utilitaire pour convertir hex en rgba
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
