"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, BookOpen, Users, Layers } from "lucide-react";
import Link from "next/link";
import { COURSES } from "@/data//course";
import CourseCard  from "@/components/CourseCard";
import SplashScreen from "@/components/SplashScreen";
import { useUser }  from "@/context/UserContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function HomePage() {
  const { user } = useUser();
  const [hasSeenSplash, setHasSeenSplash] = useLocalStorage("quiz-seen-splash", false);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    if (!hasSeenSplash) setShowSplash(true);
  }, []); // eslint-disable-line

  const handleSplashDone = () => {
    setShowSplash(false);
    setHasSeenSplash(true);
  };

  const modes = [
    { href: "/speedrun",    icon: Zap,      label: "Speed Run",   desc: "Race against the clock",  color: "#f59e0b" },
    { href: "/flashcards",  icon: Layers,   label: "Flashcards",  desc: "Study mode with flip cards", color: "#6366f1" },
    { href: "/multiplayer", icon: Users,    label: "Multiplayer", desc: "Challenge friends live",  color: "#10b981" },
    { href: "/quiz",        icon: BookOpen, label: "Standard",    desc: "Classic quiz mode",       color: "#e8ff47" },
  ];

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashDone} />}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Hero */}
        <div className="mb-10 text-center">
          {user && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="mb-2 text-sm text-ink-muted">
              Welcome back, <span className="text-accent font-semibold">{user.name}</span> {user.avatar}
              {" "}·{" "}
              <span className="text-ink-muted">🔥 {user.stats.streakDays} day streak</span>
            </motion.p>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl font-black leading-none tracking-tight text-ink sm:text-7xl"
          >
            CHOOSE YOUR<br /><span className="text-accent">CHALLENGE</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    className="mt-4 text-base text-ink-muted">
            Pick a mode and a course to get started.
          </motion.p>
        </div>

        {/* Quiz modes */}
        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {modes.map(({ href, icon: Icon, label, desc, color }, i) => (
            <motion.div key={href}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
            >
              <Link href={href}
                    className="group flex flex-col items-center gap-2 rounded-2xl border
                               border-white/8 bg-surface-2 p-5 text-center transition-all
                               hover:border-white/15 hover:-translate-y-1 hover:shadow-lg
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl"
                     style={{ backgroundColor: `${color}22`, border: `1px solid ${color}44` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <p className="text-sm font-bold text-ink">{label}</p>
                <p className="text-xs text-ink-muted">{desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Course grid */}
        <h2 className="mb-5 font-display text-2xl font-bold text-ink">
          All Courses
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" role="list">
          {COURSES.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}