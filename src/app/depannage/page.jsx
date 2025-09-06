import fr from "@/i18n/messages/fr.json";

export const metadata = {
  title: `${fr["depannage.title"]} | GHN Group`,
  description: fr["depannage.desc"],
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-[#009ee0]">
        {fr["depannage.title"]}
      </h1>
      <p className="text-gray-700 text-lg mb-8">{fr["depannage.desc"]}</p>

      <section className="grid gap-4 md:grid-cols-2">
        {[
          ["depannage.cards.intervention.title","depannage.cards.intervention.subtitle"],
          ["depannage.cards.diagnostic.title","depannage.cards.diagnostic.subtitle"],
          ["depannage.cards.reparations.title","depannage.cards.reparations.subtitle"],
          ["depannage.cards.suivi.title","depannage.cards.suivi.subtitle"],
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
