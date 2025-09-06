"use client";
import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useSection } from "./SectionProvider";
import { useI18n } from "@/i18n/I18nProvider";
import { WHATSAPP_PHONE } from "@/config/site";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppBubble({ hideOnContact = false }) {
  const { active } = useSection();
  const { t } = useI18n();
  const [isContactVisible, setIsContactVisible] = useState(false);
  const message = encodeURIComponent(t("bubble.defaultMessage") || "");
  const url = `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;

  useEffect(() => {
    // Mode scène: masquer si section active = contact
    setIsContactVisible(active === "contact");
  }, [active]);

  return (
  <AnimatePresence mode="wait">
      {!(hideOnContact && isContactVisible) && (
    <m.a
          key="whatsapp-bubble"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("bubble.aria") || "WhatsApp"}
          className="fixed bottom-5 right-5 z-[120] bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center p-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
          style={{ boxShadow: "0 4px 24px #22c55e55" }}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
          exit={{ scale: 0.7, opacity: 0, transition: { type: 'tween', duration: 0.3 } }}
        >
          <FaWhatsapp className="w-7 h-7" aria-hidden />
          <span className="ml-2 font-bold hidden sm:inline">{t("bubble.cta") || "WhatsApp"}</span>
  </m.a>
      )}
    </AnimatePresence>
  );
}
