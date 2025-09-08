"use client";
// Provider Framer Motion pour respecter prefers-reduced-motion globalement
import { MotionConfig, useReducedMotion } from "framer-motion";

export default function MotionProvider({ children }) {
  const reduced = useReducedMotion();
  return (
    <MotionConfig reducedMotion={reduced ? "always" : "never"}>{children}</MotionConfig>
  );
}
