"use client";

// ── Multiplayer ────────────────────────────────────────────
// TODO: Connect to real backend:
//   - WebSocket: ws://your-server/multiplayer
//   - Supabase Realtime channels
//   - Pusher / Ably
// Room codes should be stored in DB: POST /api/rooms

import { useState } from "react";
import { motion } from "framer-motion";
import { COURSES } from "@/data/course";
import MultiplayerLobby from "@/components/MultiplayerLobby";
import { useUser } from "@/context/UserContext";

function generateCode() {
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}

export default function MultiplayerPage() {
  const { user } = useUser();
  const [stage,      setStage]      = useState<"pick" | "lobby" | "game">("pick");
  const [mode,       setMode]       = useState<"create" | "join">("create");
  const [roomCode,   setRoomCode]   = useState(generateCode());
  const [joinCode,   setJoinCode]   = useState("");
  const [courseId,   setCourseId]   = useState("mathematics");
  const [gameStarted, setGameStarted] = useState(false);

  const handleCreate = () => {
    // TODO: POST /api/rooms { courseId, hostId: user.id } → returns roomCode
    setRoomCode(generateCode());
    setStage("lobby");
  };

  const handleJoin = () => {
    if (!joinCode.trim()) return;
    // TODO: POST /api/rooms/join { code: joinCode, userId: user.id }
    setRoomCode(joinCode.toUpperCase());
    setStage("lobby");
  };

  if (gameStarted) {
    return (
      <section className="mx-auto max-w-xl px-4 py-12 sm:px-6 text-center">
        <div className="rounded-2xl border border-white/8 bg-surface-2 p-10">
          <p className="text-6xl mb-4">🎮</p>
          <h2 className="font-display text-3xl font-black text-ink mb-2">Game in progress!</h2>
          <p className="text-ink-muted mb-6 text-sm">
            {/* TODO: Render live QuestionCard synced to room state */}
            Real-time quiz UI goes here — wire to WebSocket events.
          </p>
          <button onClick={() => { setStage("pick"); setGameStarted(false); }}
                  className="rounded-xl border border-white/10 px-6 py-2.5 text-sm text-ink-muted hover:text-ink">
            Leave Room
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-2 font-display text-4xl font-black text-ink">👥 MULTIPLAYER</h1>
        <p className="mb-8 text-ink-muted">Challenge friends in real time.</p>

        {stage === "pick" && (
          <div className="space-y-4">
            {/* Mode tabs */}
            <div className="flex gap-2">
              {(["create", "join"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)}
                        className={`flex-1 rounded-xl border py-3 text-sm font-semibold
                                    transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                                    ${mode === m
                                      ? "border-accent/40 bg-accent/10 text-accent"
                                      : "border-white/10 text-ink-muted hover:text-ink"}`}>
                  {m === "create" ? "Create Room" : "Join Room"}
                </button>
              ))}
            </div>

            {mode === "create" ? (
              <div className="rounded-2xl border border-white/8 bg-surface-2 p-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-ink-muted">
                    Select Course
                  </label>
                  <select value={courseId} onChange={(e) => setCourseId(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-surface-3 px-4 py-2.5
                                     text-sm text-ink focus:border-accent/50 focus:outline-none">
                    {COURSES.map((c) => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                </div>
                <button onClick={handleCreate}
                        className="w-full rounded-xl bg-accent py-3.5 font-bold text-surface-0
                                   hover:scale-[1.02] transition-transform active:scale-[0.98]">
                  Create Room
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/8 bg-surface-2 p-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-ink-muted">
                    Enter Room Code
                  </label>
                  <input value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                         placeholder="e.g. AB3X"
                         maxLength={4}
                         className="w-full rounded-xl border border-white/10 bg-surface-3 px-4 py-2.5
                                    text-center font-display text-3xl tracking-widest text-ink
                                    focus:border-accent/50 focus:outline-none uppercase"
                  />
                </div>
                <button onClick={handleJoin} disabled={joinCode.length < 4}
                        className="w-full rounded-xl bg-accent py-3.5 font-bold text-surface-0
                                   hover:scale-[1.02] transition-transform disabled:opacity-40">
                  Join Room
                </button>
              </div>
            )}
          </div>
        )}

        {stage === "lobby" && (
          <MultiplayerLobby
            roomCode={roomCode}
            isHost={mode === "create"}
            onStart={() => setGameStarted(true)}
          />
        )}
      </motion.div>
    </section>
  );
}