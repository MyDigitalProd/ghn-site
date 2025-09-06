"use client";
// Wrapper image local optimisé: utilise next/image avec import statique
// - placeholder blur auto (fourni par Next sur import statique)
// - width/height dérivés de l'import; style responsive par défaut
// - priority optionnel; sizes par défaut raisonnable
import Image from "next/image";

export default function LocalImage({ src, alt, priority = false, fetchPriority, sizes = "(max-width: 768px) 100vw, 100vw", className, style }) {
  return (
    <Image
      src={src}
      alt={alt}
      placeholder="blur"
      priority={priority}
  fetchPriority={fetchPriority}
      sizes={sizes}
      className={className}
      // Rendu responsive sans casser les ratios
      style={{ width: "100%", height: "auto", ...style }}
    />
  );
}
