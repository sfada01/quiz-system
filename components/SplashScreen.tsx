"use client";

// ── SplashScreen ───────────────────────────────────────────
// Animated intro shown on first visit or /onboarding route.

import { motion, AnimatePresence } from "framer-motion";
import { Brain } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState<"logo" | "tagline" | "out">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("tagline"), 1200);
    const t2 = setTimeout(() => setPhase("out"), 2800);
    const t3 = setTimeout(() => onComplete(), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "out" ? (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface-0"
        >
          {/* Background grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage: "linear-gradient(rgba(232,255,71,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(232,255,71,0.3) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
            className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-accent shadow-2xl"
            style={{ boxShadow: "0 0 60px rgba(232,255,71,0.4)" }}
          >
            <Brain size={48} className="text-surface-0" strokeWidth={2} />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="font-display text-6xl font-black text-ink"
          >
            Quiz<span className="text-accent">OS</span>
          </motion.h1>

          {/* Tagline */}
          <AnimatePresence>
            {phase === "tagline" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-ink-muted text-lg"
              >
                Level up your knowledge ⚡
              </motion.p>
            )}
          </AnimatePresence>

          {/* Loading bar */}
          <motion.div
            className="absolute bottom-12 h-0.5 bg-accent/30 w-48 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-accent rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.8, ease: "linear" }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}