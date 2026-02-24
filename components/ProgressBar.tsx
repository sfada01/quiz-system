"use client";

import { motion } from "framer-motion";

interface Props {
  current: number; // 1-based
  total: number;
  color?: string;
}

export default function ProgressBar({ current, total, color = "#e8ff47" }: Props) {
  const pct = Math.round((current / total) * 100);

  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Question ${current} of ${total}`}
    >
      <div className="mb-1.5 flex justify-between text-xs text-ink-muted">
        <span>Question <strong className="text-ink">{current}</strong> of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}