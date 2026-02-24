"use client";

// TODO: Load real user from GET /api/users/me (auth session)
// TODO: Save profile updates via PATCH /api/users/me

import { motion } from "framer-motion";
import { useUser }  from "@/context/UserContext";
import { useSound } from "@/context/SoundContext";
import { COURSES }  from "@/data/course";
import Link from "next/link";

export default function ProfilePage() {
  const { user, updateUser, logout } = useUser();
  const { soundEnabled, toggleSound } = useSound();

  if (!user) return (
    <div className="flex h-96 items-center justify-center text-ink-muted">
      Not logged in. <Link href="/" className="ml-2 text-accent underline">Go home</Link>
    </div>
  );

  const accuracy = user.stats.totalQuestionsAnswered > 0
    ? Math.round((user.stats.totalCorrect / user.stats.totalQuestionsAnswered) * 100)
    : 0;

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="mb-8 flex items-center gap-5 rounded-2xl border border-white/8
                        bg-surface-2 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl
                          border border-white/10 bg-surface-3 text-4xl">
            {user.avatar}
          </div>
          <div>
            <h1 className="font-display text-3xl font-black text-ink">{user.name}</h1>
            <p className="text-sm text-ink-muted">{user.email}</p>
            <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-bold uppercase
                              ${user.role === "admin"
                                ? "bg-accent/20 text-accent"
                                : "bg-surface-3 text-ink-muted"}`}>
              {user.role}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { label: "Quizzes",  value: user.stats.totalQuizzesTaken },
            { label: "Accuracy", value: `${accuracy}%` },
            { label: "Streak",   value: `🔥${user.stats.streakDays}d` },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-white/8 bg-surface-2 p-4 text-center">
              <p className="font-display text-2xl font-black text-ink">{value}</p>
              <p className="text-xs text-ink-muted">{label}</p>
            </div>
          ))}
        </div>

        {/* Badges */}
        <h2 className="mb-3 font-semibold text-ink">Badges ({user.stats.badges.length})</h2>
        <div className="mb-6 flex flex-wrap gap-2">
          {user.stats.badges.map((b) => (
            <div key={b.id} title={b.description}
                 className="flex items-center gap-1.5 rounded-full border border-white/10
                            bg-surface-2 px-3 py-1.5 text-sm">
              {b.icon} <span className="text-ink font-medium">{b.label}</span>
            </div>
          ))}
          {user.stats.badges.length === 0 && (
            <p className="text-sm text-ink-muted">No badges yet — complete quizzes to earn them!</p>
          )}
        </div>

        {/* Completed courses */}
        <h2 className="mb-3 font-semibold text-ink">Completed Courses</h2>
        <div className="mb-6 flex flex-wrap gap-2">
          {user.stats.coursesCompleted.length > 0
            ? user.stats.coursesCompleted.map((cid) => {
                const c = COURSES.find((x) => x.id === cid);
                return c ? (
                  <span key={cid} className="flex items-center gap-1 rounded-full border
                                              border-white/10 bg-surface-2 px-3 py-1.5 text-sm text-ink">
                    {c.icon} {c.name}
                  </span>
                ) : null;
              })
            : <p className="text-sm text-ink-muted">No courses completed yet.</p>
          }
        </div>

        {/* Settings */}
        <h2 className="mb-3 font-semibold text-ink">Settings</h2>
        <div className="mb-6 space-y-3 rounded-2xl border border-white/8 bg-surface-2 p-5">
          {/* Sound */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink">Sound Effects</span>
            <button onClick={toggleSound}
                    className={`relative h-6 w-11 rounded-full transition-colors
                                ${soundEnabled ? "bg-accent" : "bg-surface-4"}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-surface-0 shadow
                                transition-transform ${soundEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>

          {/* Difficulty preference */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink">Preferred Difficulty</span>
            <select
              value={user.preferredDifficulty ?? "medium"}
              onChange={(e) => updateUser({ preferredDifficulty: e.target.value as "easy" | "medium" | "hard" })}
              className="rounded-lg border border-white/10 bg-surface-3 px-3 py-1
                         text-sm text-ink focus:border-accent/50 focus:outline-none"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <button onClick={logout}
                className="w-full rounded-xl border border-red-500/30 bg-red-500/10 py-3
                           text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/20
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
          Sign Out
        </button>
      </motion.div>
    </section>
  );
}