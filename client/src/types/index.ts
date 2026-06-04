export interface User {
  id: string;
  username: string;
  email: string;
  xp: number;
  streak: number;
  hearts: number;
}

export interface Lesson {
  _id: string;
  title: string;
  language: string;
  topic: string;
  order: number;
  isCompleted: boolean;
  isLocked: boolean;
}

export interface Question {
  type: "multiple-choice" | "fill-blank" | "reorder";
  question: string;
  options?: string[];
  correct: string;
  xpReward: number;
}