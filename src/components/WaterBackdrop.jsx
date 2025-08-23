"use client"; // Rend le composant utilisable côté client

// Composant purement visuel : deux calques fixes en arrière-plan
export default function WaterBackdrop() {
  return (
    <>
      {/* Calque principal “eau” (dégradés + vagues bas) */}
      <div className="water-bg" />
      {/* Caustiques/points doux en dérive */}
      <div className="water-noise" />
    </>
  );
}
