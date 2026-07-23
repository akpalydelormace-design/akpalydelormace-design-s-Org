export type Grade = "2nde" | "1ère" | "Terminale";

export type Subject =
  | "Mathématiques"
  | "Français"
  | "Anglais"
  | "SVT"
  | "Physique-Chimie"
  | "Philosophie"
  | "Histoire-Géographie";

export type Difficulty = "facile" | "moyen" | "difficile";

export interface LessonSection {
  title: string;
  content: string; // Markdown formatted content
}

export interface Lesson {
  id: string;
  subject: Subject;
  grade: Grade;
  chapterNo: number;
  chapterTitle: string;
  title: string;
  sections: LessonSection[];
  pdfAvailable: boolean;
  readingTime: number; // in minutes
  completed?: boolean;
  isPublished?: boolean;
  pdfUrl?: string;
  imageUrl?: string;
}

export interface Question {
  id: string;
  type: "qcm" | "vrai_faux" | "texte_libre";
  questionText: string;
  options?: string[]; // strictly for QCM
  correctAnswer: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: Subject;
  grade: Grade;
  chapterNo: number;
  chapterTitle: string;
  difficulty: Difficulty;
  questions: Question[];
  durationMinutes: number;
  recommended?: boolean;
}

export interface LearningHistory {
  id: string;
  type: "cours" | "quiz" | "defi_bac";
  itemTitle: string;
  subject: Subject;
  score?: number;
  totalQuestions?: number;
  date: string;
  xpEarned: number;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: Grade;
  xp: number;
  streak: number;
  completedLessonsCount: number;
  completedQuizzesCount: number;
  isAdmin?: boolean;
  notifications: AppNotification[];
  serie?: string; // e.g. "Série D", "Série C", "Série A1", etc.
  schoolYear?: string; // e.g. "2026-2027"
  isDisabled?: boolean;
  country?: string;
  schoolName?: string;
  profilePicture?: string;
  isOnboarded?: boolean;
  isEmailVerified?: boolean;
  password?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

export interface StudentGrade {
  id: string;
  subject: Subject;
  evaluationType: string; // e.g. "Devoir", "Interrogation"
  grade: number;
  maxGrade: number;
  coefficient: number;
  trimester: number; // 1, 2 or 3
  date: string;
  remark?: string;
}
