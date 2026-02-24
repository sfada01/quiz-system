"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import { Course } from "@/types";

interface Props {
  course: Course;
  index: number;
}

export default function CourseCard({ course, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="group relative"
    >
      <Link
        href={`/quiz/${course.id}`}
        aria-label={`Start ${course.name} — ${course.questions.length} questions`}
        className="block h-full overflow-hidden rounded-2xl border border-white/8
                   bg-surface-2 p-6 shadow-lg transition-shadow
                   hover:border-white/15 hover:shadow-xl
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {/* Glow */}
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full
                     opacity-20 blur-2xl transition-opacity group-hover:opacity-35"
          style={{ backgroundColor: course.color }}
        />

        {/* Icon */}
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
          style={{ backgroundColor: `${course.color}22`, border: `1px solid ${course.color}44` }}
          aria-hidden
        >
          {course.icon}
        </div>

        <h2 className="mb-1 font-display text-lg font-bold text-ink">{course.name}</h2>
        <p className="mb-5 text-sm text-ink-muted">{course.description}</p>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 rounded-full bg-surface-3
                           px-3 py-1 text-xs font-medium text-ink-muted">
            <HelpCircle size={12} />
            {course.questions.length} questions
          </span>
          <span
            className="flex items-center gap-1 text-xs font-semibold
                       transition-colors group-hover:text-accent"
            style={{ color: course.color }}
          >
            Start
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}