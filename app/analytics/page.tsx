"use client";

// ── Analytics Dashboard ────────────────────────────────────
// TODO: Replace MOCK_ADMIN_ANALYTICS with:
//   const data = await fetch("/api/analytics").then(r => r.json())
// For personal stats, use GET /api/analytics/user/:id

import { motion } from "framer-motion";
import { MOCK_ADMIN_ANALYTICS } from "@/data/mockAnalytics";
import { useUser } from "@/context/UserContext";
import StatCard from "@/components/StatCard";
import { TrendingUp, Users, BookOpen, Target, Clock, Flame } from "lucide-react";

function formatTime(ms: number) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
}

export default function AnalyticsPage() {
  const { user, isAdmin } = useUser();
  const data = MOCK_ADMIN_ANALYTICS;

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-2 font-display text-4xl font-black text-ink sm:text-5xl">
          📊 ANALYTICS
        </h1>
        <p className="mb-8 text-ink-muted">
          {isAdmin ? "Platform-wide statistics." : "Your personal performance stats."}
        </p>

        {/* ── Personal stats ── */}
        {user && (
          <>
            <h2 className="mb-4 font-display text-xl font-bold text-ink">Your Stats</h2>
            <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard label="Quizzes Taken"    value={user.stats.totalQuizzesTaken}
                        icon={<BookOpen size={18}/>} color="#6366f1" index={0} />
              <StatCard label="Average Score"    value={`${user.stats.averageScore}%`}
                        icon={<Target size={18}/>}   color="#e8ff47" index={1} />
              <StatCard label="Best Score"       value={`${user.stats.bestScore}%`}
                        icon={<TrendingUp size={18}/>} color="#10b981" index={2} />
              <StatCard label="Time Played"      value={formatTime(user.stats.totalTimePlayed)}
                        icon={<Clock size={18}/>}    color="#f59e0b" index={3} />
              <StatCard label="Day Streak"       value={`🔥 ${user.stats.streakDays}`}
                        icon={<Flame size={18}/>}    color="#ef4444" index={4} />
              <StatCard label="Correct Answers"
                        value={`${user.stats.totalCorrect}/${user.stats.totalQuestionsAnswered}`}
                        icon="✅" color="#10b981" index={5} />
            </div>

            {/* Badges */}
            <h2 className="mb-4 font-display text-xl font-bold text-ink">Badges</h2>
            <div className="mb-10 flex flex-wrap gap-3">
              {user.stats.badges.map((badge) => (
                <div key={badge.id}
                     className="flex items-center gap-2 rounded-full border border-white/10
                                bg-surface-2 px-4 py-2 text-sm font-medium text-ink"
                     title={badge.description}>
                  <span>{badge.icon}</span>
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Admin-only platform stats ── */}
        {isAdmin && (
          <>
            <h2 className="mb-4 font-display text-xl font-bold text-ink">Platform Overview</h2>
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Total Users"    value={data.totalUsers}    icon={<Users size={18}/>}      color="#6366f1" index={0} />
              <StatCard label="Active Today"   value={data.activeToday}   icon="🟢"                      color="#10b981" index={1} />
              <StatCard label="Total Quizzes"  value={data.totalQuizzes}  icon={<BookOpen size={18}/>}   color="#f59e0b" index={2} />
              <StatCard label="Avg Score"      value={`${data.avgScore}%`} icon={<Target size={18}/>}    color="#e8ff47" index={3} />
            </div>

            {/* Course stats table */}
            <h2 className="mb-4 font-display text-xl font-bold text-ink">Course Performance</h2>
            <div className="overflow-hidden rounded-2xl border border-white/8 bg-surface-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 text-xs uppercase tracking-widest text-ink-muted">
                    <th className="px-5 py-3 text-left">Course</th>
                    <th className="px-5 py-3 text-right">Attempts</th>
                    <th className="px-5 py-3 text-right">Avg Score</th>
                    <th className="px-5 py-3 text-right">Pass Rate</th>
                    <th className="px-5 py-3 text-right hidden sm:table-cell">Avg Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.courseStats.map((cs, i) => (
                    <motion.tr key={cs.courseId}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-surface-3 transition-colors">
                      <td className="px-5 py-3 font-medium text-ink">{cs.courseName}</td>
                      <td className="px-5 py-3 text-right text-ink-muted">{cs.attempts}</td>
                      <td className="px-5 py-3 text-right">
                        <span className={cs.avgScore >= 70 ? "text-emerald-400" : "text-amber-400"}>
                          {cs.avgScore}%
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className={cs.passRate >= 70 ? "text-emerald-400" : "text-red-400"}>
                          {cs.passRate}%
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right text-ink-muted hidden sm:table-cell">
                        {Math.round(cs.avgTimeMs / 1000)}s
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Daily activity chart (simple bar chart — no library) */}
            <h2 className="mb-4 mt-10 font-display text-xl font-bold text-ink">
              Daily Activity (last 30 days)
            </h2>
            <div className="rounded-2xl border border-white/8 bg-surface-2 p-6">
              <div className="flex items-end gap-1 h-32">
                {data.dailyActivity.map((day, i) => {
                  const maxQ = Math.max(...data.dailyActivity.map(d => d.quizzes));
                  const h = (day.quizzes / maxQ) * 100;
                  return (
                    <div key={day.date} className="group flex-1 flex flex-col items-center gap-1"
                         title={`${day.date}: ${day.quizzes} quizzes, avg ${day.score}%`}>
                      <div className="w-full rounded-t-sm bg-accent/60 transition-all hover:bg-accent"
                           style={{ height: `${h}%`, minHeight: 2 }} />
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 flex justify-between text-xs text-ink-faint">
                <span>30 days ago</span><span>Today</span>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </section>
  );
}