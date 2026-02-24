"use client";

// ── MultiplayerLobby ───────────────────────────────────────
// Shows room waiting screen with player list.
// TODO: Replace mock state with real WebSocket / Supabase Realtime:
//   const channel = supabase.channel(`room:${roomId}`)
//   channel.on("presence", ...) .subscribe()
//
// TODO: Or use Pusher: pusher.subscribe(`room-${roomId}`)

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Crown, Wifi } from "lucide-react";
import { MultiplayerPlayer } from "@/types";

// Mock initial players
const MOCK_PLAYERS: MultiplayerPlayer[] = [
  { userId: "user_001", name: "Alex Johnson", avatar: "🧑‍💻", score: 0, answered: false, ready: true  },
  { userId: "user_002", name: "Maria Garcia", avatar: "👩‍🎓", score: 0, answered: false, ready: true  },
  { userId: "user_003", name: "James Okafor", avatar: "🧑‍🔬", score: 0, answered: false, ready: false },
];

interface Props {
  roomCode: string;
  onStart: () => void;
  isHost?: boolean;
}

export default function MultiplayerLobby({ roomCode, onStart, isHost = true }: Props) {
  const [players, setPlayers] = useState<MultiplayerPlayer[]>(MOCK_PLAYERS);
  const [copied,  setCopied]  = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulate a player joining (mock)
  // TODO: Remove this — players join via WebSocket events
  const simulateJoin = () => {
    const bots = ["👩‍💼 Priya", "🧑‍🎨 Leo", "👩‍🔬 Zara"];
    if (players.length >= 6) return;
    setPlayers((p) => [
      ...p,
      {
        userId: `bot_${Date.now()}`,
        name: bots[Math.floor(Math.random() * bots.length)].slice(3),
        avatar: bots[Math.floor(Math.random() * bots.length)].slice(0, 2),
        score: 0, answered: false, ready: true,
      },
    ]);
  };

  return (
    <div className="mx-auto max-w-lg w-full">
      {/* Room code banner */}
      <div className="mb-6 rounded-2xl border border-accent/30 bg-accent/8 p-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-1">
          Room Code
        </p>
        <p className="font-display text-5xl font-black tracking-widest text-accent">
          {roomCode}
        </p>
        <button
          onClick={copyCode}
          className="mt-3 flex items-center gap-1.5 mx-auto text-xs text-ink-muted
                     hover:text-ink transition-colors"
        >
          <Copy size={12} />
          {copied ? "Copied!" : "Copy code"}
        </button>
      </div>

      {/* Players */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-ink">
          Players ({players.length}/6)
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
          <Wifi size={12} />
          {/* TODO: Show real connection status from WebSocket */}
          Connected
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <AnimatePresence>
          {players.map((p, i) => (
            <motion.div
              key={p.userId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 rounded-xl border border-white/8
                         bg-surface-2 px-4 py-3"
            >
              <span className="text-xl">{p.avatar}</span>
              <span className="flex-1 text-sm font-medium text-ink">{p.name}</span>
              {i === 0 && <Crown size={14} className="text-accent" />}
              <span className={`text-xs font-semibold ${p.ready ? "text-emerald-400" : "text-ink-muted"}`}>
                {p.ready ? "Ready ✓" : "Waiting…"}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Dev helper — remove in production */}
      <button onClick={simulateJoin} className="mb-3 w-full rounded-xl border border-white/8 py-2
                                                 text-xs text-ink-muted hover:text-ink transition-colors">
        + Simulate player joining (dev only)
      </button>

      {isHost && (
        <button
          onClick={onStart}
          disabled={players.length < 2}
          className="w-full rounded-xl bg-accent py-4 font-bold text-surface-0
                     transition-transform hover:scale-[1.02] active:scale-[0.98]
                     disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Start Game →
        </button>
      )}
      {!isHost && (
        <p className="text-center text-sm text-ink-muted">
          Waiting for host to start…
        </p>
      )}
    </div>
  );
}