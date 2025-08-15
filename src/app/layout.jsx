import "../styles/tools/_tailwind.css"; // Tailwind v4 d’abord
import "../styles/globals.scss";        // Styles SCSS globaux
import Header from "@/components/Header"; // En-tête global
import Footer from "@/components/Footer"; // Pied de page global

export const metadata = {
  title: "GHN Group — Piscines & Extérieurs d’Exception",
  description: "Construction, rénovation, entretien, hivernage et terrasses.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
