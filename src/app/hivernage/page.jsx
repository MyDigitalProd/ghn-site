import fr from "@/i18n/messages/fr.json";

export const metadata = {
  title: `${fr["hivernage.title"]} | GHN Group`,
  description: fr["hivernage.desc"],
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-[#009ee0]">
        {fr["hivernage.title"]}
      </h1>
      <p className="text-gray-700 text-lg mb-8">{fr["hivernage.desc"]}</p>

      <section className="grid gap-4 md:grid-cols-2">
        {[
          ["hivernage.cards.protection.title","hivernage.cards.protection.subtitle"],
          ["hivernage.cards.traitement.title","hivernage.cards.traitement.subtitle"],
          ["hivernage.cards.equipements.title","hivernage.cards.equipements.subtitle"],
          ["hivernage.cards.couverture.title","hivernage.cards.couverture.subtitle"],
          ["hivernage.cards.remise.title","hivernage.cards.remise.subtitle"],
        ].map(([t,s]) => (
          <article key={t} className="bg-white/95 rounded-2xl p-6 shadow border border-sky-100">
            <h2 className="text-xl font-semibold">{fr[t]}</h2>
            <p className="text-gray-700">{fr[s]}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
