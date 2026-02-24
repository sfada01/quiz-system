"use client";

// ── WrittenAnswerCard ──────────────────────────────────────
// Free-text answer input. Checks against acceptedAnswers list.
// TODO: For advanced grading, send to POST /api/grade with
//       the written answer and use AI to evaluate similarity.

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Send } from "lucide-react";
import { Question } from "@/types";

interface Props {
  question: Question;
  questionNumber: number;
  onAnswer: (answer: string, isCorrect: boolean) => void;
}

export default function WrittenAnswerCard({ question, questionNumber, onAnswer }: Props) {
  const [input,    setInput]    = useState("");
  const [revealed, setRevealed] = useState(false);
  const [correct,  setCorrect]  = useState(false);

  const checkAnswer = useCallback(() => {
    if (!input.trim() || revealed) return;

    // Build list of accepted answers
    const accepted = question.acceptedAnswers?.length
      ? question.acceptedAnswers
      : [question.options[question.correctIndex]];

    // Case-insensitive, trimmed match
    // TODO: Replace with AI similarity check for open-ended questions
    const isCorrect = accepted.some(
      (a) => a.toLowerCase().trim() === input.toLowerCase().trim()
    );

    setCorrect(isCorrect);
    setRevealed(true);
    setTimeout(() => onAnswer(input, isCorrect), 1000);
  }, [input, revealed, question, onAnswer]);

  return (
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

      {/* Input */}
      <div className="relative">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
          disabled={revealed}
          placeholder="Type your answer and press Enter…"
          aria-label="Written answer input"
          className={`w-full rounded-xl border px-4 py-3.5 pr-12 text-sm font-medium
                      bg-surface-3 text-ink placeholder:text-ink-faint
                      focus:outline-none focus:ring-2 transition-colors
                      ${revealed
                        ? correct
                          ? "border-emerald-500/60 focus:ring-emerald-500/30"
                          : "border-red-500/60 focus:ring-red-500/30"
                        : "border-white/10 focus:border-accent/50 focus:ring-accent/20"
                      }`}
        />
        <button
          onClick={checkAnswer}
          disabled={revealed || !input.trim()}
          aria-label="Submit answer"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5
                     text-ink-muted transition-colors hover:text-accent disabled:opacity-30"
        >
          <Send size={16} />
        </button>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 flex items-start gap-3 rounded-xl border p-4
                        ${correct
                          ? "border-emerald-500/20 bg-emerald-500/8"
                          : "border-red-500/20 bg-red-500/8"}`}
          >
            {correct
              ? <CheckCircle2 size={18} className="shrink-0 text-emerald-400 mt-0.5" />
              : <XCircle      size={18} className="shrink-0 text-red-400 mt-0.5" />
            }
            <div>
              <p className={`text-sm font-semibold ${correct ? "text-emerald-400" : "text-red-400"}`}>
                {correct ? "Correct!" : "Not quite."}
              </p>
              {!correct && (
                <p className="text-sm text-ink-muted mt-1">
                  Expected: <span className="text-ink font-medium">
                    {question.options[question.correctIndex]}
                  </span>
                </p>
              )}
              {question.explanation && (
                <p className="mt-1 text-xs text-ink-muted">{question.explanation}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}