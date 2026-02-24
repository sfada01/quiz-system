"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  label: string;
  value: string | number;
  sub?: string;
  icon?: ReactNode;
  color?: string;
  index?: number;
}

export default function StatCard({ label, value, sub, icon, color = "#e8ff47", index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl border border-white/8 bg-surface-2 p-5"
    >
      {/* Glow */}
      <div
        className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-20 blur-xl"
        style={{ backgroundColor: color }}
      />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-ink-muted">{label}</p>
          <p className="mt-1 font-display text-3xl font-black text-ink">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-ink-muted">{sub}</p>}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
               style={{ backgroundColor: `${color}22` }}>
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}