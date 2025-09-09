// Page Construction — MOBILE/TABLET: 3 cards horizontales visibles sans scroll
// Tout est commenté ligne par ligne.

import fr from "@/i18n/messages/fr.json";                     // Textes i18n
import { FiClipboard, FiTool, FiShield } from "react-icons/fi"; // Icônes légères

export const metadata = {
  title: `${fr["construction.title"]} | GHN Group`, // Titre SEO
  description: fr["construction.desc"],             // Description SEO
};

export default function Page() {
  // Petite fonction pour couper proprement les textes trop longs en mobile
  const short = (s, n = 22) => (s?.length > n ? s.slice(0, n).trim() + "…" : s);

  return (
    // Wrapper pleine hauteur calculée = 100svh - header - éventuel FAB (pas de scroll)
    <main
      // Ajuste ces variables à TA vraie UI (ex: header 64px, fab 56px)
      style={{ ["--header-h"]: "56px", ["--fab-h"]: "0px" }} // valeurs par défaut
      className="w-full overflow-hidden"                     // bloque tout scroll global
    >
      {/* Hauteur dynamique cross-mobile: 100svh fiable iOS/Android */}
      <div
        className="
          mx-auto w-full max-w-screen-2xl
          flex flex-col
          px-3 sm:px-4 md:px-6
        "
        // calc(100svh - header - fab) → garantit que la zone visible ne déborde pas
        style={{ height: "calc(100svh - var(--header-h) - var(--fab-h))" }}
      >
        {/* Header ultra compact (description masquée < lg) */}
        <header className="pt-1 pb-2 md:pt-2 md:pb-3">
          <h1 className="text-[clamp(18px,3.2vw,40px)] font-bold leading-tight text-[#009ee0]">
            {fr["construction.title"]}
          </h1>
          <p className="hidden lg:block mt-1 text-[clamp(13px,1.2vw,18px)] text-gray-700">
            {fr["construction.desc"]}
          </p>
        </header>

        {/* ZONE CARTES : 3 lignes égales -> 3 cards visibles sans scroll */}
        <section
          aria-label={fr["construction.title"]}
          className="
            flex-1 min-h-0               /* prend le reste sans overflow */
            grid grid-rows-3             /* 3 lignes égales en mobile/tablette */
            gap-2 md:gap-3               /* espacements compacts */
            lg:grid-rows-1 lg:grid-cols-3/* desktop : 3 colonnes classiques */
            auto-rows-fr                 /* robustesse si contenu varie */
          "
        >
          {/* === CARD 1 (Horizontale) === */}
          <article
            className="
              min-h-0 overflow-hidden           /* rien ne déborde */
              flex flex-row items-start         /* LAYOUT HORIZONTAL */
              lg:flex-col                       /* vertical en desktop */
              rounded-xl bg-white/95 shadow-sm border border-sky-100
              p-2 md:p-2.5                      /* padding réduit */
              max-[380px]:p-1.5                 /* micro tuning < 380px */
            "
          >
            {/* Col gauche: icône + titre (compact) */}
            <div className="min-w-0 flex basis-[42%] md:basis-[40%] lg:basis-auto flex-col gap-1 pr-2 lg:pr-0">
              <FiClipboard className="shrink-0 text-[18px] md:text-[20px] text-[#009ee0]" />
              <h2
                className="
                  text-[clamp(12px,1.4vw,16px)] font-semibold leading-snug text-gray-900
                  truncate lg:truncate max-[380px]:text-[11px] /* tronqué = 1 ligne */
                "
                title={fr["construction.card1.title"]}
              >
                {short(fr["construction.card1.title"], 26)}
              </h2>
            </div>

            {/* Séparateur fin (masqué en desktop) */}
            <div className="w-px bg-sky-100 mx-1 md:mx-1.5 lg:hidden" />

            {/* Col droite: liste 2×2 ultra compacte, 1 ligne par item */}
            <ul
              className="
                min-w-0 flex-1 grid grid-cols-2 gap-x-2 gap-y-1
                text-[clamp(10px,1.2vw,14px)] max-[380px]:text-[9.5px]
                text-gray-700 leading-tight self-start lg:mt-2
              "
            >
              <li className="truncate" title={fr["construction.card1.bullets.0"]}>{short(fr["construction.card1.bullets.0"])}</li>
              <li className="truncate" title={fr["construction.card1.bullets.1"]}>{short(fr["construction.card1.bullets.1"])}</li>
              <li className="truncate" title={fr["construction.card1.bullets.2"]}>{short(fr["construction.card1.bullets.2"])}</li>
              <li className="truncate" title={fr["construction.card1.bullets.3"]}>{short(fr["construction.card1.bullets.3"])}</li>
            </ul>
          </article>

          {/* === CARD 2 === */}
          <article className="min-h-0 overflow-hidden flex flex-row items-start lg:flex-col rounded-xl bg-white/95 shadow-sm border border-sky-100 p-2 md:p-2.5 max-[380px]:p-1.5">
            <div className="min-w-0 flex basis-[42%] md:basis-[40%] lg:basis-auto flex-col gap-1 pr-2 lg:pr-0">
              <FiTool className="shrink-0 text-[18px] md:text-[20px] text-[#009ee0]" />
              <h2 className="text-[clamp(12px,1.4vw,16px)] font-semibold leading-snug text-gray-900 truncate max-[380px]:text-[11px]" title={fr["construction.card2.title"]}>
                {short(fr["construction.card2.title"], 26)}
              </h2>
            </div>
            <div className="w-px bg-sky-100 mx-1 md:mx-1.5 lg:hidden" />
            <ul className="min-w-0 flex-1 grid grid-cols-2 gap-x-2 gap-y-1 text-[clamp(10px,1.2vw,14px)] max-[380px]:text-[9.5px] text-gray-700 leading-tight self-start lg:mt-2">
              <li className="truncate" title={fr["construction.card2.bullets.0"]}>{short(fr["construction.card2.bullets.0"])}</li>
              <li className="truncate" title={fr["construction.card2.bullets.1"]}>{short(fr["construction.card2.bullets.1"])}</li>
              <li className="truncate" title={fr["construction.card2.bullets.2"]}>{short(fr["construction.card2.bullets.2"])}</li>
              <li className="truncate" title={fr["construction.card2.bullets.3"]}>{short(fr["construction.card2.bullets.3"])}</li>
            </ul>
          </article>

          {/* === CARD 3 === */}
          <article className="min-h-0 overflow-hidden flex flex-row items-start lg:flex-col rounded-xl bg-white/95 shadow-sm border border-sky-100 p-2 md:p-2.5 max-[380px]:p-1.5">
            <div className="min-w-0 flex basis-[42%] md:basis-[40%] lg:basis-auto flex-col gap-1 pr-2 lg:pr-0">
              <FiShield className="shrink-0 text-[18px] md:text-[20px] text-[#009ee0]" />
              <h2 className="text-[clamp(12px,1.4vw,16px)] font-semibold leading-snug text-gray-900 truncate max-[380px]:text-[11px]" title={fr["construction.card3.title"]}>
                {short(fr["construction.card3.title"], 26)}
              </h2>
            </div>
            <div className="w-px bg-sky-100 mx-1 md:mx-1.5 lg:hidden" />
            <ul className="min-w-0 flex-1 grid grid-cols-2 gap-x-2 gap-y-1 text-[clamp(10px,1.2vw,14px)] max-[380px]:text-[9.5px] text-gray-700 leading-tight self-start lg:mt-2">
              <li className="truncate" title={fr["construction.card3.bullets.0"]}>{short(fr["construction.card3.bullets.0"])}</li>
              <li className="truncate" title={fr["construction.card3.bullets.1"]}>{short(fr["construction.card3.bullets.1"])}</li>
              <li className="truncate" title={fr["construction.card3.bullets.2"]}>{short(fr["construction.card3.bullets.2"])}</li>
              <li className="truncate" title={fr["construction.card3.bullets.3"]}>{short(fr["construction.card3.bullets.3"])}</li>
            </ul>
          </article>
        </section>
      </div>
    </main>
  );
}
