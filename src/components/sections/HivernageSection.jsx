"use client";
import React from "react";
import { FaSnowflake, FaShieldAlt, FaFlask, FaUmbrella, FaPlay, FaCogs } from "react-icons/fa";
import InfoModal from "@/components/InfoModal";
import { useI18n } from "@/i18n/I18nProvider";

export default function HivernageSection() {
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
    remise: t("hivernage.modal.remise"),
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