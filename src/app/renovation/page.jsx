// — i18n FR —
// Importe les textes FR utilisés par la page (titres, descriptions, libellés)
import fr from "@/i18n/messages/fr.json";

// — Métadonnées SEO —
// Définit le <title> et la meta description pour la route courante
export const metadata = {
  title: `${fr["renovation.title"]} | GHN Group`, // Titre SEO : clé i18n + marque
  description: fr["renovation.desc"],             // Description SEO depuis i18n
};

// — Page Rénovation —
// Composant de page (app/renovation/page.jsx en App Router)
export default function Page() {
  return (
    // Conteneur principal centré, largeur fluide, padding horizontal responsive, marge verticale
    <main className="mx-auto w-full max-w-6xl px-3 sm:px-6 py-8 md:py-10">
      {/* Titre avec taille adaptée : plus petit en mobile, grand en desktop */}
      <h1 className="text-2xl md:text-5xl font-bold mb-3 md:mb-4 text-[#009ee0]">
        {fr["renovation.title"]} {/* Injecte le titre i18n */}
      </h1>

      {/* Paragraphe d’intro : texte un peu réduit en mobile, confortable en desktop */}
      <p className="text-gray-700 text-base md:text-lg mb-6 md:mb-8">
        {fr["renovation.desc"]} {/* Injecte la description i18n */}
      </p>

      {/* Grille responsive :
          - Mobile : 1 colonne (cards prennent toute la largeur)
          - md+ : 2 colonnes
          - gap plus serré en mobile pour compacter la hauteur
       */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {[
          ["renovation.cards.revetements.title","renovation.cards.revetements.subtitle"],
          ["renovation.cards.fuites.title","renovation.cards.fuites.subtitle"],
          ["renovation.cards.modernisation.title","renovation.cards.modernisation.subtitle"],
          ["renovation.cards.refonte.title","renovation.cards.refonte.subtitle"],
          ["renovation.cards.conformite.title","renovation.cards.conformite.subtitle"],
        ].map(([t, s]) => (
          // Card :
          // - Padding réduit en mobile (p-4) et confortable en md+ (md:p-6)
          // - Rayon adapté (rounded-xl en mobile, rounded-2xl en md+)
          // - Option de hauteur min : active `min-h-[110px]` si tu veux des cards uniformes en mobile
          //   (laisse commenté si tu préfères la hauteur auto selon contenu)
          <article
            key={t}                                  // Clé unique pour React
            className="
              bg-white/95                           /* Fond clair légèrement transparent */
              border border-sky-100                 /* Liseré discret bleu */
              shadow                               /* Ombre douce */
              rounded-xl md:rounded-2xl            /* Coins : plus doux en desktop */
              p-4 md:p-6                           /* Padding : compact en mobile */
              transition-shadow                     /* Transition hover fluide */
              hover:shadow-md                       /* Légère élévation au survol */
              // min-h-[110px]                      /* ← OPTION : décommente pour une hauteur mini mobile */
            "
          >
            {/* Titre de card : plus petit en mobile */}
            <h2 className="text-lg md:text-xl font-semibold mb-1">
              {fr[t]} {/* Injecte le titre i18n de la card */}
            </h2>

            {/* Sous-texte : taille contrôlée, couleur gris lisible */}
            <p className="text-gray-700 text-sm md:text-base">
              {fr[s]} {/* Injecte le sous-titre i18n de la card */}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
