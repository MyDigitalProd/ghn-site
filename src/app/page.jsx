"use client"; // Rend le fichier côté client pour autoriser les hooks

// ----- Imports React & icônes -----
import React, { useEffect, useRef, useState, useMemo } from "react"; // Hooks React
import Image from "next/image";
import {
  FaDraftingCompass, FaCogs, FaGem, FaTools, FaRedo, FaWrench, FaSnowflake,
  FaLeaf, FaShieldAlt, FaWater, FaCheckCircle, FaHammer, FaPhoneAlt, FaEnvelope, FaUser,
  FaFlask, FaUmbrella, FaPlay, FaBroom, FaClipboardCheck, FaClone, FaRuler,
  FaSearchLocation, FaHardHat, FaPaintBrush, FaPalette
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
import { useSection } from "@/components/SectionProvider";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/i18n/I18nProvider";

// ----- Page one-page GHN -----
export default function Page() {
  const { active, setActive } = useSection();
  const { t } = useI18n();
  const SECTION_IDS = useMemo(() => ([
    "accueil","construction","renovation","depannage","hivernage","entretien","terrasses","nos-realisations","contact"
  ]), []);

  // À l'arrivée, si un hash existe, l'utiliser
  useEffect(() => {
    const id = typeof window !== 'undefined' ? window.location.hash.replace('#','') : '';
    if (id && SECTION_IDS.includes(id)) setActive(id);
  }, [SECTION_IDS, setActive]);

  // Variants d'émergence (sortie de l'eau)
  const emerge = {
    initial: { opacity: 0, filter: "blur(8px)", y: 24, scale: 0.99 },
    animate: { opacity: 1, filter: "blur(0px)", y: 0, scale: 1, transition: { duration: 0.45, ease: [0.44,0.95,0.6,1.15] } },
    exit:    { opacity: 0, filter: "blur(6px)", y: -16, scale: 0.995, transition: { duration: 0.32, ease: [0.44,0.95,0.6,1.15] } },
  };

  // Rendu principal
  return (
    <>
  {/* Fond global désormais géré dans layout.jsx */}

      {/* MobileNavBar visible uniquement sur mobile */}
      <div className="lg:hidden">
        <MobileNavBar />
      </div>

      <main className="w-full relative"> {/* Conteneur principal (scroll page désactivé via layout) */}

        {/* Bulle WhatsApp flottante */}
        <WhatsAppBubble hideOnContact={true} />

        {/* Stage plein écran: une section visible à la fois, transitions d'émergence */}
        <div className="relative w-full min-h-screen overflow-hidden">
          <AnimatePresence mode="wait">
            {active === "accueil" && (
              <motion.section key="accueil" variants={emerge} initial="initial" animate="animate" exit="exit" className="absolute inset-0 flex flex-col w-full overflow-auto">
                <div className="relative z-10 mx-auto w-full max-w-7xl grid gap-6 md:grid-cols-2 flex-1 pt-[90px] px-4 items-center justify-center" data-reveal>
                  <div className="flex flex-col justify-center">
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                      {t("hero.title")}
                    </h1>
                    <p className="mt-4 text-base md:text-lg text-gray-700">
                      {t("hero.lead")}
                    </p>
                    <ul className="mt-6 space-y-2 text-gray-700">
                      <li>{t("hero.bullets.0")}</li>
                      <li>{t("hero.bullets.1")}</li>
                      <li>{t("hero.bullets.2")}</li>
                    </ul>
                  </div>
                  <div className="flex items-center justify-center w-full max-w-full">
                    <Image
                      src="/img/logo adam fini (2).png"
                      alt="Logo GHN Group - Piscines & Extérieurs"
                      width={800}
                      height={400}
                      priority
                      className="w-full h-auto max-w-full max-h-full object-contain p-4"
                    />
                  </div>
                </div>
              </motion.section>
            )}
            {active === "construction" && (
              <motion.section key="construction" variants={emerge} initial="initial" animate="animate" exit="exit" className="absolute inset-0 flex flex-col w-full overflow-auto">
                <div className="relative z-10 w-full flex-1 pt-[90px] px-4 flex items-center justify-center" data-reveal>
                  <ModernConstructionSection />
                </div>
              </motion.section>
            )}
            {active === "renovation" && (
              <motion.section key="renovation" variants={emerge} initial="initial" animate="animate" exit="exit" className="absolute inset-0 flex flex-col w-full overflow-auto">
                <div className="relative z-10 w-full flex-1 pt-[90px] px-4 flex items-center justify-center" data-reveal>
                  <ModernRenovationSection />
                </div>
              </motion.section>
            )}
            {active === "depannage" && (
              <motion.section key="depannage" variants={emerge} initial="initial" animate="animate" exit="exit" className="absolute inset-0 flex flex-col w-full overflow-auto">
                <div className="relative z-10 w-full flex-1 pt-[90px] px-4 flex items-center justify-center" data-reveal>
                  <ModernDepannageSection />
                </div>
              </motion.section>
            )}
            {active === "hivernage" && (
              <motion.section key="hivernage" variants={emerge} initial="initial" animate="animate" exit="exit" className="absolute inset-0 flex flex-col w-full overflow-auto">
                <div className="relative z-10 w-full flex-1 pt-[90px] px-4 flex items-center justify-center" data-reveal>
                  <ModernHivernageSection />
                </div>
              </motion.section>
            )}
            {active === "entretien" && (
              <motion.section key="entretien" variants={emerge} initial="initial" animate="animate" exit="exit" className="absolute inset-0 flex flex-col w-full overflow-auto">
                <div className="relative z-10 w-full flex-1 pt-[90px] px-4 flex items-center justify-center" data-reveal>
                  <ModernEntretienSection />
                </div>
              </motion.section>
            )}
            {active === "terrasses" && (
              <motion.section key="terrasses" variants={emerge} initial="initial" animate="animate" exit="exit" className="absolute inset-0 flex flex-col w-full overflow-auto">
                <div className="relative z-10 w-full flex-1 pt-[90px] px-4 flex items-center justify-center" data-reveal>
                  <ModernTerrassesSection />
                </div>
              </motion.section>
            )}
            {active === "nos-realisations" && (
              <motion.section key="nos-realisations" variants={emerge} initial="initial" animate="animate" exit="exit" className="absolute inset-0 flex flex-col w-full overflow-auto">
                <div className="relative z-10 max-w-5xl mx-auto w-full flex-1 pt-[90px] px-4 flex items-center justify-center" data-reveal>
                  <div className="w-full">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-[#009ee0]">{t("section.realisations.title")}</h2>
                    <p className="text-center text-lg mb-8 text-gray-700">{t("section.realisations.desc")}</p>
                    <RealisationsCarousel />
                  </div>
                </div>
              </motion.section>
            )}
            {active === "contact" && (
              <motion.section key="contact" variants={emerge} initial="initial" animate="animate" exit="exit" className="absolute inset-0 flex flex-col w-full overflow-auto">
                <div className="relative z-10 mx-auto w-full flex-1 pt-[90px] px-4 flex items-center justify-center" data-reveal>
                  <InteractiveContact />
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}

// ----- Section Construction (client, simple carterie) -----
function ModernConstructionSection() {
  const { t } = useI18n();
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

  // Textes explicatifs (localisés via i18n)
  const explications = {
    faisabilite: t("construction.modal.faisabilite"),
    construction: t("construction.modal.construction"),
    personnalise: t("construction.modal.personnalise")
  };

  return (
    <div ref={ref} className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-3 sm:mb-4 text-center justify-center">
        <FaDraftingCompass className="text-2xl sm:text-3xl text-sky-500" />
        <span className="leading-tight">{t("construction.title")}</span>
      </h2>
      <p className="mt-3 sm:mt-4 text-gray-700 text-base sm:text-lg text-center max-w-3xl mx-auto mb-6 sm:mb-8 px-2">{t("construction.desc")}</p>
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6 max-w-7xl mx-auto">
        {/* Card 1 - Étude de faisabilité */}
        <div
          className="flex-1 p-4 sm:p-5 md:p-6 lg:p-8 rounded-2xl bg-white/95 shadow-2xl border border-sky-100 flex flex-col justify-between hover:scale-105 transition-all duration-300 cursor-pointer min-h-[200px] lg:min-h-[280px]"
          onClick={() => handleOpenModal(t("construction.card1.title"), explications.faisabilite, <FaClipboardCheck className="text-sky-500" />)}
        >
          <div className="text-center mb-4">
            <FaClipboardCheck className="text-3xl sm:text-4xl text-sky-500 mx-auto mb-3" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 text-gray-800">{t("construction.card1.title")}</h3>
          </div>
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3"><FaCheckCircle className="text-sky-400 text-sm flex-shrink-0" /><span className="text-gray-700">{t("construction.card1.bullets.0")}</span></div>
            <div className="flex items-center gap-3"><FaCheckCircle className="text-sky-400 text-sm flex-shrink-0" /><span className="text-gray-700">{t("construction.card1.bullets.1")}</span></div>
            <div className="flex items-center gap-3"><FaCheckCircle className="text-sky-400 text-sm flex-shrink-0" /><span className="text-gray-700">{t("construction.card1.bullets.2")}</span></div>
            <div className="flex items-center gap-3"><FaCheckCircle className="text-sky-400 text-sm flex-shrink-0" /><span className="text-gray-700">{t("construction.card1.bullets.3")}</span></div>
          </div>
        </div>
        {/* Card 2 - Étapes de construction */}
        <div
          className="flex-1 p-4 sm:p-5 md:p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-400 text-white shadow-2xl flex flex-col justify-between hover:scale-105 transition-all duration-300 cursor-pointer min-h-[200px] lg:min-h-[280px]"
          onClick={() => handleOpenModal(t("construction.card2.title"), explications.construction, <FaHammer className="text-cyan-500" />)}
        >
          <div className="text-center mb-4">
            <FaHammer className="text-3xl sm:text-4xl text-white mx-auto mb-3" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 text-white">{t("construction.card2.title")}</h3>
          </div>
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3"><FaCheckCircle className="text-white text-sm drop-shadow flex-shrink-0" /><span className="text-white/95">{t("construction.card2.bullets.0")}</span></div>
            <div className="flex items-center gap-3"><FaCheckCircle className="text-white text-sm drop-shadow flex-shrink-0" /><span className="text-white/95">{t("construction.card2.bullets.1")}</span></div>
            <div className="flex items-center gap-3"><FaCheckCircle className="text-white text-sm drop-shadow flex-shrink-0" /><span className="text-white/95">{t("construction.card2.bullets.2")}</span></div>
            <div className="flex items-center gap-3"><FaCheckCircle className="text-white text-sm drop-shadow flex-shrink-0" /><span className="text-white/95">{t("construction.card2.bullets.3")}</span></div>
          </div>
        </div>
        {/* Card 3 - Projet personnalisé */}
        <div
          className="flex-1 p-4 sm:p-5 md:p-6 lg:p-8 rounded-2xl bg-white/95 shadow-2xl border border-cyan-100 flex flex-col justify-between hover:scale-105 transition-all duration-300 cursor-pointer min-h-[200px] lg:min-h-[280px]"
          onClick={() => handleOpenModal(t("construction.card3.title"), explications.personnalise, <FaPalette className="text-cyan-500" />)}
        >
          <div className="text-center mb-4">
            <FaPalette className="text-3xl sm:text-4xl text-cyan-500 mx-auto mb-3" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 text-gray-800">{t("construction.card3.title")}</h3>
          </div>
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3"><FaCheckCircle className="text-cyan-400 text-sm flex-shrink-0" /><span className="text-gray-700">{t("construction.card3.bullets.0")}</span></div>
            <div className="flex items-center gap-3"><FaCheckCircle className="text-cyan-400 text-sm flex-shrink-0" /><span className="text-gray-700">{t("construction.card3.bullets.1")}</span></div>
            <div className="flex items-center gap-3"><FaCheckCircle className="text-cyan-400 text-sm flex-shrink-0" /><span className="text-gray-700">{t("construction.card3.bullets.2")}</span></div>
            <div className="flex items-center gap-3"><FaCheckCircle className="text-cyan-400 text-sm flex-shrink-0" /><span className="text-gray-700">{t("construction.card3.bullets.3")}</span></div>
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
  const { t } = useI18n();
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
    revetements: t("renovation.modal.revetements"),
    fuites: t("renovation.modal.fuites"),
    modernisation: t("renovation.modal.modernisation"),
    refonte: t("renovation.modal.refonte"),
    conformite: t("renovation.modal.conformite")
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-2 sm:mb-3 text-center justify-center">
        <FaRedo className="text-cyan-500 text-3xl sm:text-4xl md:text-5xl" />
        {t("renovation.title")}
      </h2>
      <p className="mt-2 sm:mt-3 text-gray-700 text-sm sm:text-base md:text-lg text-center max-w-3xl mx-auto mb-15 sm:mb-4 px-2">{t("renovation.desc")}</p>
      <div className="flex flex-wrap justify-center gap-6">
          <div className="basis-[300px] max-w-full h-[160px] p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal(t("renovation.cards.revetements.title"), explications.revetements, <FaTools className="text-sky-500" />)}>
          <FaTools className="text-2xl sm:text-3xl md:text-4xl text-sky-500 mb-1" />
            <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">{t("renovation.cards.revetements.title")}</h3>
            <p className="text-gray-600 text-center text-xs sm:text-sm">{t("renovation.cards.revetements.subtitle")}</p>
        </div>
          <div className="basis-[300px] max-w-full h-[160px] p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal(t("renovation.cards.fuites.title"), explications.fuites, <FaWater className="text-cyan-500" />)}>
          <FaWater className="text-2xl sm:text-3xl md:text-4xl text-cyan-500 mb-1" />
            <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">{t("renovation.cards.fuites.title")}</h3>
            <p className="text-gray-600 text-center text-xs sm:text-sm">{t("renovation.cards.fuites.subtitle")}</p>
        </div>
          <div className="basis-[300px] max-w-full h-[160px] p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal(t("renovation.cards.modernisation.title"), explications.modernisation, <FaCogs className="text-blue-400" />)}>
          <FaCogs className="text-2xl sm:text-3xl md:text-4xl text-blue-400 mb-1" />
            <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">{t("renovation.cards.modernisation.title")}</h3>
            <p className="text-gray-600 text-center text-xs sm:text-sm">{t("renovation.cards.modernisation.subtitle")}</p>
        </div>
          <div className="basis-[300px] max-w-full h-[160px] p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal(t("renovation.cards.refonte.title"), explications.refonte, <FaHammer className="text-sky-500" />)}>
          <FaHammer className="text-2xl sm:text-3xl md:text-4xl text-sky-500 mb-1" />
            <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">{t("renovation.cards.refonte.title")}</h3>
            <p className="text-gray-600 text-center text-xs sm:text-sm">{t("renovation.cards.refonte.subtitle")}</p>
        </div>
          <div className="basis-[300px] max-w-full h-[160px] p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
             onClick={() => handleOpenModal(t("renovation.cards.conformite.title"), explications.conformite, <FaShieldAlt className="text-cyan-500" />)}>
          <FaShieldAlt className="text-2xl sm:text-3xl md:text-4xl text-cyan-500 mb-1" />
            <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">{t("renovation.cards.conformite.title")}</h3>
            <p className="text-gray-600 text-center text-xs sm:text-sm">{t("renovation.cards.conformite.subtitle")}</p>
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
  const { t } = useI18n();
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
    intervention: t("depannage.modal.intervention"),
    diagnostic: t("depannage.modal.diagnostic"),
    reparations: t("depannage.modal.reparations"),
    suivi: t("depannage.modal.suivi")
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
    <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-2 sm:mb-3 text-center justify-center">
        <FaWrench className="text-blue-400 text-3xl sm:text-4xl md:text-5xl" />
      {t("depannage.title")}
      </h2>
    <p className="mt-2 sm:mt-3 text-gray-700 text-sm sm:text-base md:text-lg text-center max-w-3xl mx-auto mb-15 sm:mb-4 px-2">{t("depannage.desc")}</p>
      <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 md:grid-cols-2">
        <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[120px] sm:min-h-[140px]"
         onClick={() => handleOpenModal(t("depannage.cards.intervention.title"), explications.intervention, <FaCheckCircle className="text-sky-500" />)}>
          <FaCheckCircle className="text-2xl sm:text-3xl md:text-4xl text-sky-500 mb-1" />
       <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">{t("depannage.cards.intervention.title")}</h3>
       <p className="text-gray-600 text-center text-xs sm:text-sm">{t("depannage.cards.intervention.subtitle")}</p>
        </div>
        <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[120px] sm:min-h-[140px]"
         onClick={() => handleOpenModal(t("depannage.cards.diagnostic.title"), explications.diagnostic, <FaCogs className="text-cyan-500" />)}>
          <FaCogs className="text-2xl sm:text-3xl md:text-4xl text-cyan-500 mb-1" />
       <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">{t("depannage.cards.diagnostic.title")}</h3>
       <p className="text-gray-600 text-center text-xs sm:text-sm">{t("depannage.cards.diagnostic.subtitle")}</p>
        </div>
        <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[120px] sm:min-h-[140px]"
         onClick={() => handleOpenModal(t("depannage.cards.reparations.title"), explications.reparations, <FaTools className="text-blue-400" />)}>
          <FaTools className="text-2xl sm:text-3xl md:text-4xl text-blue-400 mb-1" />
       <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">{t("depannage.cards.reparations.title")}</h3>
       <p className="text-gray-600 text-center text-xs sm:text-sm">{t("depannage.cards.reparations.subtitle")}</p>
        </div>
        <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[120px] sm:min-h-[140px]"
         onClick={() => handleOpenModal(t("depannage.cards.suivi.title"), explications.suivi, <FaLeaf className="text-cyan-500" />)}>
          <FaLeaf className="text-2xl sm:text-3xl md:text-4xl text-cyan-500 mb-1" />
       <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">{t("depannage.cards.suivi.title")}</h3>
       <p className="text-gray-600 text-center text-xs sm:text-sm">{t("depannage.cards.suivi.subtitle")}</p>
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
  const { t } = useI18n();
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
    protection: t("hivernage.modal.protection"),
    traitement: t("hivernage.modal.traitement"),
    equipements: t("hivernage.modal.equipements"),
    couverture: t("hivernage.modal.couverture"),
    remise: t("hivernage.modal.remise")
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
  <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold flex flex-col sm:flex-row items-center gap-2 sm:gap-3 sm:mb-3 text-center justify-center mb-7">
        <FaSnowflake className="text-cyan-500 text-3xl sm:text-4xl md:text-5xl" />
      {t("hivernage.title")}
      </h2>
    <p className="mt-2 sm:mt-3 text-gray-700 text-sm sm:text-base md:text-lg text-center max-w-3xl mx-auto mb-15 sm:mb-4 px-2">{t("hivernage.desc")}</p>
      <div className="flex flex-wrap justify-center gap-6">
        <div className="basis-[300px] max-w-full h-[160px] p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
         onClick={() => handleOpenModal(t("hivernage.cards.protection.title"), explications.protection, <FaShieldAlt className="text-cyan-500" />)}>
          <FaShieldAlt className="text-2xl sm:text-3xl md:text-4xl text-cyan-500 mb-1" />
       <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">{t("hivernage.cards.protection.title")}</h3>
       <p className="text-gray-600 text-center text-xs sm:text-sm">{t("hivernage.cards.protection.subtitle")}</p>
        </div>
        <div className="basis-[300px] max-w-full h-[160px] p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
         onClick={() => handleOpenModal(t("hivernage.cards.traitement.title"), explications.traitement, <FaFlask className="text-blue-400" />)}>
          <FaFlask className="text-2xl sm:text-3xl md:text-4xl text-blue-400 mb-1" />
       <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">{t("hivernage.cards.traitement.title")}</h3>
       <p className="text-gray-600 text-center text-xs sm:text-sm">{t("hivernage.cards.traitement.subtitle")}</p>
        </div>
        <div className="basis-[300px] max-w-full h-[160px] p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
         onClick={() => handleOpenModal(t("hivernage.cards.equipements.title"), explications.equipements, <FaCogs className="text-sky-500" />)}>
          <FaCogs className="text-2xl sm:text-3xl md:text-4xl text-sky-500 mb-1" />
       <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">{t("hivernage.cards.equipements.title")}</h3>
       <p className="text-gray-600 text-center text-xs sm:text-sm">{t("hivernage.cards.equipements.subtitle")}</p>
        </div>
        <div className="basis-[300px] max-w-full h-[160px] p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
         onClick={() => handleOpenModal(t("hivernage.cards.couverture.title"), explications.couverture, <FaUmbrella className="text-cyan-500" />)}>
          <FaUmbrella className="text-2xl sm:text-3xl md:text-4xl text-cyan-500 mb-1" />
       <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">{t("hivernage.cards.couverture.title")}</h3>
       <p className="text-gray-600 text-center text-xs sm:text-sm">{t("hivernage.cards.couverture.subtitle")}</p>
        </div>
        <div className="basis-[300px] max-w-full h-[160px] p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
         onClick={() => handleOpenModal(t("hivernage.cards.remise.title"), explications.remise, <FaPlay className="text-blue-400" />)}>
          <FaPlay className="text-2xl sm:text-3xl md:text-4xl text-blue-400 mb-1" />
       <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">{t("hivernage.cards.remise.title")}</h3>
       <p className="text-gray-600 text-center text-xs sm:text-sm">{t("hivernage.cards.remise.subtitle")}</p>
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
  const { t } = useI18n();
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
    quotidien: t("entretien.modal.quotidien"),
    nettoyage: t("entretien.modal.nettoyage"),
    equilibre: t("entretien.modal.equilibre"),
    maintenance: t("entretien.modal.maintenance"),
    controles: t("entretien.modal.controles")
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
    <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-2 sm:mb-3 text-center justify-center">
        <FaBroom className="text-blue-400 text-3xl sm:text-4xl md:text-5xl" />
      {t("entretien.title")}
      </h2>
    <p className="mt-2 sm:mt-3 text-gray-700 text-sm sm:text-base md:text-lg text-center max-w-3xl mx-auto mb-15 sm:mb-4 px-2">{t("entretien.desc")}</p>
      <div className="flex flex-wrap justify-center gap-6">
        <div className="basis-[300px] max-w-full h-[160px] p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
         onClick={() => handleOpenModal(t("entretien.cards.quotidien.title"), explications.quotidien, <FaCheckCircle className="text-cyan-500" />)}>
          <FaCheckCircle className="text-2xl sm:text-3xl md:text-4xl text-cyan-500 mb-1" />
       <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">{t("entretien.cards.quotidien.title")}</h3>
       <p className="text-gray-600 text-center text-xs sm:text-sm">{t("entretien.cards.quotidien.subtitle")}</p>
        </div>
        <div className="basis-[300px] max-w-full h-[160px] p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
         onClick={() => handleOpenModal(t("entretien.cards.nettoyage.title"), explications.nettoyage, <FaBroom className="text-blue-400" />)}>
          <FaBroom className="text-2xl sm:text-3xl md:text-4xl text-blue-400 mb-1" />
       <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">{t("entretien.cards.nettoyage.title")}</h3>
       <p className="text-gray-600 text-center text-xs sm:text-sm">{t("entretien.cards.nettoyage.subtitle")}</p>
        </div>
        <div className="basis-[300px] max-w-full h-[160px] p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
         onClick={() => handleOpenModal(t("entretien.cards.equilibre.title"), explications.equilibre, <FaFlask className="text-sky-500" />)}>
          <FaFlask className="text-2xl sm:text-3xl md:text-4xl text-sky-500 mb-1" />
       <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">{t("entretien.cards.equilibre.title")}</h3>
       <p className="text-gray-600 text-center text-xs sm:text-sm">{t("entretien.cards.equilibre.subtitle")}</p>
        </div>
        <div className="basis-[300px] max-w-full h-[160px] p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
         onClick={() => handleOpenModal(t("entretien.cards.maintenance.title"), explications.maintenance, <FaCogs className="text-cyan-500" />)}>
          <FaCogs className="text-2xl sm:text-3xl md:text-4xl text-cyan-500 mb-1" />
       <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">{t("entretien.cards.maintenance.title")}</h3>
       <p className="text-gray-600 text-center text-xs sm:text-sm">{t("entretien.cards.maintenance.subtitle")}</p>
        </div>
        <div className="basis-[300px] max-w-full h-[160px] p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
         onClick={() => handleOpenModal(t("entretien.cards.controles.title"), explications.controles, <FaClipboardCheck className="text-blue-400" />)}>
          <FaClipboardCheck className="text-2xl sm:text-3xl md:text-4xl text-blue-400 mb-1" />
       <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">{t("entretien.cards.controles.title")}</h3>
       <p className="text-gray-600 text-center text-xs sm:text-sm">{t("entretien.cards.controles.subtitle")}</p>
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
  const { t } = useI18n();
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
    conception: t("terrasses.modal.conception"),
    materiaux: t("terrasses.modal.materiaux"),
    amenagement: t("terrasses.modal.amenagement"),
    entretien: t("terrasses.modal.entretien")
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
    <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-2 sm:mb-3 text-center justify-center">
        <FaClone className="text-amber-500 text-3xl sm:text-4xl md:text-5xl" />
      {t("terrasses.title")}
      </h2>
    <p className="mt-2 sm:mt-3 text-gray-700 text-sm sm:text-base md:text-lg text-center max-w-3xl mx-auto mb-15 sm:mb-4 px-2">{t("terrasses.desc")}</p>
      <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 md:grid-cols-2">
        <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[120px] sm:min-h-[140px]"
         onClick={() => handleOpenModal(t("terrasses.cards.conception.title"), explications.conception, <FaRuler className="text-amber-500" />)}>
          <FaRuler className="text-2xl sm:text-3xl md:text-4xl text-amber-500 mb-1" />
       <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">{t("terrasses.cards.conception.title")}</h3>
       <p className="text-gray-600 text-center text-xs sm:text-sm">{t("terrasses.cards.conception.subtitle")}</p>
        </div>
        <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[120px] sm:min-h-[140px]"
         onClick={() => handleOpenModal(t("terrasses.cards.materiaux.title"), explications.materiaux, <FaGem className="text-yellow-500" />)}>
          <FaGem className="text-2xl sm:text-3xl md:text-4xl text-yellow-500 mb-1" />
       <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">{t("terrasses.cards.materiaux.title")}</h3>
       <p className="text-gray-600 text-center text-xs sm:text-sm">{t("terrasses.cards.materiaux.subtitle")}</p>
        </div>
        <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[120px] sm:min-h-[140px]"
         onClick={() => handleOpenModal(t("terrasses.cards.amenagement.title"), explications.amenagement, <FaLeaf className="text-green-500" />)}>
          <FaLeaf className="text-2xl sm:text-3xl md:text-4xl text-green-500 mb-1" />
       <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">{t("terrasses.cards.amenagement.title")}</h3>
       <p className="text-gray-600 text-center text-xs sm:text-sm">{t("terrasses.cards.amenagement.subtitle")}</p>
        </div>
        <div className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[120px] sm:min-h-[140px]"
         onClick={() => handleOpenModal(t("terrasses.cards.entretien.title"), explications.entretien, <FaBroom className="text-amber-500" />)}>
          <FaBroom className="text-2xl sm:text-3xl md:text-4xl text-amber-500 mb-1" />
       <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">{t("terrasses.cards.entretien.title")}</h3>
       <p className="text-gray-600 text-center text-xs sm:text-sm">{t("terrasses.cards.entretien.subtitle")}</p>
        </div>
      </div>
      <InfoModal open={modalOpen} onClose={handleCloseModal} title={modalTitle} icon={modalIcon}>
        {modalContent}
      </InfoModal>
    </div>
  );
}
