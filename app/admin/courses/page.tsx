"use client";

// TODO: Load from GET /api/admin/courses
// TODO: POST /api/admin/courses to create
// TODO: DELETE /api/admin/courses/:id to remove
// TODO: PATCH /api/admin/courses/:id to update

import { useState } from "react";
import { useUser }   from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { COURSES } from "@/data/course";
import { Course } from "@/types";
import { Trash2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function AdminCoursesPage() {
  const { isAdmin } = useUser();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>(COURSES);

  useEffect(() => { if (!isAdmin) router.replace("/"); }, [isAdmin, router]);
  if (!isAdmin) return null;

  const togglePublish = (id: string) => {
    // TODO: PATCH /api/admin/courses/:id { isPublished: !current }
    setCourses((cs) =>
      cs.map((c) => c.id === id ? { ...c, isPublished: !c.isPublished } : c)
    );
  };

  const removeCourse = (id: string) => {
    // TODO: DELETE /api/admin/courses/:id
    setCourses((cs) => cs.filter((c) => c.id !== id));
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-ink-muted hover:text-ink transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-display text-3xl font-black text-ink">MANAGE COURSES</h1>
        </div>
        <Link href="/upload"
              className="rounded-xl bg-accent px-4 py-2 text-sm font-bold text-surface-0
                         hover:scale-105 transition-transform">
          + Add Questions
        </Link>
      </div>

      <div className="space-y-3">
        {courses.map((c, i) => (
          <motion.div key={c.id}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 rounded-2xl border border-white/8
                       bg-surface-2 px-5 py-4">
            {/* Icon */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
                 style={{ backgroundColor: `${c.color}22`, border: `1px solid ${c.color}44` }}>
              {c.icon}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-ink">{c.name}</p>
              <p className="text-xs text-ink-muted">
                {c.questions.length} questions · {c.description}
              </p>
            </div>

            {/* Published badge */}
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full hidden sm:inline
                              ${c.isPublished !== false
                                ? "bg-emerald-500/15 text-emerald-400"
                                : "bg-surface-3 text-ink-muted"}`}>
              {c.isPublished !== false ? "Published" : "Draft"}
            </span>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button onClick={() => togglePublish(c.id)}
                      aria-label={c.isPublished !== false ? "Unpublish" : "Publish"}
                      className="rounded-lg p-2 text-ink-muted hover:bg-surface-3 hover:text-ink transition-colors">
                {c.isPublished !== false ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
              <button onClick={() => removeCourse(c.id)}
                      aria-label={`Remove ${c.name}`}
                      className="rounded-lg p-2 text-ink-faint hover:bg-red-500/15 hover:text-red-400 transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}