"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, Sun, Moon, Upload, Home } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const links = [
    { href: "/",       label: "Home",          icon: Home   },
    { href: "/upload", label: "Add Questions",  icon: Upload },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-surface-1/80 backdrop-blur-xl">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="QuizOS home"
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-surface-0">
            <Brain size={18} strokeWidth={2.5} />
          </span>
          <span className="hidden sm:inline">
            Quiz<span className="text-accent">OS</span>
          </span>
        </Link>

        {/* Nav links */}
        <ul className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm
                              font-medium transition-colors focus-visible:outline-none
                              focus-visible:ring-2 focus-visible:ring-accent
                              ${active ? "text-accent" : "text-ink-muted hover:text-ink"}`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-accent/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <Icon size={15} />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10
                     text-ink-muted transition-colors hover:border-accent/50 hover:text-accent
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </nav>
    </header>
  );
}