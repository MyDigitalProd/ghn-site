"use client";
import { createContext, useContext, useMemo, useState, useEffect } from "react";

const DEFAULT_LANG = "fr"; // fr | nl | en
const SUPPORTED = ["fr", "nl", "en"];

const I18nContext = createContext({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (key) => key,
});

export function I18nProvider({ children, initialLang }) {
  const [lang, setLangState] = useState(initialLang || DEFAULT_LANG);

  // One-time initial detection: URL ?lang, then localStorage, then navigator.languages, else default
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const param = (url.searchParams.get("lang") || "").toLowerCase();
    const stored = localStorage.getItem("lang");

    const detectFromNavigator = () => {
      const cand = (navigator.languages && Array.isArray(navigator.languages))
        ? navigator.languages
        : [navigator.language || ""];
      for (const l of cand) {
        if (!l) continue;
        const lc = l.toLowerCase();
        if (lc.startsWith("fr")) return "fr";
        if (lc.startsWith("nl") || lc.startsWith("nl-be") || lc.startsWith("nl-nl")) return "nl";
        if (lc.startsWith("en")) return "en";
      }
      return DEFAULT_LANG;
    };

    const chosen = SUPPORTED.includes(param)
      ? param
      : (stored && SUPPORTED.includes(stored) ? stored : detectFromNavigator());

    setLangState(chosen);

    // Ensure URL reflects chosen lang without reload, preserve hash
    url.searchParams.set("lang", chosen);
    const newUrl = url.pathname + url.search + (window.location.hash || "");
    if (newUrl !== window.location.pathname + window.location.search + window.location.hash) {
      history.replaceState(null, "", newUrl);
    }
  }, []);

  // Persist in localStorage and update <html lang>
  useEffect(() => {
    if (typeof window === "undefined") return;
    try { localStorage.setItem("lang", lang); } catch {}
    try { document.documentElement.setAttribute("lang", lang); } catch {}
  }, [lang]);

  const setLang = (next) => {
    if (!SUPPORTED.includes(next)) return;
    setLangState(next);
    // Reflect in URL (?lang=) without losing hash
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", next);
      history.replaceState(null, "", url.pathname + url.search + (window.location.hash || ""));
    }
  };

  // Lazy load messages (simple sync import for now)
  const messages = useMemo(() => {
    try {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const dict = require(`./messages/${lang}.json`);
      return dict || {};
    } catch (e) {
      return {};
    }
  }, [lang]);

  const t = (key) => {
    const val = messages[key];
    if (typeof val === "string") return val;
    return key; // fallback
  };

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
