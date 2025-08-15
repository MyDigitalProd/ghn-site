// Import de l'icône Instagram depuis react-icons
import { FaInstagram } from "react-icons/fa";

// Composant Footer, affiché en bas de toutes les pages
export default function Footer() {
  return (
    <footer>
      {/* Bloc 1 : Copyright avec l'année en cours */}
      <p>© 2021–{new Date().getFullYear()}</p>
      
      {/* Bloc 2 : Nom du site */}
      <p>GHN-Pool.</p>
      
      {/* Bloc 3 : Crédit développement + lien Instagram */}
      <p>
        Développement : MyDigitalProd.
        {/* Lien Instagram, ouverture dans un nouvel onglet, sécurisé */}
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram />
        </a>
      </p>
    </footer>
  );
}
