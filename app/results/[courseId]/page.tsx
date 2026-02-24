"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCourse } from "@/data/course";
import { useQuiz }   from "@/context/QuizContext";
import ResultsSummary from "@/components/ResultsSummary";

export default function ResultsPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const { session, resetQuiz, startQuiz } = useQuiz();

  const course = getCourse(courseId);

  // Guard: if no completed session, redirect home
  useEffect(() => {
    if (!session || !session.completed || session.courseId !== courseId) {
      router.replace("/");
    }
  }, []); // eslint-disable-line

  const handleRetry = () => {
    if (!course) return;
    resetQuiz();
    startQuiz(courseId, course.questions.length);
    router.push(`/quiz/${courseId}`);
  };

  if (!course || !session) return null;

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <ResultsSummary
        course={course}
        answers={session.answers}
        score={session.score}
        onRetry={handleRetry}
      />
    </section>
  );
}