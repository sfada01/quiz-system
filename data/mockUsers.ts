// ── Mock user data ─────────────────────────────────────────
// TODO: Replace with real DB calls (Supabase / Firebase / Prisma)
// API pattern: GET /api/users, GET /api/users/:id

import { User } from "@/types";

export const MOCK_CURRENT_USER: User = {
  id: "user_001",
  name: "Hassan Gambo",
  email: "alex@example.com",
  avatar: "🧑‍💻",
  role: "student",
  joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 30, // 30 days ago
  preferredDifficulty: "medium",
  soundEnabled: true,
  stats: {
    totalQuizzesTaken: 47,
    totalQuestionsAnswered: 940,
    totalCorrect: 752,
    averageScore: 80,
    bestScore: 100,
    totalTimePlayed: 1000 * 60 * 180, // 3 hours
    streakDays: 7,
    coursesCompleted: ["mathematics", "biology"],
    badges: [
      { id: "b1", label: "First Quiz", icon: "🎯", description: "Completed your first quiz", earnedAt: Date.now() - 86400000 * 28 },
      { id: "b2", label: "Perfect Score", icon: "💯", description: "Got 100% on any quiz", earnedAt: Date.now() - 86400000 * 14 },
      { id: "b3", label: "Week Streak", icon: "🔥", description: "7 days in a row", earnedAt: Date.now() - 86400000 * 1 },
      { id: "b4", label: "Speed Demon", icon: "⚡", description: "Finished a speedrun under 60s", earnedAt: Date.now() - 86400000 * 5 },
    ],
  },
};

export const MOCK_ADMIN_USER: User = {
  id: "user_admin",
  name: "Dr. Sarah Chen",
  email: "admin@quizos.com",
  avatar: "👩‍🏫",
  role: "admin",
  joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 365,
  stats: {
    totalQuizzesTaken: 0,
    totalQuestionsAnswered: 0,
    totalCorrect: 0,
    averageScore: 0,
    bestScore: 0,
    totalTimePlayed: 0,
    streakDays: 0,
    coursesCompleted: [],
    badges: [],
  },
};

export const MOCK_ALL_USERS: User[] = [
  MOCK_CURRENT_USER,
  {
    id: "user_002",
    name: "Kamal Sheikh",
    email: "maria@example.com",
    avatar: "👩‍🎓",
    role: "student",
    joinedAt: Date.now() - 86400000 * 45,
    stats: {
      totalQuizzesTaken: 62,
      totalQuestionsAnswered: 1240,
      totalCorrect: 1054,
      averageScore: 85,
      bestScore: 100,
      totalTimePlayed: 1000 * 60 * 240,
      streakDays: 12,
      coursesCompleted: ["mathematics", "biology", "history"],
      badges: [
        { id: "b1", label: "First Quiz",   icon: "🎯", description: "First quiz done" },
        { id: "b2", label: "Perfect Score", icon: "💯", description: "100% score" },
        { id: "b5", label: "Bookworm",     icon: "📚", description: "Completed 3 courses" },
      ],
    },
  },
  {
    id: "user_003",
    name: "Abdul Ustazu",
    email: "abdul@example.com",
    avatar: "🧑‍🔬",
    role: "student",
    joinedAt: Date.now() - 86400000 * 20,
    stats: {
      totalQuizzesTaken: 28,
      totalQuestionsAnswered: 560,
      totalCorrect: 392,
      averageScore: 70,
      bestScore: 95,
      totalTimePlayed: 1000 * 60 * 90,
      streakDays: 3,
      coursesCompleted: ["computer-science"],
      badges: [
        { id: "b1", label: "First Quiz", icon: "🎯", description: "First quiz done" },
      ],
    },
  },
  {
    id: "user_004",
    name: "Adam M Adam",
    email: "adam@example.com",
    avatar: "👩‍💼",
    role: "student",
    joinedAt: Date.now() - 86400000 * 60,
    stats: {
      totalQuizzesTaken: 91,
      totalQuestionsAnswered: 1820,
      totalCorrect: 1656,
      averageScore: 91,
      bestScore: 100,
      totalTimePlayed: 1000 * 60 * 360,
      streakDays: 21,
      coursesCompleted: ["mathematics", "biology", "history", "computer-science"],
      badges: [
        { id: "b1", label: "First Quiz",    icon: "🎯", description: "First quiz done" },
        { id: "b2", label: "Perfect Score", icon: "💯", description: "100% score" },
        { id: "b3", label: "Week Streak",   icon: "🔥", description: "7-day streak" },
        { id: "b6", label: "Champion",      icon: "🏆", description: "Top of leaderboard" },
      ],
    },
  },
  MOCK_ADMIN_USER,
];