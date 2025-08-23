"use client"; // Rend le fichier côté client pour autoriser les hooks

// ----- Imports React & icônes -----
import React, { useEffect, useRef, useState } from "react"; // Hooks React
import {
  FaDraftingCompass, FaCogs, FaGem, FaTools, FaRedo, FaWrench, FaSnowflake,
  FaLeaf, FaShieldAlt, FaWater, FaCheckCircle, FaHammer, FaPhoneAlt, FaEnvelope, FaUser,
  FaFlask, FaUmbrella, FaPlay, FaBroom, FaClipboardCheck, FaClone, FaRuler
} from "react-icons/fa"; // Icônes
import WaveBackground from "../components/WaveBackground"; // Vague décorative
import dynamic from "next/dynamic";
const MobileNavBar = dynamic(() => import("../components/MobileNavBar"), { ssr: false });
const WhatsAppBubble = dynamic(() => import("../components/WhatsAppBubble"), { ssr: false });
const InteractiveContact = dynamic(() => import("../components/InteractiveContact"), { ssr: false });
import InfoModal from "@/components/InfoModal";

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
          className="min-h-screen flex items-center px-4 mt-10 bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50 relative"
        >
          {/* Vague décor en haut de section (harmonisée) */}
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
            <WaveBackground color="#b6ecfe" height={60} opacity={0.8} />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-7xl grid gap-6 md:grid-cols-2" data-reveal>
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
            <div className="flex items-center justify-center aspect-[4/3]">
              <img 
                src="/img/logo adam fini (2).png" 
                alt="Logo GHN Group - Piscines & Extérieurs" 
                className="max-w-full max-h-full object-contain p-6 rounded-xl"
              />
            </div>
          </div>
        </section>

        {/* ====== CONSTRUCTION ====== */}
        <section
          id="construction"
          className="min-h-screen flex items-center px-4  bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50 relative"
        >
          {/* Vague décor en haut de section (harmonisée) */}
          <div className="absolute top-0 inset-x-0 z-0 pointer-events-none">
            <WaveBackground color="#b6ecfe" height={60} opacity={0.8} />
          </div>

          <div className="relative z-10 w-full" data-reveal>                 {/* Bloc révélé */}
            <ModernConstructionSection />                                     {/* Section détaillée */}
          </div>
        </section>

        {/* ====== RÉNOVATION ====== */}
        <section
          id="renovation"
          className="min-h-screen flex items-center px-4  bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50 relative"
        >
          {/* Vague décor en haut de section (harmonisée) */}
          <div className="absolute top-0 inset-x-0 z-0 pointer-events-none">
            <WaveBackground color="#b6ecfe" height={60} opacity={0.8} />
          </div>

          <div className="relative z-10 w-full" data-reveal>
            <ModernRenovationSection />
          </div>
        </section>

        {/* ====== DÉPANNAGE ====== */}
        <section
          id="depannage"
          className="min-h-screen flex items-center px-4 py-20 bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50 relative"
        >
          {/* Vague décor en haut de section (harmonisée) */}
          <div className="absolute top-0 inset-x-0 z-0 pointer-events-none">
            <WaveBackground color="#b6ecfe" height={60} opacity={0.8} />
          </div>

          <div className="relative z-10 w-full" data-reveal>
            <ModernDepannageSection />
          </div>
        </section>

        {/* ====== HIVERNAGE ====== */}
        <section
          id="hivernage"
          className="min-h-screen flex items-center px-4 py-20 bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50 relative"
        >
          {/* Vague décor en haut de section (harmonisée) */}
          <div className="absolute top-0 inset-x-0 z-0 pointer-events-none">
            <WaveBackground color="#b6ecfe" height={60} opacity={0.8} />
          </div>

          <div className="relative z-10 w-full" data-reveal>
            <ModernHivernageSection />
          </div>
        </section>

        {/* ====== ENTRETIEN ====== */}
        <section
          id="entretien"
          className="min-h-screen flex items-center px-4 py-20 bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50 relative"
        >
          {/* Vague décor en haut de section (harmonisée) */}
          <div className="absolute top-0 inset-x-0 z-0 pointer-events-none">
            <WaveBackground color="#b6ecfe" height={60} opacity={0.8} />
          </div>

          <div className="relative z-10 w-full" data-reveal>
            <ModernEntretienSection />
          </div>
        </section>

        {/* ====== TERRASSES ====== */}
        <section
          id="terrasses"
          className="min-h-screen flex items-center px-4 py-20 bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50 relative"
        >
          {/* Vague décor en haut de section (harmonisée) */}
          <div className="absolute top-0 inset-x-0 z-0 pointer-events-none">
            <WaveBackground color="#b6ecfe" height={60} opacity={0.8} />
          </div>

          <div className="relative z-10 w-full" data-reveal>
            <ModernTerrassesSection />
          </div>
        </section>

        {/* ====== CONTACT ====== */}
        <section
          id="contact"
          className="min-h-screen flex items-center px-4 py-0 bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50 relative"
        >
          {/* Vague décor en haut de section (harmonisée) */}
          <div className="absolute top-0 inset-x-0 z-0 pointer-events-none">
            <WaveBackground color="#b6ecfe" height={60} opacity={0.8} />
          </div>

          <div className="relative z-10 mx-auto w-full" data-reveal>
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
    <div ref={ref} className="mx-auto w-full max-w-6xl">
      <h2 className="text-2xl md:text-4xl font-semibold flex items-center gap-3 mb-4 text-center justify-center">
        <FaDraftingCompass className="text-sky-500 text-3xl" />
        Construction de Piscine : Étapes & Conseils
      </h2>
      <p className="mt-4 text-gray-700 text-lg text-center max-w-3xl mx-auto mb-8">
        Créer un équilibre parfait entre votre jardin et votre piscine. Chaque projet est unique et conçu sur mesure : formes variées, débordement, couloir de nage, piscine miroir.
      </p>
      <div className="grid gap-5 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 - Étude de faisabilité */}
        <div
          className="p-5 md:p-6 min-h-[260px] md:min-h-[300px] rounded-2xl bg-white/95 backdrop-blur shadow-2xl flex flex-col justify-between hover:scale-105 transition-all duration-300 border border-sky-100 cursor-pointer"
          onClick={() => handleOpenModal("Étude de faisabilité", explications.faisabilite, <FaDraftingCompass className="text-sky-500" />)}
        >
          <div className="text-center">
            <FaDraftingCompass className="text-4xl text-sky-500 mx-auto mb-3" />
            <h3 className="text-lg md:text-xl font-bold mb-3 text-gray-800">Étude de faisabilité</h3>
          </div>
          <div className="flex-1 flex items-center">
            <ul className="text-gray-700 text-[15px] md:text-base space-y-1.5 leading-relaxed w-full">
              <li className="flex items-center gap-2"><FaCheckCircle className="text-sky-400 text-sm flex-shrink-0" /><span>Analyse du terrain</span></li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-sky-400 text-sm flex-shrink-0" /><span>Implantation optimale</span></li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-sky-400 text-sm flex-shrink-0" /><span>Gestion des contraintes</span></li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-sky-400 text-sm flex-shrink-0" /><span>Démarches administratives</span></li>
            </ul>
          </div>
        </div>
        {/* Card 2 - Étapes de construction */}
        <div
          className="p-5 md:p-6 min-h-[260px] md:min-h-[300px] rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-400 text-white shadow-2xl flex flex-col justify-between hover:scale-105 transition-all duration-300 cursor-pointer"
          onClick={() => handleOpenModal("Étapes de construction", explications.construction, <FaCogs className="text-cyan-500" />)}
        >
          <div className="text-center">
            <FaCogs className="text-4xl mx-auto mb-3" />
            <h3 className="text-lg md:text-xl font-bold mb-3">Étapes de construction</h3>
          </div>
          <div className="flex-1 flex items-center">
            <ul className="text-white/95 text-[15px] md:text-base space-y-1.5 leading-relaxed w-full">
              <li className="flex items-center gap-2"><FaCheckCircle className="text-white text-sm drop-shadow flex-shrink-0" /><span>Terrassement</span></li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-white text-sm drop-shadow flex-shrink-0" /><span>Structure béton</span></li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-white text-sm drop-shadow flex-shrink-0" /><span>Filtration & équipements</span></li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-white text-sm drop-shadow flex-shrink-0" /><span>Finitions & paysager</span></li>
            </ul>
          </div>
        </div>
        {/* Card 3 - Projet personnalisé */}
        <div
          className="p-5 md:p-6 min-h-[260px] md:min-h-[300px] rounded-2xl bg-white/95 backdrop-blur shadow-2xl flex flex-col justify-between hover:scale-105 transition-all duration-300 border border-cyan-100 cursor-pointer"
          onClick={() => handleOpenModal("Projet personnalisé", explications.personnalise, <FaGem className="text-cyan-500" />)}
        >
          <div className="text-center">
            <FaGem className="text-4xl text-cyan-500 mx-auto mb-3" />
            <h3 className="text-lg md:text-xl font-bold mb-3 text-gray-800">Projet personnalisé</h3>
          </div>
          <div className="flex-1 flex items-center">
            <ul className="text-gray-700 text-[15px] md:text-base space-y-1.5 leading-relaxed w-full">
              <li className="flex items-center gap-2"><FaCheckCircle className="text-cyan-400 text-sm flex-shrink-0" /><span>Design esthétique</span></li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-cyan-400 text-sm flex-shrink-0" /><span>Facilité d'usage</span></li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-cyan-400 text-sm flex-shrink-0" /><span>Matériaux premium</span></li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-cyan-400 text-sm flex-shrink-0" /><span>Éclairage LED</span></li>
            </ul>
          </div>
        </div>
      </div>
      {/* CTA Button */}
      <div className="text-center mt-8">
        <button className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-8 py-3 rounded-full font-semibold hover:from-sky-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          Demander un devis gratuit
        </button>
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
    <div className="mx-auto w-full max-w-6xl">
      <h2 className="text-2xl md:text-4xl font-semibold flex items-center gap-3 mb-4 text-center justify-center">
        <FaRedo className="text-cyan-500 text-3xl" />
        Rénovation de Piscine
      </h2>
      <p className="mt-4 text-gray-700 text-lg text-center max-w-3xl mx-auto mb-8">
        Rafraîchissement partiel ou transformation complète : nous redonnons vie à votre bassin avec des solutions durables et esthétiques.
      </p>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur shadow-xl flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal("Remplacement de revêtements", explications.revetements, <FaTools className="text-sky-500" />)}>
          <FaTools className="text-3xl text-sky-500 mb-2" />
            <h3 className="font-bold text-lg md:text-xl mb-1">Remplacement de revêtements</h3>
            <p className="text-gray-600 text-center text-[15px] md:text-base">Liner, carrelage, PVC armé</p>
        </div>
          <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur shadow-xl flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal("Réparation de fuites & étanchéité", explications.fuites, <FaWater className="text-cyan-500" />)}>
          <FaWater className="text-3xl text-cyan-500 mb-2" />
            <h3 className="font-bold text-lg md:text-xl mb-1">Réparation de fuites & étanchéité</h3>
            <p className="text-gray-600 text-center text-[15px] md:text-base">Diagnostic et solutions durables</p>
        </div>
          <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur shadow-xl flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal("Modernisation", explications.modernisation, <FaCogs className="text-blue-400" />)}>
          <FaCogs className="text-3xl text-blue-400 mb-2" />
            <h3 className="font-bold text-lg md:text-xl mb-1">Modernisation</h3>
            <p className="text-gray-600 text-center text-[15px] md:text-base">Filtration, LED, chauffage, domotique</p>
        </div>
          <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur shadow-xl flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal("Refonte du bassin", explications.refonte, <FaHammer className="text-sky-500" />)}>
          <FaHammer className="text-3xl text-sky-500 mb-2" />
            <h3 className="font-bold text-lg md:text-xl mb-1">Refonte du bassin</h3>
            <p className="text-gray-600 text-center text-[15px] md:text-base">Forme, profondeur, accès</p>
        </div>
          <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur shadow-xl flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal("Mise en conformité sécurité", explications.conformite, <FaShieldAlt className="text-cyan-500" />)}>
          <FaShieldAlt className="text-3xl text-cyan-500 mb-2" />
            <h3 className="font-bold text-lg md:text-xl mb-1">Mise en conformité sécurité</h3>
            <p className="text-gray-600 text-center text-[15px] md:text-base">Sécurité et normes actualisées</p>
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
    <div className="mx-auto w-full max-w-6xl">
      <h2 className="text-2xl md:text-4xl font-semibold flex items-center gap-3 mb-4 text-center justify-center">
        <FaWrench className="text-blue-400 text-3xl" />
        Dépannage Piscine
      </h2>
      <p className="mt-4 text-gray-700 text-lg text-center max-w-3xl mx-auto mb-8">
        Une panne ne prévient jamais. Intervention rapide, diagnostic précis, réparations efficaces pour retrouver votre tranquillité.
      </p>
      <div className="grid gap-5 md:gap-6 grid-cols-1 md:grid-cols-2">
        <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur shadow-xl flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal("Intervention rapide", explications.intervention, <FaCheckCircle className="text-sky-500" />)}>
          <FaCheckCircle className="text-3xl text-sky-500 mb-2" />
          <h3 className="font-bold text-lg md:text-xl mb-1">Intervention rapide</h3>
          <p className="text-gray-600 text-center text-[15px] md:text-base">Sur site, sans délai</p>
        </div>
        <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur shadow-xl flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal("Diagnostic & solutions sur mesure", explications.diagnostic, <FaCogs className="text-cyan-500" />)}>
          <FaCogs className="text-3xl text-cyan-500 mb-2" />
          <h3 className="font-bold text-lg md:text-xl mb-1">Diagnostic & solutions sur mesure</h3>
          <p className="text-gray-600 text-center text-[15px] md:text-base">Analyse précise, réparation adaptée</p>
        </div>
        <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur shadow-xl flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal("Réparations", explications.reparations, <FaTools className="text-blue-400" />)}>
          <FaTools className="text-3xl text-blue-400 mb-2" />
          <h3 className="font-bold text-lg md:text-xl mb-1">Réparations</h3>
          <p className="text-gray-600 text-center text-[15px] md:text-base">Filtration, fuites, pompes, éclairage, etc.</p>
        </div>
        <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur shadow-xl flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal("Suivi & conseils", explications.suivi, <FaLeaf className="text-cyan-500" />)}>
          <FaLeaf className="text-3xl text-cyan-500 mb-2" />
          <h3 className="font-bold text-lg md:text-xl mb-1">Suivi & conseils</h3>
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
    <div className="mx-auto w-full max-w-6xl">
      <h2 className="text-2xl md:text-4xl font-semibold flex items-center gap-3 mb-4 text-center justify-center">
        <FaSnowflake className="text-cyan-500 text-3xl" />
        Hivernage Piscine
      </h2>
      <p className="mt-4 text-gray-700 text-lg text-center max-w-3xl mx-auto mb-8">
        Protégez votre investissement : préparation minutieuse pour l'hiver et remise en service au printemps.
      </p>
      <div className="grid gap-5 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur shadow-xl flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal("Protection du bassin", explications.protection, <FaShieldAlt className="text-cyan-500" />)}>
          <FaShieldAlt className="text-3xl text-cyan-500 mb-2" />
          <h3 className="font-bold text-lg md:text-xl mb-1">Protection du bassin</h3>
          <p className="text-gray-600 text-center text-[15px] md:text-base">Hivernage adapté & professionnel</p>
        </div>
        <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur shadow-xl flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal("Traitement chimique hivernal", explications.traitement, <FaFlask className="text-blue-400" />)}>
          <FaFlask className="text-3xl text-blue-400 mb-2" />
          <h3 className="font-bold text-lg md:text-xl mb-1">Traitement chimique hivernal</h3>
          <p className="text-gray-600 text-center text-[15px] md:text-base">Équilibre & stabilisation de l'eau</p>
        </div>
        <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur shadow-xl flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal("Protection équipements", explications.equipements, <FaCogs className="text-sky-500" />)}>
          <FaCogs className="text-3xl text-sky-500 mb-2" />
          <h3 className="font-bold text-lg md:text-xl mb-1">Protection équipements</h3>
          <p className="text-gray-600 text-center text-[15px] md:text-base">Pompes, filtres, canalisations</p>
        </div>
        <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur shadow-xl flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal("Installation couvertures", explications.couverture, <FaUmbrella className="text-cyan-500" />)}>
          <FaUmbrella className="text-3xl text-cyan-500 mb-2" />
          <h3 className="font-bold text-lg md:text-xl mb-1">Installation couvertures</h3>
          <p className="text-gray-600 text-center text-[15px] md:text-base">Accessoires d'hivernage</p>
        </div>
  <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur shadow-xl flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal("Remise en service", explications.remise, <FaPlay className="text-blue-400" />)}>
          <FaPlay className="text-3xl text-blue-400 mb-2" />
          <h3 className="font-bold text-lg md:text-xl mb-1">Remise en service</h3>
          <p className="text-gray-600 text-center text-[15px] md:text-base">Retour printemps</p>
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
    <div className="mx-auto w-full max-w-6xl">
      <h2 className="text-2xl md:text-4xl font-semibold flex items-center gap-3 mb-4 text-center justify-center">
        <FaBroom className="text-blue-400 text-3xl" />
        Entretien Piscine
      </h2>
      <p className="mt-4 text-gray-700 text-lg text-center max-w-3xl mx-auto mb-8">
        Une eau cristalline toute l'année : entretien professionnel, nettoyage et équilibrage pour votre sérénité.
      </p>
      <div className="grid gap-5 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur shadow-xl flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal("Entretien quotidien", explications.quotidien, <FaCheckCircle className="text-cyan-500" />)}>
          <FaCheckCircle className="text-3xl text-cyan-500 mb-2" />
          <h3 className="font-bold text-lg md:text-xl mb-1">Entretien quotidien</h3>
          <p className="text-gray-600 text-center text-[15px] md:text-base">Eau cristalline en permanence</p>
        </div>
        <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur shadow-xl flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal("Nettoyage", explications.nettoyage, <FaBroom className="text-blue-400" />)}>
          <FaBroom className="text-3xl text-blue-400 mb-2" />
          <h3 className="font-bold text-lg md:text-xl mb-1">Nettoyage</h3>
          <p className="text-gray-600 text-center text-[15px] md:text-base">Bassin, parois, fond</p>
        </div>
        <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur shadow-xl flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal("Équilibrage chimique", explications.equilibre, <FaFlask className="text-sky-500" />)}>
          <FaFlask className="text-3xl text-sky-500 mb-2" />
          <h3 className="font-bold text-lg md:text-xl mb-1">Équilibrage chimique</h3>
          <p className="text-gray-600 text-center text-[15px] md:text-base">pH, chlore, alcalinité</p>
        </div>
        <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur shadow-xl flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal("Maintenance équipements", explications.maintenance, <FaCogs className="text-cyan-500" />)}>
          <FaCogs className="text-3xl text-cyan-500 mb-2" />
          <h3 className="font-bold text-lg md:text-xl mb-1">Maintenance équipements</h3>
          <p className="text-gray-600 text-center text-[15px] md:text-base">Prévention & performance</p>
        </div>
        <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur shadow-xl flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal("Contrôles & optimisation", explications.controles, <FaClipboardCheck className="text-blue-400" />)}>
          <FaClipboardCheck className="text-3xl text-blue-400 mb-2" />
          <h3 className="font-bold text-lg md:text-xl mb-1">Contrôles & optimisation</h3>
          <p className="text-gray-600 text-center text-[15px] md:text-base">Conseils d'experts</p>
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
    <div className="mx-auto w-full max-w-6xl">
      <h2 className="text-2xl md:text-4xl font-semibold flex items-center gap-3 mb-4 text-center justify-center">
        <FaClone className="text-amber-500 text-3xl" />
        Terrasses & Aménagements
      </h2>
      <p className="mt-4 text-gray-700 text-lg text-center max-w-3xl mx-auto mb-8">
        Sublimez votre espace piscine : terrasses sur mesure, matériaux premium et aménagements paysagers.
      </p>
      <div className="grid gap-5 md:gap-6 grid-cols-1 md:grid-cols-2">
        <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur shadow-xl flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal("Conception & réalisation", explications.conception, <FaRuler className="text-amber-500" />)}>
          <FaRuler className="text-3xl text-amber-500 mb-2" />
          <h3 className="font-bold text-lg md:text-xl mb-1">Conception & réalisation</h3>
          <p className="text-gray-600 text-center text-[15px] md:text-base">Terrasses sur mesure</p>
        </div>
        <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur shadow-xl flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal("Matériaux premium", explications.materiaux, <FaGem className="text-yellow-500" />)}>
          <FaGem className="text-3xl text-yellow-500 mb-2" />
          <h3 className="font-bold text-lg md:text-xl mb-1">Matériaux premium</h3>
          <p className="text-gray-600 text-center text-[15px] md:text-base">Bois, composite, pierre, carrelage</p>
        </div>
        <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur shadow-xl flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal("Aménagement paysager", explications.amenagement, <FaLeaf className="text-green-500" />)}>
          <FaLeaf className="text-3xl text-green-500 mb-2" />
          <h3 className="font-bold text-lg md:text-xl mb-1">Aménagement paysager</h3>
          <p className="text-gray-600 text-center text-[15px] md:text-base">Espaces verts & éclairage</p>
        </div>
        <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur shadow-xl flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal("Entretien & rénovation", explications.entretien, <FaBroom className="text-amber-500" />)}>
          <FaBroom className="text-3xl text-amber-500 mb-2" />
          <h3 className="font-bold text-lg md:text-xl mb-1">Entretien & rénovation</h3>
          <p className="text-gray-600 text-center text-[15px] md:text-base">Nettoyage, réparation, protection</p>
        </div>
      </div>
      <InfoModal open={modalOpen} onClose={handleCloseModal} title={modalTitle} icon={modalIcon}>
        {modalContent}
      </InfoModal>
    </div>
  );
}
