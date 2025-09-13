"use client"; // 👉 Composant côté client (hooks/DOM)
import React, { useEffect, useRef } from "react"; // 👉 React + hooks
import { FaDraftingCompass, FaCheckCircle, FaHammer, FaPalette } from "react-icons/fa"; // 👉 Icônes
import InfoModal from "@/components/InfoModal"; // 👉 Modal réutilisable
import { useI18n } from "@/i18n/I18nProvider"; // 👉 i18n (traductions)

export default function ConstructionSection() {
  const { t } = useI18n(); // 👉 Fonction de traduction

  // ✅ Helper i18n sûr (fallback si clé manquante)
  const tt = React.useCallback(
    (key, fallback) => {
      const val = t?.(key);                 // 🔎 Récupère la traduction
      if (!val || val === key) return fallback; // ↩️ Fallback lisible si manquante
      return val;                           // ✅ Traduction trouvée
    },
    [t]                                     // 🔁 Recrée si t change
  );

  const sectionRef = useRef(null);          // 🔗 Ref racine pour écouter les clics
  const idleTimerRef = useRef(null);        // ⏱️ Ref du timer d’inactivité
  const IDLE_DELAY = 6000;                  // 🕒 6s sans clic → afficher le message

  const [showIdleInfo, setShowIdleInfo] = React.useState(false); // 👀 Afficher le message discret
  const [modalOpen, setModalOpen] = React.useState(false);       // 🪟 Ouverture modal
  const [modalTitle, setModalTitle] = React.useState("");        // 🏷️ Titre modal
  const [modalContent, setModalContent] = React.useState("");    // 📝 Contenu modal
  const [modalIcon, setModalIcon] = React.useState(null);        // 🖼️ Icône modal

  // 📚 Textes longs (i18n)
  const explications = {
    faisabilite: t("construction.modal.faisabilite"), // 🧱 Carte 1
    construction: t("construction.modal.construction"), // 🛠️ Carte 2
    personnalise: t("construction.modal.personnalise"), // 🎨 Carte 3
  };

  // ▶️ Ouvre le modal + reset idle
  const handleOpenModal = (title, content, icon) => {
    setModalTitle(title);                 // 🏷️ Set titre
    setModalContent(content);             // 📝 Set contenu
    setModalIcon(icon);                   // 🖼️ Set icône
    setModalOpen(true);                   // 🪟 Ouvre
    setShowIdleInfo(false);               // 👋 Cache le hint (interaction)
    startIdleTimer();                     // 🔁 Relance le timer d’inactivité
  };

  // ⏹️ Ferme le modal
  const handleCloseModal = () => setModalOpen(false);  // 📴 Ferme

  // 🔁 Démarre/relance le timer d’inactivité (affiche le hint après 6s sans clic)
  const startIdleTimer = React.useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current); // 🧹 Nettoie l’ancien timer
    idleTimerRef.current = setTimeout(() => setShowIdleInfo(true), IDLE_DELAY); // ⏲️ Affiche le hint
  }, [IDLE_DELAY]);                                                // ♻️ Stable tant que le délai ne change pas

  // 🖱️ Ecoute les clics dans la section : cache le hint et relance le timer
  useEffect(() => {
    const node = sectionRef.current;           // 🔗 Nœud DOM
    if (!node) return;                         // 🛡️ Sécurité
    const onClickAny = () => {
      setShowIdleInfo(false);                  // 🙈 Cache le message
      startIdleTimer();                        // 🔁 Relance timer
    };
    node.addEventListener("click", onClickAny, { passive: true }); // 🖱️ Écoute tous les clics
    startIdleTimer();                           // ▶️ Lance au montage
    return () => {
      node.removeEventListener("click", onClickAny);               // 🧹 Clean listener
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current); // 🧹 Clean timer
    };
  }, [startIdleTimer]);                                            // 🔁 Dépend de startIdleTimer

  return (
    <div ref={sectionRef} className="mx-auto w-full max-w-6xl px-3 sm:px-6"> {/* 📦 Conteneur + ref pour clics */}
      {/* 🏷️ Titre */}
      <h2 className="text-lg sm:text-2xl md:text-4xl font-semibold flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-2 sm:mb-4 text-center justify-center">
        <FaDraftingCompass className="text-lg sm:text-3xl text-sky-500" /> {/* 🧭 Icône */}
        <span className="leading-tight">{t("construction.title")}</span>    {/* 🧾 Titre */}
      </h2>

      {/* 📝 Description */}
      <p className="mt-2 sm:mt-4 text-gray-700 text-sm sm:text-lg text-center max-w-3xl mx-auto mb-4 sm:mb-8 px-2">
        {t("construction.desc")}
      </p>

      {/* 📐 Grille : mobile colonne / desktop (lg) en rang */}
      <div className="flex flex-col lg:flex-row gap-3 sm:gap-5 md:gap-6 max-w-7xl mx-auto">
        {/* ====== CARTE 1 ====== */}
        <div
          className={[
            "flex md:block items-start",                                 // 📲 Mobile horizontal | 🖥️ md+ vertical
            "flex-1 p-2 sm:p-4 md:p-6 lg:p-8",                           // 🧊 Padding responsive
            "rounded-2xl bg-white/95 shadow-xl border border-sky-100",   // 🎨 Style
            "transition-all duration-300 hover:scale-105 cursor-pointer",// 🎞️ Hover
            "min-h-[140px] sm:min-h-[200px] lg:min-h-[280px]",           // 📏 Hauteur
          ].join(" ")}
          onClick={() =>
            handleOpenModal(
              t("construction.card1.title"),                             // 🏷️
              explications.faisabilite,                                  // 📝
              <FaCheckCircle className="text-sky-400" />                 // 🖼️
            )
          }
          title={tt("ui.hint.clickCard", "Cliquer pour voir le détail")} // 🛈 Tooltip discret
        >
          {/* Col gauche (mobile) : icône + titre */}
          <div className="w-[42%] md:w-auto md:text-center md:mb-3 pr-2 md:pr-0">
            <FaCheckCircle className="text-xl sm:text-3xl text-sky-400 mx-0 md:mx-auto mb-1 sm:mb-3" />
            <h3 className="text-sm sm:text-xl md:text-2xl font-bold text-gray-800 leading-snug line-clamp-2">
              {t("construction.card1.title")}
            </h3>
          </div>
          {/* Col droite (mobile) : liste */}
          <div className="w-[58%] md:w-auto md:space-y-3 space-y-1 sm:space-y-2 flex-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-2">
                <FaCheckCircle className="text-sky-400 text-[10px] sm:text-sm flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-xs sm:text-sm leading-snug">
                  {t(`construction.card1.bullets.${i}`)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ====== CARTE 2 ====== */}
        <div
          className={[
            "flex md:block items-start",
            "flex-1 p-2 sm:p-4 md:p-6 lg:p-8",
            "rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-400 text-white shadow-xl",
            "transition-all duration-300 hover:scale-105 cursor-pointer",
            "min-h-[140px] sm:min-h-[200px] lg:min-h-[280px]",
          ].join(" ")}
          onClick={() =>
            handleOpenModal(
              t("construction.card2.title"),
              explications.construction,
              <FaHammer className="text-white" />
            )
          }
          title={tt("ui.hint.clickCard", "Cliquer pour voir le détail")}
        >
          <div className="w-[42%] md:w-auto md:text-center md:mb-3 pr-2 md:pr-0">
            <FaHammer className="text-xl sm:text-3xl text-white mx-0 md:mx-auto mb-1 sm:mb-3 drop-shadow" />
            <h3 className="text-sm sm:text-xl md:text-2xl font-bold text-white leading-snug line-clamp-2">
              {t("construction.card2.title")}
            </h3>
          </div>
          <div className="w-[58%] md:w-auto md:space-y-3 space-y-1 sm:space-y-2 flex-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-2">
                <FaCheckCircle className="text-white text-[10px] sm:text-sm drop-shadow flex-shrink-0 mt-0.5" />
                <span className="text-white/95 text-xs sm:text-sm leading-snug">
                  {t(`construction.card2.bullets.${i}`)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ====== CARTE 3 ====== */}
        <div
          className={[
            "flex md:block items-start",
            "flex-1 p-2 sm:p-4 md:p-6 lg:p-8",
            "rounded-2xl bg-white/95 shadow-xl border border-cyan-100",
            "transition-all duration-300 hover:scale-105 cursor-pointer",
            "min-h-[140px] sm:min-h-[200px] lg:min-h-[280px]",
          ].join(" ")}
          onClick={() =>
            handleOpenModal(
              t("construction.card3.title"),
              explications.personnalise,
              <FaPalette className="text-cyan-500" />
            )
          }
          title={tt("ui.hint.clickCard", "Cliquer pour voir le détail")}
        >
          <div className="w-[42%] md:w-auto md:text-center md:mb-3 pr-2 md:pr-0">
            <FaPalette className="text-xl sm:text-3xl text-cyan-500 mx-0 md:mx-auto mb-1 sm:mb-3" />
            <h3 className="text-sm sm:text-xl md:text-2xl font-bold text-gray-800 leading-snug line-clamp-2">
              {t("construction.card3.title")}
            </h3>
          </div>
          <div className="w-[58%] md:w-auto md:space-y-3 space-y-1 sm:space-y-2 flex-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-2">
                <FaCheckCircle className="text-cyan-400 text-[10px] sm:text-sm flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-xs sm:text-sm leading-snug">
                  {t(`construction.card3.bullets.${i}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🛈 Message discret en bas — s’affiche après 6s sans CLIC dans la section */}
      {showIdleInfo && (
        <div className="mt-3 flex justify-end">                 {/* 📏 Aligné à droite */}
          <div className="flex items-center gap-2 text-[11px] text-gray-500/85 select-none">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-500/60" /> {/* 🔵 Pastille */}
            <span>{tt("ui.hint.inline", tt("ui.hint.clickCard", (t?.("lang") === "en" ? "Click a card for details." : t?.("lang") === "nl" ? "Klik op een kaart voor details." : "Cliquer pour voir le détail")))}</span> {/* 🗨️ Texte hint multilangue */}
          </div>
        </div>
      )}

      {/* 🪟 Modal d’infos */}
      <InfoModal open={modalOpen} onClose={handleCloseModal} title={modalTitle} icon={modalIcon}>
        {modalContent}
      </InfoModal>
    </div>
  );
}
