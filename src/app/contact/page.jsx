import fr from "@/i18n/messages/fr.json";

export const metadata = {
  title: `${fr["contact.title"]} | GHN Group`,
  description: fr["contact.subtitle"],
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-[#009ee0]">
        {fr["contact.title"]}
      </h1>
      <p className="text-gray-700 text-lg mb-8">{fr["contact.subtitle"]}</p>
    </main>
  );
}
