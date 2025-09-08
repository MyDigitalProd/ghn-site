import "../styles/tools/_tailwind.css"; // Tailwind v4 d’abord
import "../styles/globals.scss";        // Styles SCSS globaux
import Header from "@/components/Header"; // En-tête global
import Footer from "@/components/Footer"; // Pied de page global
import RealisticWaveEffect from "@/components/RealisticWaveEffect"; // Vague globale fixe
import { SectionProvider } from "@/components/SectionProvider";
import { I18nProvider } from "@/i18n/I18nProvider";

export const metadata = {
  title: "GHN Group — Piscines & Extérieurs d’Exception",
  description: "Construction, rénovation, entretien, hivernage et terrasses.",
  alternates: {
    languages: {
      "fr": "/?lang=fr",
      "nl": "/?lang=nl",
      "en": "/?lang=en",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <I18nProvider>
        {/* Fond global fixe: dégradé + vague discrète en haut */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50" />
          <div className="absolute top-0 inset-x-0 h-[90px]">
            <RealisticWaveEffect
              height={110}
              amplitude={11}
              frequency={0.009}
              speed={0.015

              }
              color="#009ee0"
              opacity={0.9}
              layers={8}
            />
          </div>
        </div>
          <SectionProvider>
            <Header />
            <main className="relative min-h-screen overflow-hidden" style={{ height: '100dvh' }}>
              {children}
            </main>
            <Footer />
          </SectionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
