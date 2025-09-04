"use client";
import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useSection } from "./SectionProvider";

export default function WhatsAppBubble({ hideOnContact = false }) {
  const { active } = useSection();
  const [isContactVisible, setIsContactVisible] = useState(false);
  const phone = "33612345678"; // Remplace par ton numéro WhatsApp sans +
  const message = encodeURIComponent("Bonjour, je souhaite un devis pour une piscine !");
  const url = `https://wa.me/${phone}?text=${message}`;

  useEffect(() => {
    // Mode scène: masquer si section active = contact
    setIsContactVisible(active === "contact");
  }, [active]);

  return (
    <AnimatePresence mode="wait">
      {!(hideOnContact && isContactVisible) && (
        <motion.a
          key="whatsapp-bubble"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactez-nous sur WhatsApp"
          className="fixed bottom-5 right-5 z-[120] bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center p-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
          style={{ boxShadow: "0 4px 24px #22c55e55" }}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
          exit={{ scale: 0.7, opacity: 0, transition: { type: 'tween', duration: 0.3 } }}
        >
          <FaWhatsapp className="text-3xl" />
          <span className="ml-2 font-bold hidden sm:inline">Devis WhatsApp</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
