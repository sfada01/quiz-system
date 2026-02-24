"use client";

// ── SoundContext ───────────────────────────────────────────
// Manages sound effects using the Web Audio API.
// No external library needed — pure browser API.
//
// TODO: Replace tone generation with real audio files:
//   import correctSfx from "@/public/sounds/correct.mp3"
//   const audio = new Audio(correctSfx); audio.play();

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";

interface SoundContextValue {
  soundEnabled: boolean;
  toggleSound: () => void;
  playCorrect:  () => void;
  playWrong:    () => void;
  playComplete: () => void;
  playTick:     () => void;
  playClick:    () => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Lazy-init AudioContext on first interaction (browser policy)
  const getCtx = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }, []);

  // Low-level tone generator
  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine", gain = 0.3) => {
      if (!soundEnabled) return;
      const ctx = getCtx();
      if (!ctx) return;

      const oscillator = ctx.createOscillator();
      const gainNode   = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type      = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      gainNode.gain.setValueAtTime(gain, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    },
    [soundEnabled, getCtx]
  );

  const toggleSound  = useCallback(() => setSoundEnabled((s) => !s), []);

  // TODO: Replace these with real audio files for production
  const playCorrect  = useCallback(() => { playTone(523, 0.15); setTimeout(() => playTone(659, 0.15), 100); }, [playTone]);
  const playWrong    = useCallback(() => { playTone(200, 0.3, "sawtooth", 0.2); }, [playTone]);
  const playComplete = useCallback(() => {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 0.2), i * 120));
  }, [playTone]);
  const playTick     = useCallback(() => playTone(800, 0.05, "square", 0.1), [playTone]);
  const playClick    = useCallback(() => playTone(440, 0.08, "sine", 0.15), [playTone]);

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, playCorrect, playWrong, playComplete, playTick, playClick }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be inside <SoundProvider>");
  return ctx;
}