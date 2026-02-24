"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { Course, AnswerMap } from "@/types";

interface Props {
  course: Course;
  answers: AnswerMap;
  score: number;
  onRetry: () => void;
}

export default function ResultsSummary({ course, answers, score, onRetry }: Props) {
  const total = course.questions.length;
  const pct   = Math.round((score / total) * 100);

  const grade =
    pct >= 90 ? { label: "Excellent! 🎉", color: "#10b981" } :
    pct >= 70 ? { label: "Great job! 👍",  color: "#e8ff47" } :
    pct >= 50 ? { label: "Not bad! 😊",    color: "#f59e0b" } :
                { label: "Keep studying! 📚", color: "#ef4444" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto w-full max-w-2xl"
    >
      {/* Score hero */}
      <div className="mb-8 rounded-2xl border border-white/8 bg-surface-2 p-8 text-center">
        <p className="mb-1 text-sm font-medium uppercase tracking-widest text-ink-muted">
          {course.name}
        </p>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
          className="my-4 inline-flex items-end gap-2"
        >
          <span className="font-display text-7xl font-extrabold leading-none"
                style={{ color: grade.color }}>
            {score}
          </span>
          <span className="mb-2 text-2xl font-light text-ink-muted">/ {total}</span>
        </motion.div>
        <p className="text-lg font-semibold" style={{ color: grade.color }}>{grade.label}</p>
        <p className="mt-1 text-sm text-ink-muted">{pct}% correct</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={onRetry}
            aria-label="Retry this quiz"
            className="flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3
                       font-semibold text-surface-0 shadow transition-transform
                       hover:scale-105 active:scale-95
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <RotateCcw size={16} /> Retry Quiz
          </button>
          <Link
            href="/"
            aria-label="All courses"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10
                       bg-surface-3 px-6 py-3 font-semibold text-ink transition-colors
                       hover:border-accent/30 hover:text-accent
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Home size={16} /> All Courses
          </Link>
        </div>
      </div>

      {/* Per-question breakdown */}
      <h2 className="mb-3 font-display text-lg font-bold text-ink">Question Breakdown</h2>
      <div className="space-y-2">
        {course.questions.map((q, i) => {
          const chosen  = answers[q.id];
          const correct = chosen === q.correctIndex;
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i }}
              className={`flex items-start gap-3 rounded-xl border p-4
                ${correct
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : "border-red-500/20 bg-red-500/5"}`}
            >
              <div className="mt-0.5 shrink-0">
                {correct
                  ? <CheckCircle2 size={18} className="text-emerald-400" />
                  : <XCircle     size={18} className="text-red-400" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-snug text-ink">{q.question}</p>
                {!correct && (
                  <p className="mt-1 text-xs text-ink-muted">
                    <span className="text-red-400">Your answer: </span>
                    // Change line 103 to:
{chosen !== undefined ? q.options[chosen as number] : "Not answered"}
                    <span className="mx-2 text-ink-faint">·</span>
                    <span className="text-emerald-400">Correct: </span>
                    {q.options[q.correctIndex]}
                  </p>
                )}
                {q.explanation && (
                  <p className="mt-1 text-xs text-ink-muted">{q.explanation}</p>
                )}
              </div>
              <span className="shrink-0 text-xs text-ink-muted">Q{i + 1}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}