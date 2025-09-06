import fr from "@/i18n/messages/fr.json";

export const metadata = {
  title: `${fr["section.realisations.title"]} | GHN Group`,
  description: fr["section.realisations.desc"],
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-[#009ee0]">
        {fr["section.realisations.title"]}
      </h1>
      <p className="text-gray-700 text-lg mb-8">{fr["section.realisations.desc"]}</p>
      {/* Ici on pourrait réutiliser le carrousel si besoin */}
    </main>
  );
}
