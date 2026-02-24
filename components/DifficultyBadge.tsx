"use client";

import { Difficulty } from "@/types";

interface Props {
  difficulty: Difficulty;
  size?: "sm" | "md";
}

const config = {
  easy:   { label: "Easy",   color: "text-emerald-400 bg-emerald-400/15 border-emerald-400/30" },
  medium: { label: "Medium", color: "text-amber-400 bg-amber-400/15 border-amber-400/30"       },
  hard:   { label: "Hard",   color: "text-red-400 bg-red-400/15 border-red-400/30"             },
};

export default function DifficultyBadge({ difficulty, size = "sm" }: Props) {
  const { label, color } = config[difficulty];
  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold uppercase tracking-wide
                  ${color}
                  ${size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"}`}
    >
      {label}
    </span>
  );
}