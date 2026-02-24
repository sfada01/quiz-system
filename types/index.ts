// ── Core Quiz Types ────────────────────────────────────────

export type Option = string;
export type Difficulty = "easy" | "medium" | "hard";
export type QuizMode = "standard" | "speedrun" | "written" | "flashcard" | "multiplayer";

export interface Question {
  id: string;
  question: string;
  options: Option[];
  correctIndex: number;
  explanation?: string;
  difficulty?: Difficulty;
  tags?: string[];
  // Written answer mode
  acceptedAnswers?: string[]; // list of valid written answers
}

export interface Course {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  questions: Question[];
  difficulty?: Difficulty;
  category?: string;
  createdBy?: string; // userId
  createdAt?: number;
  isPublished?: boolean;
}

// ── Quiz Session ───────────────────────────────────────────

export type AnswerMap = Record<string, number | string>; // questionId → index or written text

export interface QuizSession {
  courseId: string;
  mode: QuizMode;
  answers: AnswerMap;
  score: number;
  totalQuestions: number;
  completed: boolean;
  startedAt: number;
  finishedAt?: number;
  timePerQuestion?: number[]; // ms spent on each question
  streakCount?: number;        // current correct streak
  bestStreak?: number;
}

// ── User & Profiles ────────────────────────────────────────

export type UserRole = "student" | "admin";

export interface UserStats {
  totalQuizzesTaken: number;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  averageScore: number;       // percentage
  bestScore: number;          // percentage
  totalTimePlayed: number;    // ms
  streakDays: number;         // consecutive days
  coursesCompleted: string[]; // courseIds
  badges: Badge[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;           // emoji or URL
  role: UserRole;
  joinedAt: number;
  stats: UserStats;
  preferredDifficulty?: Difficulty;
  soundEnabled?: boolean;
}

// ── Badges ─────────────────────────────────────────────────

export interface Badge {
  id: string;
  label: string;
  icon: string;
  description: string;
  earnedAt?: number;
}

// ── Leaderboard ────────────────────────────────────────────

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatar: string;
  score: number;        // percentage
  rawScore: number;     // points
  courseId: string;
  courseName: string;
  timeTaken: number;    // ms
  completedAt: number;
  mode: QuizMode;
}

// ── Analytics ──────────────────────────────────────────────

export interface DailyActivity {
  date: string;     // "YYYY-MM-DD"
  quizzes: number;
  score: number;    // average %
}

export interface CourseAnalytics {
  courseId: string;
  courseName: string;
  attempts: number;
  avgScore: number;
  passRate: number; // %
  avgTimeMs: number;
}

export interface AdminAnalytics {
  totalUsers: number;
  activeToday: number;
  totalQuizzes: number;
  avgScore: number;
  dailyActivity: DailyActivity[];
  courseStats: CourseAnalytics[];
  topPerformers: LeaderboardEntry[];
}

// ── Multiplayer ────────────────────────────────────────────

export type RoomStatus = "waiting" | "playing" | "finished";

export interface MultiplayerRoom {
  id: string;
  courseId: string;
  hostId: string;
  players: MultiplayerPlayer[];
  status: RoomStatus;
  currentQuestion: number;
  createdAt: number;
}

export interface MultiplayerPlayer {
  userId: string;
  name: string;
  avatar: string;
  score: number;
  answered: boolean;
  ready: boolean;
}

// ── AI Extract ─────────────────────────────────────────────

export interface ExtractedQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  difficulty?: Difficulty;
}

export interface ExtractResponse {
  questions: ExtractedQuestion[];
}

// ── Theme ──────────────────────────────────────────────────
export type Theme = "dark" | "light";