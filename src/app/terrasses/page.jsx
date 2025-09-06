import fr from "@/i18n/messages/fr.json";

export const metadata = {
  title: `${fr["terrasses.title"]} | GHN Group`,
  description: fr["terrasses.desc"],
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-[#009ee0]">
        {fr["terrasses.title"]}
      </h1>
      <p className="text-gray-700 text-lg mb-8">{fr["terrasses.desc"]}</p>

      <section className="grid gap-4 md:grid-cols-2">
        {[
          ["terrasses.cards.conception.title","terrasses.cards.conception.subtitle"],
          ["terrasses.cards.materiaux.title","terrasses.cards.materiaux.subtitle"],
          ["terrasses.cards.amenagement.title","terrasses.cards.amenagement.subtitle"],
          ["terrasses.cards.entretien.title","terrasses.cards.entretien.subtitle"],
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
