"use client";

// ── LeaderboardTable ───────────────────────────────────────
// Displays ranked entries with medals, scores, and times.
// TODO: Accept real data from GET /api/leaderboard

import { motion } from "framer-motion";
import { LeaderboardEntry } from "@/types";
import UserAvatar from "./UserAvatar";

interface Props {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

const MEDALS = ["🥇", "🥈", "🥉"];

function formatTime(ms: number) {
  const s = Math.floor(ms / 1000);
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
}

export default function LeaderboardTable({ entries, currentUserId }: Props) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/8 bg-surface-2">
      {/* Header */}
      <div className="grid grid-cols-[2rem_1fr_5rem_5rem_4rem] gap-3 border-b border-white/8
                      px-5 py-3 text-xs font-semibold uppercase tracking-widest text-ink-muted">
        <span>#</span>
        <span>Player</span>
        <span className="text-right">Score</span>
        <span className="text-right">Time</span>
        <span className="text-right">Mode</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {entries.map((entry, i) => {
          const isMe = entry.userId === currentUserId;
          return (
            <motion.div
              key={`${entry.userId}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`grid grid-cols-[2rem_1fr_5rem_5rem_4rem] items-center gap-3 px-5 py-3.5
                          transition-colors hover:bg-surface-3
                          ${isMe ? "bg-accent/5 border-l-2 border-l-accent" : ""}`}
            >
              {/* Rank */}
              <span className="text-center text-lg">
                {i < 3 ? MEDALS[i] : <span className="text-sm font-bold text-ink-muted">{i + 1}</span>}
              </span>

              {/* Player */}
              <div className="flex items-center gap-2 min-w-0">
                <UserAvatar avatar={entry.avatar} name={entry.name} size="sm" />
                <div className="min-w-0">
                  <p className={`truncate text-sm font-semibold ${isMe ? "text-accent" : "text-ink"}`}>
                    {entry.name} {isMe && "(you)"}
                  </p>
                  <p className="truncate text-xs text-ink-muted">{entry.courseName}</p>
                </div>
              </div>

              {/* Score */}
              <p className="text-right text-sm font-bold text-ink">{entry.score}%</p>

              {/* Time */}
              <p className="text-right text-xs text-ink-muted">{formatTime(entry.timeTaken)}</p>

              {/* Mode */}
              <span className={`text-right text-[10px] font-semibold uppercase tracking-wide
                               ${entry.mode === "speedrun" ? "text-amber-400" : "text-ink-faint"}`}>
                {entry.mode}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}