"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MOCK_LEADERBOARD } from "@/data/ockLeaderboard";
import { COURSES } from "@/data/course";
import LeaderboardTable from "@/components/LeaderboardTable";
import { useUser } from "@/context/UserContext";

// TODO: Fetch from GET /api/leaderboard?courseId=all&mode=all
// useEffect(() => { fetch("/api/leaderboard").then(r=>r.json()).then(setEntries) }, [])

export default function LeaderboardPage() {
  const { user } = useUser();
  const [courseFilter, setCourseFilter] = useState("all");
  const [modeFilter,   setModeFilter]   = useState("all");

  const filtered = MOCK_LEADERBOARD.filter((e) => {
    const matchCourse = courseFilter === "all" || e.courseId === courseFilter;
    const matchMode   = modeFilter   === "all" || e.mode     === modeFilter;
    return matchCourse && matchMode;
  });

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}>
        <h1 className="mb-2 font-display text-4xl font-black text-ink sm:text-5xl">
          🏆 LEADERBOARD
        </h1>
        <p className="mb-8 text-ink-muted">Top scores across all courses and modes.</p>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}
                  aria-label="Filter by course"
                  className="rounded-xl border border-white/10 bg-surface-2 px-4 py-2
                             text-sm text-ink focus:border-accent/50 focus:outline-none">
            <option value="all">All Courses</option>
            {COURSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <select value={modeFilter} onChange={(e) => setModeFilter(e.target.value)}
                  aria-label="Filter by mode"
                  className="rounded-xl border border-white/10 bg-surface-2 px-4 py-2
                             text-sm text-ink focus:border-accent/50 focus:outline-none">
            <option value="all">All Modes</option>
            <option value="standard">Standard</option>
            <option value="speedrun">Speed Run</option>
            <option value="written">Written</option>
          </select>
        </div>

        <LeaderboardTable entries={filtered} currentUserId={user?.id} />
      </motion.div>
    </section>
  );
}