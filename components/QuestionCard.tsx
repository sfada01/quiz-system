"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { Question } from "@/types";

const LABELS = ["A", "B", "C", "D"] as const;

interface Props {
  question: Question;
  questionNumber: number;
  onAnswer: (chosen: number, isCorrect: boolean) => void;
}

export default function QuestionCard({ question, questionNumber, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = useCallback(
    (i: number) => {
      if (revealed) return;
      const correct = i === question.correctIndex;
      setSelected(i);
      setRevealed(true);
      setTimeout(() => onAnswer(i, correct), 950);
    },
    [revealed, question.correctIndex, onAnswer]
  );

  const optionClass = (i: number) => {
    if (!revealed)
      return "border-white/10 bg-surface-3 hover:border-accent/50 hover:bg-surface-4 cursor-pointer";
    if (i === question.correctIndex)
      return "border-emerald-500/70 bg-emerald-500/15 text-emerald-300";
    if (i === selected)
      return "border-red-500/70 bg-red-500/15 text-red-300";
    return "border-white/5 bg-surface-2 opacity-40";
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={questionNumber}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full"
      >
        <p className="mb-6 text-lg font-semibold leading-snug text-ink sm:text-xl">
          {question.question}
        </p>

        <ul className="grid gap-3" role="list">
          {question.options.map((opt, i) => {
            const isWrong = revealed && i === selected && i !== question.correctIndex;
            return (
              <motion.li
                key={i}
                animate={
                  isWrong ? { x: [0, -8, 8, -5, 5, 0] } :
                  revealed && i === question.correctIndex ? { scale: [1, 1.02, 1] } : {}
                }
                transition={{ duration: 0.4 }}
              >
                <button
                  onClick={() => handleSelect(i)}
                  disabled={revealed}
                  aria-pressed={selected === i}
                  aria-label={`Option ${LABELS[i]}: ${opt}`}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5
                              text-left text-sm font-medium transition-all duration-200
                              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                              ${optionClass(i)}`}
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center
                               rounded-lg bg-surface-0/60 text-xs font-bold"
                    aria-hidden
                  >
                    {LABELS[i]}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {revealed && i === question.correctIndex &&
                    <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />}
                  {isWrong &&
                    <XCircle size={18} className="shrink-0 text-red-400" />}
                </button>
              </motion.li>
            );
          })}
        </ul>

        {/* Explanation */}
        <AnimatePresence>
          {revealed && question.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden rounded-xl border border-accent/20 bg-accent/5 px-4 py-3"
            >
              <p className="text-sm text-ink-muted">
                <span className="mr-1 font-semibold text-accent">Explanation:</span>
                {question.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}