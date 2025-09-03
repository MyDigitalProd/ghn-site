"use client";
import { useEffect, useRef, useState } from "react";

// Composant d'effet de vague réaliste avec Canvas et simulation physique
export default function RealisticWaveEffect({ 
  height = 120, 
  amplitude = 20, 
  frequency = 0.02, 
  speed = 0.03,
  color = "#009ee0",
  opacity = 0.8,
  layers = 3 
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Animation principale
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
      
      // Configuration pour chaque layer avec courants croisés de piscine
      for (let layer = 0; layer < layers; layer++) {
        const layerAmplitude = amplitude * (1 - layer * 0.3);
        // Vitesses adaptées mobile/desktop
        const mobileSpeedFactor = isMobile ? 0.5 : 1; // 50% plus lent sur mobile
        const layerFrequency = frequency * (1 + layer * (isMobile ? 0.4 : 0.8)); // Moins de fréquence sur mobile
        const layerSpeed = speed * (1 + layer * (isMobile ? 0.25 : 0.5)) * mobileSpeedFactor; // Plus lent sur mobile
        const layerOpacity = opacity * (1 - layer * 0.2);
        
        // Direction alternée pour courants croisés (comme l'eau de piscine)
        const direction = layer % 2 === 0 ? 1 : -0.7; // Courants plus subtils
        
        // Couleur avec transparence pour chaque layer
        const layerColor = hexToRgba(color, layerOpacity);
        
        // Début du chemin de la vague
        ctx.beginPath();
        ctx.moveTo(0, dimensions.height);
        
        // Génération de la courbe de vague avec courants croisés de piscine
        for (let x = 0; x <= dimensions.width; x += 1) {
          // Calcul de la hauteur de vague avec harmoniques et courants croisés adaptés mobile/desktop
          const baseTime = timeRef.current * layerSpeed * direction;
          const oscillationSpeed = isMobile ? 0.1 : 0.2; // Plus lent sur mobile
          const crossCurrentSpeed = isMobile ? 0.3 : 0.6; // Plus lent sur mobile
          const oscillation = Math.sin(baseTime * oscillationSpeed) * 0.4;
          const crossCurrent = Math.sin(timeRef.current * layerSpeed * -direction * crossCurrentSpeed) * 0.3;
          
          const wave1 = Math.sin((x * layerFrequency) + baseTime + oscillation) * layerAmplitude;
          const wave2Speed = isMobile ? 1.2 : 2.0; // Plus lent sur mobile
          const wave3Speed = isMobile ? 0.9 : 1.5; // Plus lent sur mobile
          const wave4Speed = isMobile ? 1.5 : 2.5; // Plus lent sur mobile
          const wave5Speed = isMobile ? 0.8 : 1.2; // Plus lent sur mobile
          
          const wave2 = Math.sin((x * layerFrequency * 1.7) + (baseTime * wave2Speed) - oscillation + crossCurrent) * (layerAmplitude * 0.6);
          const wave3 = Math.sin((x * layerFrequency * 0.3) + (baseTime * wave3Speed) + oscillation * 0.5 - crossCurrent) * (layerAmplitude * 0.4);
          const wave4 = Math.sin((x * layerFrequency * 2.3) + (baseTime * wave4Speed) - oscillation * 0.7 + crossCurrent * 0.5) * (layerAmplitude * 0.3);
          const wave5 = Math.sin((x * layerFrequency * 0.15) + (baseTime * wave5Speed) + oscillation * 0.8 - crossCurrent * 0.3) * (layerAmplitude * 0.25);
          
          // Décalage vertical subtil par couche pour la profondeur
          const depthOffset = layer * (dimensions.height * 0.05);
          const y = (dimensions.height * 0.6) + wave1 + wave2 + wave3 + wave4 + wave5 + depthOffset;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        // Fermer le chemin vers le bas
        ctx.lineTo(dimensions.width, dimensions.height);
        ctx.lineTo(0, dimensions.height);
        ctx.closePath();
        
        // Remplissage avec gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, dimensions.height);
        const baseColor = hexToRgba(color, layerOpacity);
        const fadeColor = hexToRgba(color, 0);
        
        gradient.addColorStop(0, baseColor);
        gradient.addColorStop(1, fadeColor);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Effet de surface de piscine avec courants croisés subtils
        if (layer === 0) {
          // Surface principale (sens normal)
          ctx.beginPath();
          for (let x = 0; x <= dimensions.width; x += 2) {
            const surfaceFlow = Math.sin(timeRef.current * speed * 0.08) * 0.4;
            const wave = Math.sin((x * frequency * 4) + (timeRef.current * speed * 3) + surfaceFlow) * (amplitude * 0.2);
            const y = (dimensions.height * 0.4) + wave;
            
            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.strokeStyle = `rgba(255, 255, 255, ${layerOpacity * 0.8})`;
          ctx.lineWidth = 1.8;
          ctx.stroke();
          
          // Surface en contre-courant adapté mobile/desktop
          ctx.beginPath();
          for (let x = 0; x <= dimensions.width; x += 3) {
            const counterFlowSpeed = isMobile ? 0.08 : 0.15; // Plus lent sur mobile
            const surfaceWaveSpeed = isMobile ? 2.0 : 3.5; // Plus lent sur mobile
            const surfaceFrequency = isMobile ? 1.8 : 2.5; // Moins de fréquence sur mobile
            
            const counterFlow = Math.sin(timeRef.current * speed * counterFlowSpeed) * 0.7;
            const wave = Math.sin((x * frequency * surfaceFrequency) - (timeRef.current * speed * surfaceWaveSpeed) - counterFlow) * (amplitude * 0.2);
            const y = (dimensions.height * 0.25) + wave;
            
            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.strokeStyle = `rgba(255, 255, 255, ${layerOpacity * 0.4})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
      
      // Increment time adapté mobile/desktop
      const timeIncrement = isMobile ? 0.4 : 0.8; // 50% plus lent sur mobile
      timeRef.current += timeIncrement;
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };

    // Démarre l'animation
    animate();

    // Nettoyage
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, amplitude, frequency, speed, color, opacity, layers, isMobile]);

  // Utility function: convert hex to rgba
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div 
      style={{ 
        position: "absolute",
        top: 0,
        left: "-10%",
        width: "120%",
        height: `${height}px`,
        pointerEvents: "none",
        zIndex: 1
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block"
        }}
      />
      
      {/* Reflets scintillants multiples */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "60%",
          background: `linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)`,
          animation: "shimmer1 6s ease-in-out infinite"
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: 0,
          right: 0,
          height: "40%",
          background: `linear-gradient(-45deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)`,
          animation: "shimmer2 8s ease-in-out infinite 2s"
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: 0,
          right: 0,
          height: "30%",
          background: `linear-gradient(60deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)`,
          animation: "shimmer3 10s ease-in-out infinite 4s"
        }}
      />
      
      <style jsx>{`
        @keyframes shimmer1 {
          0%, 100% { transform: translateX(-120%); opacity: 0; }
          50% { transform: translateX(120%); opacity: 1; }
        }
        @keyframes shimmer2 {
          0%, 100% { transform: translateX(120%); opacity: 0; }
          50% { transform: translateX(-120%); opacity: 1; }
        }
        @keyframes shimmer3 {
          0%, 100% { transform: translateX(-100%) rotateZ(5deg); opacity: 0; }
          50% { transform: translateX(100%) rotateZ(-5deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
