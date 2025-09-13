"use client"; // Exécution côté client (hooks/DOM)

import { useCallback, useEffect, useMemo, useRef, useState } from "react"; // Hooks React
import { AnimatePresence, m } from "framer-motion";                        // Animations douces
import { FaWhatsapp } from "react-icons/fa";                                // Icône WhatsApp
import { WHATSAPP_PHONE } from "@/config/site";                              // Numéro SANS '+'

// -- Helper (fallback i18n minimal) --
const T = {
  open: "Ouvrir WhatsApp",
  ask1: "Avez-vous des questions ?",
  ask2: "Contactez un de nos spécialistes gratuitement.",
  ask3: "Un de nos collaborateurs est en ligne pour vous répondre.",
  toggle_on: "Activer les messages automatiques",
  toggle_off: "Désactiver les messages automatiques",
  modal_title: "Besoin d’aide ?",
  modal_cta: "Contacter via WhatsApp",
  modal_cancel: "Annuler",
  toast_off: "Messages automatiques désactivés",
  hint_enable: "Activer les messages automatiques",
};

// -- Bool persistant (localStorage) --
function useLocalStorageBool(key, initial) {
  const [val, setVal] = useState(() => {
    try { const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null; return raw === null ? initial : raw === "true"; }
    catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, val ? "true" : "false"); } catch {} }, [key, val]);
  return [val, setVal];
}

export default function WhatsAppBubble({
  autoMessages = true,                         // ON par défaut
  showBubble   = true,                         // Masquer totalement si false
  footerHeight = 10,                           // Décalage bas
  storageKey   = "waAutoMessages",             // Clé LS
  prefill      = "Bonjour, j’ai une question sur ma piscine 🙂", // Texte prérempli
  mobileMode   = "modal",                      // "modal" | "inline"
}) {
  // -- Accessibilité: animations réduites --
  const prefersReduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  // -- Séquence de messages optimisée (délais indiqués) --
  const sequence = useMemo(() => ([
    { text: T.ask1, delay: 2000 },    // +2s
    { text: T.ask2, delay: 15000 },   // +15s
    { text: T.ask3, delay: 20000 },   // +20s
  ]), []);

  // -- Etats principaux --
  const [enabled, setEnabled] = useLocalStorageBool(storageKey, autoMessages); // ON/OFF auto
  const [msgIdx, setMsgIdx]   = useState(0);                                   // Index message courant
  const [isHover, setIsHover] = useState(false);                               // Hover desktop (pause)
  const [isMobile, setIsMobile] = useState(false);                             // UA mobile
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);               // Modal mobile
  const [showHint, setShowHint] = useState(false);                             // Hint réactivation (desktop)
  const [showToast, setShowToast] = useState(false);                           // Toast 3s après OFF (desktop)

  // -- Timers --
  const seqTimerRef   = useRef(null);     // Timer séquence
  const hoverDelayRef = useRef(null);     // Délai hint
  const toastHideRef  = useRef(null);     // Auto-hide toast

  // -- Détection mobile simple --
  useEffect(() => {
    const ua = (typeof navigator !== "undefined" && navigator.userAgent) || "";
    setIsMobile(/Android|iPhone|iPad|iPod|Mobile/i.test(ua));
    return () => {
      [seqTimerRef, hoverDelayRef, toastHideRef].forEach(r => r.current && clearTimeout(r.current));
    };
  }, []);

  // -- URLs WhatsApp (desktop = wa.me direct, mobile = handled dans onClick) --
  const waWebUrl = useMemo(
    () => "https://wa.me/" + WHATSAPP_PHONE + "?text=" + encodeURIComponent(prefill),
    [prefill]
  );
  const waAppUrl = useMemo(
    () => "whatsapp://send?phone=" + WHATSAPP_PHONE + "&text=" + encodeURIComponent(prefill),
    [prefill]
  );

  // -- Séquence: planification message suivant (avec jitter léger) --
  const schedule = useCallback((idx) => {
    if (prefersReduced || !enabled || isHover) return;            // Stop si reduce/paused/OFF
    const { delay } = sequence[idx];                              // Délai du message courant
    const jitter = Math.round((Math.random() - 0.5) * 800);       // ±0.8s
    seqTimerRef.current = setTimeout(
      () => setMsgIdx(i => (i + 1) % sequence.length),
      Math.max(1500, delay + jitter)
    );
  }, [enabled, isHover, prefersReduced, sequence]);

  useEffect(() => { if (seqTimerRef.current) clearTimeout(seqTimerRef.current); schedule(msgIdx); return () => seqTimerRef.current && clearTimeout(seqTimerRef.current); }, [msgIdx, schedule]);
  useEffect(() => { if (seqTimerRef.current) clearTimeout(seqTimerRef.current); schedule(msgIdx); return () => seqTimerRef.current && clearTimeout(seqTimerRef.current); }, [enabled, isHover]); // eslint-disable-line

  // -- Toggle ON/OFF (avec toast desktop) --
  const toggleAuto = useCallback((next) => {
    const nv = typeof next === "boolean" ? next : !enabled;      // Valeur ciblée
    setEnabled(nv);                                              // Applique
    if (!nv) {                                                   // Si OFF
      setShowHint(false);                                        // Evite conflit
      setShowToast(true);                                        // Toast visible
      if (toastHideRef.current) clearTimeout(toastHideRef.current);
      toastHideRef.current = setTimeout(() => setShowToast(false), 3000); // Cache après 3s
    }
  }, [enabled]);

  // -- Desktop: hint après ~900ms de hover (si OFF et pas de toast) --
  const onEnter = () => {
    setIsHover(true);
    if (!enabled && !showToast) {
      if (hoverDelayRef.current) clearTimeout(hoverDelayRef.current);
      hoverDelayRef.current = setTimeout(() => setShowHint(true), 900);
    }
  };
  const onLeave = () => {
    setIsHover(false);
    if (hoverDelayRef.current) clearTimeout(hoverDelayRef.current);
    setShowHint(false);
  };

  // -- Motion presets --
  const vInit = prefersReduced ? {} : { opacity: 0, y: 10 };
  const vIn   = prefersReduced ? {} : { opacity: 1, y: 0 };
  const vOut  = prefersReduced ? {} : { opacity: 0, y: 10 };
  const tMsg  = prefersReduced ? { duration: 0 } : { duration: 0.24, ease: [0.22,0.65,0.3,0.9] };
  const tUI   = prefersReduced ? { duration: 0 } : { duration: 0.18, ease: [0.22,0.65,0.3,0.9] };
  const tToast= prefersReduced ? { duration: 0 } : { duration: 1.5, ease: [0.22,0.65,0.3,0.9] };

  if (!showBubble) return null; // Rien à rendre si masqué

  // -- Modes mobile --
  const isModalMode  = isMobile && mobileMode === "modal";   // FAB → modal (pas de mini-toggle)
  const isInlineMode = isMobile && mobileMode === "inline";  // FAB → WhatsApp direct (mini-toggle actif)

  return (
    <div
      className="fixed right-0 bottom-0 z-[200] flex flex-col items-end pointer-events-auto select-none"
      style={{ bottom: `calc(env(safe-area-inset-bottom,0px) + ${footerHeight}px)` }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* -- Bulle message auto (masquée quand toast visible) -- */}
      <AnimatePresence initial={false}>
        {enabled && !showToast && (
          <m.div
            key={msgIdx}
            initial={vInit} animate={vIn} exit={vOut} transition={tMsg}
            className="group relative max-w-44 md:max-w-[240px] text-[11px] md:text-[15px]
                       bg-[#e7ffdb] text-[#075e54] shadow-md rounded-xl border border-[#b2f5ea]
                       m-0.5 md:m-2 px-2 py-1 md:px-3 md:py-2 pr-4 md:pr-5"
            style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Arial, sans-serif" }}
            aria-live="polite"
          >
            <span className="block">{sequence[msgIdx].text}</span>
            {/* Pointe */}
            <span aria-hidden className="absolute -bottom-2 right-2 inline-block w-0 h-0
                         border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-[#e7ffdb]" />
            {/* X desktop discret pour OFF */}
            <button
              type="button" onClick={() => toggleAuto(false)}
              className="hidden md:flex absolute top-1 right-1 w-4 h-4 rounded-full bg-white/80
                         items-center justify-center text-[10px] leading-none text-green-900/80
                         opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={T.toggle_off} title={T.toggle_off} style={{ lineHeight: 1 }}
            >×</button>
          </m.div>
        )}
      </AnimatePresence>

      {/* -- Toast desktop (exclusif) -- */}
      <AnimatePresence>
        {showToast && (
          <m.div
            key="reactivate-toast"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
            transition={tToast}
            className="hidden md:flex items-center gap-2 m-2 px-3 py-1.5 rounded-lg
                       bg-black/70 text-white text-[12px] shadow-md backdrop-blur-sm"
            role="status" aria-live="polite"
          >
            <span>{T.toast_off}</span>
            <button
              type="button" onClick={() => setEnabled(true)}
              className="flex items-center justify-center w-5 h-5 rounded-full bg-white border border-green-600"
              title={T.toggle_on} aria-label={T.toggle_on}
            >
              {/* Check vert (SVG) */}
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
                <path d="M20 6L9 17l-5-5" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </m.div>
        )}
      </AnimatePresence>

      {/* -- Hint desktop (après ~900ms de hover, pas pendant le toast) -- */}
      <AnimatePresence>
        {!enabled && !showToast && showHint && (
          <m.div
            key="reactivate-hint"
            initial={vInit} animate={vIn} exit={vOut} transition={tUI}
            className="hidden md:flex items-center gap-2 m-2 px-2.5 py-1 rounded-lg
                       bg-[#e7ffdb] text-[#075e54] text-[12px] border border-[#b2f5ea] shadow"
            role="status" aria-live="polite"
          >
            <span>{T.hint_enable}</span>
            <button
              type="button" onClick={() => setEnabled(true)}
              className="px-2 py-0.5 rounded-md bg-white text-green-700 border border-gray-300 text-[12px] font-semibold"
            >OK</button>
          </m.div>
        )}
      </AnimatePresence>

      {/* -- Ligne actions (FAB + logique mobile) -- */}
      <div className="flex items-end gap-1 pr-2 pb-2">
        <div className="relative">
          {/* FAB principal
             Desktop: lien wa.me direct (pas de JS empêchant l'ouverture) -> + fiable
             Mobile:
               - modal: ouvre une bottom-sheet stylée
               - inline: ouvre WhatsApp directement (deep-link via wa.me, fiable) */}
          <a
            href={waWebUrl}                          // Desktop & Mobile inline: wa.me prend le relais (Web ou Desktop App)
            onClick={(e) => {
              if (isModalMode) {                     // Mobile modal -> sheet
                e.preventDefault();
                setMobileSheetOpen(true);
              }
              // Sinon on laisse le lien fonctionner normalement (pas de preventDefault)
            }}
            target="_blank"                          // Ouverture propre
            rel="noopener noreferrer"
            aria-label={T.open}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg
                       flex items-center justify-center w-12 h-12 md:w-14 md:h-14
                       focus:outline-none border border-white/20 active:scale-[0.98] transition"
            style={{ boxShadow: "0 8px 22px rgba(37,211,102,0.45)" }}
            title="WhatsApp"
          >
            <FaWhatsapp className="w-6 h-6 md:w-7 md:h-7" aria-hidden />
          </a>

          {/* Mini-toggle ultra discret (UNIQUEMENT mobile inline) */}
          {isInlineMode && (
            <button
              type="button" onClick={() => toggleAuto()}
              className="md:hidden absolute -left-1 -bottom-1 w-5 h-5 rounded-full border border-white/25
                         shadow-sm flex items-center justify-center text-white active:scale-[0.98] transition"
              style={{ backgroundColor: enabled ? "#22c55e" : "#ef4444", opacity: 0.9 }}
              title={enabled ? T.toggle_off : T.toggle_on} aria-label={enabled ? T.toggle_off : T.toggle_on}
            >
              <span className="text-[12px]" aria-hidden>-</span>
            </button>
          )}

          {/* BOTTOM-SHEET MOBILE (design + hiérarchie) */}
          <AnimatePresence>
            {isModalMode && mobileSheetOpen && (
              <m.div
                key="wa-sheet"
                className="fixed inset-0 z-[210] md:hidden"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={tUI}
                aria-modal="true" role="dialog" onClick={() => setMobileSheetOpen(false)}
              >
                {/* Backdrop verre fumé */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                {/* Feuille */}
                <m.div
                  initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={tUI}
                  className="absolute left-0 right-0 bottom-0 mx-3 mb-3 rounded-2xl shadow-2xl
                             border border-white/15 bg-white/90 backdrop-blur-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Poignée */}
                  <div className="flex justify-center pt-3">
                    <span className="h-1.5 w-12 rounded-full bg-black/15" />
                  </div>

                  {/* Contenu */}
                  <div className="p-4">
                    <div className="text-base font-semibold text-slate-900 mb-1">{T.modal_title}</div>
                    {/* Ligne discrète: état messages auto + toggle (petit lien) */}
                    <div className="text-[12px] text-slate-600 mb-3">
                      {enabled ? "Messages auto : activés" : "Messages auto : désactivés"} ·{" "}
                      <button
                        type="button" onClick={() => toggleAuto()}
                        className="underline decoration-dotted text-slate-700"
                      >
                        {enabled ? "désactiver" : "activer"}
                      </button>
                    </div>

                    <div className="grid gap-2">
                      {/* CTA principal (dominant) */}
                      <a
                        href={waWebUrl} target="_blank" rel="noopener noreferrer"
                        className="w-full rounded-xl px-4 py-3 bg-green-500 text-white font-semibold
                                   active:scale-[0.98] transition text-center shadow-md"
                        onClick={() => setMobileSheetOpen(false)}
                      >
                        {T.modal_cta}
                      </a>

                      {/* Bouton secondaire (annuler) */}
                      <button
                        type="button"
                        className="w-full rounded-xl px-4 py-3 bg-white/80 border border-slate-200
                                   text-slate-700 active:scale-[0.98] transition shadow-sm"
                        onClick={() => setMobileSheetOpen(false)}
                      >
                        {T.modal_cancel}
                      </button>
                    </div>
                  </div>
                </m.div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
