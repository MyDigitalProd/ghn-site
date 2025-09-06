"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";

const categories = [
  { id: "all", label: "Toutes", color: "bg-gradient-to-r from-sky-500 to-cyan-500" },
  { id: "couverture", label: "Couverture", color: "bg-gradient-to-r from-blue-500 to-sky-500" },
  { id: "entretien", label: "Entretien", color: "bg-gradient-to-r from-cyan-500 to-teal-500" },
  { id: "hivernage", label: "Hivernage", color: "bg-gradient-to-r from-sky-500 to-cyan-500" },
  { id: "local-technique", label: "Local technique", color: "bg-gradient-to-r from-indigo-500 to-sky-500" },
  { id: "piscine", label: "Piscine", color: "bg-gradient-to-r from-teal-500 to-green-500" },
];

// Datasets par dossier (on omet les .heic pour compat web)
const DATASETS = {
  couverture: [
    "/img/realisations/Couvertur/20250404_182418.jpg",
    "/img/realisations/Couvertur/IMG-20250611-WA0016(2).jpg",
    "/img/realisations/Couvertur/IMG-20250611-WA0018(1).jpg",
    "/img/realisations/Couvertur/IMG-20250829-WA0037.jpg",
  ],
  entretienDesktop: [
    "/img/realisations/Entretien Desktop/IMG_20250902_083338_928.webp",
    "/img/realisations/Entretien Desktop/IMG_20250902_083409_924.webp",
    "/img/realisations/Entretien Desktop/IMG_20250902_083443_521.webp",
    "/img/realisations/Entretien Desktop/IMG_20250902_083513_355.webp",
  ],
  entretienMobile: [
    "/img/realisations/Entretien Mobile/IMG_20250830_014353_226.webp",
    "/img/realisations/Entretien Mobile/IMG_20250830_014438_576.webp",
    "/img/realisations/Entretien Mobile/IMG_20250830_014505_435.webp",
    "/img/realisations/Entretien Mobile/IMG_20250830_014529_360.webp",
  ],
  hivernage: [
    "/img/realisations/Hivernage/20241115_141649.jpg",
    "/img/realisations/Hivernage/IMG-20250611-WA0059(1).jpg",
    "/img/realisations/Hivernage/IMG-20250611-WA0060(1).jpg",
    "/img/realisations/Hivernage/IMG-20250829-WA0012.jpg",
    "/img/realisations/Hivernage/IMG-20250829-WA0023.jpg",
    "/img/realisations/Hivernage/IMG-20250829-WA0026.jpg",
    "/img/realisations/Hivernage/IMG-20250829-WA0027.jpg",
    "/img/realisations/Hivernage/IMG-20250829-WA0028.jpg",
    "/img/realisations/Hivernage/IMG-20250829-WA0032.jpg",
    "/img/realisations/Hivernage/IMG-20250829-WA0033.jpg",
    "/img/realisations/Hivernage/IMG-20250829-WA0036.jpg",
    "/img/realisations/Hivernage/IMG-20250829-WA0042.jpg",
  ],
  localTechnique: [
    "/img/realisations/Local technique/IMG-20250829-WA0006.jpg",
    "/img/realisations/Local technique/IMG-20250829-WA0011.jpg",
    "/img/realisations/Local technique/IMG-20250829-WA0022.jpg",
  ],
  piscine: [
    "/img/realisations/Piscine/IMG-20250611-WA0045(1).jpg",
    "/img/realisations/Piscine/IMG-20250611-WA0046(1).jpg",
    "/img/realisations/Piscine/IMG-20250829-WA0030.jpg",
    "/img/realisations/Piscine/IMG-20250829-WA0035.jpg",
  ],
};

export default function RealisationsCarousel() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Détecte mobile (viewport < 768px)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const getImagesForCategory = useMemo(() => {
    const entretien = isMobile ? DATASETS.entretienMobile : DATASETS.entretienDesktop;
    return (catId) => {
      switch (catId) {
        case "couverture":
          return DATASETS.couverture;
        case "entretien":
          return entretien;
        case "hivernage":
          return DATASETS.hivernage;
        case "local-technique":
          return DATASETS.localTechnique;
        case "piscine":
          return DATASETS.piscine;
        case "all":
        default:
          return [
            ...DATASETS.couverture,
            ...entretien,
            ...DATASETS.hivernage,
            ...DATASETS.localTechnique,
            ...DATASETS.piscine,
          ];
      }
    };
  }, [isMobile]);

  const images = getImagesForCategory(selectedCategory);

  // Sécurité: si index hors limites après changement de catégorie
  useEffect(() => {
    if (currentIndex >= images.length) setCurrentIndex(0);
  }, [images, currentIndex]);

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  const goToSlide = (i) => setCurrentIndex(i);

  return (
    <LazyMotion features={domAnimation} strict>
    <div className="w-full max-w-5xl mx-auto px-2">
      {/* Filtres */}
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {categories.map((c) => (
          <m.button
            key={c.id}
            onClick={() => { setSelectedCategory(c.id); setCurrentIndex(0); }}
            className={`px-4 py-2 rounded-full text-white font-medium transition-all duration-300 ${selectedCategory === c.id ? `${c.color} scale-105 shadow-lg` : "bg-gray-400 hover:bg-gray-500"}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {c.label}
          </m.button>
        ))}
      </div>

      {/* Carousel */}
      <div className="group relative overflow-hidden rounded-2xl bg-transparent">
        <div className="relative h-[36vh] md:h-[44vh] lg:h-[48vh] min-h-[260px] max-h-[520px]">
          <AnimatePresence mode="wait">
            <m.div
              key={`${selectedCategory}-${currentIndex}`}
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div className="relative h-full flex items-center justify-center">
                {images.length > 0 ? (
                  <div className="relative w-[90%] h-[88%]">
                    <Image
                      src={images[currentIndex]}
                      alt={`Réalisation ${currentIndex + 1}`}
                      fill
                      sizes="(max-width: 768px) 90vw, (max-width: 1200px) 70vw, 800px"
                      className="object-contain rounded-2xl shadow-xl shadow-sky-300/50 will-change-transform img-float transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.01]"
                      priority={false}
                    />
                  </div>
                ) : (
                  <div className="text-gray-600">Aucune image</div>
                )}
              </div>
              </m.div>
          </AnimatePresence>
        </div>

        {/* Contrôles */}
        {images.length > 1 && (
          <>
            <button onClick={goToPrev} aria-label="Précédent" className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-sky-700 p-2 rounded-full shadow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
                <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <button onClick={goToNext} aria-label="Suivant" className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-sky-700 p-2 rounded-full shadow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
                <path fill="currentColor" d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
              </svg>
            </button>
          </>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-2 py-3">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`h-2 rounded-full transition-all ${i === currentIndex ? "bg-sky-500 w-6" : "bg-gray-400 w-2"}`}
                aria-label={`Aller à l'image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      {/* Animation flottante locale au composant */}
  <style jsx>{`
        @keyframes floatImg {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.01); }
          100% { transform: translateY(0) scale(1); }
        }
        .img-float { animation: floatImg 6s ease-in-out infinite; }
      `}</style>
  </div>
  </LazyMotion>
  );
}
