"use client";
import React from "react";
import { FaRedo, FaTools, FaWater, FaCogs, FaHammer, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import InfoModal from "@/components/InfoModal";
import { useI18n } from "@/i18n/I18nProvider";

export default function RenovationSection() {
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
    conformite: t("renovation.modal.conformite"),
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