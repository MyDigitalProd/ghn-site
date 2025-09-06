"use client";
import React from "react";
import { FaBroom, FaCheckCircle, FaFlask, FaCogs, FaClipboardCheck } from "react-icons/fa";
import InfoModal from "@/components/InfoModal";
import { useI18n } from "@/i18n/I18nProvider";

export default function EntretienSection() {
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
    controles: t("entretien.modal.controles"),
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