"use client"; // Active l'exécution côté client (hooks/DOM nécessaires)
import React from "react"; // Importe React pour JSX et hooks
import { FaBroom, FaCheckCircle, FaFlask, FaCogs, FaClipboardCheck } from "react-icons/fa"; // Icônes
import InfoModal from "@/components/InfoModal"; // Modal d'information
import { useI18n } from "@/i18n/I18nProvider"; // Contexte i18n (traductions)

export default function EntretienSection() {
  const { t } = useI18n(); // Fonction de traduction i18n

  // Helper i18n sûr : renvoie un fallback lisible si la clé est manquante/identique
  const tt = React.useCallback(
    (key, fallback) => {                 // Déclare une fonction mémoisée
      const v = t?.(key);                // Récupère la traduction
      if (!v || v === key) return fallback; // Si manquante/identique → fallback
      return v;                          // Sinon renvoie la traduction
    },
    [t]                                  // Dépendance : se re-crée si t change
  );

  const [modalOpen, setModalOpen] = React.useState(false); // État : modal ouvert ?
  const [modalTitle, setModalTitle] = React.useState("");  // Titre du modal
  const [modalContent, setModalContent] = React.useState(""); // Contenu du modal
  const [modalIcon, setModalIcon] = React.useState(null);  // Icône du modal

  const IDLE_DELAY = 6000; // Délai d'inactivité avant d'afficher le message (ms)
  const [showIdleInfo, setShowIdleInfo] = React.useState(false); // Afficher le message discret ?
  const idleTimerRef = React.useRef(null); // Référence du timer pour pouvoir l'annuler
  const sectionRef = React.useRef(null);   // Référence du conteneur de section

  // (Re)lance le timer d'inactivité (basé UNIQUEMENT sur les clics dans la section)
  const startIdleTimer = React.useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current); // Annule le timer précédent
    idleTimerRef.current = setTimeout(() => setShowIdleInfo(true), IDLE_DELAY); // Après X s → affiche le message
  }, [IDLE_DELAY]); // Dépend du délai

  // Attache un écouteur de clic global sur la section et démarre le timer au montage
  React.useEffect(() => {
    const node = sectionRef.current; // Récupère le nœud DOM de la section
    if (!node) return;               // Sécurité si la ref n'est pas prête
    const onAnyClick = () => {       // Au moindre clic dans la section
      setShowIdleInfo(false);        // Cache le message discret
      startIdleTimer();              // Relance le timer d'inactivité
    };
    node.addEventListener("click", onAnyClick, { passive: true }); // Écoute les clics
    startIdleTimer();                // Démarre le timer initial
    return () => {                   // Nettoyages au démontage du composant
      node.removeEventListener("click", onAnyClick); // Retire l'écouteur
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current); // Annule le timer
    };
  }, [startIdleTimer]); // Re-attache si la fonction change

  // Ouvre le modal avec les infos de la carte
  const handleOpenModal = (title, content, icon) => {
    setModalTitle(title);   // Définit le titre
    setModalContent(content); // Définit le contenu
    setModalIcon(icon);     // Définit l'icône
    setModalOpen(true);     // Ouvre le modal
    setShowIdleInfo(false); // Cache le message discret (interaction)
    startIdleTimer();       // Relance le timer pour la suite
  };

  // Ferme le modal
  const handleCloseModal = () => setModalOpen(false); // Ferme le modal

  // Textes des modals (i18n)
  const explications = {
    quotidien: t("entretien.modal.quotidien"),   // Entretien quotidien
    nettoyage: t("entretien.modal.nettoyage"),   // Nettoyage
    equilibre: t("entretien.modal.equilibre"),   // Équilibre de l'eau
    maintenance: t("entretien.modal.maintenance"), // Maintenance
    controles: t("entretien.modal.controles"),   // Contrôles
  };

  // Classe commune : cartes homogènes (desktop 320×160) + hover doux + textes tronqués
  const cardBase =
    "relative w-full sm:basis-[280px] md:grow-0 md:shrink-0 " +       // Empêche l'étirement en md+
    "md:min-w-[320px] md:max-w-[320px] md:min-h-[160px] md:max-h-[160px] " + // Largeur/hauteur fixes desktop
    "h-auto min-h-[88px] overflow-hidden " +                          // Mobile compact + coupe débordements
    "p-1.5 sm:p-2 md:p-3 rounded-xl bg-white md:bg-white/90 backdrop-blur " + // Fond + blur léger
    "shadow-sm md:shadow-md ring-1 ring-black/5 hover:ring-black/10 " +       // Définition/ombre
    "transform-gpu transition-transform duration-300 md:hover:scale-105 " +   // Micro-zoom au hover (desktop)
    "cursor-pointer select-none " +                                 // UX : main + évite la sélection
    "flex flex-col items-center justify-center text-center leading-tight gap-0.5"; // Contenu centré & compact

  return (
    <div ref={sectionRef} className="mx-auto w-full max-w-6xl px-4 sm:px-6"> {/* Conteneur + ref pour le timer */}
      {/* Titre section */}
      <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-2 sm:mb-3 text-center justify-center">
        <FaBroom className="text-blue-400 text-3xl sm:text-4xl md:text-5xl" /> {/* Icône titre */}
        {t("entretien.title")} {/* Libellé i18n */}
      </h2>

      {/* Description */}
      <p className="mt-2 sm:mt-3 text-gray-700 text-sm sm:text-base md:text-lg text-center max-w-3xl mx-auto mb-4 px-2">
        {t("entretien.desc")} {/* Texte i18n */}
      </p>

      {/* Grille des cartes (wrap centré) */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6"> {/* Espacements homogènes */}
        {/* Carte — Entretien quotidien */}
        <div
          className={cardBase} // Style homogène
          onClick={() =>
            handleOpenModal(
              t("entretien.cards.quotidien.title"), // Titre modal
              explications.quotidien,               // Contenu modal
              <FaCheckCircle className="text-cyan-500" /> // Icône modal
            )
          }
          title={tt("ui.hint.clickCard", "Cliquer pour voir le détail")} // Tooltip discret
        >
          <FaCheckCircle className="text-2xl sm:text-3xl md:text-4xl text-cyan-500 mb-1" /> {/* Icône */}
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center truncate w-full" title={t("entretien.cards.quotidien.title")}>
            {t("entretien.cards.quotidien.title")} {/* Titre */}
          </h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm truncate w-full" title={t("entretien.cards.quotidien.subtitle")}>
            {t("entretien.cards.quotidien.subtitle")} {/* Sous-titre */}
          </p>
        </div>

        {/* Carte — Nettoyage */}
        <div
          className={cardBase}
          onClick={() =>
            handleOpenModal(
              t("entretien.cards.nettoyage.title"), // Titre modal
              explications.nettoyage,               // Contenu modal
              <FaBroom className="text-blue-400" /> // Icône modal
            )
          }
          title={tt("ui.hint.clickCard", "Cliquer pour voir le détail")}
        >
          <FaBroom className="text-2xl sm:text-3xl md:text-4xl text-blue-400 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center truncate w-full" title={t("entretien.cards.nettoyage.title")}>
            {t("entretien.cards.nettoyage.title")}
          </h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm truncate w-full" title={t("entretien.cards.nettoyage.subtitle")}>
            {t("entretien.cards.nettoyage.subtitle")}
          </p>
        </div>

        {/* Carte — Équilibre de l'eau */}
        <div
          className={cardBase}
          onClick={() =>
            handleOpenModal(
              t("entretien.cards.equilibre.title"), // Titre modal
              explications.equilibre,               // Contenu modal
              <FaFlask className="text-sky-500" />  // Icône modal
            )
          }
          title={tt("ui.hint.clickCard", "Cliquer pour voir le détail")}
        >
          <FaFlask className="text-2xl sm:text-3xl md:text-4xl text-sky-500 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center truncate w-full" title={t("entretien.cards.equilibre.title")}>
            {t("entretien.cards.equilibre.title")}
          </h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm truncate w-full" title={t("entretien.cards.equilibre.subtitle")}>
            {t("entretien.cards.equilibre.subtitle")}
          </p>
        </div>

        {/* Carte — Maintenance */}
        <div
          className={cardBase}
          onClick={() =>
            handleOpenModal(
              t("entretien.cards.maintenance.title"), // Titre modal
              explications.maintenance,               // Contenu modal
              <FaCogs className="text-cyan-500" />    // Icône modal
            )
          }
          title={tt("ui.hint.clickCard", "Cliquer pour voir le détail")}
        >
          <FaCogs className="text-2xl sm:text-3xl md:text-4xl text-cyan-500 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center truncate w-full" title={t("entretien.cards.maintenance.title")}>
            {t("entretien.cards.maintenance.title")}
          </h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm truncate w-full" title={t("entretien.cards.maintenance.subtitle")}>
            {t("entretien.cards.maintenance.subtitle")}
          </p>
        </div>

        {/* Carte — Contrôles */}
        <div
          className={cardBase}
          onClick={() =>
            handleOpenModal(
              t("entretien.cards.controles.title"), // Titre modal
              explications.controles,               // Contenu modal
              <FaClipboardCheck className="text-blue-400" /> // Icône modal
            )
          }
          title={tt("ui.hint.clickCard", "Cliquer pour voir le détail")}
        >
          <FaClipboardCheck className="text-2xl sm:text-3xl md:text-4xl text-blue-400 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center truncate w-full" title={t("entretien.cards.controles.title")}>
            {t("entretien.cards.controles.title")}
          </h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm truncate w-full" title={t("entretien.cards.controles.subtitle")}>
            {t("entretien.cards.controles.subtitle")}
          </p>
        </div>
      </div>

      {/* Message discret en bas : apparaît après X s sans clic dans la section */}
      {showIdleInfo && (
        <div className="mt-3 flex justify-end"> {/* Aligne à droite */}
          <div className="flex items-center gap-2 text-[11px] text-gray-500/85 select-none"> {/* Style discret */}
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-500/60" /> {/* Pastille */}
            <span>{tt("ui.hint.inline", "Astuce : cliquez sur une carte pour voir les détails.")}</span> {/* Texte avec fallback */}
          </div>
        </div>
      )}

      {/* Modal d’informations */}
      <InfoModal open={modalOpen} onClose={handleCloseModal} title={modalTitle} icon={modalIcon}>
        {modalContent} {/* Contenu injecté selon la carte cliquée */}
      </InfoModal>
    </div>
  );
}
