// ── useLocalStorage ────────────────────────────────────────
// Persists state to localStorage with SSR safety.
// TODO: For multi-device sync, replace localStorage with
//       a real DB call: PATCH /api/users/:id/preferences

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setValue(JSON.parse(stored) as T);
    } catch {}
  }, [key]);

  const set = (val: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const next = typeof val === "function" ? (val as (p: T) => T)(prev) : val;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  return [value, set] as const;
}