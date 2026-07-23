import { UserProfile, LearningHistory, AppNotification, Lesson, Quiz, StudentGrade } from "../types";
import { SAMPLE_LESSONS } from "../data/coursesData";
import { SAMPLE_QUIZZES } from "../data/quizzesData";
import { generateAllSyllabusLessons, generateAllSyllabusQuizzes } from "../data/syllabusGenerator";

const PROFILE_KEY = "edumentor_user_profile";
const HISTORY_KEY = "edumentor_learning_history";
const COMPLETED_LESSONS_KEY = "edumentor_completed_lessons";
const COMPLETED_QUIZZES_KEY = "edumentor_completed_quizzes";

const USERS_KEY = "edumentor_users";
const LOGS_KEY = "edumentor_admin_logs";
const CITATIONS_KEY = "edumentor_citations";
const SETTINGS_KEY = "edumentor_settings";
const LESSONS_KEY = "edumentor_lessons";
const QUIZZES_KEY = "edumentor_quizzes";

export interface AdminLog {
  id: string;
  adminEmail: string;
  adminName: string;
  action: string;
  target: string;
  date: string;
}

export interface Citation {
  id: string;
  text: string;
  author: string;
  category: string;
}

export interface AppSettings {
  appName: string;
  schoolYear: string;
  allowAiRegistrations: boolean;
  maintenanceMode: boolean;
  automaticBackups: boolean;
  notificationsEnabled: boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  grade: "Terminale",
  serie: "Série D",
  schoolYear: "2026-2027",
  country: "Côte d'Ivoire",
  schoolName: "",
  xp: 0,
  streak: 0,
  completedLessonsCount: 0,
  completedQuizzesCount: 0,
  isAdmin: false,
  isDisabled: false,
  isOnboarded: false,
  isEmailVerified: false,
  notifications: []
};

export interface Country {
  code: string;
  name: string;
}

export interface SchoolClass {
  id: string;
  name: string;
}

export interface Serie {
  id: string;
  name: string;
}

export interface SchoolYear {
  id: string;
  name: string;
}

export const COUNTRIES_TABLE: Country[] = [
  { code: "CI", name: "Côte d'Ivoire" },
  { code: "SN", name: "Sénégal" },
  { code: "CM", name: "Cameroun" },
  { code: "TG", name: "Togo" },
  { code: "BJ", name: "Bénin" },
  { code: "BF", name: "Burkina Faso" },
  { code: "ML", name: "Mali" },
  { code: "NE", name: "Niger" },
  { code: "GA", name: "Gabon" },
];

export const CLASSES_TABLE: SchoolClass[] = [
  { id: "2nde", name: "Seconde (2nde)" },
  { id: "1ère", name: "Première (1ère)" },
  { id: "Terminale", name: "Terminale (Tle)" },
];

export const SERIES_TABLE: Serie[] = [
  { id: "Série A1", name: "Série A1" },
  { id: "Série A2", name: "Série A2" },
  { id: "Série C", name: "Série C" },
  { id: "Série D", name: "Série D" },
  { id: "Série E", name: "Série E" },
];

export const SCHOOL_YEARS_TABLE: SchoolYear[] = [
  { id: "2025-2026", name: "Année Scolaire 2025-2026" },
  { id: "2026-2027", name: "Année Scolaire 2026-2027" },
  { id: "2027-2028", name: "Année Scolaire 2027-2028" },
  { id: "2028-2029", name: "Année Scolaire 2028-2029" },
];

const DEFAULT_USERS: UserProfile[] = [
  {
    id: "u_admin",
    firstName: "Moïse",
    lastName: "Gognin",
    email: "louamoisegognin@gmail.com",
    password: "admin123",
    grade: "Terminale",
    serie: "Série D",
    schoolYear: "2026-2027",
    country: "Côte d'Ivoire",
    schoolName: "Direction Générale EduMentor",
    xp: 0,
    streak: 0,
    completedLessonsCount: 0,
    completedQuizzesCount: 0,
    isAdmin: true,
    isDisabled: false,
    isOnboarded: true,
    isEmailVerified: true,
    notifications: []
  }
];

const DEFAULT_CITATIONS: Citation[] = [];

const DEFAULT_SETTINGS: AppSettings = {
  appName: "EduMentor CI",
  schoolYear: "2026-2027",
  allowAiRegistrations: true,
  maintenanceMode: false,
  automaticBackups: true,
  notificationsEnabled: true
};

const DEFAULT_LOGS: AdminLog[] = [];

export function getStoredUsers(): UserProfile[] {
  const data = localStorage.getItem(USERS_KEY);
  if (!data) {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  return JSON.parse(data);
}

export function saveUsers(users: UserProfile[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getAdminLogs(): AdminLog[] {
  const data = localStorage.getItem(LOGS_KEY);
  if (!data) {
    localStorage.setItem(LOGS_KEY, JSON.stringify(DEFAULT_LOGS));
    return DEFAULT_LOGS;
  }
  return JSON.parse(data);
}

export function saveAdminLogs(logs: AdminLog[]): void {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function addAdminLog(adminEmail: string, adminName: string, action: string, target: string): void {
  const logs = getAdminLogs();
  const newLog: AdminLog = {
    id: "log_" + Math.random().toString(36).substring(2, 9),
    adminEmail,
    adminName,
    action,
    target,
    date: new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }) + ", " + new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  };
  logs.unshift(newLog);
  saveAdminLogs(logs);
}

export function getStoredCitations(): Citation[] {
  const data = localStorage.getItem(CITATIONS_KEY);
  if (!data) {
    localStorage.setItem(CITATIONS_KEY, JSON.stringify(DEFAULT_CITATIONS));
    return DEFAULT_CITATIONS;
  }
  return JSON.parse(data);
}

export function saveCitations(citations: Citation[]): void {
  localStorage.setItem(CITATIONS_KEY, JSON.stringify(citations));
}

export function getAppSettings(): AppSettings {
  const data = localStorage.getItem(SETTINGS_KEY);
  if (!data) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  }
  return JSON.parse(data);
}

export function saveAppSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getProfileByEmail(email: string): UserProfile {
  const users = getStoredUsers();
  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (found) {
    if (email.toLowerCase() === "louamoisegognin@gmail.com") {
      found.isAdmin = true;
    } else {
      found.isAdmin = false;
    }
    return found;
  }
  const isTargetAdmin = email.toLowerCase() === "louamoisegognin@gmail.com";
  const newProfile: UserProfile = {
    id: "u_" + Math.random().toString(36).substring(2, 9),
    firstName: email.split("@")[0],
    lastName: "Élève",
    email: email,
    grade: "Terminale",
    serie: "Série D",
    schoolYear: "2026-2027",
    country: "Côte d'Ivoire",
    xp: 100,
    streak: 1,
    completedLessonsCount: 0,
    completedQuizzesCount: 0,
    isAdmin: isTargetAdmin,
    isOnboarded: false,
    isEmailVerified: false,
    notifications: []
  };
  users.push(newProfile);
  saveUsers(users);
  return newProfile;
}

export function getStoredProfile(): UserProfile {
  const data = localStorage.getItem(PROFILE_KEY);
  if (!data) {
    const activeEmail = localStorage.getItem("edumentor_logged_in_email");
    if (activeEmail) {
      const profile = getProfileByEmail(activeEmail);
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      return profile;
    }
    localStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
    return DEFAULT_PROFILE;
  }
  return JSON.parse(data);
}

export function saveProfile(profile: UserProfile): void {
  // Security policy enforcement
  if (profile.email.toLowerCase() === "louamoisegognin@gmail.com") {
    profile.isAdmin = true;
  } else {
    profile.isAdmin = false;
  }
  
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  const users = getStoredUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === profile.email.toLowerCase());
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...profile };
    saveUsers(users);
  } else {
    users.push(profile);
    saveUsers(users);
  }
}

const DEFAULT_HISTORY: LearningHistory[] = [];

export function getStoredHistory(): LearningHistory[] {
  const data = localStorage.getItem(HISTORY_KEY);
  if (!data) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(DEFAULT_HISTORY));
    return DEFAULT_HISTORY;
  }
  return JSON.parse(data);
}

export function saveHistory(history: LearningHistory[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getStoredLessons(): Lesson[] {
  const data = localStorage.getItem(LESSONS_KEY);
  if (!data) {
    localStorage.setItem(LESSONS_KEY, JSON.stringify([]));
    return [];
  }
  return JSON.parse(data);
}

export function saveLessons(lessons: Lesson[]): void {
  localStorage.setItem(LESSONS_KEY, JSON.stringify(lessons));
}

export function getStoredQuizzes(): Quiz[] {
  const data = localStorage.getItem(QUIZZES_KEY);
  if (!data) {
    localStorage.setItem(QUIZZES_KEY, JSON.stringify([]));
    return [];
  }
  return JSON.parse(data);
}

export function saveQuizzes(quizzes: Quiz[]): void {
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
}

export function getCompletedLessons(): string[] {
  const data = localStorage.getItem(COMPLETED_LESSONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function markLessonCompleted(lessonId: string): void {
  const completed = getCompletedLessons();
  if (!completed.includes(lessonId)) {
    completed.push(lessonId);
    localStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(completed));

    // Grant XP and increment counter
    const profile = getStoredProfile();
    profile.xp += 50;
    profile.completedLessonsCount = completed.length;
    saveProfile(profile);

    // Add notification
    const lesson = getStoredLessons().find(l => l.id === lessonId);
    const newNotif: AppNotification = {
      id: Math.random().toString(),
      title: "🎓 Cours terminé !",
      message: `Bravo ! Tu as validé le cours : "${lesson?.title || 'Cours'}" et obtenu +50 XP.`,
      date: "À l'instant",
      read: false
    };
    profile.notifications = [newNotif, ...profile.notifications];
    saveProfile(profile);

    // Add to history
    const history = getStoredHistory();
    history.unshift({
      id: Math.random().toString(),
      type: "cours",
      itemTitle: lesson?.title || "Cours",
      subject: lesson?.subject || "Mathématiques",
      date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }),
      xpEarned: 50
    });
    saveHistory(history);
  }
}

export function getCompletedQuizzes(): Record<string, { score: number; total: number }> {
  const data = localStorage.getItem(COMPLETED_QUIZZES_KEY);
  return data ? JSON.parse(data) : {};
}

export function markQuizCompleted(quizId: string, score: number, total: number, quizTitle: string, subject: string, isDefiBac = false): void {
  const completed = getCompletedQuizzes();
  completed[quizId] = { score, total };
  localStorage.setItem(COMPLETED_QUIZZES_KEY, JSON.stringify(completed));

  // Grant XP and increment counter
  const profile = getStoredProfile();
  const xpEarned = isDefiBac ? 150 : Math.round((score / total) * 100);
  profile.xp += xpEarned;
  profile.completedQuizzesCount = Object.keys(completed).length;
  
  // Add notification
  const newNotif: AppNotification = {
    id: Math.random().toString(),
    title: isDefiBac ? "🎯 Défi Bac IA Terminé !" : "📝 Quiz validé !",
    message: isDefiBac 
      ? `Félicitations pour ton Défi Bac IA ! Score : ${score}/${total} (${Math.round((score/total)*100)}%). Tu as gagné +150 XP !`
      : `Tu as terminé le quiz "${quizTitle}" avec un score de ${score}/${total}. +${xpEarned} XP remportés !`,
    date: "À l'instant",
    read: false
  };
  profile.notifications = [newNotif, ...profile.notifications];
  saveProfile(profile);

  // Add to history
  const history = getStoredHistory();
  history.unshift({
    id: Math.random().toString(),
    type: isDefiBac ? "defi_bac" : "quiz",
    itemTitle: quizTitle,
    subject: subject as any,
    score,
    totalQuestions: total,
    date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }),
    xpEarned
  });
  saveHistory(history);
}

export function getStoredStudentGrades(): StudentGrade[] {
  const data = localStorage.getItem("edumentor_student_grades");
  return data ? JSON.parse(data) : [];
}

export function saveStudentGrades(grades: StudentGrade[]): void {
  localStorage.setItem("edumentor_student_grades", JSON.stringify(grades));
}

export function addStudentGrade(grade: Omit<StudentGrade, "id">): StudentGrade {
  const grades = getStoredStudentGrades();
  const newGrade: StudentGrade = {
    ...grade,
    id: "g_" + Math.random().toString(36).substring(2, 9),
  };
  grades.unshift(newGrade);
  saveStudentGrades(grades);
  return newGrade;
}

export function deleteStudentGrade(id: string): void {
  const grades = getStoredStudentGrades();
  const filtered = grades.filter(g => g.id !== id);
  saveStudentGrades(filtered);
}
