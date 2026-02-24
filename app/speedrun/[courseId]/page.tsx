"use client";

// ── Speed Run Mode ─────────────────────────────────────────
// 10-second timer per question. Score bonus for fast answers.
// TODO: Save speedrun score to POST /api/scores with mode:"speedrun"

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getCourse } from "@/data/course";
import { useSound }  from "@/context/SoundContext";
import ProgressBar   from "@/components/ProgressBar";
import TimerRing     from "@/components/TimerRing";
import Link from "next/link";

const SECS_PER_Q = 10; // speed run time limit

export default function SpeedRunPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const { playCorrect, playWrong, playTick, playComplete } = useSound();

  const course = getCourse(courseId as string);
  const [index,    setIndex]    = useState(0);
  const [score,    setScore]    = useState(0);
  const [seconds,  setSeconds]  = useState(SECS_PER_Q);
  const [selected, setSelected] = useState<number | null>(null);
  const [done,     setDone]     = useState(false);
  const [times,    setTimes]    = useState<number[]>([]); // ms per question

  const [qStart, setQStart] = useState(Date.now());

  // Timer countdown
  useEffect(() => {
    if (done || selected !== null) return;
    if (seconds <= 0) { handleAnswer(-1); return; }
    const t = setTimeout(() => {
      setSeconds((s) => s - 1);
      if (seconds <= 4) playTick();
    }, 1000);
    return () => clearTimeout(t);
  }, [seconds, selected, done]); // eslint-disable-line

  const handleAnswer = useCallback((chosen: number) => {
    if (!course || selected !== null) return;
    const elapsed = Date.now() - qStart;
    const correct = chosen === course.questions[index].correctIndex;

    setSelected(chosen);
    setTimes((t) => [...t, elapsed]);
    if (correct) { setScore((s) => s + 1); playCorrect(); }
    else playWrong();

    const isLast = index >= course.questions.length - 1;
    setTimeout(() => {
      if (isLast) { playComplete(); setDone(true); }
      else {
        setIndex((i) => i + 1);
        setSelected(null);
        setSeconds(SECS_PER_Q);
        setQStart(Date.now());
      }
    }, 700);
  }, [course, index, selected, qStart, playCorrect, playWrong, playComplete]);

  if (!course) return (
    <div className="flex h-96 items-center justify-center text-ink-muted">
      Course not found. <Link href="/" className="ml-2 text-accent underline">Go home</Link>
    </div>
  );

  // ── Results screen ───────────────────────────────────────
  if (done) {
    const totalMs  = times.reduce((a, b) => a + b, 0);
    const avgMs    = Math.round(totalMs / times.length);
    const pct      = Math.round((score / course.questions.length) * 100);
    return (
      <section className="mx-auto max-w-md px-4 py-14 sm:px-6 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.4 }}>
          <p className="text-6xl mb-4">⚡</p>
          <h1 className="font-display text-5xl font-black text-accent mb-2">{pct}%</h1>
          <p className="text-ink-muted mb-1">{score} / {course.questions.length} correct</p>
          <p className="text-ink-muted mb-8">Avg time: {(avgMs/1000).toFixed(1)}s per question</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => { setIndex(0); setScore(0); setSeconds(SECS_PER_Q); setSelected(null); setDone(false); setTimes([]); }}
                    className="rounded-xl bg-accent px-6 py-3 font-bold text-surface-0 hover:scale-105 transition-transform">
              Try Again
            </button>
            <Link href="/speedrun"
                  className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium
                             text-ink-muted hover:text-ink transition-colors">
              ← All Speed Runs
            </Link>
          </div>
        </motion.div>
      </section>
    );
  }

  const q = course.questions[index];
  const LABELS = ["A", "B", "C", "D"];

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex-1">
          <ProgressBar current={index + 1} total={course.questions.length} color={course.color} />
        </div>
        <TimerRing secondsLeft={seconds} totalSeconds={SECS_PER_Q} />
      </div>

      {/* Score badge */}
      <div className="mb-4 flex justify-between text-sm">
        <span className="text-ink-muted">{course.name} · Speed Run ⚡</span>
        <span className="font-bold text-accent">{score} pts</span>
      </div>

      <div className="rounded-2xl border border-white/8 bg-surface-2 p-6 shadow-xl">
        <AnimatePresence mode="wait">
          <motion.div key={index} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
            <p className="mb-6 text-lg font-semibold text-ink">{q.question}</p>
            <div className="grid gap-3">
              {q.options.map((opt, i) => {
                const isRevealed = selected !== null;
                const isCorrect  = i === q.correctIndex;
                const isChosen   = i === selected;
                let cls = "border-white/10 bg-surface-3 hover:border-accent/40 cursor-pointer";
                if (isRevealed) {
                  if (isCorrect) cls = "border-emerald-500/60 bg-emerald-500/12 text-emerald-300";
                  else if (isChosen) cls = "border-red-500/60 bg-red-500/12 text-red-300";
                  else cls = "border-white/5 opacity-40";
                }
                return (
                  <button key={i} onClick={() => handleAnswer(i)} disabled={isRevealed}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-3
                                      text-left text-sm font-medium transition-all ${cls}
                                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`}>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center
                                     rounded-lg bg-surface-0/60 text-xs font-bold">
                      {LABELS[i]}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}