// ── Mock analytics data ────────────────────────────────────
// TODO: Replace with real API: GET /api/analytics/admin
// Aggregate from DB: GROUP BY date, courseId, etc.

import { AdminAnalytics } from "@/types";
import { MOCK_LEADERBOARD } from "./ockLeaderboard";

// Helper: generate last N days of activity
function generateDailyActivity(days: number) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return {
      date: d.toISOString().split("T")[0],
      quizzes: Math.floor(Math.random() * 40) + 5,
      score: Math.floor(Math.random() * 30) + 60,
    };
  });
}

export const MOCK_ADMIN_ANALYTICS: AdminAnalytics = {
  totalUsers: 248,
  activeToday: 34,
  totalQuizzes: 1847,
  avgScore: 74,
  dailyActivity: generateDailyActivity(30),
  courseStats: [
    { courseId: "mathematics",     courseName: "Mathematics",     attempts: 512, avgScore: 72, passRate: 68, avgTimeMs: 180000 },
    { courseId: "biology",         courseName: "Biology",         attempts: 438, avgScore: 78, passRate: 74, avgTimeMs: 165000 },
    { courseId: "computer-science",courseName: "Computer Science",attempts: 391, avgScore: 81, passRate: 79, avgTimeMs: 142000 },
    { courseId: "history",         courseName: "World History",   attempts: 506, avgScore: 69, passRate: 63, avgTimeMs: 198000 },
  ],
  topPerformers: MOCK_LEADERBOARD.slice(0, 5),
};