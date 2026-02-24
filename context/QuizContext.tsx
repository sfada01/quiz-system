"use client";

import {
  createContext, useContext, useState,
  useCallback, useEffect, useRef, ReactNode,
} from "react";
import { AnswerMap, QuizSession } from "@/types";

interface QuizContextValue {
  session: QuizSession | null;
  currentIndex: number;
  timerEnabled: boolean;
  secondsLeft: number;
  startQuiz:    (courseId: string, total: number) => void;
  recordAnswer: (questionId: string, chosen: number, correct: boolean) => void;
  nextQuestion: () => void;
  finishQuiz:   () => void;
  resetQuiz:    () => void;
  toggleTimer:  () => void;
}

const QUESTION_SECS = 30;
const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [session,      setSession]      = useState<QuizSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [secondsLeft,  setSecondsLeft]  = useState(QUESTION_SECS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Timer helpers ──────────────────────────────────────── */
  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    setSecondsLeft(QUESTION_SECS);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { clearTimer(); return 0; }
        return s - 1;
      });
    }, 1000);
  }, [clearTimer]);

  // Restart when question changes (if timer is on)
  useEffect(() => {
    if (timerEnabled && session && !session.completed) startTimer();
    return clearTimer;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, timerEnabled]);

  /* ── Actions ────────────────────────────────────────────── */
  const startQuiz = useCallback((courseId: string, total: number) => {
    setSession({ courseId, answers: {}, score: 0,
      totalQuestions: total, completed: false, startedAt: Date.now() });
    setCurrentIndex(0);
    setSecondsLeft(QUESTION_SECS);
  }, []);

  const recordAnswer = useCallback(
    (questionId: string, chosen: number, correct: boolean) => {
      clearTimer();
      setSession((prev) =>
        prev ? {
          ...prev,
          answers: { ...prev.answers, [questionId]: chosen },
          score: correct ? prev.score + 1 : prev.score,
        } : prev
      );
    },
    [clearTimer]
  );

  const nextQuestion = useCallback(() => setCurrentIndex((i) => i + 1), []);

  const finishQuiz = useCallback(() => {
    clearTimer();
    setSession((prev) =>
      prev ? { ...prev, completed: true, finishedAt: Date.now() } : prev
    );
  }, [clearTimer]);

  const resetQuiz = useCallback(() => {
    clearTimer();
    setSession(null);
    setCurrentIndex(0);
    setSecondsLeft(QUESTION_SECS);
  }, [clearTimer]);

  const toggleTimer = useCallback(() => setTimerEnabled((t) => !t), []);

  return (
    <QuizContext.Provider value={{
      session, currentIndex, timerEnabled, secondsLeft,
      startQuiz, recordAnswer, nextQuestion, finishQuiz, resetQuiz, toggleTimer,
    }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be inside <QuizProvider>");
  return ctx;
}