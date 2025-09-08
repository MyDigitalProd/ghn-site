"use client"; // Composant client (hooks autorisés)

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { WHATSAPP_PHONE } from "@/config/site";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppBubble() {
  // Example WhatsApp-style messages
  const messages = [
    "Salut ! Besoin d'aide ?",
    "Envoyez-nous un message sur WhatsApp !",
    "Nous sommes là pour vous répondre.",
    "Posez votre question ici !"
  ];
  const [msgIndex, setMsgIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);
  const waUrl = `https://wa.me/${WHATSAPP_PHONE}`;

  return (
    <div className="fixed bottom-5 right-5 z-[120] flex flex-col items-end">
      {/* Comic-style WhatsApp message bubble */}
      <AnimatePresence>
        <m.div
          key={msgIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="relative mb-2 max-w-[220px] bg-[#e7ffdb] text-[#075e54] text-sm shadow-lg rounded-2xl px-4 py-2 border border-[#b2f5ea]"
          style={{ fontFamily: 'Segoe UI, Arial, sans-serif' }}
        >
          <span>{messages[msgIndex]}</span>
          {/* WhatsApp-style tail */}
          <span
            aria-hidden
            className="absolute -bottom-2 right-6 inline-block w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#e7ffdb]"
          />
        </m.div>
      </AnimatePresence>
      {/* WhatsApp logo button only */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Ouvrir WhatsApp"
        className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center p-4 focus:outline-none focus:ring-2 focus:ring-green-400"
        style={{ boxShadow: "0 4px 24px #22c55e55" }}
      >
        <FaWhatsapp className="w-7 h-7" aria-hidden />
      </a>
    </div>
  );
}
