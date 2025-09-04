"use client"; // Rend le fichier côté client pour autoriser les hooks

// ----- Imports React & icônes -----
import React, { useEffect, useRef, useState } from "react"; // Hooks React
import {
  FaDraftingCompass, FaCogs, FaGem, FaTools, FaRedo, FaWrench, FaSnowflake,
  FaLeaf, FaShieldAlt, FaWater, FaCheckCircle, FaHammer, FaPhoneAlt, FaEnvelope, FaUser,
  FaFlask, FaUmbrella, FaPlay, FaBroom, FaClipboardCheck, FaClone, FaRuler
} from "react-icons/fa"; // Icônes
import WaveBackground from "../components/WaveBackground"; // Vague décorative
import PS3WaveEffect from "../components/PS3WaveEffect"; // Effet vagues PlayStation 3
import dynamic from "next/dynamic";
const MobileNavBar = dynamic(() => import("../components/MobileNavBar"), { ssr: false });
const WhatsAppBubble = dynamic(() => import("../components/WhatsAppBubble"), { ssr: false });
const InteractiveContact = dynamic(() => import("../components/InteractiveContact"), { ssr: false });
import InfoModal from "@/components/InfoModal";
const RealisationsCarousel = dynamic(() => import("../components/RealisationsCarousel"), { ssr: false });
const RealisticWaveEffect = dynamic(() => import("../components/RealisticWaveEffect"), { ssr: false });

// ----- Page one-page GHN -----
export default function Page() {
  // Observer unique pour révéler/masquer les blocs marqués data-reveal
  useEffect(() => {
    // Récupération de toutes les cibles (plus précis qu'observer la SECTION entière)
    const targets = Array.from(document.querySelectorAll("[data-reveal]")); // Sélecteur attribut

    // État initial (caché) + transition douce
    targets.forEach((el) => { // Pour chaque bloc ciblé
      el.classList.add("reveal-base"); // Pose l'état initial (opacity 0 + translate + blur)
    });

    // IntersectionObserver configuré pour déclencher un peu avant le centre
    const io = new IntersectionObserver(
      (entries) => { // Callback à chaque changement de visibilité
        entries.forEach((entry) => { // Pour chaque élément observé
          if (entry.isIntersecting) { // Si visible
            entry.target.classList.remove("reveal-out"); // Retire une éventuelle anim de sortie
            entry.target.classList.add("reveal-in");     // Lance l'anim d'entrée
          } else { // Si non visible
            // On lance une sortie uniquement si l'élément a déjà été "in"
            if (entry.target.classList.contains("reveal-in")) { // Évite de "sortir" avant la première entrée
              entry.target.classList.remove("reveal-in"); // Retire anim d'entrée
              entry.target.classList.add("reveal-out");   // Lance anim de sortie
            }
          }
        });
      },
      { root: null, rootMargin: "-20% 0px -25% 0px", threshold: 0 } // Fenêtre de déclenchement
    );

    // Démarre l'observation sur chaque cible
    targets.forEach((el) => io.observe(el)); // Observe tous les blocs

    // Nettoyage à l'unmount
    return () => io.disconnect(); // Coupe l'observer proprement
  }, []); // Une seule fois au montage

  // Rendu principal
  return (
    <>
      {/* Fond global discret (dégradé bleu très léger) */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50" /> {/* Arrière-plan */}

      {/* MobileNavBar visible uniquement sur mobile */}
      <div className="lg:hidden">
        <MobileNavBar />
      </div>

      <main className="w-full scroll-smooth relative"> {/* Conteneur principal */}

        {/* Bulle WhatsApp flottante qui se cache dans la section contact */}
        <WhatsAppBubble hideOnContact={true} />

        {/* ====== ACCUEIL ====== */}
        <section
          id="accueil"
          className="min-h-screen flex flex-col w-full bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50 relative overflow-hidden"
        >
          {/* Vague décor en haut de section (effet Canvas dynamique mais doux) */}
          <div className="absolute top-0 inset-x-0 z-0 pointer-events-none h-[90px] w-full">
            {/* Bande sommitale en forme de vague (dégradé doux) */}
            <svg
              className="absolute inset-x-0 top-0"
              width="100%"
              height="12"
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
              style={{ display: "block", pointerEvents: "none" }}
            >
              <defs>
                {/* Dégradé horizontal: plus visible à gauche, disparaît vers la droite */}
                <linearGradient id="accueilTopWaveGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.25" />
                  <stop offset="60%" stopColor="#cbd5e1" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,0 H100 V10 C85,9 70,10.8 55,9.5 C40,8.5 20,8 0,7 Z"
                fill="url(#accueilTopWaveGrad)"
              />
            </svg>
            {/* Effet de vague Canvas doux avec courants croisés de piscine */}
            <RealisticWaveEffect 
              height={90}
              amplitude={10}
              frequency={0.007}
              speed={0.015}
              color="#009ee0"
              opacity={0.4}
              layers={4}
            />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-7xl grid gap-6 md:grid-cols-2 flex-1 pt-[90px] px-4 items-center justify-center" data-reveal>
            <div className="flex flex-col justify-center">                  {/* Colonne texte */}
              <h1 className="text-3xl md:text-5xl font-bold leading-tight"> {/* Titre */}
                GHN Group – Piscines & Extérieurs d'Exception               {/* Libellé */}
              </h1>
              <p className="mt-4 text-base md:text-lg text-gray-700">       {/* Accroche */}
                Imaginez la piscine idéale, parfaitement intégrée à votre jardin. Projets sur mesure, du bassin familial au couloir de nage, en passant par la piscine miroir.
              </p>
              <ul className="mt-6 space-y-2 text-gray-700">                 {/* Points clés */}
                <li>Étude de faisabilité sur site</li>                      {/* Item */}
                <li>Accompagnement administratif</li>                       {/* Item */}
                <li>Matériaux haut de gamme & finitions soignées</li>       {/* Item */}
              </ul>
            </div>

            {/* Image logo de l'entreprise */}
            <div className="flex items-center justify-center w-full max-w-full">
              <img 
                src="/img/logo adam fini (2).png" 
                alt="Logo GHN Group - Piscines & Extérieurs" 
                className="w-full h-auto max-w-full max-h-full object-contain p-4"
              />
            </div>
          </div>
        </section>

        {/* ====== CONSTRUCTION ====== */}
        <section
          id="construction"
          className="min-h-screen flex flex-col w-full bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50 relative overflow-hidden"
        >
          {/* Vague décor en haut de section (effet Canvas dynamique mais doux) */}
          <div className="absolute top-0 inset-x-0 z-0 pointer-events-none h-[90px] w-full">
            {/* Bande sommitale en forme de vague (dégradé doux) */}
            <svg
              className="absolute inset-x-0 top-0"
              width="100%"
              height="12"
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
              style={{ display: "block", pointerEvents: "none" }}
            >
              <defs>
                {/* Dégradé horizontal: plus visible à gauche, disparaît vers la droite */}
                <linearGradient id="constructionTopWaveGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.25" />
                  <stop offset="60%" stopColor="#cbd5e1" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,0 H100 V10 C85,9 70,10.8 55,9.5 C40,8.5 20,8 0,7 Z"
                fill="url(#constructionTopWaveGrad)"
              />
            </svg>
            {/* Effet de vague Canvas doux avec courants croisés de piscine */}
            <RealisticWaveEffect 
              height={90}
              amplitude={10}
              frequency={0.007}
              speed={0.015}
              color="#009ee0"
              opacity={0.4}
              layers={4}
            />
          </div>

          <div className="relative z-10 w-full flex-1 pt-[90px] px-4 flex items-center justify-center" data-reveal>                 {/* Bloc révélé */}
            <ModernConstructionSection />                                     {/* Section détaillée */}
          </div>
        </section>

        {/* ====== RÉNOVATION ====== */}
        <section
          id="renovation"
          className="min-h-screen flex flex-col w-full bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50 relative overflow-hidden"
        >
          {/* Vague décor en haut de section (effet Canvas dynamique mais doux) */}
          <div className="absolute top-0 inset-x-0 z-0 pointer-events-none h-[90px] w-full">
            {/* Bande sommitale en forme de vague (dégradé doux) */}
            <svg
              className="absolute inset-x-0 top-0"
              width="100%"
              height="12"
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
              style={{ display: "block", pointerEvents: "none" }}
            >
              <defs>
                {/* Dégradé horizontal: plus visible à gauche, disparaît vers la droite */}
                <linearGradient id="renovationTopWaveGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.25" />
                  <stop offset="60%" stopColor="#cbd5e1" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,0 H100 V10 C85,9 70,10.8 55,9.5 C40,8.5 20,8 0,7 Z"
                fill="url(#renovationTopWaveGrad)"
              />
            </svg>
            {/* Effet de vague Canvas doux avec courants croisés de piscine */}
            <RealisticWaveEffect 
              height={90}
              amplitude={10}
              frequency={0.007}
              speed={0.015}
              color="#009ee0"
              opacity={0.4}
              layers={4}
            />
          </div>

          <div className="relative z-10 w-full flex-1 pt-[90px] px-4 flex items-center justify-center" data-reveal>
            <ModernRenovationSection />
          </div>
        </section>

        {/* ====== DÉPANNAGE ====== */}
        <section
          id="depannage"
          className="min-h-screen flex flex-col w-full bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50 relative overflow-hidden"
        >
          {/* Vague décor en haut de section (effet Canvas dynamique mais doux) */}
          <div className="absolute top-0 inset-x-0 z-0 pointer-events-none h-[90px] w-full">
            {/* Bande sommitale en forme de vague (dégradé doux) */}
            <svg
              className="absolute inset-x-0 top-0"
              width="100%"
              height="12"
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
              style={{ display: "block", pointerEvents: "none" }}
            >
              <defs>
                {/* Dégradé horizontal: plus visible à gauche, disparaît vers la droite */}
                <linearGradient id="depannageTopWaveGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.25" />
                  <stop offset="60%" stopColor="#cbd5e1" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,0 H100 V10 C85,9 70,10.8 55,9.5 C40,8.5 20,8 0,7 Z"
                fill="url(#depannageTopWaveGrad)"
              />
            </svg>
            {/* Effet de vague Canvas doux avec courants croisés de piscine */}
            <RealisticWaveEffect 
              height={90}
              amplitude={10}
              frequency={0.007}
              speed={0.015}
              color="#009ee0"
              opacity={0.4}
              layers={4}
            />
          </div>

          <div className="relative z-10 w-full flex-1 pt-[90px] px-4 flex items-center justify-center" data-reveal>
            <ModernDepannageSection />
          </div>
        </section>

        {/* ====== HIVERNAGE ====== */}
        <section
          id="hivernage"
          className="min-h-screen flex flex-col w-full bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50 relative overflow-hidden"
        >
          {/* Vague décor en haut de section (effet Canvas dynamique mais doux) */}
          <div className="absolute top-0 inset-x-0 z-0 pointer-events-none h-[90px] w-full">
            {/* Bande sommitale en forme de vague (dégradé doux) */}
            <svg
              className="absolute inset-x-0 top-0"
              width="100%"
              height="12"
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
              style={{ display: "block", pointerEvents: "none" }}
            >
              <defs>
                {/* Dégradé horizontal: plus visible à gauche, disparaît vers la droite */}
                <linearGradient id="hivernageTopWaveGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.25" />
                  <stop offset="60%" stopColor="#cbd5e1" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,0 H100 V10 C85,9 70,10.8 55,9.5 C40,8.5 20,8 0,7 Z"
                fill="url(#hivernageTopWaveGrad)"
              />
            </svg>
            {/* Effet de vague Canvas doux avec courants croisés de piscine */}
            <RealisticWaveEffect 
              height={90}
              amplitude={10}
              frequency={0.007}
              speed={0.015}
              color="#009ee0"
              opacity={0.4}
              layers={4}
            />
          </div>

          <div className="relative z-10 w-full flex-1 pt-[90px] px-4 flex items-center justify-center" data-reveal>
            <ModernHivernageSection />
          </div>
        </section>

        {/* ====== ENTRETIEN ====== */}
        <section
          id="entretien"
          className="min-h-screen flex flex-col w-full bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50 relative overflow-hidden"
        >
          {/* Vague décor en haut de section (effet Canvas dynamique mais doux) */}
          <div className="absolute top-0 inset-x-0 z-0 pointer-events-none h-[90px] w-full">
            {/* Bande sommitale en forme de vague (dégradé doux) */}
            <svg
              className="absolute inset-x-0 top-0"
              width="100%"
              height="12"
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
              style={{ display: "block", pointerEvents: "none" }}
            >
              <defs>
                {/* Dégradé horizontal: plus visible à gauche, disparaît vers la droite */}
                <linearGradient id="entretienTopWaveGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.25" />
                  <stop offset="60%" stopColor="#cbd5e1" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,0 H100 V10 C85,9 70,10.8 55,9.5 C40,8.5 20,8 0,7 Z"
                fill="url(#entretienTopWaveGrad)"
              />
            </svg>
            {/* Effet de vague Canvas doux avec courants croisés de piscine */}
            <RealisticWaveEffect 
              height={90}
              amplitude={10}
              frequency={0.007}
              speed={0.015}
              color="#009ee0"
              opacity={0.4}
              layers={4}
            />
          </div>

          <div className="relative z-10 w-full flex-1 pt-[90px] px-4 flex items-center justify-center" data-reveal>
            <ModernEntretienSection />
          </div>
        </section>

        {/* ====== TERRASSES ====== */}
        <section
          id="terrasses"
          className="min-h-screen flex flex-col w-full bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50 relative overflow-hidden"
        >
          {/* Vague décor en haut de section (effet Canvas dynamique mais doux) */}
          <div className="absolute top-0 inset-x-0 z-0 pointer-events-none h-[90px] w-full">
            {/* Bande sommitale en forme de vague (dégradé doux) */}
            <svg
              className="absolute inset-x-0 top-0"
              width="100%"
              height="12"
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
              style={{ display: "block", pointerEvents: "none" }}
            >
              <defs>
                {/* Dégradé horizontal: plus visible à gauche, disparaît vers la droite */}
                <linearGradient id="terrassesTopWaveGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.25" />
                  <stop offset="60%" stopColor="#cbd5e1" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,0 H100 V10 C85,9 70,10.8 55,9.5 C40,8.5 20,8 0,7 Z"
                fill="url(#terrassesTopWaveGrad)"
              />
            </svg>
            {/* Effet de vague Canvas doux avec courants croisés de piscine */}
            <RealisticWaveEffect 
              height={90}
              amplitude={10}
              frequency={0.007}
              speed={0.015}
              color="#009ee0"
              opacity={0.4}
              layers={4}
            />
          </div>

          <div className="relative z-10 w-full flex-1 pt-[90px] px-4 flex items-center justify-center" data-reveal>
            <ModernTerrassesSection />
          </div>
        </section>

        {/* ====== NOS RÉALISATIONS ====== */}
        <section
          id="nos-realisations"
          className="min-h-screen flex flex-col w-full bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50 relative overflow-hidden"
        >
          {/* Vague décor en haut de section (effet Canvas dynamique mais doux) */}
          <div className="absolute top-0 inset-x-0 z-0 pointer-events-none">
            {/* Bande sommitale en forme de vague (dégradé doux) */}
            <svg
              className="absolute inset-x-0 top-0"
              width="100%"
              height="12"
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
              style={{ display: "block", pointerEvents: "none" }}
            >
              <defs>
                {/* Dégradé horizontal: plus visible à gauche, disparaît vers la droite */}
                <linearGradient id="realisationsTopWaveGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.25" />
                  <stop offset="60%" stopColor="#cbd5e1" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,0 H100 V10 C85,9 70,10.8 55,9.5 C40,8.5 20,8 0,7 Z"
                fill="url(#realisationsTopWaveGrad)"
              />
            </svg>
            {/* Effet de vague Canvas doux avec courants croisés de piscine */}
            <RealisticWaveEffect 
              height={90}
              amplitude={10}
              frequency={0.007}
              speed={0.015}
              color="#009ee0"
              opacity={0.4}
              layers={4}
            />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto w-full flex-1 pt-[90px] px-4 flex items-center justify-center" data-reveal>
            <div className="w-full">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-[#009ee0]">Nos Réalisations</h2>
              <p className="text-center text-lg mb-8 text-gray-700">Découvrez quelques-unes de nos réalisations : piscines, entretien, hivernage et aménagements sur mesure.</p>
              <RealisationsCarousel />
            </div>
          </div>
        </section>

        {/* ====== CONTACT ====== */}
        <section
          id="contact"
          className="min-h-screen flex flex-col w-full bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50 relative overflow-hidden"
        >
          {/* Vague décor en haut de section (effet Canvas dynamique mais doux) */}
          <div className="absolute top-0 inset-x-0 z-0 pointer-events-none h-[90px] w-full">
            {/* Bande sommitale en forme de vague (dégradé doux) */}
            <svg
              className="absolute inset-x-0 top-0"
              width="100%"
              height="12"
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
              style={{ display: "block", pointerEvents: "none" }}
            >
              <defs>
                {/* Dégradé horizontal: plus visible à gauche, disparaît vers la droite */}
                <linearGradient id="contactTopWaveGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.25" />
                  <stop offset="60%" stopColor="#cbd5e1" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,0 H100 V10 C85,9 70,10.8 55,9.5 C40,8.5 20,8 0,7 Z"
                fill="url(#contactTopWaveGrad)"
              />
            </svg>
            {/* Effet de vague Canvas doux avec courants croisés de piscine */}
            <RealisticWaveEffect 
              height={90}
              amplitude={10}
              frequency={0.007}
              speed={0.015}
              color="#009ee0"
              opacity={0.4}
              layers={4}
            />
          </div>

          <div className="relative z-10 mx-auto w-full flex-1 pt-[90px] px-4 flex items-center justify-center" data-reveal>
            <InteractiveContact />
          </div>
        </section>
      </main>
    </>
  );
}

// ----- Section Construction (client, simple carterie) -----
function ModernConstructionSection() {
  const ref = useRef(null);                    // Référence (utile si tu veux des anim locales)
  useEffect(() => { /* hook réservé si besoin futur */ }, []); // Pas d'observer doublon ici

  // Import du composant InfoModal
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState("");
  const [modalContent, setModalContent] = React.useState("");
  const [modalIcon, setModalIcon] = React.useState(null);
  const handleOpenModal = (title, content, icon) => {
    setModalTitle(title);
    setModalContent(content);
    setModalIcon(icon);
    setModalOpen(true);
  };
  const handleCloseModal = () => setModalOpen(false);

  // Textes explicatifs (à adapter pour chaque carte)
  const explications = {
    faisabilite: `Nos experts se déplacent sur place pour analyser la configuration de votre terrain et étudier les meilleures options d’implantation. Terrain rocheux, en pente, ou restreint, chaque contrainte devient une opportunité d'optimisation. Nous garantissons une intégration harmonieuse et durable de votre piscine grâce à une étude approfondie des sols et des accès. GHN Group vous accompagne dans les démarches administratives pour une réalisation sereine et conforme aux réglementations locales.`,
    construction: `La construction débute par le terrassement et la préparation du sol, puis la mise en place de la structure de votre piscine. Le système de filtration, les équipements techniques et les finitions (margelles, revêtements) sont installés avec soin. Nous veillons à ce que chaque détail contribue à créer un espace à la fois esthétique et fonctionnel. Les aménagements paysagers viennent parfaire l’ensemble, transformant votre jardin en un véritable havre de paix.`,
    personnalise: `Quelle que soit la configuration de votre terrain, GHN Group trouve la solution idéale pour une intégration harmonieuse avec votre maison et votre jardin. Chaque choix est guidé par trois priorités : l’esthétique, la facilité d’utilisation et le confort. Nous sélectionnons des matériaux haut de gamme, intégrons harmonieusement la végétation, et proposons des solutions d’éclairage pour une ambiance chaleureuse. Nous optimisons l’ensoleillement et éloignons le bassin des arbres pour minimiser l’entretien. Avec GHN Group, votre projet de piscine sur mesure devient une réalité, alliant savoir-faire technique et accompagnement personnalisé.`
  };

  return (
    <div ref={ref} className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-3 sm:mb-4 text-center justify-center">
        <FaDraftingCompass className="text-2xl sm:text-3xl text-sky-500" />
        <span className="leading-tight">Construction de Piscine : Étapes & Conseils</span>
      </h2>
      <p className="mt-3 sm:mt-4 text-gray-700 text-base sm:text-lg text-center max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
        Créer un équilibre parfait entre votre jardin et votre piscine. Chaque projet est unique et conçu sur mesure : formes variées, débordement, couloir de nage, piscine miroir.
      </p>
      <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 - Étude de faisabilité */}
        <div
          className="p-4 sm:p-5 md:p-6 min-h-[160px] sm:min-h-[180px] md:min-h-[200px] rounded-2xl bg-white/95 shadow-2xl border border-sky-100 flex flex-col justify-between hover:scale-105 transition-all duration-300 cursor-pointer"
          onClick={() => handleOpenModal("Étude de faisabilité", explications.faisabilite, <FaDraftingCompass className="text-sky-500" />)}
        >
          <div className="text-center">
            <FaDraftingCompass className="text-2xl sm:text-3xl text-sky-500 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 text-gray-800">Étude de faisabilité</h3>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-gray-700 text-xs sm:text-sm md:text-base">
            <div className="flex items-center gap-1"><FaCheckCircle className="text-sky-400 text-xs flex-shrink-0" /><span>Analyse du terrain</span></div>
            <div className="flex items-center gap-1"><FaCheckCircle className="text-sky-400 text-xs flex-shrink-0" /><span>Implantation optimale</span></div>
            <div className="flex items-center gap-1"><FaCheckCircle className="text-sky-400 text-xs flex-shrink-0" /><span>Gestion des contraintes</span></div>
            <div className="flex items-center gap-1"><FaCheckCircle className="text-sky-400 text-xs flex-shrink-0" /><span>Démarches administratives</span></div>
          </div>
        </div>
        {/* Card 2 - Étapes de construction */}
        <div
          className="p-4 sm:p-5 md:p-6 min-h-[160px] sm:min-h-[180px] md:min-h-[200px] rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-400 text-white shadow-2xl flex flex-col justify-between hover:scale-105 transition-all duration-300 cursor-pointer"
          onClick={() => handleOpenModal("Étapes de construction", explications.construction, <FaCogs className="text-cyan-500" />)}
        >
          <div className="text-center">
            <FaCogs className="text-2xl sm:text-3xl mx-auto mb-2 sm:mb-3" />
            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3">Étapes de construction</h3>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-white/95 text-xs sm:text-sm md:text-base">
            <div className="flex items-center gap-1"><FaCheckCircle className="text-white text-xs drop-shadow flex-shrink-0" /><span>Terrassement</span></div>
            <div className="flex items-center gap-1"><FaCheckCircle className="text-white text-xs drop-shadow flex-shrink-0" /><span>Structure béton</span></div>
            <div className="flex items-center gap-1"><FaCheckCircle className="text-white text-xs drop-shadow flex-shrink-0" /><span>Filtration & équipements</span></div>
            <div className="flex items-center gap-1"><FaCheckCircle className="text-white text-xs drop-shadow flex-shrink-0" /><span>Finitions & paysager</span></div>
          </div>
        </div>
        {/* Card 3 - Projet personnalisé */}
        <div
          className="p-4 sm:p-5 md:p-6 min-h-[160px] sm:min-h-[180px] md:min-h-[200px] rounded-2xl bg-white/95 shadow-2xl border border-cyan-100 flex flex-col justify-between hover:scale-105 transition-all duration-300 cursor-pointer"
          onClick={() => handleOpenModal("Projet personnalisé", explications.personnalise, <FaGem className="text-cyan-500" />)}
        >
          <div className="text-center">
            <FaGem className="text-2xl sm:text-3xl text-cyan-500 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 text-gray-800">Projet personnalisé</h3>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-gray-700 text-xs sm:text-sm md:text-base">
            <div className="flex items-center gap-1"><FaCheckCircle className="text-cyan-400 text-xs flex-shrink-0" /><span>Design esthétique</span></div>
            <div className="flex items-center gap-1"><FaCheckCircle className="text-cyan-400 text-xs flex-shrink-0" /><span>Facilité d'usage</span></div>
            <div className="flex items-center gap-1"><FaCheckCircle className="text-cyan-400 text-xs flex-shrink-0" /><span>Matériaux premium</span></div>
            <div className="flex items-center gap-1"><FaCheckCircle className="text-cyan-400 text-xs flex-shrink-0" /><span>Éclairage LED</span></div>
          </div>
        </div>
      </div>
      {/* Modal explicatif */}
      <InfoModal open={modalOpen} onClose={handleCloseModal} title={modalTitle} icon={modalIcon}>
        {modalContent}
      </InfoModal>
    </div>
  );
}

// ----- Section Rénovation -----
function ModernRenovationSection() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState("");
  const [modalContent, setModalContent] = React.useState("");
  const [modalIcon, setModalIcon] = React.useState(null);
  
  const handleOpenModal = (title, content, icon) => {
    setModalTitle(title);
    setModalContent(content);
    setModalIcon(icon);
    setModalOpen(true);
  };
  const handleCloseModal = () => setModalOpen(false);

  const explications = {
    revetements: `Chez GHN Group, nous redonnons vie à votre piscine grâce à notre expertise en rénovation sur mesure. Qu'il s'agisse d'un simple rafraîchissement ou d'une transformation complète, notre équipe vous accompagne à chaque étape avec professionnalisme et écoute. Le remplacement de revêtements (liner, carrelage, PVC armé) permet de renouveler totalement l'aspect de votre bassin.`,
    fuites: `La réparation de fuites et le traitement des problèmes d'étanchéité sont essentiels pour préserver votre piscine. Nos experts diagnostiquent précisément l'origine des problèmes et appliquent des solutions durables pour garantir l'étanchéité parfaite de votre bassin.`,
    modernisation: `La modernisation des systèmes (filtration, éclairage LED, chauffage, domotique) transforme votre piscine en un espace moderne et économe en énergie. Nous intégrons les dernières technologies pour améliorer le confort et réduire les coûts d'exploitation.`,
    refonte: `La refonte du bassin permet de modifier la forme, la profondeur ou les accès selon vos nouveaux besoins. Cette transformation majeure redonne une seconde vie à votre piscine en l'adaptant parfaitement à vos attentes actuelles.`,
    conformite: `La mise en conformité avec les normes de sécurité en vigueur est indispensable. Nous nous chargeons de tous les aspects réglementaires pour que votre piscine respecte les standards de sécurité les plus récents.`
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-2 sm:mb-3 text-center justify-center">
        <FaRedo className="text-cyan-500 text-3xl sm:text-4xl md:text-5xl" />
        Rénovation de Piscine
      </h2>
      <p className="mt-2 sm:mt-3 text-gray-700 text-sm sm:text-base md:text-lg text-center max-w-3xl mx-auto mb-15 sm:mb-4 px-2">
        Rafraîchissement partiel ou transformation complète : nous redonnons vie à votre bassin avec des solutions durables et esthétiques.
      </p>
      <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[90px] sm:min-h-[100px]"
             onClick={() => handleOpenModal("Remplacement de revêtements", explications.revetements, <FaTools className="text-sky-500" />)}>
          <FaTools className="text-2xl sm:text-3xl md:text-4xl text-sky-500 mb-1" />
            <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">Remplacement de revêtements</h3>
            <p className="text-gray-600 text-center text-xs sm:text-sm">Liner, carrelage, PVC armé</p>
        </div>
          <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[90px] sm:min-h-[100px]"
             onClick={() => handleOpenModal("Réparation de fuites & étanchéité", explications.fuites, <FaWater className="text-cyan-500" />)}>
          <FaWater className="text-2xl sm:text-3xl md:text-4xl text-cyan-500 mb-1" />
            <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">Réparation de fuites & étanchéité</h3>
            <p className="text-gray-600 text-center text-xs sm:text-sm">Diagnostic et solutions durables</p>
        </div>
          <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[90px] sm:min-h-[100px]"
             onClick={() => handleOpenModal("Modernisation", explications.modernisation, <FaCogs className="text-blue-400" />)}>
          <FaCogs className="text-2xl sm:text-3xl md:text-4xl text-blue-400 mb-1" />
            <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">Modernisation</h3>
            <p className="text-gray-600 text-center text-xs sm:text-sm">Filtration, LED, chauffage, domotique</p>
        </div>
          <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[90px] sm:min-h-[100px]"
             onClick={() => handleOpenModal("Refonte du bassin", explications.refonte, <FaHammer className="text-sky-500" />)}>
          <FaHammer className="text-2xl sm:text-3xl md:text-4xl text-sky-500 mb-1" />
            <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">Refonte du bassin</h3>
            <p className="text-gray-600 text-center text-xs sm:text-sm">Forme, profondeur, accès</p>
        </div>
          <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[90px] sm:min-h-[100px]"
             onClick={() => handleOpenModal("Mise en conformité sécurité", explications.conformite, <FaShieldAlt className="text-cyan-500" />)}>
          <FaShieldAlt className="text-2xl sm:text-3xl md:text-4xl text-cyan-500 mb-1" />
            <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">Mise en conformité sécurité</h3>
            <p className="text-gray-600 text-center text-xs sm:text-sm">Sécurité et normes actualisées</p>
        </div>
      </div>
      <InfoModal open={modalOpen} onClose={handleCloseModal} title={modalTitle} icon={modalIcon}>
        {modalContent}
      </InfoModal>
    </div>
  );
}

// ----- Section Dépannage -----
function ModernDepannageSection() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState("");
  const [modalContent, setModalContent] = React.useState("");
  const [modalIcon, setModalIcon] = React.useState(null);
  
  const handleOpenModal = (title, content, icon) => {
    setModalTitle(title);
    setModalContent(content);
    setModalIcon(icon);
    setModalOpen(true);
  };
  const handleCloseModal = () => setModalOpen(false);

  const explications = {
    intervention: `Une panne ne prévient jamais. Chez GHN Group, nous savons qu'un problème technique peut vite compromettre le bon fonctionnement de votre piscine. C'est pourquoi nous mettons un point d'honneur à intervenir rapidement et efficacement, pour que vous puissiez retrouver votre tranquillité sans attendre. Notre équipe est à votre écoute et prête à agir avec professionnalisme et réactivité.`,
    diagnostic: `Nous proposons un diagnostic précis et des solutions sur mesure pour chaque problème rencontré. Notre expertise nous permet d'identifier rapidement l'origine des dysfonctionnements et de proposer la réparation la plus adaptée à votre situation.`,
    reparations: `Nos interventions couvrent tous les aspects techniques : réparation de systèmes de filtration, fuites, pompes, éclairage, etc. Nous disposons de l'équipement et du savoir-faire nécessaires pour résoudre efficacement tous types de pannes.`,
    suivi: `GHN Group assure un suivi professionnel et vous prodigue des conseils pour éviter les récidives. Nous vous accompagnons même après la réparation pour garantir le bon fonctionnement durable de votre installation.`
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-2 sm:mb-3 text-center justify-center">
        <FaWrench className="text-blue-400 text-3xl sm:text-4xl md:text-5xl" />
        Dépannage Piscine
      </h2>
      <p className="mt-2 sm:mt-3 text-gray-700 text-sm sm:text-base md:text-lg text-center max-w-3xl mx-auto mb-15 sm:mb-4 px-2">
        Une panne ne prévient jamais. Intervention rapide, diagnostic précis, réparations efficaces pour retrouver votre tranquillité.
      </p>
      <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 md:grid-cols-2">
        <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[90px] sm:min-h-[100px]"
             onClick={() => handleOpenModal("Intervention rapide", explications.intervention, <FaCheckCircle className="text-sky-500" />)}>
          <FaCheckCircle className="text-2xl sm:text-3xl md:text-4xl text-sky-500 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">Intervention rapide</h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">Sur site, sans délai</p>
        </div>
        <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[90px] sm:min-h-[100px]"
             onClick={() => handleOpenModal("Diagnostic & solutions sur mesure", explications.diagnostic, <FaCogs className="text-cyan-500" />)}>
          <FaCogs className="text-2xl sm:text-3xl md:text-4xl text-cyan-500 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">Diagnostic & solutions sur mesure</h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">Analyse précise, réparation adaptée</p>
        </div>
        <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[90px] sm:min-h-[100px]"
             onClick={() => handleOpenModal("Réparations", explications.reparations, <FaTools className="text-blue-400" />)}>
          <FaTools className="text-2xl sm:text-3xl md:text-4xl text-blue-400 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">Réparations</h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">Filtration, fuites, pompes, éclairage, etc.</p>
        </div>
        <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[90px] sm:min-h-[100px]"
             onClick={() => handleOpenModal("Suivi & conseils", explications.suivi, <FaLeaf className="text-cyan-500" />)}>
          <FaLeaf className="text-2xl sm:text-3xl md:text-4xl text-cyan-500 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">Suivi & conseils</h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">Accompagnement post-réparation</p>
        </div>
      </div>
      <InfoModal open={modalOpen} onClose={handleCloseModal} title={modalTitle} icon={modalIcon}>
        {modalContent}
      </InfoModal>
    </div>
  );
}

// ----- Section Hivernage -----
function ModernHivernageSection() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState("");
  const [modalContent, setModalContent] = React.useState("");
  const [modalIcon, setModalIcon] = React.useState(null);
  
  const handleOpenModal = (title, content, icon) => {
    setModalTitle(title);
    setModalContent(content);
    setModalIcon(icon);
    setModalOpen(true);
  };
  const handleCloseModal = () => setModalOpen(false);

  const explications = {
    protection: `L'hivernage protège votre investissement. Chez GHN Group, nous savons que bien préparer sa piscine pour l'hiver est essentiel pour préserver sa durée de vie et faciliter sa remise en service au printemps. Nos solutions d'hivernage sont adaptées aux spécificités de votre bassin et aux conditions climatiques locales.`,
    traitement: `Le traitement chimique hivernal stabilise l'eau et empêche la prolifération d'algues et de bactéries pendant la période d'arrêt. Nous utilisons des produits spécialisés pour maintenir un équilibre optimal même en période de non-utilisation.`,
    equipements: `La protection des équipements (pompes, filtres, canalisations) contre le gel est cruciale pour éviter les dégâts coûteux. Nous nous chargeons de la vidange et de la protection de tous les éléments sensibles de votre installation.`,
    couverture: `L'installation de couvertures et accessoires d'hivernage protège efficacement votre bassin des impuretés et facilite la remise en service. Nous proposons différents types de couvertures adaptées à vos besoins et à votre budget.`,
    remise: `Au printemps, nous assurons la remise en service complète de votre piscine. Cette prestation inclut le retrait des équipements d'hivernage, la vérification de tous les systèmes et la remise en route progressive pour retrouver une eau cristalline.`
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-2 sm:mb-3 text-center justify-center mb-7">
        <FaSnowflake className="text-cyan-500 text-3xl sm:text-4xl md:text-5xl" />
        Hivernage Piscine
      </h2>
      <p className="mt-2 sm:mt-3 text-gray-700 text-sm sm:text-base md:text-lg text-center max-w-3xl mx-auto mb-15 sm:mb-4 px-2">
        Protégez votre investissement : préparation minutieuse pour l'hiver et remise en service au printemps.
      </p>
      <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[90px] sm:min-h-[100px]"
             onClick={() => handleOpenModal("Protection du bassin", explications.protection, <FaShieldAlt className="text-cyan-500" />)}>
          <FaShieldAlt className="text-2xl sm:text-3xl md:text-4xl text-cyan-500 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">Protection du bassin</h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">Hivernage adapté & professionnel</p>
        </div>
        <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[90px] sm:min-h-[100px]"
             onClick={() => handleOpenModal("Traitement chimique hivernal", explications.traitement, <FaFlask className="text-blue-400" />)}>
          <FaFlask className="text-2xl sm:text-3xl md:text-4xl text-blue-400 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">Traitement chimique hivernal</h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">Équilibre & stabilisation de l'eau</p>
        </div>
        <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[90px] sm:min-h-[100px]"
             onClick={() => handleOpenModal("Protection équipements", explications.equipements, <FaCogs className="text-sky-500" />)}>
          <FaCogs className="text-2xl sm:text-3xl md:text-4xl text-sky-500 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">Protection équipements</h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">Pompes, filtres, canalisations</p>
        </div>
        <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[90px] sm:min-h-[100px]"
             onClick={() => handleOpenModal("Installation couvertures", explications.couverture, <FaUmbrella className="text-cyan-500" />)}>
          <FaUmbrella className="text-2xl sm:text-3xl md:text-4xl text-cyan-500 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">Installation couvertures</h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">Accessoires d'hivernage</p>
        </div>
  <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[90px] sm:min-h-[100px]"
             onClick={() => handleOpenModal("Remise en service", explications.remise, <FaPlay className="text-blue-400" />)}>
          <FaPlay className="text-2xl sm:text-3xl md:text-4xl text-blue-400 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">Remise en service</h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">Retour printemps</p>
        </div>
      </div>
      <InfoModal open={modalOpen} onClose={handleCloseModal} title={modalTitle} icon={modalIcon}>
        {modalContent}
      </InfoModal>
    </div>
  );
}

// ----- Section Entretien -----
function ModernEntretienSection() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState("");
  const [modalContent, setModalContent] = React.useState("");
  const [modalIcon, setModalIcon] = React.useState(null);
  
  const handleOpenModal = (title, content, icon) => {
    setModalTitle(title);
    setModalContent(content);
    setModalIcon(icon);
    setModalOpen(true);
  };
  const handleCloseModal = () => setModalOpen(false);

  const explications = {
    quotidien: `L'entretien quotidien assure une eau cristalline en permanence. Chez GHN Group, nous savons qu'une piscine bien entretenue procure un plaisir de baignade optimal et préserve la durée de vie de vos équipements. Notre service d'entretien régulier vous libère de toutes les contraintes techniques.`,
    nettoyage: `Le nettoyage du bassin, parois et fond, élimine efficacement les impuretés et dépôts. Notre équipe utilise des techniques et équipements professionnels pour maintenir votre piscine dans un état impeccable en toutes circonstances.`,
    equilibre: `L'équilibrage chimique de l'eau garantit une baignade saine et agréable. Nous contrôlons et ajustons régulièrement tous les paramètres (pH, chlore, alcalinité) pour maintenir une qualité d'eau optimale selon les normes en vigueur.`,
    maintenance: `La maintenance des équipements prévient les pannes et optimise les performances. Nos interventions programmées incluent la vérification, le nettoyage et l'entretien de tous les systèmes pour assurer leur bon fonctionnement.`,
    controles: `Les contrôles réguliers et conseils d'optimisation permettent d'anticiper les besoins et d'améliorer l'efficacité de votre installation. Nous vous proposons des solutions personnalisées pour réduire vos coûts d'exploitation.`
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-2 sm:mb-3 text-center justify-center">
        <FaBroom className="text-blue-400 text-3xl sm:text-4xl md:text-5xl" />
        Entretien Piscine
      </h2>
      <p className="mt-2 sm:mt-3 text-gray-700 text-sm sm:text-base md:text-lg text-center max-w-3xl mx-auto mb-15 sm:mb-4 px-2">
        Une eau cristalline toute l'année : entretien professionnel, nettoyage et équilibrage pour votre sérénité.
      </p>
      <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[90px] sm:min-h-[100px]"
             onClick={() => handleOpenModal("Entretien quotidien", explications.quotidien, <FaCheckCircle className="text-cyan-500" />)}>
          <FaCheckCircle className="text-2xl sm:text-3xl md:text-4xl text-cyan-500 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">Entretien quotidien</h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">Eau cristalline en permanence</p>
        </div>
        <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[90px] sm:min-h-[100px]"
             onClick={() => handleOpenModal("Nettoyage", explications.nettoyage, <FaBroom className="text-blue-400" />)}>
          <FaBroom className="text-2xl sm:text-3xl md:text-4xl text-blue-400 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">Nettoyage</h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">Bassin, parois, fond</p>
        </div>
        <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[90px] sm:min-h-[100px]"
             onClick={() => handleOpenModal("Équilibrage chimique", explications.equilibre, <FaFlask className="text-sky-500" />)}>
          <FaFlask className="text-2xl sm:text-3xl md:text-4xl text-sky-500 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">Équilibrage chimique</h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">pH, chlore, alcalinité</p>
        </div>
        <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[90px] sm:min-h-[100px]"
             onClick={() => handleOpenModal("Maintenance équipements", explications.maintenance, <FaCogs className="text-cyan-500" />)}>
          <FaCogs className="text-2xl sm:text-3xl md:text-4xl text-cyan-500 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">Maintenance équipements</h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">Prévention & performance</p>
        </div>
        <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[90px] sm:min-h-[100px]"
             onClick={() => handleOpenModal("Contrôles & optimisation", explications.controles, <FaClipboardCheck className="text-blue-400" />)}>
          <FaClipboardCheck className="text-2xl sm:text-3xl md:text-4xl text-blue-400 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">Contrôles & optimisation</h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">Conseils d'experts</p>
        </div>
      </div>
      <InfoModal open={modalOpen} onClose={handleCloseModal} title={modalTitle} icon={modalIcon}>
        {modalContent}
      </InfoModal>
    </div>
  );
}

// ----- Section Terrasses -----
function ModernTerrassesSection() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState("");
  const [modalContent, setModalContent] = React.useState("");
  const [modalIcon, setModalIcon] = React.useState(null);
  
  const handleOpenModal = (title, content, icon) => {
    setModalTitle(title);
    setModalContent(content);
    setModalIcon(icon);
    setModalOpen(true);
  };
  const handleCloseModal = () => setModalOpen(false);

  const explications = {
    conception: `La conception et réalisation de terrasses transforment l'espace autour de votre piscine en véritable lieu de vie. Chez GHN Group, nous créons des terrasses sur mesure qui s'harmonisent parfaitement avec votre bassin et votre environnement, alliant esthétique et fonctionnalité.`,
    materiaux: `Nous travaillons avec des matériaux premium : bois exotique, composite, pierre naturelle, carrelage antidérapant. Chaque matériau est sélectionné pour sa durabilité, sa résistance aux intempéries et son aspect esthétique, garantissant un résultat durable et élégant.`,
    amenagement: `L'aménagement paysager intègre harmonieusement votre terrasse dans son environnement. Nous concevons des espaces verts, des éclairages d'ambiance et des solutions d'ombrage pour créer une atmosphère unique et relaxante autour de votre piscine.`,
    entretien: `L'entretien et rénovation des terrasses existantes redonnent éclat et longévité à vos espaces extérieurs. Nos équipes interviennent pour le nettoyage, la réparation, le traitement et la protection de tous types de revêtements de terrasse.`
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-2 sm:mb-3 text-center justify-center">
        <FaClone className="text-amber-500 text-3xl sm:text-4xl md:text-5xl" />
        Terrasses & Aménagements
      </h2>
      <p className="mt-2 sm:mt-3 text-gray-700 text-sm sm:text-base md:text-lg text-center max-w-3xl mx-auto mb-15 sm:mb-4 px-2">
        Sublimez votre espace piscine : terrasses sur mesure, matériaux premium et aménagements paysagers.
      </p>
      <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 md:grid-cols-2">
        <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[90px] sm:min-h-[100px]"
             onClick={() => handleOpenModal("Conception & réalisation", explications.conception, <FaRuler className="text-amber-500" />)}>
          <FaRuler className="text-2xl sm:text-3xl md:text-4xl text-amber-500 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">Conception & réalisation</h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">Terrasses sur mesure</p>
        </div>
        <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[90px] sm:min-h-[100px]"
             onClick={() => handleOpenModal("Matériaux premium", explications.materiaux, <FaGem className="text-yellow-500" />)}>
          <FaGem className="text-2xl sm:text-3xl md:text-4xl text-yellow-500 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">Matériaux premium</h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">Bois, composite, pierre, carrelage</p>
        </div>
        <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[90px] sm:min-h-[100px]"
             onClick={() => handleOpenModal("Aménagement paysager", explications.amenagement, <FaLeaf className="text-green-500" />)}>
          <FaLeaf className="text-2xl sm:text-3xl md:text-4xl text-green-500 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">Aménagement paysager</h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">Espaces verts & éclairage</p>
        </div>
        <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[90px] sm:min-h-[100px]"
             onClick={() => handleOpenModal("Entretien & rénovation", explications.entretien, <FaBroom className="text-amber-500" />)}>
          <FaBroom className="text-2xl sm:text-3xl md:text-4xl text-amber-500 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">Entretien & rénovation</h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">Nettoyage, réparation, protection</p>
        </div>
      </div>
      <InfoModal open={modalOpen} onClose={handleCloseModal} title={modalTitle} icon={modalIcon}>
        {modalContent}
      </InfoModal>
    </div>
  );
}
