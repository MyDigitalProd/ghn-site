import fr from "@/i18n/messages/fr.json";

export const metadata = {
  title: `${fr["construction.title"]} | GHN Group`,
  description: fr["construction.desc"],
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-[#009ee0]">
        {fr["construction.title"]}
      </h1>
      <p className="text-gray-700 text-lg mb-8">{fr["construction.desc"]}</p>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="bg-white/95 rounded-2xl p-6 shadow border border-sky-100">
          <h2 className="text-xl font-semibold mb-3">{fr["construction.card1.title"]}</h2>
          <ul className="space-y-2 text-gray-700">
            <li>{fr["construction.card1.bullets.0"]}</li>
            <li>{fr["construction.card1.bullets.1"]}</li>
            <li>{fr["construction.card1.bullets.2"]}</li>
            <li>{fr["construction.card1.bullets.3"]}</li>
          </ul>
        </article>
        <article className="bg-white/95 rounded-2xl p-6 shadow border border-sky-100">
          <h2 className="text-xl font-semibold mb-3">{fr["construction.card2.title"]}</h2>
          <ul className="space-y-2 text-gray-700">
            <li>{fr["construction.card2.bullets.0"]}</li>
            <li>{fr["construction.card2.bullets.1"]}</li>
            <li>{fr["construction.card2.bullets.2"]}</li>
            <li>{fr["construction.card2.bullets.3"]}</li>
          </ul>
        </article>
        <article className="bg-white/95 rounded-2xl p-6 shadow border border-sky-100">
          <h2 className="text-xl font-semibold mb-3">{fr["construction.card3.title"]}</h2>
          <ul className="space-y-2 text-gray-700">
            <li>{fr["construction.card3.bullets.0"]}</li>
            <li>{fr["construction.card3.bullets.1"]}</li>
            <li>{fr["construction.card3.bullets.2"]}</li>
            <li>{fr["construction.card3.bullets.3"]}</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
