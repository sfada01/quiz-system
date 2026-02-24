// ── Core domain types ──────────────────────────────────────

export type Option = string;

export interface Question {
  id: string;
  question: string;
  options: Option[];
  correctIndex: number;
  explanation?: string;
}

export interface Course {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string; // hex — used for card theming
  questions: Question[];
}

// ── Quiz session ───────────────────────────────────────────

/** Map of questionId → chosen option index */
export type AnswerMap = Record<string, number>;

export interface QuizSession {
  courseId: string;
  answers: AnswerMap;
  score: number;
  totalQuestions: number;
  completed: boolean;
  startedAt: number;
  finishedAt?: number;
}

// ── AI extraction ──────────────────────────────────────────

export interface ExtractedQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface ExtractResponse {
  questions: ExtractedQuestion[];
}

// ── Theme ──────────────────────────────────────────────────
export type Theme = "dark" | "light";