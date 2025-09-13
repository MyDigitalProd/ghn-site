"use client"; // Exécution côté client (hooks & DOM)
import React from "react"; // Import de React pour JSX et hooks
import { FaRedo, FaTools, FaWater, FaCogs, FaHammer, FaShieldAlt } from "react-icons/fa"; // Icônes
import InfoModal from "@/components/InfoModal"; // Modal d'information au clic
import { useI18n } from "@/i18n/I18nProvider"; // Contexte i18n (traductions)

export default function RenovationSection() {
  const { t } = useI18n(); // Fonction de traduction

  // Helper i18n sûr : si la clé manque (ou renvoie la clé), on affiche un fallback lisible
  const tt = React.useCallback(
    (key, fallback) => {
      const val = t?.(key); // Récupère la traduction
      if (!val || val === key) return fallback; // Si manquante/identique → fallback
      return val; // Sinon renvoie la traduction
    },
    [t] // Dépendance à la fonction t
  );

  const [modalOpen, setModalOpen] = React.useState(false); // État d'ouverture du modal
  const [modalTitle, setModalTitle] = React.useState(""); // Titre du modal
  const [modalContent, setModalContent] = React.useState(""); // Contenu du modal
  const [modalIcon, setModalIcon] = React.useState(null); // Icône du modal

  const IDLE_DELAY = 6000; // Délai d'inactivité (ms) avant d'afficher le message discret
  const [showIdleInfo, setShowIdleInfo] = React.useState(false); // État du message discret (bas de section)
  const idleTimerRef = React.useRef(null); // Référence du timer d'inactivité
  const sectionRef = React.useRef(null); // Référence du conteneur section pour écouter les clics

  // Démarre/relance le timer d'inactivité (basé uniquement sur les CLICS, comme demandé)
  const startIdleTimer = React.useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current); // Nettoie l'ancien timer
    idleTimerRef.current = setTimeout(() => setShowIdleInfo(true), IDLE_DELAY); // Après délai → affiche le message
  }, [IDLE_DELAY]); // Stable tant que le délai ne change pas

  // Écoute les CLICS dans la section : un clic cache le message et relance le timer
  React.useEffect(() => {
    const node = sectionRef.current; // Nœud DOM de la section
    if (!node) return; // Sécurité si ref non montée
    const onClickAny = () => {
      setShowIdleInfo(false); // Cache le message discret
      startIdleTimer(); // Relance le timer d'inactivité
    };
    node.addEventListener("click", onClickAny, { passive: true }); // Écoute tous les clics (bubbling)
    startIdleTimer(); // Lance une première fois au montage
    return () => {
      node.removeEventListener("click", onClickAny); // Nettoie l'écouteur
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current); // Nettoie le timer
    };
  }, [startIdleTimer]); // Repose sur la fonction stable

  // Ouvre le modal avec les données de la carte
  const handleOpenModal = (title, content, icon) => {
    setModalTitle(title); // Stocke le titre
    setModalContent(content); // Stocke le contenu
    setModalIcon(icon); // Stocke l'icône
    setModalOpen(true); // Ouvre le modal
    setShowIdleInfo(false); // Cache le message discret (interaction détectée)
    startIdleTimer(); // Relance le timer pour les interactions futures
  };

  // Ferme le modal
  const handleCloseModal = () => setModalOpen(false); // Ferme le modal

  // Contenus détaillés (i18n)
  const explications = {
    revetements: t("renovation.modal.revetements"), // Texte revêtements
    fuites: t("renovation.modal.fuites"), // Texte fuites
    modernisation: t("renovation.modal.modernisation"), // Texte modernisation
    refonte: t("renovation.modal.refonte"), // Texte refonte
    conformite: t("renovation.modal.conformite"), // Texte conformité
  };

  // Base homogène des cartes (dimensions figées en desktop)
  const cardBase =
    // — Layout responsive —
    "w-full " + // Mobile : largeur 100%
    "sm:basis-[280px] " + // Tablet : base 280px (2 colonnes)
    "md:grow-0 md:shrink-0 " + // Desktop : empêche l’étirement/rétrécissement
    "md:min-w-[320px] md:max-w-[320px] " + // Desktop : largeur FIXE 320px (homogène)
    "md:min-h-[160px] md:max-h-[160px] " + // Desktop : hauteur FIXE 160px (homogène)
    // — Boîte & style —
    "h-auto min-h-[80px] " + // Mobile : hauteur auto avec minimum
    "overflow-hidden " + // Coupe les débordements
    "p-1.5 md:p-3 rounded-lg bg-white md:bg-white/90 " + // Padding + fond
    "antialiased md:backdrop-blur shadow-sm md:shadow-md " + // Netteté + ombres
    // — Interaction & perf —
    "transform-gpu transition-transform duration-300 md:hover:scale-105 cursor-pointer select-none " + // Hover fluide
    // — Contenu interne —
    "flex flex-col items-center justify-center text-center leading-tight gap-0.5"; // Centrage & compacité

  return (
    // Conteneur principal (largeur max cohérente) avec ref pour détecter les CLICS
    <div ref={sectionRef} className="mx-auto w-full max-w-6xl px-3 sm:px-6 antialiased">
      {/* Titre section */}
      <h2 className="text-xl sm:text-3xl md:text-5xl font-semibold flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 mb-1.5 sm:mb-3 text-center justify-center leading-tight">
        <FaRedo className="text-cyan-500 text-2xl sm:text-4xl md:text-5xl" /> {/* Icône du titre */}
        {t("renovation.title")} {/* Texte i18n */}
      </h2>

      {/* Description section */}
      <p className="mt-1 sm:mt-2 text-gray-700 text-xs sm:text-sm md:text-lg text-center max-w-3xl mx-auto mb-3 sm:mb-4 px-1 leading-tight">
        {t("renovation.desc")} {/* Texte i18n */}
      </p>

      {/* Grille des cartes (wrap + centrage des lignes) */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
        {/* Carte — Revêtements */}
        <div
          className={cardBase} // Applique la base homogène
          onClick={() =>
            handleOpenModal(
              t("renovation.cards.revetements.title"), // Titre modal
              explications.revetements, // Contenu modal
              <FaTools className="text-sky-500" /> // Icône modal
            )
          }
          title={tt("ui.hint.clickCard", "Cliquer pour voir le détail")} // Tooltip discret
        >
          <FaTools className="text-lg sm:text-2xl md:text-4xl text-sky-500 mb-0.5" /> {/* Icône */}
          <h3
            className="font-bold text-sm sm:text-base md:text-xl mb-0 truncate w-full" // Tronque pour garder la hauteur
            title={t("renovation.cards.revetements.title")} // Tooltip complet titre
          >
            {t("renovation.cards.revetements.title")} {/* Titre card */}
          </h3>
          <p
            className="text-gray-600 text-[11px] sm:text-xs md:text-sm truncate w-full" // Tronque le sous-titre
            title={t("renovation.cards.revetements.subtitle")} // Tooltip complet sous-titre
          >
            {t("renovation.cards.revetements.subtitle")} {/* Sous-titre */}
          </p>
        </div>

        {/* Carte — Fuites */}
        <div
          className={cardBase}
          onClick={() =>
            handleOpenModal(
              t("renovation.cards.fuites.title"),
              explications.fuites,
              <FaWater className="text-cyan-500" />
            )
          }
          title={tt("ui.hint.clickCard", "Cliquer pour voir le détail")}
        >
          <FaWater className="text-lg sm:text-2xl md:text-4xl text-cyan-500 mb-0.5" />
          <h3 className="font-bold text-sm sm:text-base md:text-xl mb-0 truncate w-full" title={t("renovation.cards.fuites.title")}>
            {t("renovation.cards.fuites.title")}
          </h3>
          <p className="text-gray-600 text-[11px] sm:text-xs md:text-sm truncate w-full" title={t("renovation.cards.fuites.subtitle")}>
            {t("renovation.cards.fuites.subtitle")}
          </p>
        </div>

        {/* Carte — Modernisation */}
        <div
          className={cardBase}
          onClick={() =>
            handleOpenModal(
              t("renovation.cards.modernisation.title"),
              explications.modernisation,
              <FaCogs className="text-blue-400" />
            )
          }
          title={tt("ui.hint.clickCard", "Cliquer pour voir le détail")}
        >
          <FaCogs className="text-lg sm:text-2xl md:text-4xl text-blue-400 mb-0.5" />
          <h3 className="font-bold text-sm sm:text-base md:text-xl mb-0 truncate w-full" title={t("renovation.cards.modernisation.title")}>
            {t("renovation.cards.modernisation.title")}
          </h3>
          <p className="text-gray-600 text-[11px] sm:text-xs md:text-sm truncate w-full" title={t("renovation.cards.modernisation.subtitle")}>
            {t("renovation.cards.modernisation.subtitle")}
          </p>
        </div>

        {/* Carte — Refonte */}
        <div
          className={cardBase}
          onClick={() =>
            handleOpenModal(
              t("renovation.cards.refonte.title"),
              explications.refonte,
              <FaHammer className="text-sky-500" />
            )
          }
          title={tt("ui.hint.clickCard", "Cliquer pour voir le détail")}
        >
          <FaHammer className="text-lg sm:text-2xl md:text-4xl text-sky-500 mb-0.5" />
          <h3 className="font-bold text-sm sm:text-base md:text-xl mb-0 truncate w-full" title={t("renovation.cards.refonte.title")}>
            {t("renovation.cards.refonte.title")}
          </h3>
          <p className="text-gray-600 text-[11px] sm:text-xs md:text-sm truncate w-full" title={t("renovation.cards.refonte.subtitle")}>
            {t("renovation.cards.refonte.subtitle")}
          </p>
        </div>

        {/* Carte — Conformité */}
        <div
          className={cardBase}
          onClick={() =>
            handleOpenModal(
              t("renovation.cards.conformite.title"),
              explications.conformite,
              <FaShieldAlt className="text-cyan-500" />
            )
          }
          title={tt("ui.hint.clickCard", "Cliquer pour voir le détail")}
        >
          <FaShieldAlt className="text-lg sm:text-2xl md:text-4xl text-cyan-500 mb-0.5" />
          <h3 className="font-bold text-sm sm:text-base md:text-xl mb-0 truncate w-full" title={t("renovation.cards.conformite.title")}>
            {t("renovation.cards.conformite.title")}
          </h3>
          <p className="text-gray-600 text-[11px] sm:text-xs md:text-sm truncate w-full" title={t("renovation.cards.conformite.subtitle")}>
            {t("renovation.cards.conformite.subtitle")}
          </p>
        </div>
      </div>

      {/* MESSAGE DISCRET EN BAS — Apparaît seulement après inactivité sans clic */}
      {showIdleInfo && (
        <div className="mt-3 flex justify-end"> {/* Ligne alignée à droite */}
          <div className="flex items-center gap-2 text-[11px] text-gray-500/85 select-none"> {/* Style discret */}
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-500/60" /> {/* Petit indicateur */}
            <span>{tt("ui.hint.inline", "Cliquez sur une carte pour voir les détails.")}</span> {/* Texte avec fallback */}
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
