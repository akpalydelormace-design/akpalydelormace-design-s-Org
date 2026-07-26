import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType, enableNetwork, disableNetwork, formatFirestoreErrorMessage } from "./firebase";
import { UserProfile, LearningHistory, AppNotification, Lesson, Quiz, StudentGrade } from "../types";
import { SAMPLE_LESSONS } from "../data/coursesData";
import { SAMPLE_QUIZZES } from "../data/quizzesData";

/**
 * Sanitizes any JS object or array before writing to Firestore.
 * Removes properties whose values are `undefined` (or converts nested undefined to clean values)
 * so that Firestore does not throw "Unsupported field value: undefined" errors.
 */
export function sanitizeForFirestore<T>(obj: T): T {
  if (obj === undefined) {
    return null as any;
  }
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (obj instanceof Date) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj
      .filter(item => item !== undefined)
      .map(item => sanitizeForFirestore(item)) as any;
  }
  
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = sanitizeForFirestore(value);
    }
  }
  return cleaned as T;
}

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

const DEFAULT_SETTINGS: AppSettings = {
  appName: "EduMentor CI",
  schoolYear: "2026-2027",
  allowAiRegistrations: true,
  maintenanceMode: false,
  automaticBackups: true,
  notificationsEnabled: true
};

const DEFAULT_PROFILE: UserProfile = {
  id: "u_default",
  firstName: "Élève",
  lastName: "EduMentor",
  email: "eleve@edumentor.ci",
  grade: "Terminale",
  serie: "Série D",
  schoolYear: "2026-2027",
  country: "Côte d'Ivoire",
  schoolName: "Lycée Classique d'Abidjan",
  xp: 100,
  streak: 1,
  completedLessonsCount: 0,
  completedQuizzesCount: 0,
  isAdmin: false,
  isDisabled: false,
  isOnboarded: true,
  isEmailVerified: true,
  notifications: []
};

// --- REACTIVE IN-MEMORY FIRESTORE CACHE ---
let usersCache: UserProfile[] = DEFAULT_USERS;
let historyCache: LearningHistory[] = [];
let lessonsCache: Lesson[] = SAMPLE_LESSONS;
let quizzesCache: Quiz[] = SAMPLE_QUIZZES;
let adminLogsCache: AdminLog[] = [];
let citationsCache: Citation[] = [];
let settingsCache: AppSettings = DEFAULT_SETTINGS;
let studentGradesCache: StudentGrade[] = [];
let activeProfileCache: UserProfile | null = null;
let activeSessionEmail: string = typeof window !== 'undefined' ? (localStorage.getItem("edumentor_active_email") || "") : "";

// Subscriptions listener array
type ListenerCallback = () => void;
const listeners: Set<ListenerCallback> = new Set();

export function subscribeToFirestore(callback: ListenerCallback): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notifySubscribers() {
  listeners.forEach(cb => {
    try {
      cb();
    } catch (e) {
      console.error("Firestore subscriber error:", e);
    }
  });
}

// Network and Sync status tracking
let isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
let hasPendingWrites = false;
let lastSyncTime: Date | null = new Date();

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    isOnline = true;
    enableNetwork(db)
      .then(() => console.info("[EduMentor Firestore Sync] Connexion réseau rétablie et réactivée."))
      .catch((err) => console.warn("[EduMentor Firestore Sync] Warning lors de la réactivation réseau:", err));
    notifySubscribers();
  });
  window.addEventListener('offline', () => {
    isOnline = false;
    console.info("[EduMentor Firestore Sync] Mode hors-ligne détecté. Cache local actif.");
    notifySubscribers();
  });
}

export function getSyncStatus() {
  return { isOnline, hasPendingWrites, lastSyncTime };
}

// --- INITIALIZE FIRESTORE REALTIME LISTENERS & AUTO SYNC ---
let listenersInitialized = false;

function initFirestoreListeners() {
  if (listenersInitialized) return;
  listenersInitialized = true;

  const updateMetadata = (metadata?: { hasPendingWrites: boolean; fromCache: boolean }) => {
    if (metadata) {
      hasPendingWrites = metadata.hasPendingWrites;
      if (!metadata.fromCache) {
        lastSyncTime = new Date();
      }
    }
  };

  // 1. Users Collection Listener
  onSnapshot(collection(db, "users"), (snapshot) => {
    updateMetadata(snapshot.metadata);
    if (!snapshot.empty) {
      const fetchedUsers: UserProfile[] = [];
      snapshot.forEach(docSnap => {
        fetchedUsers.push(docSnap.data() as UserProfile);
      });
      usersCache = fetchedUsers;
      
      // Update active profile if email matches
      if (activeSessionEmail) {
        const found = usersCache.find(u => u.email.toLowerCase() === activeSessionEmail.toLowerCase());
        if (found) {
          activeProfileCache = found;
        }
      }
    } else {
      // Seed default admin user to Firestore if collection empty
      DEFAULT_USERS.forEach(u => saveUserToFirestore(u));
    }
    notifySubscribers();
  }, (err) => {
    console.warn("[Firestore Snapshot Notice - Users]:", formatFirestoreErrorMessage(err));
  });

  // 2. Lessons Listener
  onSnapshot(collection(db, "lessons"), (snapshot) => {
    updateMetadata(snapshot.metadata);
    if (!snapshot.empty) {
      const fetchedLessons: Lesson[] = [];
      snapshot.forEach(docSnap => {
        fetchedLessons.push(docSnap.data() as Lesson);
      });
      lessonsCache = fetchedLessons;

      // Auto-sync missing Terminale lessons to Firestore
      SAMPLE_LESSONS.forEach(l => {
        if (!fetchedLessons.some(existing => existing.id === l.id)) {
          setDoc(doc(db, "lessons", l.id), sanitizeForFirestore(l), { merge: true }).catch(console.error);
        }
      });
    } else {
      SAMPLE_LESSONS.forEach(l => {
        setDoc(doc(db, "lessons", l.id), sanitizeForFirestore(l), { merge: true }).catch(console.error);
      });
    }
    notifySubscribers();
  }, (err) => {
    console.warn("[Firestore Snapshot Notice - Lessons]:", formatFirestoreErrorMessage(err));
  });

  // 3. Quizzes Listener
  onSnapshot(collection(db, "quizzes"), (snapshot) => {
    updateMetadata(snapshot.metadata);
    if (!snapshot.empty) {
      const fetchedQuizzes: Quiz[] = [];
      snapshot.forEach(docSnap => {
        fetchedQuizzes.push(docSnap.data() as Quiz);
      });
      quizzesCache = fetchedQuizzes;

      // Auto-sync missing Terminale quizzes to Firestore
      SAMPLE_QUIZZES.forEach(q => {
        if (!fetchedQuizzes.some(existing => existing.id === q.id)) {
          setDoc(doc(db, "quizzes", q.id), sanitizeForFirestore(q), { merge: true }).catch(console.error);
        }
      });
    } else {
      SAMPLE_QUIZZES.forEach(q => {
        setDoc(doc(db, "quizzes", q.id), sanitizeForFirestore(q), { merge: true }).catch(console.error);
      });
    }
    notifySubscribers();
  }, (err) => {
    console.warn("[Firestore Snapshot Notice - Quizzes]:", formatFirestoreErrorMessage(err));
  });

  // 4. Admin Logs Listener
  onSnapshot(collection(db, "adminLogs"), (snapshot) => {
    updateMetadata(snapshot.metadata);
    if (!snapshot.empty) {
      const fetchedLogs: AdminLog[] = [];
      snapshot.forEach(docSnap => {
        fetchedLogs.push(docSnap.data() as AdminLog);
      });
      adminLogsCache = fetchedLogs.sort((a, b) => b.id.localeCompare(a.id));
    }
    notifySubscribers();
  }, (err) => {
    console.warn("[Firestore Snapshot Notice - AdminLogs]:", formatFirestoreErrorMessage(err));
  });

  // 5. Citations Listener
  onSnapshot(collection(db, "citations"), (snapshot) => {
    updateMetadata(snapshot.metadata);
    if (!snapshot.empty) {
      const fetchedCitations: Citation[] = [];
      snapshot.forEach(docSnap => {
        fetchedCitations.push(docSnap.data() as Citation);
      });
      citationsCache = fetchedCitations;
    }
    notifySubscribers();
  }, (err) => {
    console.warn("[Firestore Snapshot Notice - Citations]:", formatFirestoreErrorMessage(err));
  });

  // 6. Settings Listener
  onSnapshot(doc(db, "settings", "app_settings"), (docSnap) => {
    updateMetadata(docSnap.metadata);
    if (docSnap.exists()) {
      settingsCache = docSnap.data() as AppSettings;
    } else {
      setDoc(doc(db, "settings", "app_settings"), sanitizeForFirestore(DEFAULT_SETTINGS), { merge: true }).catch(console.error);
    }
    notifySubscribers();
  }, (err) => {
    console.warn("[Firestore Snapshot Notice - Settings]:", formatFirestoreErrorMessage(err));
  });

  // 7. Student Grades Listener
  onSnapshot(collection(db, "studentGrades"), (snapshot) => {
    updateMetadata(snapshot.metadata);
    if (!snapshot.empty) {
      const fetchedGrades: StudentGrade[] = [];
      snapshot.forEach(docSnap => {
        fetchedGrades.push(docSnap.data() as StudentGrade);
      });
      studentGradesCache = fetchedGrades;
    }
    notifySubscribers();
  }, (err) => {
    console.warn("[Firestore Snapshot Notice - StudentGrades]:", formatFirestoreErrorMessage(err));
  });

  // 8. History Listener
  onSnapshot(collection(db, "history"), (snapshot) => {
    updateMetadata(snapshot.metadata);
    if (!snapshot.empty) {
      const fetchedHistory: LearningHistory[] = [];
      snapshot.forEach(docSnap => {
        fetchedHistory.push(docSnap.data() as LearningHistory);
      });
      historyCache = fetchedHistory;
    }
    notifySubscribers();
  }, (err) => {
    console.warn("[Firestore Snapshot Notice - History]:", formatFirestoreErrorMessage(err));
  });
}

// Start Firestore real-time background listeners
initFirestoreListeners();

// --- SESSION STORAGE HELPERS ---
export function setActiveSessionEmail(email: string) {
  activeSessionEmail = email;
  if (typeof window !== 'undefined') {
    if (email) {
      localStorage.setItem("edumentor_active_email", email);
    } else {
      localStorage.removeItem("edumentor_active_email");
    }
  }

  if (email) {
    const found = usersCache.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      activeProfileCache = found;
    } else {
      activeProfileCache = getProfileByEmail(email);
    }
  } else {
    activeProfileCache = null;
  }
}

export function getActiveSessionEmail(): string {
  return activeSessionEmail;
}

// --- USER MANAGEMENT FUNCTIONS (PURE FIRESTORE) ---
export function getStoredUsers(): UserProfile[] {
  return usersCache;
}

export function saveUserToFirestore(user: UserProfile): Promise<void> {
  const docId = user.id || user.email.replace(/[@.]/g, '_');
  const path = `users/${docId}`;
  
  // Security enforcement
  if (user.email.toLowerCase() === "louamoisegognin@gmail.com") {
    user.isAdmin = true;
  } else if (user.isAdmin === undefined) {
    user.isAdmin = false;
  }

  // Update in-memory cache
  const idx = usersCache.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  if (idx !== -1) {
    usersCache[idx] = user;
  } else {
    usersCache.push(user);
  }

  return setDoc(doc(db, "users", docId), sanitizeForFirestore(user), { merge: true })
    .catch((err) => { handleFirestoreError(err, OperationType.WRITE, path); });
}

export function saveUsers(users: UserProfile[]): void {
  usersCache = users;
  users.forEach(u => saveUserToFirestore(u));
}

export function getProfileByEmail(email: string): UserProfile {
  const found = usersCache.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (found) {
    if (email.toLowerCase() === "louamoisegognin@gmail.com") {
      found.isAdmin = true;
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
    isDisabled: false,
    isOnboarded: false,
    isEmailVerified: false,
    notifications: []
  };

  saveUserToFirestore(newProfile);
  return newProfile;
}

export function getStoredProfile(): UserProfile | null {
  if (activeSessionEmail) {
    const found = usersCache.find(u => u.email.toLowerCase() === activeSessionEmail.toLowerCase());
    if (found) return found;
  }
  return activeProfileCache;
}

export function saveProfile(profile: UserProfile): void {
  if (profile.email.toLowerCase() === "louamoisegognin@gmail.com") {
    profile.isAdmin = true;
  }
  activeProfileCache = profile;
  activeSessionEmail = profile.email;
  saveUserToFirestore(profile);
}

// --- ADMIN LOGS (PURE FIRESTORE) ---
export function getAdminLogs(): AdminLog[] {
  return adminLogsCache;
}

export function saveAdminLogs(logs: AdminLog[]): void {
  adminLogsCache = logs;
  logs.forEach(log => {
    setDoc(doc(db, "adminLogs", log.id), sanitizeForFirestore(log), { merge: true }).catch(console.error);
  });
}

export function addAdminLog(adminEmail: string, adminName: string, action: string, target: string): void {
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
  adminLogsCache.unshift(newLog);
  setDoc(doc(db, "adminLogs", newLog.id), sanitizeForFirestore(newLog), { merge: true }).catch(console.error);
}

// --- CITATIONS (PURE FIRESTORE) ---
export function getStoredCitations(): Citation[] {
  return citationsCache;
}

export function saveCitations(citations: Citation[]): void {
  citationsCache = citations;
  citations.forEach(c => {
    setDoc(doc(db, "citations", c.id), sanitizeForFirestore(c), { merge: true }).catch(console.error);
  });
}

export function addCitationToFirestore(citation: Citation): Promise<void> {
  citationsCache.unshift(citation);
  return setDoc(doc(db, "citations", citation.id), sanitizeForFirestore(citation), { merge: true }).catch(console.error);
}

// --- APP SETTINGS (PURE FIRESTORE) ---
export function getAppSettings(): AppSettings {
  return settingsCache;
}

export function saveAppSettings(settings: AppSettings): void {
  settingsCache = settings;
  setDoc(doc(db, "settings", "app_settings"), sanitizeForFirestore(settings), { merge: true }).catch(console.error);
}

// --- LEARNING HISTORY (PURE FIRESTORE) ---
export function getStoredHistory(): LearningHistory[] {
  return historyCache;
}

export function saveHistory(history: LearningHistory[]): void {
  historyCache = history;
  history.forEach(item => {
    setDoc(doc(db, "history", item.id), sanitizeForFirestore(item), { merge: true }).catch(console.error);
  });
}

// --- LESSONS & QUIZZES (PURE FIRESTORE) ---
export function getStoredLessons(): Lesson[] {
  return lessonsCache;
}

export function saveLessons(lessons: Lesson[]): void {
  lessonsCache = lessons;
  lessons.forEach(l => {
    setDoc(doc(db, "lessons", l.id), sanitizeForFirestore(l), { merge: true }).catch(console.error);
  });
}

export function getStoredQuizzes(): Quiz[] {
  return quizzesCache;
}

export function saveQuizzes(quizzes: Quiz[]): void {
  quizzesCache = quizzes;
  quizzes.forEach(q => {
    setDoc(doc(db, "quizzes", q.id), sanitizeForFirestore(q), { merge: true }).catch(console.error);
  });
}

// --- COMPLETED PROGRESS & ACHIEVEMENTS (PURE FIRESTORE) ---
export function getCompletedLessons(): string[] {
  const profile = getStoredProfile();
  return (profile as any).completedLessonIds || [];
}

export function markLessonCompleted(lessonId: string): void {
  const profile = getStoredProfile();
  const currentCompleted: string[] = (profile as any).completedLessonIds || [];

  if (!currentCompleted.includes(lessonId)) {
    const updatedCompleted = [...currentCompleted, lessonId];
    (profile as any).completedLessonIds = updatedCompleted;

    // Grant XP and increment counter
    profile.xp += 50;
    profile.completedLessonsCount = updatedCompleted.length;

    // Add notification
    const lesson = lessonsCache.find(l => l.id === lessonId);
    const newNotif: AppNotification = {
      id: "n_" + Math.random().toString(36).substring(2, 9),
      title: "🎓 Cours terminé !",
      message: `Bravo ! Tu as validé le cours : "${lesson?.title || 'Cours'}" et obtenu +50 XP.`,
      date: "À l'instant",
      read: false
    };
    profile.notifications = [newNotif, ...(profile.notifications || [])];
    saveProfile(profile);

    // Add history log in Firestore
    const newHistoryItem: LearningHistory = {
      id: "h_" + Math.random().toString(36).substring(2, 9),
      type: "cours",
      itemTitle: lesson?.title || "Cours",
      subject: lesson?.subject || "Mathématiques",
      date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }),
      xpEarned: 50
    };
    historyCache.unshift(newHistoryItem);
    setDoc(doc(db, "history", newHistoryItem.id), sanitizeForFirestore(newHistoryItem), { merge: true }).catch(console.error);
  }
}

export function getCompletedQuizzes(): Record<string, { score: number; total: number }> {
  const profile = getStoredProfile();
  return (profile as any).completedQuizzesMap || {};
}

export function markQuizCompleted(quizId: string, score: number, total: number, quizTitle: string, subject: string, isDefiBac = false): void {
  const profile = getStoredProfile();
  const completedMap: Record<string, { score: number; total: number }> = (profile as any).completedQuizzesMap || {};

  completedMap[quizId] = { score, total };
  (profile as any).completedQuizzesMap = completedMap;

  // Grant XP and increment counter
  const safeTotal = total > 0 ? total : 1;
  const percentage = Math.round((score / safeTotal) * 100);
  const xpEarned = isDefiBac ? 150 : percentage;
  profile.xp += xpEarned;
  profile.completedQuizzesCount = Object.keys(completedMap).length;

  // Add notification
  const newNotif: AppNotification = {
    id: "n_" + Math.random().toString(36).substring(2, 9),
    title: isDefiBac ? "🎯 Défi Bac IA Terminé !" : "📝 Quiz validé !",
    message: isDefiBac 
      ? `Félicitations pour ton Défi Bac IA ! Score : ${score}/${total} (${percentage}%). Tu as gagné +150 XP !`
      : `Tu as terminé le quiz "${quizTitle}" avec un score de ${score}/${total}. +${xpEarned} XP remportés !`,
    date: "À l'instant",
    read: false
  };
  profile.notifications = [newNotif, ...(profile.notifications || [])];
  saveProfile(profile);

  // Add history log in Firestore
  const newHistoryItem: LearningHistory = {
    id: "h_" + Math.random().toString(36).substring(2, 9),
    type: isDefiBac ? "defi_bac" : "quiz",
    itemTitle: quizTitle,
    subject: subject as any,
    score,
    totalQuestions: total,
    date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }),
    xpEarned
  };
  historyCache.unshift(newHistoryItem);
  setDoc(doc(db, "history", newHistoryItem.id), sanitizeForFirestore(newHistoryItem), { merge: true }).catch(console.error);
}

// --- STUDENT GRADES (PURE FIRESTORE) ---
export function getStoredStudentGrades(): StudentGrade[] {
  return studentGradesCache;
}

export function saveStudentGrades(grades: StudentGrade[]): void {
  studentGradesCache = grades;
  grades.forEach(g => {
    setDoc(doc(db, "studentGrades", g.id), sanitizeForFirestore(g), { merge: true }).catch(console.error);
  });
}

export function addStudentGrade(grade: Omit<StudentGrade, "id">): StudentGrade {
  const newGrade: StudentGrade = {
    ...grade,
    id: "g_" + Math.random().toString(36).substring(2, 9),
  };
  studentGradesCache.unshift(newGrade);
  setDoc(doc(db, "studentGrades", newGrade.id), sanitizeForFirestore(newGrade), { merge: true }).catch(console.error);
  return newGrade;
}

export function deleteStudentGrade(id: string): void {
  studentGradesCache = studentGradesCache.filter(g => g.id !== id);
  deleteDoc(doc(db, "studentGrades", id)).catch(console.error);
}

// --- BOOKMARKS & FAVORITES (PURE FIRESTORE) ---
export function getBookmarkedLessons(): string[] {
  const profile = getStoredProfile();
  return (profile as any).bookmarkedLessonIds || [];
}

export function toggleBookmarkLesson(lessonId: string): void {
  const profile = getStoredProfile();
  const currentBookmarks: string[] = (profile as any).bookmarkedLessonIds || [];
  const exists = currentBookmarks.includes(lessonId);
  const updated = exists
    ? currentBookmarks.filter(id => id !== lessonId)
    : [...currentBookmarks, lessonId];
  (profile as any).bookmarkedLessonIds = updated;
  saveProfile(profile);
}

export function saveQuizToFirestore(quiz: Quiz): Promise<void> {
  const idx = quizzesCache.findIndex(q => q.id === quiz.id);
  if (idx !== -1) {
    quizzesCache[idx] = quiz;
  } else {
    quizzesCache.unshift(quiz);
  }
  return setDoc(doc(db, "quizzes", quiz.id), sanitizeForFirestore(quiz), { merge: true }).catch(console.error);
}

export function deleteQuizFromFirestore(id: string): Promise<void> {
  quizzesCache = quizzesCache.filter(q => q.id !== id);
  return deleteDoc(doc(db, "quizzes", id)).catch(console.error);
}
