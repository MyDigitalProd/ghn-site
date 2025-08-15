import '../styles/tools/_tailwind.css'; // Tailwind v4 d’abord
import '../styles/globals.scss';        // puis ton SCSS
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import '@/styles/globals.scss'
export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Header/>
        <main>
        {children}
        </main>
        
        <Footer/>
      </body>
    </html>
  );
}
