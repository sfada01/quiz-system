"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { ArrowRight, Sparkles } from "lucide-react";

export default function OnboardingPage() {
  const { user, updateUser } = useUser();
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🚀");

  const avatars = ["🚀", "🧠", "⚡", "🔥", "🎨", "🧪", "🌟", "👾"];

  // If the user already has a custom name (not mock), redirect them home
  useEffect(() => {
    if (user && user.name !== "Mock User") {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Use your existing context's updateUser method
    updateUser({
      name: name.trim(),
      avatar: avatar,
    });

    router.push("/");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-1 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-white/8 bg-surface-2 p-8 shadow-2xl"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/20 text-3xl">
            {avatar}
          </div>
          <h1 className="font-display text-3xl font-black text-ink">WELCOME</h1>
          <p className="text-ink-muted text-sm">Let's personalize your experience.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-ink-muted">Your Name</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full rounded-xl border border-white/10 bg-surface-1 p-4 text-ink outline-none focus:border-accent"
              required
            />
          </div>

          <div>
            <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-ink-muted">Choose Avatar</label>
            <div className="grid grid-cols-4 gap-3">
              {avatars.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAvatar(a)}
                  className={`flex h-12 items-center justify-center rounded-xl text-2xl transition-all ${
                    avatar === a ? "bg-accent scale-110 shadow-lg" : "bg-surface-1 hover:bg-white/5"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-accent p-4 font-bold text-surface-1 transition-transform active:scale-95 disabled:opacity-50"
          >
            Start Learning <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </form>
      </motion.div>
    </main>
  );
}