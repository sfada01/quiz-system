"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, Sun, Moon, Upload, Home, Trophy,
         BarChart2, User, Shield, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useUser }  from "@/context/UserContext";
import { useSound } from "@/context/SoundContext";
import UserAvatar   from "./UserAvatar";

export default function Navbar() {
  const { theme, toggleTheme }   = useTheme();
  const { user, isAdmin, switchRole } = useUser();
  const { soundEnabled, toggleSound } = useSound();
  const pathname = usePathname();

  const links = [
    { href: "/",            label: "Home",        icon: Home    },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy  },
    { href: "/analytics",   label: "Stats",       icon: BarChart2 },
    { href: "/upload",      label: "Add Q's",     icon: Upload  },
    ...(isAdmin ? [{ href: "/admin", label: "Admin", icon: Shield }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-surface-1/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6"
           aria-label="Main navigation">

        {/* Logo */}
        <Link href="/" aria-label="QuizOS home"
              className="flex items-center gap-2 font-display text-lg font-bold tracking-tight
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-surface-0">
            <Brain size={18} strokeWidth={2.5} />
          </span>
          <span className="hidden sm:inline">S_Fada <span className="text-accent">TestBrain</span></span>
        </Link>

        {/* Nav links */}
        <ul className="hidden items-center gap-0.5 md:flex">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link href={href} aria-current={active ? "page" : undefined}
                      className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm
                                  font-medium transition-colors focus-visible:outline-none
                                  focus-visible:ring-2 focus-visible:ring-accent
                                  ${active ? "text-accent" : "text-ink-muted hover:text-ink"}`}>
                  {active && (
                    <motion.span layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-accent/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />
                  )}
                  <Icon size={14} />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Sound toggle */}
          <button onClick={toggleSound} aria-label="Toggle sound" aria-pressed={soundEnabled}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10
                             text-ink-muted transition-colors hover:border-accent/50 hover:text-accent
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          {/* Theme toggle */}
          <button onClick={toggleTheme} aria-label="Toggle theme"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10
                             text-ink-muted transition-colors hover:border-accent/50 hover:text-accent
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Profile / role switch */}
          {user && (
            <Link href="/profile"
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full">
              <UserAvatar avatar={user.avatar} name={user.name} size="sm" />
            </Link>
          )}

          {/* Dev: role switcher — remove in production */}
          <button onClick={switchRole} title="Toggle admin (dev only)"
                  className="hidden sm:flex h-7 px-2 items-center rounded border border-dashed
                             border-white/20 text-[10px] text-ink-faint hover:text-ink transition-colors">
            {isAdmin ? "→ Student" : "→ Admin"}
          </button>
        </div>
      </nav>
    </header>
  );
}