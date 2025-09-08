// Icônes inline pour éviter de charger react-icons globalement

// Composant Footer, affiché en bas de toutes les pages
export default function Footer() {
  return (
    <footer style={{ position: 'relative' }}>
      {/* Flèche pour réduire le footer */}
      <button
        type="button"
        aria-label="Réduire le footer"
        title="Réduire le footer"
        className="absolute left-1/2 -translate-x-1/2 -top-5 bg-white/80 rounded-full shadow p-1 z-10 hover:bg-sky-100 transition-colors"
        onClick={() => document.dispatchEvent(new CustomEvent('hideFooter'))}
        style={{ cursor: 'pointer' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="#0ea5e9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {/* Bloc 1 : Copyright avec l'année en cours */}
      <p>© 2021–{new Date().getFullYear()}</p>
      {/* Bloc 2 : Nom du site */}
      <p>GHN-Pool.</p>
      {/* Bloc 3 : Crédit développement + lien Instagram */}
      <p>
        Développement : MyDigitalProd.
        <a
          href="https://www.instagram.com/mydigitalprod"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram MyDigitalProd"
          title="Instagram MyDigitalProd"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path fill="currentColor" d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm12 1.5a1 1 0 110 2 1 1 0 010-2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z"/>
          </svg>
        </a>
        {" "}
        <a
          href="https://wa.me/32456833300"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp MyDigitalProd"
          title="WhatsApp MyDigitalProd"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="18" height="18" aria-hidden>
            <path fill="currentColor" d="M16 3C9.383 3 4 8.383 4 15a11.9 11.9 0 0 0 1.627 6.036L4 29l8.227-1.585A12.93 12.93 0 0 0 16 27c6.617 0 12-5.383 12-12S22.617 3 16 3z" />
          </svg>
        </a>
      </p>
    </footer>
  );
}
