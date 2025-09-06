"use client";
import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
const MobileNavBar = dynamic(() => import("../../components/MobileNavBar"), { ssr: false });
const WhatsAppBubble = dynamic(() => import("../../components/WhatsAppBubble"), { ssr: false });
const InteractiveContact = dynamic(() => import("../../components/InteractiveContact"), { ssr: false });
const RealisationsCarousel = dynamic(() => import("../../components/RealisationsCarousel"), { ssr: false });
const ModernConstructionSection = dynamic(() => import("../../components/sections/ConstructionSection"));
const ModernRenovationSection = dynamic(() => import("../../components/sections/RenovationSection"));
const ModernDepannageSection = dynamic(() => import("../../components/sections/DepannageSection"));
const ModernHivernageSection = dynamic(() => import("../../components/sections/HivernageSection"));
const ModernEntretienSection = dynamic(() => import("../../components/sections/EntretienSection"));
const ModernTerrassesSection = dynamic(() => import("../../components/sections/TerrassesSection"));
import { useSection } from "../../components/SectionProvider";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { useI18n } from "../../i18n/I18nProvider";
import LocalImage from "@/components/LocalImage";
// Image hero locale importée statiquement (depuis /public)
import hero from "../../../public/img/logo adam fini (2).png";

export default function HomeClient() {
  const { active, setActive } = useSection();
  const { t } = useI18n();
  const SECTION_IDS = useMemo(() => ([
    "accueil","construction","renovation","depannage","hivernage","entretien","terrasses","nos-realisations","contact"
  ]), []);

  useEffect(() => {
    const id = typeof window !== 'undefined' ? window.location.hash.replace('#','') : '';
    if (id && SECTION_IDS.includes(id)) setActive(id);
  }, [SECTION_IDS, setActive]);

  const emerge = {
    initial: { opacity: 0, filter: "blur(8px)", y: 24, scale: 0.99 },
    animate: { opacity: 1, filter: "blur(0px)", y: 0, scale: 1, transition: { duration: 0.45, ease: [0.44,0.95,0.6,1.15] } },
    exit:    { opacity: 0, filter: "blur(6px)", y: -16, scale: 0.995, transition: { duration: 0.32, ease: [0.44,0.95,0.6,1.15] } },
  };

  return (
    <LazyMotion features={domAnimation} strict>
      {/* Mobile only */}
      <div className="lg:hidden">
        <MobileNavBar />
      </div>
      <main className="w-full relative">
        <WhatsAppBubble hideOnContact={true} />
        <div className="relative w-full min-h-screen overflow-hidden">
          <AnimatePresence mode="wait">
            {active === "accueil" && (
              <m.section key="accueil" variants={emerge} initial="initial" animate="animate" exit="exit" className="absolute inset-0 flex flex-col w-full overflow-auto">
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
                  <div className="flex items-center justify-center w-full max-w-full" style={{ minHeight: 200 }}>
                    <LocalImage
                      src={hero}
                      alt="Logo GHN Group - Piscines & Extérieurs"
                      priority
                      fetchPriority="high"
                      sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 600px"
                      className="w-full h-auto max-w-full max-h-full object-contain p-4"
                    />
                  </div>
                </div>
              </m.section>
            )}
            {active === "construction" && (
              <m.section key="construction" variants={emerge} initial="initial" animate="animate" exit="exit" className="absolute inset-0 flex flex-col w-full overflow-auto">
                <div className="relative z-10 w-full flex-1 pt-[90px] px-4 flex items-center justify-center" data-reveal>
                  <ModernConstructionSection />
                </div>
              </m.section>
            )}
            {active === "renovation" && (
              <m.section key="renovation" variants={emerge} initial="initial" animate="animate" exit="exit" className="absolute inset-0 flex flex-col w-full overflow-auto">
                <div className="relative z-10 w-full flex-1 pt-[90px] px-4 flex items-center justify-center" data-reveal>
                  <ModernRenovationSection />
                </div>
              </m.section>
            )}
            {active === "depannage" && (
              <m.section key="depannage" variants={emerge} initial="initial" animate="animate" exit="exit" className="absolute inset-0 flex flex-col w-full overflow-auto">
                <div className="relative z-10 w-full flex-1 pt-[90px] px-4 flex items-center justify-center" data-reveal>
                  <ModernDepannageSection />
                </div>
              </m.section>
            )}
            {active === "hivernage" && (
              <m.section key="hivernage" variants={emerge} initial="initial" animate="animate" exit="exit" className="absolute inset-0 flex flex-col w-full overflow-auto">
                <div className="relative z-10 w-full flex-1 pt-[90px] px-4 flex items-center justify-center" data-reveal>
                  <ModernHivernageSection />
                </div>
              </m.section>
            )}
            {active === "entretien" && (
              <m.section key="entretien" variants={emerge} initial="initial" animate="animate" exit="exit" className="absolute inset-0 flex flex-col w-full overflow-auto">
                <div className="relative z-10 w-full flex-1 pt-[90px] px-4 flex items-center justify-center" data-reveal>
                  <ModernEntretienSection />
                </div>
              </m.section>
            )}
            {active === "terrasses" && (
              <m.section key="terrasses" variants={emerge} initial="initial" animate="animate" exit="exit" className="absolute inset-0 flex flex-col w-full overflow-auto">
                <div className="relative z-10 w-full flex-1 pt-[90px] px-4 flex items-center justify-center" data-reveal>
                  <ModernTerrassesSection />
                </div>
              </m.section>
            )}
            {active === "nos-realisations" && (
              <m.section key="nos-realisations" variants={emerge} initial="initial" animate="animate" exit="exit" className="absolute inset-0 flex flex-col w-full overflow-auto">
                <div className="relative z-10 max-w-5xl mx-auto w-full flex-1 pt-[90px] px-4 flex items-center justify-center" data-reveal>
                  <div className="w-full">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-[#009ee0]">{t("section.realisations.title")}</h2>
                    <p className="text-center text-lg mb-8 text-gray-700">{t("section.realisations.desc")}</p>
                    <RealisationsCarousel />
                  </div>
                </div>
              </m.section>
            )}
            {active === "contact" && (
              <m.section key="contact" variants={emerge} initial="initial" animate="animate" exit="exit" className="absolute inset-0 flex flex-col w-full overflow-auto">
                <div className="relative z-10 mx-auto w-full flex-1 pt-[90px] px-4 flex items-center justify-center" data-reveal>
                  <InteractiveContact />
                </div>
              </m.section>
            )}
          </AnimatePresence>
        </div>
      </main>
    </LazyMotion>
  );
}
