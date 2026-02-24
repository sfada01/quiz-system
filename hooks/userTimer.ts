import { useState, useEffect, useRef, useCallback } from "react";

interface Options {
  initialSeconds: number;
  enabled: boolean;
  onExpire?: () => void;
}

export function useTimer({ initialSeconds, enabled, onExpire }: Options) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  const reset = useCallback(() => {
    clear();
    setSecondsLeft(initialSeconds);
    if (!enabled) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { clear(); onExpire?.(); return 0; }
        return s - 1;
      });
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clear, enabled, initialSeconds]);

  useEffect(() => { reset(); return clear; }, [enabled]); // eslint-disable-line

  return { secondsLeft, reset };
}