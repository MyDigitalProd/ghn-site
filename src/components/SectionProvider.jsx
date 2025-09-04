"use client";
import React, { createContext, useContext, useMemo, useState } from "react";

const SectionCtx = createContext(null);

export function SectionProvider({ children, initial = "accueil" }) {
  const [active, setActive] = useState(initial);
  const value = useMemo(() => ({ active, setActive }), [active]);
  return <SectionCtx.Provider value={value}>{children}</SectionCtx.Provider>;
}

export function useSection() {
  const ctx = useContext(SectionCtx);
  if (!ctx) throw new Error("useSection must be used within SectionProvider");
  return ctx;
}
