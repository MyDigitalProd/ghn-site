// src/app/page.jsx
// One Page GHN – sections ancrées + classes Tailwind prêtes à l’emploi
// Les classes "reveal-section" servent de hook à ta NavBar/scrollspy pour l’anim d’apparition.
// Contenu textuel adapté de ton doc "cite ghn.docx" :contentReference[oaicite:1]{index=1}

export default function Page() { // Export par défaut du composant de page
  return ( // Retourne l’arborescence JSX
    <main className="w-full scroll-smooth" /* Conteneur principal, largeur pleine, scroll fluide */>
      {/* ====== ACCUEIL ====== */}
      <section
        id="accueil" /* Ancre pour la NavBar */
        className="min-h-screen flex items-center bg-white px-4 py-20 reveal-section" /* Pleine hauteur écran + centrage vertical + padding + hook anim */
      >
        <div className="max-w-7xl mx-auto w-full grid gap-6 md:grid-cols-2" /* Grille responsive 2 colonnes dès md */>
          <div className="flex flex-col justify-center" /* Colonne texte, verticalement centrée */>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight" /* Titre accrocheur responsive */>
              GHN Group – Piscines & Extérieurs d’Exception {/* Titre accueil */}
            </h1>
            <p className="mt-4 text-base md:text-lg text-gray-700" /* Paragraphe d’intro */>
              Imaginez la piscine idéale, parfaitement intégrée à votre jardin. Projets sur mesure, du bassin familial au couloir de nage, en passant par la piscine miroir. {/* Intro inspirée de la section Construction :contentReference[oaicite:2]{index=2} */}
            </p>
            <ul className="mt-6 space-y-2 text-gray-700" /* Liste de points clés */>
              <li>Étude de faisabilité sur site</li> {/* Point clé – étude sur terrain :contentReference[oaicite:3]{index=3} */}
              <li>Accompagnement administratif</li> {/* Point clé – démarches :contentReference[oaicite:4]{index=4} */}
              <li>Matériaux haut de gamme & finitions soignées</li> {/* Point clé – qualité :contentReference[oaicite:5]{index=5} */}
            </ul>
          </div>
          <div className="aspect-[4/3] bg-gray-100 rounded-xl" /* Placeholder visuel (carousel/image) */>
            {/* 👉 Place ici ton carousel d’images (déjà prévu) */}
          </div>
        </div>
      </section>

      {/* ====== CONSTRUCTION ====== */}
      <section
        id="construction" /* Ancre pour la NavBar */
        className="min-h-screen flex items-center bg-gray-50 px-4 py-20 reveal-section" /* Style alterné + hook anim */
      >
        <div className="max-w-5xl mx-auto w-full" /* Conteneur centré */>
          <h2 className="text-2xl md:text-4xl font-semibold" /* Titre section */>
            Construction de Piscine : Étapes & Conseils {/* Titre conforme au doc :contentReference[oaicite:6]{index=6} */}
          </h2>
          <p className="mt-4 text-gray-700" /* Paragraphe vision */>
            Créer un équilibre parfait entre votre jardin et votre piscine. Chaque projet est unique et conçu sur mesure : formes variées, débordement, couloir de nage, piscine miroir. {/* Synthèse du paragraphe "Imaginez la piscine idéale" :contentReference[oaicite:7]{index=7} */}
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2" /* Deux colonnes d’infos */>
            <div className="p-6 rounded-xl bg-white shadow-sm" /* Carte 1 – Étude */>
              <h3 className="text-xl font-medium">Étude de faisabilité</h3> {/* Sous-titre */}
              <p className="mt-2 text-gray-700" /* Détail */>
                Analyse du terrain, implantation optimale, gestion des contraintes (pente, roche, accès). Accompagnement sur les démarches locales. {/* D’après "Étude de Faisabilité" :contentReference[oaicite:8]{index=8} */}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white shadow-sm" /* Carte 2 – Étapes */>
              <h3 className="text-xl font-medium">Étapes de construction</h3> {/* Sous-titre */}
              <p className="mt-2 text-gray-700" /* Détail */>
                Terrassement, structure, filtration & équipements, margelles et revêtements. Aménagement paysager pour un ensemble harmonieux. {/* D’après "Étapes de Construction" :contentReference[oaicite:9]{index=9} */}
              </p>
            </div>
          </div>
          <div className="mt-8 p-6 rounded-xl bg-white shadow-sm" /* Bloc – Projet perso */>
            <h3 className="text-xl font-medium">Un projet personnalisé</h3> {/* Sous-titre */}
            <p className="mt-2 text-gray-700" /* Détail */>
              Esthétique, facilité d’usage, confort : matériaux haut de gamme, éclairage atmosphérique, optimisation de l’ensoleillement, plages spacieuses et accès fluides. {/* D’après "Un Projet Personnalisé..." :contentReference[oaicite:10]{index=10} */}
            </p>
          </div>
        </div>
      </section>

      {/* ====== RÉNOVATION ====== */}
      <section
        id="renovation" /* Ancre */
        className="min-h-screen flex items-center bg-white px-4 py-20 reveal-section" /* Style alterné + hook anim */
      >
        <div className="max-w-5xl mx-auto w-full" /* Conteneur */>
          <h2 className="text-2xl md:text-4xl font-semibold" /* Titre */>
            Rénovation de Piscine {/* Titre doc :contentReference[oaicite:11]{index=11} */}
          </h2>
          <p className="mt-4 text-gray-700" /* Intro */>
            Rafraîchissement partiel ou transformation complète : nous redonnons vie à votre bassin avec des solutions durables et esthétiques. {/* Synthèse intro rénovation :contentReference[oaicite:12]{index=12} */}
          </p>
          <ul className="mt-6 grid gap-3 md:grid-cols-2 text-gray-700" /* Liste des services en grille */>
            <li>Remplacement de revêtements (liner, carrelage, PVC armé)</li> {/* Service :contentReference[oaicite:13]{index=13} */}
            <li>Réparation de fuites & étanchéité</li> {/* Service :contentReference[oaicite:14]{index=14} */}
            <li>Modernisation (filtration, LED, chauffage, domotique)</li> {/* Service :contentReference[oaicite:15]{index=15} */}
            <li>Refonte du bassin (forme, profondeur, accès)</li> {/* Service :contentReference[oaicite:16]{index=16} */}
            <li>Mise en conformité sécurité</li> {/* Service :contentReference[oaicite:17]{index=17} */}
          </ul>
        </div>
      </section>

      {/* ====== DÉPANNAGE ====== */}
      <section
        id="depannage" /* Ancre */
        className="min-h-screen flex items-center bg-gray-50 px-4 py-20 reveal-section" /* Style alterné + hook anim */
      >
        <div className="max-w-5xl mx-auto w-full" /* Conteneur */>
          <h2 className="text-2xl md:text-4xl font-semibold">Dépannage Piscine</h2> {/* Titre */}
          <p className="mt-4 text-gray-700" /* Intro */>
            Une panne ne prévient jamais. Intervention rapide, diagnostic précis, réparations efficaces pour retrouver votre tranquillité. {/* Intro dépann. :contentReference[oaicite:18]{index=18} */}
          </p>
          <ul className="mt-6 space-y-2 text-gray-700" /* Liste engagements */>
            <li>Intervention rapide</li> {/* Engagement :contentReference[oaicite:19]{index=19} */}
            <li>Diagnostic & solutions sur mesure</li> {/* Engagement :contentReference[oaicite:20]{index=20} */}
            <li>Réparations : filtration, fuites, pompes, éclairage, etc.</li> {/* Engagement :contentReference[oaicite:21]{index=21} */}
            <li>Suivi & conseils pour éviter les récidives</li> {/* Engagement :contentReference[oaicite:22]{index=22} */}
          </ul>
        </div>
      </section>

      {/* ====== HIVERNAGE (OUVERTURE / FERMETURE) ====== */}
      <section
        id="hivernage" /* Ancre */
        className="min-h-screen flex items-center bg-white px-4 py-20 reveal-section" /* Style alterné + hook anim */
      >
        <div className="max-w-5xl mx-auto w-full" /* Conteneur */>
          <h2 className="text-2xl md:text-4xl font-semibold">Ouverture & Fermeture – Hivernage</h2> {/* Titre */}
          <p className="mt-4 text-gray-700" /* Intro */>
            L’hivernage protège votre bassin, vos équipements, et facilite la remise en service au printemps. {/* Résumé utilité :contentReference[oaicite:23]{index=23} */}
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-2" /* Deux colonnes infos */>
            <div className="p-6 rounded-xl bg-gray-50" /* Colonne gauche */>
              <h3 className="text-lg font-medium">Types d’hivernage</h3> {/* Sous-titre */}
              <ul className="mt-2 list-disc pl-5 text-gray-700" /* Liste */>
                <li>Passif : arrêt complet de la filtration</li> {/* Doc :contentReference[oaicite:24]{index=24} */}
                <li>Actif : filtration réduite quelques heures/jour</li> {/* Doc :contentReference[oaicite:25]{index=25} */}
              </ul>
              <h3 className="mt-4 text-lg font-medium">Pourquoi hiverner ?</h3> {/* Sous-titre */}
              <ul className="mt-2 list-disc pl-5 text-gray-700" /* Liste */>
                <li>Protéger le matériel (gel, intempéries)</li> {/* Doc :contentReference[oaicite:26]{index=26} */}
                <li>Éviter l’eau verte au printemps</li> {/* Doc :contentReference[oaicite:27]{index=27} */}
                <li>Réduire les coûts d’entretien</li> {/* Doc :contentReference[oaicite:28]{index=28} */}
                <li>Préserver la structure du bassin</li> {/* Doc :contentReference[oaicite:29]{index=29} */}
              </ul>
            </div>
            <div className="p-6 rounded-xl bg-gray-50" /* Colonne droite */>
              <h3 className="text-lg font-medium">Étapes clés</h3> {/* Sous-titre */}
              <ul className="mt-2 list-disc pl-5 text-gray-700" /* Liste */>
                <li>Nettoyage & équilibrage de l’eau</li> {/* Étape :contentReference[oaicite:30]{index=30} */}
                <li>Baisse du niveau (passif)</li> {/* Étape :contentReference[oaicite:31]{index=31} */}
                <li>Protection des équipements</li> {/* Étape :contentReference[oaicite:32]{index=32} */}
                <li>Pose d’une bâche adaptée</li> {/* Étape :contentReference[oaicite:33]{index=33} */}
              </ul>
              <p className="mt-4 text-gray-700" /* Appel pro */>
                Intervention rapide & soignée, produits pros, tranquillité d’esprit tout l’hiver. {/* Avantages pro :contentReference[oaicite:34]{index=34} */}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== ENTRETIEN (CONTRATS) ====== */}
      <section
        id="entretien" /* Ancre */
        className="min-h-screen flex items-center bg-gray-50 px-4 py-20 reveal-section" /* Style alterné + hook anim */
      >
        <div className="max-w-5xl mx-auto w-full" /* Conteneur */>
          <h2 className="text-2xl md:text-4xl font-semibold">Contrats d’Entretien</h2> {/* Titre */}
          <p className="mt-4 text-gray-700" /* Intro */>
            Choisissez le niveau de service adapté : essentiel, confort ou premium. {/* Intro contrats :contentReference[oaicite:35]{index=35} */}
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3" /* 3 cartes forfaits */>
            <div className="p-6 rounded-xl bg-white shadow-sm" /* Forfait Essentiel */>
              <h3 className="text-xl font-medium">Essentiel</h3> {/* Nom forfait */}
              <p className="mt-1 text-sm text-gray-500">1× / mois</p> {/* Fréquence */}
              <ul className="mt-3 space-y-1 text-gray-700" /* Services */>
                <li>Analyse eau (pH, chlore)</li> {/* Service :contentReference[oaicite:36]{index=36} */}
                <li>Ajustement produits</li> {/* Service :contentReference[oaicite:37]{index=37} */}
                <li>Nettoyage de surface</li> {/* Service :contentReference[oaicite:38]{index=38} */}
                <li>Vérification filtration & niveau</li> {/* Service :contentReference[oaicite:39]{index=39} */}
              </ul>
            </div>
            <div className="p-6 rounded-xl bg-white shadow-sm" /* Forfait Confort */>
              <h3 className="text-xl font-medium">Confort</h3> {/* Nom forfait */}
              <p className="mt-1 text-sm text-gray-500">2× / mois</p> {/* Fréquence */}
              <ul className="mt-3 space-y-1 text-gray-700" /* Services */>
                <li>Analyse approfondie (produits inclus)</li> {/* Service :contentReference[oaicite:40]{index=40} */}
                <li>Nettoyage complet (fond, parois, skimmers)</li> {/* Service :contentReference[oaicite:41]{index=41} */}
                <li>Résolution de petits problèmes</li> {/* Service :contentReference[oaicite:42]{index=42} */}
                <li>Entretien filtration (lavage/remplacement)</li> {/* Service :contentReference[oaicite:43]{index=43} */}
              </ul>
            </div>
            <div className="p-6 rounded-xl bg-white shadow-sm" /* Forfait Premium */>
              <h3 className="text-xl font-medium">Premium</h3> {/* Nom forfait */}
              <p className="mt-1 text-sm text-gray-500">Chaque semaine</p> {/* Fréquence */}
              <ul className="mt-3 space-y-1 text-gray-700" /* Services */>
                <li>Équilibrage pro (produits inclus)</li> {/* Service :contentReference[oaicite:44]{index=44} */}
                <li>Nettoyage intégral</li> {/* Service :contentReference[oaicite:45]{index=45} */}
                <li>Contrôle technique complet</li> {/* Service :contentReference[oaicite:46]{index=46} */}
                <li>Détection proactive & petites réparations</li> {/* Service :contentReference[oaicite:47]{index=47} */}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ====== TERRASSES ====== */}
      <section
        id="terrasses" /* Ancre */
        className="min-h-screen flex items-center bg-white px-4 py-20 reveal-section" /* Style alterné + hook anim */
      >
        <div className="max-w-5xl mx-auto w-full" /* Conteneur */>
          <h2 className="text-2xl md:text-4xl font-semibold">Terrasses & Rénovation</h2> {/* Titre */}
          <p className="mt-4 text-gray-700" /* Intro */>
            Votre terrasse est une extension de votre maison : lieu de vie, détente et convivialité. Neuf ou rénovation, nous allions expérience, réactivité et passion. {/* Synthèse terrasse :contentReference[oaicite:48]{index=48} */}
          </p>
          <ul className="mt-6 grid gap-3 md:grid-cols-2 text-gray-700" /* Liste valeurs */>
            <li>Travail soigné et durable</li> {/* Valeur :contentReference[oaicite:49]{index=49} */}
            <li>Matériaux de qualité professionnelle</li> {/* Valeur :contentReference[oaicite:50]{index=50} */}
            <li>Écoute attentive de vos envies</li> {/* Valeur :contentReference[oaicite:51]{index=51} */}
            <li>Finitions irréprochables</li> {/* Valeur :contentReference[oaicite:52]{index=52} */}
          </ul>
          <p className="mt-6 text-gray-700" /* Accroche */>
            Béton moderne, bois chaleureux, pierre naturelle élégante : une intégration parfaite à votre extérieur, selon vos goûts et votre budget. {/* D’après "Pourquoi choisir GHNgroup ?" :contentReference[oaicite:53]{index=53} */}
          </p>
        </div>
      </section>

      {/* ====== CONTACT ====== */}
      <section
        id="contact" /* Ancre */
        className="min-h-screen flex items-center bg-gray-50 px-4 py-20 reveal-section" /* Style alterné + hook anim */
      >
        <div className="max-w-3xl mx-auto w-full" /* Conteneur étroit pour le formulaire */>
          <h2 className="text-2xl md:text-4xl font-semibold">Contact</h2> {/* Titre */}
          <p className="mt-4 text-gray-700" /* Intro */>
            Expliquez-nous votre projet (piscine, terrasse, rénovation). Nous revenons vers vous rapidement. {/* Pitch contact */}
          </p>
          <form className="mt-8 grid gap-4" /* Formulaire simple (placeholder, prêt à brancher) */>
            <input className="border rounded-lg px-4 py-3 w-full" placeholder="Nom" /> {/* Champ nom */}
            <input className="border rounded-lg px-4 py-3 w-full" placeholder="Email" type="email" /> {/* Champ email */}
            <input className="border rounded-lg px-4 py-3 w-full" placeholder="Téléphone" /> {/* Champ tel */}
            <textarea className="border rounded-lg px-4 py-3 w-full min-h-[140px]" placeholder="Votre message" /> {/* Champ message */}
            <button className="rounded-lg px-5 py-3 bg-black text-white hover:opacity-90 transition" type="button" /* Bouton (à connecter) */>
              Envoyer {/* Libellé bouton */}
            </button>
          </form>
          {/* 👉 Tu peux brancher ce form sur Firestore / email plus tard. */}
        </div>
      </section>
    </main>
  )
}
