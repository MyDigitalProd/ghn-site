"use client"; // Active l'exécution côté client (hooks/DOM nécessaires)
import React from "react"; // Importe React pour JSX et hooks
import { FaSnowflake, FaShieldAlt, FaFlask, FaUmbrella, FaPlay, FaCogs } from "react-icons/fa"; // Icônes
import InfoModal from "@/components/InfoModal"; // Modal d'information
import { useI18n } from "@/i18n/I18nProvider"; // Contexte i18n (traductions)

export default function HivernageSection() {
  const { t } = useI18n(); // Récupère la fonction de traduction i18n

  // Helper i18n sûr : renvoie un fallback lisible si la clé est manquante
  const tt = React.useCallback(
    (key, fallback) => {                 // Fonction mémoisée
      const v = t?.(key);                // Lit la valeur traduite
      if (!v || v === key) return fallback; // Si absent/identique à la clé → fallback
      return v;                          // Sinon retourne la traduction
    },
    [t]                                  // Dépend de t
  );

  const [modalOpen, setModalOpen] = React.useState(false); // État ouverture modal
  const [modalTitle, setModalTitle] = React.useState("");  // Titre modal dynamique
  const [modalContent, setModalContent] = React.useState(""); // Contenu modal dynamique
  const [modalIcon, setModalIcon] = React.useState(null);  // Icône modal dynamique

  const IDLE_DELAY = 6000;                // Délai d'inactivité avant d'afficher le message (ms)
  const [showIdleInfo, setShowIdleInfo] = React.useState(false); // Afficher le message discret ?
  const idleTimerRef = React.useRef(null); // Réf du timer pour pouvoir l'annuler
  const sectionRef = React.useRef(null);   // Réf de la section pour écouter les clics

  // (Re)lance le timer d'inactivité (basé UNIQUEMENT sur les clics dans la section)
  const startIdleTimer = React.useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current); // Supprime l'ancien timer
    idleTimerRef.current = setTimeout(() => setShowIdleInfo(true), IDLE_DELAY); // Après X s → affiche le message
  }, [IDLE_DELAY]); // Stable tant que le délai ne change pas

  // Monte l'écouteur de clic sur la section + démarre le timer au montage
  React.useEffect(() => {
    const node = sectionRef.current;      // Nœud de la section
    if (!node) return;                    // Sécurité
    const onAnyClick = () => {            // Au moindre clic dans la section
      setShowIdleInfo(false);             // Cache le message s'il est visible
      startIdleTimer();                   // Relance le timer d'inactivité
    };
    node.addEventListener("click", onAnyClick, { passive: true }); // Écoute les clics
    startIdleTimer();                     // Démarre une première fois
    return () => {                        // Nettoyages au démontage
      node.removeEventListener("click", onAnyClick); // Retire l'écouteur
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current); // Vide le timer
    };
  }, [startIdleTimer]); // Ré-exécute si la fonction change

  // Ouvre le modal avec le contenu de la carte
  const handleOpenModal = (title, content, icon) => {
    setModalTitle(title);                 // Fixe le titre
    setModalContent(content);             // Fixe le contenu
    setModalIcon(icon);                   // Fixe l'icône
    setModalOpen(true);                   // Ouvre le modal
    setShowIdleInfo(false);               // Cache le message (interaction)
    startIdleTimer();                     // Relance le timer
  };

  // Ferme le modal
  const handleCloseModal = () => setModalOpen(false); // Ferme le modal

  // Textes des modals (i18n)
  const explications = {
    protection: t("hivernage.modal.protection"),   // Texte protection
    traitement: t("hivernage.modal.traitement"),   // Texte traitement
    equipements: t("hivernage.modal.equipements"), // Texte équipements
    couverture: t("hivernage.modal.couverture"),   // Texte couverture
    remise: t("hivernage.modal.remise"),           // Texte remise en service
  };

  // Classe commune : cartes homogènes (desktop 320×160) + hover doux + tronquage texte
  const cardBase =
    "relative w-full sm:basis-[280px] md:grow-0 md:shrink-0 " +       // Empêche l'étirement en md+
    "md:min-w-[320px] md:max-w-[320px] md:min-h-[160px] md:max-h-[160px] " + // Largeur/hauteur fixes en desktop
    "h-auto min-h-[88px] overflow-hidden " +                          // Mobile compact + coupe débordement
    "p-1.5 sm:p-2 md:p-3 rounded-xl bg-white md:bg-white/90 backdrop-blur " + // Padding + fond + blur
    "shadow-sm md:shadow-md ring-1 ring-black/5 hover:ring-black/10 " +       // Définition/ombre
    "transform-gpu transition-transform duration-300 md:hover:scale-105 " +   // Micro-zoom au hover en desktop
    "cursor-pointer select-none " +                                 // UX : curseur main + évite sélection
    "flex flex-col items-center justify-center text-center leading-tight gap-0.5"; // Contenu centré/compact

  return (
    <div ref={sectionRef} className="mx-auto w-full max-w-6xl px-4 sm:px-6"> {/* Conteneur + ref pour le timer */}
      {/* Titre section */}
      <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold flex flex-col sm:flex-row items-center gap-2 sm:gap-3 sm:mb-3 text-center justify-center mb-7">
        <FaSnowflake className="text-cyan-500 text-3xl sm:text-4xl md:text-5xl" /> {/* Icône */}
        {t("hivernage.title")} {/* Libellé i18n */}
      </h2>

      {/* Description */}
      <p className="mt-2 sm:mt-3 text-gray-700 text-sm sm:text-base md:text-lg text-center max-w-3xl mx-auto mb-4 sm:mb-4 px-2">
        {t("hivernage.desc")} {/* Texte i18n */}
      </p>

      {/* Grille des cartes (wrap centré) */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6"> {/* Espacements homogènes */}
        {/* Carte — Protection */}
        <div
          className={cardBase} // Styles communs homogènes
          onClick={() =>
            handleOpenModal(
              t("hivernage.cards.protection.title"), // Titre modal
              explications.protection,               // Contenu modal
              <FaShieldAlt className="text-cyan-500" /> // Icône modal
            )
          }
          title={tt("ui.hint.clickCard", "Cliquer pour voir le détail")} // Tooltip discret
        >
          <FaShieldAlt className="text-2xl sm:text-3xl md:text-4xl text-cyan-500 mb-1" /> {/* Icône carte */}
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center truncate w-full" title={t("hivernage.cards.protection.title")}>
            {t("hivernage.cards.protection.title")} {/* Titre carte */}
          </h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm truncate w-full" title={t("hivernage.cards.protection.subtitle")}>
            {t("hivernage.cards.protection.subtitle")} {/* Sous-titre */}
          </p>
        </div>

        {/* Carte — Traitement */}
        <div
          className={cardBase}
          onClick={() =>
            handleOpenModal(
              t("hivernage.cards.traitement.title"), // Titre modal
              explications.traitement,               // Contenu modal
              <FaFlask className="text-blue-400" />  // Icône modal
            )
          }
          title={tt("ui.hint.clickCard", "Cliquer pour voir le détail")}
        >
          <FaFlask className="text-2xl sm:text-3xl md:text-4xl text-blue-400 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center truncate w-full" title={t("hivernage.cards.traitement.title")}>
            {t("hivernage.cards.traitement.title")}
          </h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm truncate w-full" title={t("hivernage.cards.traitement.subtitle")}>
            {t("hivernage.cards.traitement.subtitle")}
          </p>
        </div>

        {/* Carte — Équipements */}
        <div
          className={cardBase}
          onClick={() =>
            handleOpenModal(
              t("hivernage.cards.equipements.title"), // Titre modal
              explications.equipements,               // Contenu modal
              <FaCogs className="text-sky-500" />    // Icône modal
            )
          }
          title={tt("ui.hint.clickCard", "Cliquer pour voir le détail")}
        >
          <FaCogs className="text-2xl sm:text-3xl md:text-4xl text-sky-500 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center truncate w-full" title={t("hivernage.cards.equipements.title")}>
            {t("hivernage.cards.equipements.title")}
          </h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm truncate w-full" title={t("hivernage.cards.equipements.subtitle")}>
            {t("hivernage.cards.equipements.subtitle")}
          </p>
        </div>

        {/* Carte — Couverture */}
        <div
          className={cardBase}
          onClick={() =>
            handleOpenModal(
              t("hivernage.cards.couverture.title"), // Titre modal
              explications.couverture,               // Contenu modal
              <FaUmbrella className="text-cyan-500" /> // Icône modal
            )
          }
          title={tt("ui.hint.clickCard", "Cliquer pour voir le détail")}
        >
          <FaUmbrella className="text-2xl sm:text-3xl md:text-4xl text-cyan-500 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center truncate w-full" title={t("hivernage.cards.couverture.title")}>
            {t("hivernage.cards.couverture.title")}
          </h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm truncate w-full" title={t("hivernage.cards.couverture.subtitle")}>
            {t("hivernage.cards.couverture.subtitle")}
          </p>
        </div>

        {/* Carte — Remise en service */}
        <div
          className={cardBase}
          onClick={() =>
            handleOpenModal(
              t("hivernage.cards.remise.title"), // Titre modal
              explications.remise,               // Contenu modal
              <FaPlay className="text-blue-400" /> // Icône modal
            )
          }
          title={tt("ui.hint.clickCard", "Cliquer pour voir le détail")}
        >
          <FaPlay className="text-2xl sm:text-3xl md:text-4xl text-blue-400 mb-1" />
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 text-center truncate w-full" title={t("hivernage.cards.remise.title")}>
            {t("hivernage.cards.remise.title")}
          </h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm truncate w-full" title={t("hivernage.cards.remise.subtitle")}>
            {t("hivernage.cards.remise.subtitle")}
          </p>
        </div>
      </div>

      {/* >>> MESSAGE DISCRET EN BAS — apparaît après inactivité sans clic <<< */}
      {showIdleInfo && ( // Affiche uniquement quand le timer a expiré
        <div className="mt-3 flex justify-end"> {/* Aligne le message à droite */}
          <div className="flex items-center gap-2 text-[11px] text-gray-500/85 select-none"> {/* Style discret */}
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-500/60" /> {/* Pastille */}
            <span>{tt("ui.hint.inline", "Cliquez sur une carte pour voir les détails.")}</span> {/* Texte (fallback FR) */}
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
