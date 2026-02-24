"use client";

import { useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Timer, TimerOff, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { getCourse }    from "@/data/course";
import { useQuiz }      from "@/context/QuizContext";
import QuestionCard     from "@/components/QuestionCard";
import ProgressBar      from "@/components/ProgressBar";
import TimerRing        from "@/components/TimerRing";

export default function QuizPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const {
    session, currentIndex,
    timerEnabled, secondsLeft,
    startQuiz, recordAnswer, nextQuestion, finishQuiz, toggleTimer,
  } = useQuiz();

  const course = getCourse(courseId);

  // Boot session once
  useEffect(() => {
    if (!course) return;
    if (!session || session.courseId !== courseId) {
      startQuiz(courseId, course.questions.length);
    }
  }, [courseId]); // eslint-disable-line

  // Redirect to results when done
  useEffect(() => {
    if (session?.completed) router.push(`/results/${courseId}`);
  }, [session?.completed, courseId, router]);

  // Auto-advance when timer hits 0
  useEffect(() => {
    if (timerEnabled && secondsLeft === 0 && session && !session.completed) {
      const q = course?.questions[currentIndex];
      if (q && !(q.id in (session.answers ?? {}))) {
        // Record as unanswered (−1)
        recordAnswer(q.id, -1, false);
        const isLast = currentIndex >= (course?.questions.length ?? 0) - 1;
        setTimeout(() => { isLast ? finishQuiz() : nextQuestion(); }, 400);
      }
    }
  }, [secondsLeft]); // eslint-disable-line

  const handleAnswer = useCallback(
    (chosen: number, correct: boolean) => {
      if (!course) return;
      const q = course.questions[currentIndex];
      recordAnswer(q.id, chosen, correct);
      const isLast = currentIndex >= course.questions.length - 1;
      setTimeout(() => { isLast ? finishQuiz() : nextQuestion(); }, 400);
    },
    [course, currentIndex, recordAnswer, nextQuestion, finishQuiz]
  );

  if (!course) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4 text-ink-muted">
        <p>Course not found.</p>
        <Link href="/" className="text-accent underline">← Back to home</Link>
      </div>
    );
  }

  if (!session || session.courseId !== courseId) return null;

  const question = course.questions[currentIndex];

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="Exit quiz"
          className="flex items-center gap-1.5 text-sm text-ink-muted
                     hover:text-ink focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-accent rounded-lg px-2 py-1"
        >
          <ArrowLeft size={15} /> Exit
        </Link>

        <button
          onClick={toggleTimer}
          aria-label={timerEnabled ? "Disable timer" : "Enable timer"}
          aria-pressed={timerEnabled}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs
                      font-medium transition-colors focus-visible:outline-none
                      focus-visible:ring-2 focus-visible:ring-accent
                      ${timerEnabled
                        ? "border-accent/40 bg-accent/10 text-accent"
                        : "border-white/10 text-ink-muted hover:border-white/20"}`}
        >
          {timerEnabled ? <Timer size={13} /> : <TimerOff size={13} />}
          {timerEnabled ? "Timer ON" : "Timer OFF"}
        </button>
      </div>

      {/* Progress + timer row */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex-1">
          <ProgressBar
            current={currentIndex + 1}
            total={course.questions.length}
            color={course.color}
          />
        </div>
        {timerEnabled && <TimerRing secondsLeft={secondsLeft} />}
      </div>

      {/* Question */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-white/8 bg-surface-2 p-6 sm:p-8 shadow-xl"
      >
        <QuestionCard
          key={question.id}
          question={question}
          questionNumber={currentIndex + 1}
          onAnswer={handleAnswer}
        />
      </motion.div>
    </section>
  );
}