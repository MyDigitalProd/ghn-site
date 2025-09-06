"use client";
import React from "react";
import { FaWrench, FaCheckCircle, FaCogs, FaTools, FaLeaf } from "react-icons/fa";
import InfoModal from "@/components/InfoModal";
import { useI18n } from "@/i18n/I18nProvider";

export default function DepannageSection() {
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
    suivi: t("depannage.modal.suivi"),
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