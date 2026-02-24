"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCourse } from "@/data/course";
import FlashCard from "@/components/FlashCard";

export default function FlashcardsPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const course = getCourse(courseId as string);
  const [index, setIndex] = useState(0);

  if (!course) return (
    <div className="flex h-96 items-center justify-center text-ink-muted">
      Course not found. <Link href="/" className="ml-2 text-accent underline">Go home</Link>
    </div>
  );

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-1">
          Flashcard Mode
        </p>
        <h1 className="font-display text-4xl font-black text-ink">{course.name}</h1>
      </div>

      <FlashCard
        question={course.questions[index]}
        index={index}
        total={course.questions.length}
        onNext={() => setIndex((i) => Math.min(i + 1, course.questions.length - 1))}
        onPrev={() => setIndex((i) => Math.max(i - 1, 0))}
      />

      <div className="mt-8 text-center">
        <Link href={`/quiz/${courseId}`}
              className="text-sm text-ink-muted hover:text-accent transition-colors underline">
          Switch to Quiz Mode →
        </Link>
      </div>
    </section>
  );
}