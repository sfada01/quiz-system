"use client";

// ── FlashCard ──────────────────────────────────────────────
// 3D flip card for flashcard study mode.

import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { Question } from "@/types";

interface Props {
  question: Question;
  index: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
}

export default function FlashCard({ question, index, total, onNext, onPrev }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xl mx-auto">
      {/* Counter */}
      <p className="text-sm text-ink-muted">{index + 1} / {total}</p>

      {/* Card */}
      <div
        className="relative w-full cursor-pointer"
        style={{ perspective: 1200 }}
        onClick={() => setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
        aria-label={flipped ? "Show question" : "Show answer"}
        onKeyDown={(e) => e.key === "Enter" && setFlipped((f) => !f)}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-full"
        >
          {/* Front — Question */}
          <div
            className="flex min-h-64 flex-col items-center justify-center rounded-2xl
                       border border-white/10 bg-surface-2 p-8 text-center shadow-2xl"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="mb-4 text-xs font-semibold uppercase tracking-widest text-accent">
              Question
            </span>
            <p className="text-xl font-semibold text-ink leading-snug">{question.question}</p>
            <p className="mt-6 text-xs text-ink-faint">Click to reveal answer</p>
          </div>

          {/* Back — Answer */}
          <div
            className="absolute inset-0 flex min-h-64 flex-col items-center justify-center
                       rounded-2xl border border-emerald-500/30 bg-emerald-500/8 p-8 text-center shadow-2xl"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <span className="mb-4 text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Answer
            </span>
            <p className="text-xl font-semibold text-emerald-300 leading-snug">
              {question.options[question.correctIndex]}
            </p>
            {question.explanation && (
              <p className="mt-4 text-sm text-ink-muted">{question.explanation}</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={onPrev}
          disabled={index === 0}
          className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium
                     text-ink-muted transition-colors hover:border-white/20 hover:text-ink
                     disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          ← Prev
        </button>
        <button
          onClick={() => setFlipped(false)}
          aria-label="Reset card"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10
                     text-ink-muted hover:text-ink transition-colors"
        >
          <RotateCcw size={15} />
        </button>
        <button
          onClick={() => { setFlipped(false); onNext(); }}
          disabled={index === total - 1}
          className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium
                     text-ink-muted transition-colors hover:border-white/20 hover:text-ink
                     disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Next →
        </button>
      </div>
    </div>
  );
}