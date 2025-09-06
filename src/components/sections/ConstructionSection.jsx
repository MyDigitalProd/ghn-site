"use client";
import React, { useEffect, useRef } from "react";
import { FaDraftingCompass, FaCheckCircle, FaHammer, FaPalette } from "react-icons/fa";
import InfoModal from "@/components/InfoModal";
import { useI18n } from "@/i18n/I18nProvider";

export default function ConstructionSection() {
  const { t } = useI18n();
  const ref = useRef(null);
  useEffect(() => {}, []);

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
    faisabilite: t("construction.modal.faisabilite"),
    construction: t("construction.modal.construction"),
    personnalise: t("construction.modal.personnalise"),
  };

  return (
    <div ref={ref} className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-3 sm:mb-4 text-center justify-center">
        <FaDraftingCompass className="text-2xl sm:text-3xl text-sky-500" />
        <span className="leading-tight">{t("construction.title")}</span>
      </h2>
      <p className="mt-3 sm:mt-4 text-gray-700 text-base sm:text-lg text-center max-w-3xl mx-auto mb-6 sm:mb-8 px-2">{t("construction.desc")}</p>
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6 max-w-7xl mx-auto">
        <div
          className="flex-1 p-4 sm:p-5 md:p-6 lg:p-8 rounded-2xl bg-white/95 shadow-2xl border border-sky-100 flex flex-col justify-between hover:scale-105 transition-all duration-300 cursor-pointer min-h-[200px] lg:min-h-[280px]"
          onClick={() => handleOpenModal(t("construction.card1.title"), explications.faisabilite, <FaCheckCircle className="text-sky-400" />)}
        >
          <div className="text-center mb-4">
            <FaCheckCircle className="text-3xl sm:text-4xl text-sky-400 mx-auto mb-3" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 text-gray-800">{t("construction.card1.title")}</h3>
          </div>
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3"><FaCheckCircle className="text-sky-400 text-sm flex-shrink-0" /><span className="text-gray-700">{t("construction.card1.bullets.0")}</span></div>
            <div className="flex items-center gap-3"><FaCheckCircle className="text-sky-400 text-sm flex-shrink-0" /><span className="text-gray-700">{t("construction.card1.bullets.1")}</span></div>
            <div className="flex items-center gap-3"><FaCheckCircle className="text-sky-400 text-sm flex-shrink-0" /><span className="text-gray-700">{t("construction.card1.bullets.2")}</span></div>
            <div className="flex items-center gap-3"><FaCheckCircle className="text-sky-400 text-sm flex-shrink-0" /><span className="text-gray-700">{t("construction.card1.bullets.3")}</span></div>
          </div>
        </div>
        <div
          className="flex-1 p-4 sm:p-5 md:p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-400 text-white shadow-2xl flex flex-col justify-between hover:scale-105 transition-all duration-300 cursor-pointer min-h-[200px] lg:min-h-[280px]"
          onClick={() => handleOpenModal(t("construction.card2.title"), explications.construction, <FaHammer className="text-white" />)}
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
      <InfoModal open={modalOpen} onClose={handleCloseModal} title={modalTitle} icon={modalIcon}>
        {modalContent}
      </InfoModal>
    </div>
  );
}