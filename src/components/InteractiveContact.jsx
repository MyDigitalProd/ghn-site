"use client"; // 👉 Composant côté client (hooks, DOM, framer)
import { useState, useRef } from "react"; // 👉 Hooks React
import { useI18n } from "@/i18n/I18nProvider"; // 👉 i18n (traductions)
import { FaWhatsapp } from "react-icons/fa"; // 👉 Icône WhatsApp
import { WHATSAPP_PHONE } from "@/config/site"; // 👉 Téléphone préconfiguré
import { AnimatePresence, m } from "framer-motion"; // 👉 Animations (alias m)

export default function InteractiveContact() {
  const { t } = useI18n(); // 👉 Traduction t(key)
  const [mode, setMode] = useState("email"); // 👉 Onglet actif: "email" | "whatsapp"
  const [name, setName] = useState(""); // 👉 Champ nom
  const [email, setEmail] = useState(""); // 👉 Champ email
  const [message, setMessage] = useState(""); // 👉 Champ message
  const [sending, setSending] = useState(false); // 👉 Envoi en cours ?
  const [sent, setSent] = useState(false); // 👉 Message envoyé ?
  const [error, setError] = useState(""); // 👉 Erreur affichée
  const lastSendRef = useRef(0); // 👉 Anti-spam simple côté client (intervalle min)

  // 🔐 Honeypot anti-bot (champ caché, doit rester vide)
  const [hp, setHp] = useState(""); // 👉 Si rempli → bot probable

  // 🔗 Lien WhatsApp dynamique (pré-remplissage du message)
  const whatsappUrl = `https://wa.me/${encodeURIComponent(
    WHATSAPP_PHONE || ""
  )}?text=${encodeURIComponent(message || t("contact.whatsapp.prefill") || "")}`;

  // 🧰 Helper: encodage "application/x-www-form-urlencoded" pour PHP
  const toFormBody = (obj) =>
    Object.entries(obj)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v ?? "")}`)
      .join("&");

  // 📤 Envoi email → POST vers /contact.php (hébergé Easyhost)
  const handleSubmit = async (e) => {
    e.preventDefault(); // ❌ Empêche rechargement
    setError(""); // 🧹 Nettoie l’erreur
    setSent(false); // 🧹 Reset succès

    // ⛔ Anti-bot: honeypot rempli → on stoppe
    if (hp.trim() !== "") {
      setError("Bot détecté.");
      return;
    }

    // ⛔ Anti-spam simple: 8s entre 2 envois
    const now = Date.now();
    if (now - lastSendRef.current < 8000) {
      setError(t("contact.email.tooFast") || "Veuillez patienter quelques secondes.");
      return;
    }
    lastSendRef.current = now; // 🕒 Mémorise le dernier envoi

    // ⛔ Validation minimale côté client
    if (!name || !email || !message) {
      setError(t("contact.email.missing") || "Veuillez remplir tous les champs.");
      return;
    }

    setSending(true); // 🚀 Démarre l’envoi

    try {
      // 📬 Appel PHP (Brevo) avec form-urlencoded (compatible mutualisé)
      const res = await fetch("/contact.php", {
        method: "POST", // 🔁 POST HTTP
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8", // 🧾 Encodage simple
        },
        body: toFormBody({
          name,
          email,
          message,
          // ⚠️ le backend doit ignorer ce champ ; si rempli = bot
          website: hp,
        }),
      });

      if (res.ok) {
        // ✅ Succès (PHP renvoie 302 ou 200)
        setSent(true); // 🎉 Affiche succès
        setName(""); // 🧹 Reset champs
        setEmail("");
        setMessage("");
      } else {
        // ❌ Erreur côté PHP/Brevo
        const txt = await res.text().catch(() => "");
        setError(
          (t("contact.email.error") || "Erreur lors de l'envoi.") +
            (txt ? ` (${txt.slice(0, 120)}...)` : "")
        );
      }
    } catch {
      // 🌐 Erreur réseau
      setError(t("contact.email.network") || "Erreur réseau. Réessayez plus tard.");
    } finally {
      setSending(false); // ⏹️ Fin
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full max-w-2xl mx-auto h-full py-4">
      {/* 🧾 En-tête */}
      <div className="text-center space-y-4 w-full">
        <h2 className="text-2xl md:text-4xl font-semibold flex items-center justify-center gap-3">
          {/* ✉️ Petite icône inline (SVG) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-6 h-6 text-blue-400"
            aria-hidden
          >
            <path
              fill="currentColor"
              d="M12 13.065 2.4 6h19.2L12 13.065zM12 15.2 2 8.2V18h20V8.2l-10 7z"
            />
          </svg>
          {t("contact.title") || "Contact"}
        </h2>
        <p className="text-gray-700">{t("contact.subtitle") || ""}</p>
      </div>

      {/* 🗂️ Onglets */}
      <div className="flex w-full max-w-lg bg-gray-100 rounded-xl overflow-hidden shadow-md">
        <button
          onClick={() => setMode("email")} // 🔁 Switch onglet
          className={`flex-1 px-4 py-3 text-center font-semibold transition ${
            mode === "email"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          type="button" // ✅ Évite submit si dans un form
        >
          {t("contact.email.title") || "Email"}
        </button>
        <button
          onClick={() => setMode("whatsapp")} // 🔁 Switch onglet
          className={`flex-1 px-4 py-3 text-center font-semibold transition ${
            mode === "whatsapp"
              ? "bg-green-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          type="button" // ✅ Sécurité
        >
          WhatsApp
        </button>
      </div>

      {/* 🧩 Contenu animé (container relative pour boutons “bottom fixed”) */}
      <div className="relative w-full max-w-lg">
        <AnimatePresence mode="wait">
          {mode === "whatsapp" ? (
            // 🟢 PANE WHATSAPP
            <m.div
              key="whatsapp" // 🔑 Clé d’animation
              initial={{ opacity: 0, x: 50 }} // 🎬 Entrée
              animate={{ opacity: 1, x: 0 }} // 🎞️ Anim
              exit={{ opacity: 0, x: -50 }} // 📴 Sortie
              transition={{ duration: 0.3 }} // ⏱️ Vitesse
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 w-full flex flex-col gap-6 max-h-[70vh] overflow-y-auto pb-28 relative" // 📐 relative pour bouton bas
            >
              {/* 🧭 Titre + sous-titre */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-sky-700 mb-2">
                  {t("contact.whatsapp.title") || "WhatsApp"}
                </h3>
                <p className="text-gray-600">
                  {t("contact.whatsapp.subtitle") || ""}
                </p>
              </div>

              {/* 📝 Zone de message à pré-remplir */}
              <textarea
                className="w-full rounded-lg border border-gray-200 p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-green-300"
                placeholder={t("contact.whatsapp.placeholder") || ""}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={2000} // 🔒 Limite raisonnable
              />

              {/* 📎 Bouton en bas (absolu dans ce pane) */}
              <div className="absolute bottom-4 left-0 w-full px-6">
                <a
                  href={whatsappUrl} // 🔗 Vers WhatsApp
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white rounded-2xl px-8 py-4 flex items-center justify-center gap-3 text-lg font-bold shadow-lg transition-all duration-200 w-full"
                  aria-label={t("contact.whatsapp.aria") || "Ouvrir WhatsApp"}
                >
                  <FaWhatsapp className="w-7 h-7" aria-hidden />
                  {t("contact.whatsapp.cta") || "Démarrer la discussion"}
                </a>
              </div>
            </m.div>
          ) : (
            // 🔵 PANE EMAIL
            <m.div
              key="email" // 🔑 Clé d’animation
              initial={{ opacity: 0, x: -50 }} // 🎬 Entrée
              animate={{ opacity: 1, x: 0 }} // 🎞️ Anim
              exit={{ opacity: 0, x: 50 }} // 📴 Sortie
              transition={{ duration: 0.3 }} // ⏱️ Vitesse
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 w-full flex flex-col gap-6 max-h-[70vh] overflow-y-auto pb-28 relative" // 📐 relative pour bouton bas
            >
              {/* 🧭 Titre + sous-titre */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-sky-700 mb-2">
                  {t("contact.email.title") || "Email"}
                </h3>
                <p className="text-gray-600">
                  {t("contact.email.subtitle") || ""}
                </p>
              </div>

              {/* ✉️ Formulaire contrôlé → POST /contact.php (static friendly) */}
              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                {/* 🔐 Honeypot caché (bots le remplissent souvent) */}
                <input
                  type="text"
                  name="website"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* 👤 Nom */}
                <input
                  className="w-full rounded-lg border border-gray-200 p-3"
                  placeholder={t("contact.email.name") || "Votre nom"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={120} // 🔒 Longueur max
                />

                {/* 📧 Email */}
                <input
                  className="w-full rounded-lg border border-gray-200 p-3"
                  placeholder={t("contact.email.email") || "Votre email"}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  inputMode="email" // 🧭 Mobile keyboard
                  maxLength={160}
                />

                {/* 📝 Message */}
                <textarea
                  className="w-full rounded-lg border border-gray-200 p-3 min-h-[100px]"
                  placeholder={t("contact.email.message") || "Votre message"}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  maxLength={2000}
                />

                {/* ✅ Feedback */}
                {sent && (
                  <div className="text-green-600 font-semibold">
                    {t("contact.email.sent") || "Message envoyé !"}
                  </div>
                )}
                {error && (
                  <div className="text-red-500 font-semibold">{error}</div>
                )}

                {/* 🔘 Bouton en bas (absolu dans ce pane) */}
                <div className="absolute bottom-4 left-0 w-full px-6">
                  <button
                    type="submit" // 🚀 Submit
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-8 py-4 flex items-center justify-center gap-3 text-lg font-bold shadow-lg transition-all duration-200 w-full disabled:opacity-60"
                    disabled={sending}
                    aria-busy={sending || undefined} // ♿ A11y busy
                  >
                    {sending
                      ? t("contact.email.sending") || "Envoi..."
                      : t("contact.email.cta") || "Envoyer"}
                  </button>
                </div>
              </form>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
