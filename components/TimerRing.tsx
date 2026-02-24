"use client";

interface Props {
  secondsLeft: number;
  totalSeconds?: number;
}

export default function TimerRing({ secondsLeft, totalSeconds = 30 }: Props) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - secondsLeft / totalSeconds);
  const color =
    secondsLeft > totalSeconds * 0.5 ? "#e8ff47" :
    secondsLeft > totalSeconds * 0.25 ? "#f59e0b" : "#ef4444";

  return (
    <div
      className="relative flex h-14 w-14 items-center justify-center"
      role="timer"
      aria-label={`${secondsLeft} seconds remaining`}
    >
      <svg className="-rotate-90" width="56" height="56" viewBox="0 0 56 56" aria-hidden>
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
        <circle
          cx="28" cy="28" r={r} fill="none"
          stroke={color} strokeWidth="3" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s ease" }}
        />
      </svg>
      <span className="absolute text-sm font-bold tabular-nums" style={{ color }}>
        {secondsLeft}
      </span>
    </div>
  );
}