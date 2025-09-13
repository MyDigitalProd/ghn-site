"use client";
import React from "react";
import { FaWrench, FaCheckCircle, FaCogs, FaTools, FaLeaf } from "react-icons/fa";
import InfoModal from "@/components/InfoModal";
import { useI18n } from "@/i18n/I18nProvider";

export default function DepannageSection() {
  const { t } = useI18n();

  // Helper i18n avec fallback
  const tt = React.useCallback(
    (key, fallback) => {
      const v = t?.(key);
      if (!v || v === key) return fallback;
      return v;
    },
    [t]
  );

  // États pour le modal
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState("");
  const [modalContent, setModalContent] = React.useState("");
  const [modalIcon, setModalIcon] = React.useState(null);

  // États et refs pour le message discret
  const IDLE_DELAY = 6000; // 6s avant d’afficher le message
  const [showIdleInfo, setShowIdleInfo] = React.useState(false);
  const idleTimerRef = React.useRef(null);
  const sectionRef = React.useRef(null);

  // Redémarre le timer d'inactivité
  const startIdleTimer = React.useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setShowIdleInfo(true), IDLE_DELAY);
  }, [IDLE_DELAY]);

  // Installe l’écoute de clics dans la section
  React.useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const onAnyClick = () => {
      setShowIdleInfo(false);
      startIdleTimer();
    };
    node.addEventListener("click", onAnyClick, { passive: true });
    startIdleTimer();
    return () => {
      node.removeEventListener("click", onAnyClick);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [startIdleTimer]);

  // Ouvre le modal
  const handleOpenModal = (title, content, icon) => {
    setModalTitle(title);
    setModalContent(content);
    setModalIcon(icon);
    setModalOpen(true);
    setShowIdleInfo(false);
    startIdleTimer();
  };

  const handleCloseModal = () => setModalOpen(false);

  // Contenus des modals
  const explications = {
    intervention: t("depannage.modal.intervention"),
    diagnostic: t("depannage.modal.diagnostic"),
    reparations: t("depannage.modal.reparations"),
    suivi: t("depannage.modal.suivi"),
  };

  return (
    <div ref={sectionRef} className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      {/* Titre */}
      <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-2 sm:mb-3 text-center justify-center">
        <FaWrench className="text-blue-400 text-3xl sm:text-4xl md:text-5xl" />
        {t("depannage.title")}
      </h2>

      {/* Description */}
      <p className="mt-2 sm:mt-3 text-gray-700 text-sm sm:text-base md:text-lg text-center max-w-3xl mx-auto mb-4 px-2">
        {t("depannage.desc")}
      </p>

      {/* Grille de cartes */}
      <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 md:grid-cols-2">
        {/* Carte — Intervention */}
        <div
          className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[120px] sm:min-h-[140px]"
          onClick={() =>
            handleOpenModal(
              t("depannage.cards.intervention.title"),
              explications.intervention,
              <FaCheckCircle className="text-sky-500" />
            )
          }
          title={tt("ui.hint.clickCard", "Cliquer pour voir le détail")}
        >
          <FaCheckCircle className="text-2xl sm:text-3xl md:text-4xl text-sky-500 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">
            {t("depannage.cards.intervention.title")}
          </h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">
            {t("depannage.cards.intervention.subtitle")}
          </p>
        </div>

        {/* Carte — Diagnostic */}
        <div
          className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[120px] sm:min-h-[140px]"
          onClick={() =>
            handleOpenModal(
              t("depannage.cards.diagnostic.title"),
              explications.diagnostic,
              <FaCogs className="text-cyan-500" />
            )
          }
          title={tt("ui.hint.clickCard", "Cliquer pour voir le détail")}
        >
          <FaCogs className="text-2xl sm:text-3xl md:text-4xl text-cyan-500 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">
            {t("depannage.cards.diagnostic.title")}
          </h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">
            {t("depannage.cards.diagnostic.subtitle")}
          </p>
        </div>

        {/* Carte — Réparations */}
        <div
          className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[120px] sm:min-h-[140px]"
          onClick={() =>
            handleOpenModal(
              t("depannage.cards.reparations.title"),
              explications.reparations,
              <FaTools className="text-blue-400" />
            )
          }
          title={tt("ui.hint.clickCard", "Cliquer pour voir le détail")}
        >
          <FaTools className="text-2xl sm:text-3xl md:text-4xl text-blue-400 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">
            {t("depannage.cards.reparations.title")}
          </h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">
            {t("depannage.cards.reparations.subtitle")}
          </p>
        </div>

        {/* Carte — Suivi */}
        <div
          className="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/90 backdrop-blur shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 min-h-[120px] sm:min-h-[140px]"
          onClick={() =>
            handleOpenModal(
              t("depannage.cards.suivi.title"),
              explications.suivi,
              <FaLeaf className="text-cyan-500" />
            )
          }
          title={tt("ui.hint.clickCard", "Cliquer pour voir le détail")}
        >
          <FaLeaf className="text-2xl sm:text-3xl md:text-4xl text-cyan-500 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center">
            {t("depannage.cards.suivi.title")}
          </h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">
            {t("depannage.cards.suivi.subtitle")}
          </p>
        </div>
      </div>

      {/* Message discret en bas, après inactivité */}
      {showIdleInfo && (
        <div className="mt-3 flex justify-end">
          <div className="flex items-center gap-2 text-[11px] text-gray-500/85 select-none">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-500/60" />
            <span>
              {tt("ui.hint.inline", "Cliquez sur une carte pour voir les détails.")}
            </span>
          </div>
        </div>
      )}

      {/* Modal */}
      <InfoModal open={modalOpen} onClose={handleCloseModal} title={modalTitle} icon={modalIcon}>
        {modalContent}
      </InfoModal>
    </div>
  );
}
