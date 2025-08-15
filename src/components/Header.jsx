// src/components/Header.jsx
// Composant Header, optimisé pour séparer structure et navigation

import NavBar from './NavBar'; // Import du composant NavBar (chemin correct)

export default function Header() {
  return (
    <header>
      {/* Logo ou bannière éventuelle à ajouter ici si besoin */}
      <NavBar /> {/* Navigation importée et rendue à la bonne place */}
    </header>
  );
}
