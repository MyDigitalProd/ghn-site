"use client";
import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { WHATSAPP_PHONE } from "@/config/site";

export default function InteractiveContact() {
  const { t } = useI18n();
  const [mode, setMode] = useState('email'); // par défaut email
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message || t('contact.whatsapp.prefill') || '')}`;

  const toggleMode = () => {
    setMode(mode === 'whatsapp' ? 'email' : 'whatsapp');
    setError("");
    setSent(false);
  };

  // Envoi du formulaire à l'API backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    setSent(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      });
      if (res.ok) {
        setSent(true);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        const data = await res.json();
        setError(data.error || "Erreur lors de l'envoi. Essayez plus tard.");
      }
    } catch (err) {
      setError("Erreur réseau. Essayez plus tard.");
    }
    setSending(false);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full max-w-2xl mx-auto min-h-screen py-8">
      {/* Texte toujours visible au-dessus */}
      <div className="text-center space-y-4 w-full">
        <h2 className="text-2xl md:text-4xl font-semibold flex items-center justify-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-blue-400" aria-hidden>
            <path fill="currentColor" d="M12 13.065 2.4 6h19.2L12 13.065zM12 15.2 2 8.2V18h20V8.2l-10 7z" />
          </svg>
          {t('contact.title') || 'Contact'}
        </h2>
        <p className="text-gray-700">{t('contact.subtitle') || ''}</p>
      </div>

      {/* Zone interactive (WhatsApp ou Email) */}
      {mode === 'whatsapp' ? (
  <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-lg mx-auto flex flex-col items-center gap-6 animate-scale-in max-h-[80vh] overflow-y-auto">
          <div className="text-center">
            <h3 className="text-xl font-bold text-sky-700 mb-2">{t('contact.whatsapp.title') || 'WhatsApp'}</h3>
            <p className="text-gray-600">{t('contact.whatsapp.subtitle') || ''}</p>
          </div>
          <textarea
            className="w-full rounded-lg border border-gray-200 p-3 mb-4 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-green-300"
            placeholder={t('contact.whatsapp.placeholder') || ''}
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white rounded-2xl px-8 py-4 flex items-center gap-3 text-lg font-bold shadow-lg transition-all duration-200"
            aria-label={t('contact.whatsapp.aria') || 'Ouvrir WhatsApp'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5" aria-hidden>
              <path fill="currentColor" d="M16 3C9.383 3 4 8.383 4 15a11.9 11.9 0 0 0 1.627 6.036L4 29l8.227-1.585A12.93 12.93 0 0 0 16 27c6.617 0 12-5.383 12-12S22.617 3 16 3z" />
            </svg>
            {t('contact.whatsapp.cta') || 'Démarrer la discussion'}
          </a>
          <button
            onClick={toggleMode}
            className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2"
            aria-label={t('contact.toEmail.aria') || 'Basculer vers email'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
              <path fill="currentColor" d="M12 13.065 2.4 6h19.2L12 13.065zM12 15.2 2 8.2V18h20V8.2l-10 7z" />
            </svg>
            {t('contact.toEmail.text') || 'Préférez-vous envoyer un email ?'}
          </button>
        </div>
      ) : (
  <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-lg mx-auto flex flex-col items-center gap-6 animate-scale-in max-h-[80vh] overflow-y-auto">
          <div className="text-center">
            <h3 className="text-xl font-bold text-sky-700 mb-2">{t('contact.email.title') || 'Email'}</h3>
            <p className="text-gray-600">{t('contact.email.subtitle') || ''}</p>
          </div>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <input
              className="w-full rounded-lg border border-gray-200 p-3"
              placeholder={t('contact.email.name') || 'Votre nom'}
              value={name}
              onChange={e => setName(e.target.value)}
              required
              aria-label={t('contact.email.name') || 'Votre nom'}
            />
            <input
              className="w-full rounded-lg border border-gray-200 p-3"
              placeholder={t('contact.email.email') || 'Votre email'}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              aria-label={t('contact.email.email') || 'Votre email'}
            />
            <textarea
              className="w-full rounded-lg border border-gray-200 p-3 min-h-[100px]"
              placeholder={t('contact.email.message') || 'Votre message'}
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
              aria-label={t('contact.email.message') || 'Votre message'}
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-8 py-4 flex items-center gap-3 text-lg font-bold shadow-lg transition-all duration-200 disabled:opacity-60"
              disabled={sending}
              aria-label={t('contact.email.cta.aria') || "Envoyer"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
                <path fill="currentColor" d="M12 13.065 2.4 6h19.2L12 13.065zM12 15.2 2 8.2V18h20V8.2l-10 7z" />
              </svg>
              {sending ? (t('contact.email.sending') || 'Envoi...') : (t('contact.email.cta') || 'Envoyer')}
            </button>
            {sent && <div className="text-green-600 font-semibold">{t('contact.email.sent') || 'Message envoyé !'}</div>}
            {error && <div className="text-red-500 font-semibold">{error}</div>}
          </form>
          <button
            onClick={toggleMode}
            className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-6 py-3 flex items-center gap-2 font-bold shadow-md transition-all duration-200"
            aria-label={t('contact.toWhatsApp.aria') || 'Basculer vers WhatsApp'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-4 h-4" aria-hidden>
              <path fill="currentColor" d="M16 3C9.383 3 4 8.383 4 15a11.9 11.9 0 0 0 1.627 6.036L4 29l8.227-1.585A12.93 12.93 0 0 0 16 27c6.617 0 12-5.383 12-12S22.617 3 16 3z" />
            </svg>
            {t('contact.toWhatsApp.text') || 'Revenir à WhatsApp'}
          </button>
        </div>
      )}

      <style jsx global>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
