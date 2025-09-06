"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Lazy-load an existing lightweight background to cut initial JS cost
const WaveBackground = dynamic(() => import("@/components/WaveBackground"), { ssr: false });

export default function BackgroundMount() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Montée plus tardive pour limiter l'impact sur LCP/TBT
    const mount = () => {
      // Petit délai supplémentaire après 'load' pour éviter la contention initiale
      const t = setTimeout(() => setReady(true), 800);
      return () => clearTimeout(t);
    };
    const cleanups = [];
    if ("requestIdleCallback" in window) {
      // @ts-ignore
      const id = requestIdleCallback(() => {
        // Idéal: attendre aussi 'load' si possible
        if (document.readyState === 'complete') {
          cleanups.push(mount());
        } else {
          const onLoad = () => { cleanups.push(mount()); window.removeEventListener('load', onLoad); };
          window.addEventListener('load', onLoad, { once: true });
        }
      }, { timeout: 3000 });
      cleanups.push(() => cancelIdleCallback?.(id));
    } else {
      // Fallback: après l'événement 'load' ou timeout
      let timer;
      const onLoad = () => { const c = mount(); cleanups.push(c); };
      if (document.readyState === 'complete') {
        const c = mount(); cleanups.push(c);
      } else {
        window.addEventListener('load', onLoad, { once: true });
        timer = setTimeout(() => { window.removeEventListener('load', onLoad); const c = mount(); cleanups.push(c); }, 3000);
      }
      cleanups.push(() => timer && clearTimeout(timer));
    }
    return () => { cleanups.forEach((fn) => { try { typeof fn === 'function' && fn(); } catch {} }); };
  }, []);

  if (!ready) return null;
  return (
    <>
      {/* Minimal, efficient background overlay */}
      <div aria-hidden className="absolute inset-x-0 top-0">
  {/* Allégé: pas de particules ni ondulations au chargement initial */}
  <WaveBackground color="#b6ecfe" height={90} opacity={0.35} particles={false} ripples={false} />
      </div>
    </>
  );
}
