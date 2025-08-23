"use client";
import { useState } from "react";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";

export default function InteractiveContact() {
  const [mode, setMode] = useState('whatsapp'); // 'whatsapp' ou 'email'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const phone = "33612345678"; // Numéro WhatsApp admin
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message || "Bonjour, je souhaite un devis pour une piscine !")}`;

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
          <FaEnvelope className="text-blue-400" /> Contact
        </h2>
        <p className="text-gray-700">
          Expliquez-nous votre projet de piscine, rénovation ou terrasse.
          Nous revenons vers vous rapidement avec une solution sur mesure.
        </p>
      </div>

      {/* Zone interactive (WhatsApp ou Email) */}
      {mode === 'whatsapp' ? (
  <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-lg mx-auto flex flex-col items-center gap-6 animate-scale-in max-h-[80vh] overflow-y-auto">
          <div className="text-center">
            <h3 className="text-xl font-bold text-sky-700 mb-2">Contactez-nous directement sur WhatsApp</h3>
            <p className="text-gray-600">Pour un devis rapide avec un de nos professionnels !</p>
          </div>
          <textarea
            className="w-full rounded-lg border border-gray-200 p-3 mb-4 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-green-300"
            placeholder="Votre message (optionnel, sera pré-rempli dans WhatsApp)"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white rounded-2xl px-8 py-4 flex items-center gap-3 text-lg font-bold shadow-lg transition-all duration-200"
            aria-label="Ouvrir WhatsApp avec le message saisi"
          >
            <FaWhatsapp className="text-2xl" /> Démarrer la discussion
          </a>
          <button
            onClick={toggleMode}
            className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2"
            aria-label="Basculer vers le formulaire email"
          >
            <FaEnvelope /> Préférez-vous envoyer un email ?
          </button>
        </div>
      ) : (
  <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-lg mx-auto flex flex-col items-center gap-6 animate-scale-in max-h-[80vh] overflow-y-auto">
          <div className="text-center">
            <h3 className="text-xl font-bold text-sky-700 mb-2">Envoyez-nous un email</h3>
            <p className="text-gray-600">Nous vous répondrons dans les plus brefs délais.</p>
          </div>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <input
              className="w-full rounded-lg border border-gray-200 p-3"
              placeholder="Votre nom"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              aria-label="Votre nom"
            />
            <input
              className="w-full rounded-lg border border-gray-200 p-3"
              placeholder="Votre email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              aria-label="Votre email"
            />
            <textarea
              className="w-full rounded-lg border border-gray-200 p-3 min-h-[100px]"
              placeholder="Votre message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
              aria-label="Votre message"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-8 py-4 flex items-center gap-3 text-lg font-bold shadow-lg transition-all duration-200 disabled:opacity-60"
              disabled={sending}
              aria-label="Envoyer le message à l'administrateur"
            >
              <FaEnvelope className="text-2xl" /> {sending ? "Envoi..." : "Envoyer"}
            </button>
            {sent && <div className="text-green-600 font-semibold">Message envoyé ! Merci, nous vous répondrons rapidement.</div>}
            {error && <div className="text-red-500 font-semibold">{error}</div>}
          </form>
          <button
            onClick={toggleMode}
            className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-6 py-3 flex items-center gap-2 font-bold shadow-md transition-all duration-200"
            aria-label="Basculer vers WhatsApp"
          >
            <FaWhatsapp /> Revenir à WhatsApp
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
