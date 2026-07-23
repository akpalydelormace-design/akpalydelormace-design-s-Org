import React, { useState, useEffect } from "react";
import {
  BookOpen,
  LayoutDashboard,
  GraduationCap,
  Award,
  BrainCircuit,
  History,
  Settings,
  Bell,
  Menu,
  X,
  User,
  ShieldAlert,
  Calendar,
  ChevronRight,
  Trophy,
  Flame,
  CheckCircle2,
  ChevronLeft,
  Target,
  TrendingUp,
  Quote,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { UserProfile, LearningHistory, Lesson, Quiz, AppNotification } from "./types";
import { SAMPLE_LESSONS } from "./data/coursesData";
import { SAMPLE_QUIZZES } from "./data/quizzesData";
import {
  getStoredProfile,
  saveProfile,
  getStoredHistory,
  saveHistory,
  getCompletedLessons,
  markLessonCompleted,
  getCompletedQuizzes,
  markQuizCompleted,
  getStoredLessons,
  getStoredQuizzes,
  saveLessons,
  saveQuizzes
} from "./lib/storage";

// Screens
import AuthScreenSuite from "./components/AuthScreenSuite";
import OnboardingScreen from "./components/OnboardingScreen";
import DashboardScreen from "./components/DashboardScreen";
import CoursesScreen from "./components/CoursesScreen";
import CourseReaderScreen from "./components/CourseReaderScreen";
import QuizListScreen from "./components/QuizListScreen";
import QuizPlayerScreen from "./components/QuizPlayerScreen";
import AiAssistantScreen from "./components/AiAssistantScreen";
import AdminPanelScreen from "./components/AdminPanelScreen";
import ProfileSettingsScreen from "./components/ProfileSettingsScreen";
import ExercisesScreen from "./components/ExercisesScreen";
import BulletinScreen from "./components/BulletinScreen";
import CitationsScreen from "./components/CitationsScreen";

export default function App() {
  // Navigation & session state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<LearningHistory[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [completedQuizzes, setCompletedQuizzes] = useState<Record<string, { score: number; total: number }>>({});
  const [lessons, setLessons] = useState<Lesson[]>(getStoredLessons());
  const [quizzes, setQuizzes] = useState<Quiz[]>(getStoredQuizzes());

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [authScreen, setAuthScreen] = useState<"login" | "register">("login");

  // Selection states
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [isDefiBacMode, setIsDefiBacMode] = useState(false);

  // Layout UI states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Bootstrapping session from local storage on load
  useEffect(() => {
    setLessons(getStoredLessons());
    setQuizzes(getStoredQuizzes());

    // Only load session if we are logged in, for demo we load default initially or let user log in
    const sessionEmail = localStorage.getItem("edumentor_logged_in_email");
    if (sessionEmail) {
      const profile = getStoredProfile();
      setUserProfile(profile);
      setHistory(getStoredHistory());
      setCompletedLessonIds(getCompletedLessons());
      setCompletedQuizzes(getCompletedQuizzes());
      if (profile && profile.isAdmin) {
        setActiveTab("admin");
      } else {
        setActiveTab("dashboard");
      }
    }
  }, []);

  const handleLogin = (email: string) => {
    localStorage.setItem("edumentor_logged_in_email", email);
    const profile = getStoredProfile();
    
    // Check if admin email
    if (email.toLowerCase().includes("admin") || email.toLowerCase() === "louamoisegognin@gmail.com") {
      profile.isAdmin = true;
      profile.firstName = "Super";
      profile.lastName = "Admin";
      saveProfile(profile);
    } else {
      profile.email = email;
      saveProfile(profile);
    }

    setUserProfile(profile);
    setHistory(getStoredHistory());
    setCompletedLessonIds(getCompletedLessons());
    setCompletedQuizzes(getCompletedQuizzes());
    if (profile.isAdmin) {
      setActiveTab("admin");
    } else {
      setActiveTab("dashboard");
    }
  };

  const handleRegister = (data: { firstName: string; lastName: string; email: string; grade: any }) => {
    const newProfile: UserProfile = {
      id: "u_" + Math.random().toString(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      grade: data.grade,
      xp: 100, // starting bonus
      streak: 1,
      completedLessonsCount: 0,
      completedQuizzesCount: 0,
      notifications: [
        {
          id: "welcome_n",
          title: "🎉 Bienvenue sur EduMentor !",
          message: "Débute tes révisions dès aujourd'hui. Ton bonus d'inscription de +100 XP a été accordé !",
          date: "A l'instant",
          read: false
        }
      ]
    };
    saveProfile(newProfile);
    localStorage.setItem("edumentor_logged_in_email", data.email);
    setUserProfile(newProfile);
    setHistory([]);
    setCompletedLessonIds([]);
    setCompletedQuizzes({});
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("edumentor_logged_in_email");
    setUserProfile(null);
    setSelectedLesson(null);
    setActiveQuiz(null);
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    saveProfile(updated);
    setUserProfile(updated);
  };

  const handleLessonCompleted = (lessonId: string) => {
    markLessonCompleted(lessonId);
    setCompletedLessonIds(getCompletedLessons());
    setUserProfile(getStoredProfile());
    setHistory(getStoredHistory());
  };

  const handleQuizCompleted = (score: number, total: number) => {
    if (!activeQuiz || !userProfile) return;
    
    markQuizCompleted(
      activeQuiz.id,
      score,
      total,
      activeQuiz.title,
      activeQuiz.subject,
      isDefiBacMode
    );

    setCompletedQuizzes(getCompletedQuizzes());
    setUserProfile(getStoredProfile());
    setHistory(getStoredHistory());
    
    // Return to Quiz lists
    setActiveQuiz(null);
    setIsDefiBacMode(false);
    setActiveTab("quiz");
  };

  // Add / Delete lessons from Admin Panel
  const handleAddLesson = (newLesson: Lesson) => {
    setLessons((prev) => {
      const updated = [newLesson, ...prev];
      saveLessons(updated);
      return updated;
    });
  };

  const handleDeleteLesson = (id: string) => {
    setLessons((prev) => {
      const updated = prev.filter(l => l.id !== id);
      saveLessons(updated);
      return updated;
    });
  };

  const handleUpdateLesson = (updatedLesson: Lesson) => {
    setLessons((prev) => {
      const updated = prev.map(l => l.id === updatedLesson.id ? updatedLesson : l);
      saveLessons(updated);
      return updated;
    });
  };

  const handleStartDefiBac = () => {
    // Take the Philosophy simulateur exam or any terminale philo quiz as the default Défi Bac IA
    const defiBacQuiz = quizzes.find(q => q.id === "qb1" || q.id.includes("ch2") || q.id.includes("phi")) || quizzes[0];
    setIsDefiBacMode(true);
    setActiveQuiz(defiBacQuiz);
  };

  const handleMarkNotificationsRead = () => {
    if (!userProfile) return;
    const updatedNotifs = userProfile.notifications.map(n => ({ ...n, read: true }));
    const updated = { ...userProfile, notifications: updatedNotifs };
    handleUpdateProfile(updated);
  };

  // Rendering Session Gate
  if (!userProfile) {
    return (
      <AuthScreenSuite
        onAuthSuccess={(profile) => {
          setUserProfile(profile);
          setHistory(getStoredHistory());
          setCompletedLessonIds(getCompletedLessons());
          setCompletedQuizzes(getCompletedQuizzes());
          if (profile.isAdmin) {
            setActiveTab("admin");
          } else {
            setActiveTab("dashboard");
          }
        }}
      />
    );
  }

  // Active notifications count
  const unreadCount = userProfile.notifications.filter(n => !n.read).length;

  const navItems = [
    { id: "dashboard", label: "Accueil", icon: LayoutDashboard },
    { id: "cours", label: "Cours", icon: GraduationCap },
    { id: "quiz", label: "Quiz", icon: Award },
    { id: "exercices", label: "Exercices", icon: FileText },
    { id: "assistant", label: "Mentor IA", icon: BrainCircuit },
    { id: "defi_bac", label: "Défi Bac IA", icon: Target },
    { id: "bulletin", label: "Bulletin", icon: TrendingUp },
    { id: "parametres", label: "Profil", icon: User },
    { id: "citations", label: "Citations", icon: Quote },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0 select-none">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2.5">
          <div className="bg-blue-600 p-2 rounded-xl text-white">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black font-heading text-white tracking-tight">EduMentor</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Apprendre avec l'IA</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "defi_bac") {
                    handleStartDefiBac();
                  } else {
                    setActiveTab(item.id);
                    setSelectedLesson(null);
                    setActiveQuiz(null);
                    setIsDefiBacMode(false);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10"
                    : "hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <IconComponent className="h-4.5 w-4.5" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Admin tab only visible if user is admin */}
          {userProfile.isAdmin && (
            <button
              onClick={() => {
                setActiveTab("admin");
                setSelectedLesson(null);
                setActiveQuiz(null);
                setIsDefiBacMode(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "admin"
                  ? "bg-red-600 text-white shadow-lg"
                  : "text-red-400 hover:bg-slate-800"
              }`}
            >
              <ShieldAlert className="h-4.5 w-4.5" />
              <span>Espace Admin</span>
            </button>
          )}
        </nav>

        {/* Footer profile info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-9 w-9 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center text-sm shrink-0">
              {userProfile.firstName.charAt(0)}{userProfile.lastName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{userProfile.firstName} {userProfile.lastName}</p>
              <p className="text-[10px] font-semibold text-slate-400 truncate">{userProfile.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Se déconnecter"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* MAIN VIEW CONTROLLER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP HEADER HEADER (Toutes pages) */}
        <header className="bg-white border-b border-slate-100 h-16 px-4 sm:px-6 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-3">
            {/* Mobile Menu burger toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Menu className="h-5.5 w-5.5" />
            </button>

            {/* Path description */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <span>EduMentor</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-slate-700 capitalize font-bold">
                {activeTab}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Profile indicators (XP & streak) */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-150 rounded-2xl px-3 py-1.5 text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1 text-yellow-600">
                🏆 <span className="font-mono">{userProfile.xp} XP</span>
              </span>
              <span className="h-3 border-l border-slate-300"></span>
              <span className="flex items-center gap-1 text-red-500">
                🔥 <span className="font-mono">{userProfile.streak}j</span>
              </span>
            </div>

            {/* Notification bell dropdown toggle */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  handleMarkNotificationsRead();
                }}
                className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors relative"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Notifications dropdown list panel */}
              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsNotificationsOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-4 space-y-3"
                    >
                      <h4 className="font-bold text-sm text-slate-800 border-b border-slate-50 pb-2">
                        Notifications d'étude ({userProfile.notifications.length})
                      </h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {userProfile.notifications.map((notif) => (
                          <div key={notif.id} className="text-xs space-y-0.5 pb-2 border-b border-slate-50 last:border-0 last:pb-0">
                            <p className="font-bold text-slate-800">{notif.title}</p>
                            <p className="text-slate-500 leading-relaxed">{notif.message}</p>
                            <span className="text-[10px] font-semibold text-slate-400 block mt-1">
                              {notif.date}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile avatar shortcut */}
            <button
              onClick={() => setActiveTab("parametres")}
              className="h-9 w-9 bg-gradient-to-tr from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-sm hover:opacity-90"
            >
              {userProfile.firstName.charAt(0)}{userProfile.lastName.charAt(0)}
            </button>
          </div>
        </header>

        {/* MOBILE SLIDING MENU DRAWER */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.25 }}
                className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-300 z-50 flex flex-col shadow-2xl lg:hidden"
              >
                <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    <span className="font-black text-white text-base">EduMentor</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                  {navItems.map((item) => {
                    const IconComp = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.id === "defi_bac") {
                            handleStartDefiBac();
                          } else {
                            setActiveTab(item.id);
                            setSelectedLesson(null);
                            setActiveQuiz(null);
                            setIsDefiBacMode(false);
                          }
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          isActive
                            ? "bg-blue-600 text-white shadow-lg"
                            : "hover:bg-slate-850 hover:text-white"
                        }`}
                      >
                        <IconComp className="h-4.5 w-4.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}

                  {userProfile.isAdmin && (
                    <button
                      onClick={() => {
                        setActiveTab("admin");
                        setSelectedLesson(null);
                        setActiveQuiz(null);
                        setIsDefiBacMode(false);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        activeTab === "admin"
                          ? "bg-red-600 text-white"
                          : "text-red-400 hover:bg-slate-800"
                      }`}
                    >
                      <ShieldAlert className="h-4.5 w-4.5" />
                      <span>Espace Admin</span>
                    </button>
                  )}
                </nav>

                <div className="p-4 border-t border-slate-800 flex items-center gap-3">
                  <div className="h-9 w-9 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center text-sm">
                    {userProfile.firstName.charAt(0)}{userProfile.lastName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{userProfile.firstName} {userProfile.lastName}</p>
                    <button onClick={handleLogout} className="text-[10px] font-bold text-red-400 mt-0.5 hover:underline text-left block">
                      Se déconnecter
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* CONTAINER CONTENT VIEW */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          
          {/* ACTIVE SOLVER PLAYERS DISPLAY GATES (Hides standard tabs if actively solving) */}
          {activeQuiz ? (
            <QuizPlayerScreen
              quiz={activeQuiz}
              isDefiBac={isDefiBacMode}
              onFinishQuiz={handleQuizCompleted}
              onExit={() => {
                setActiveQuiz(null);
                setIsDefiBacMode(false);
              }}
            />
          ) : selectedLesson ? (
            <CourseReaderScreen
              lesson={selectedLesson}
              isCompleted={completedLessonIds.includes(selectedLesson.id)}
              onBack={() => setSelectedLesson(null)}
              onMarkCompleted={() => handleLessonCompleted(selectedLesson.id)}
              onGotoQuiz={() => {
                // Find matching quiz for the current course
                const matchingQuiz = SAMPLE_QUIZZES.find(
                  (q) => q.chapterTitle.toLowerCase() === selectedLesson.chapterTitle.toLowerCase()
                );
                setSelectedLesson(null);
                if (matchingQuiz) {
                  setActiveQuiz(matchingQuiz);
                } else {
                  setActiveTab("quiz");
                }
              }}
            />
          ) : (
            /* STANDARD TABS SWITCH ENGINE */
            <AnimatePresence mode="wait">
              {activeTab === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <DashboardScreen
                    userProfile={userProfile}
                    history={history}
                    completedLessonIds={completedLessonIds}
                    completedQuizzesCount={Object.keys(completedQuizzes).length}
                    onNavigateToTab={setActiveTab}
                    onSelectLesson={(id) => {
                      const l = lessons.find(l => l.id === id);
                      if (l) setSelectedLesson(l);
                    }}
                    onStartDefiBac={handleStartDefiBac}
                  />
                </motion.div>
              )}

              {activeTab === "cours" && (
                <motion.div
                  key="cours"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <CoursesScreen
                    lessons={lessons}
                    completedLessonIds={completedLessonIds}
                    onSelectLesson={(id) => {
                      const l = lessons.find(l => l.id === id);
                      if (l) setSelectedLesson(l);
                    }}
                    userProfile={userProfile}
                  />
                </motion.div>
              )}

              {activeTab === "quiz" && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <QuizListScreen
                    quizzes={quizzes}
                    completedQuizzes={completedQuizzes}
                    onStartQuiz={(quiz) => {
                      setIsDefiBacMode(false);
                      setActiveQuiz(quiz);
                    }}
                    userProfile={userProfile}
                  />
                </motion.div>
              )}

              {activeTab === "assistant" && (
                <motion.div
                  key="assistant"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <AiAssistantScreen userProfile={userProfile} />
                </motion.div>
              )}

              {activeTab === "historique" && (
                <motion.div
                  key="historique"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-3xl font-black font-heading text-slate-900 tracking-tight">Historique & Statistiques</h1>
                    <p className="text-slate-500 font-medium mt-1">
                      Suis tes progrès quotidiens et analyse tes résultats d'entraînement.
                    </p>
                  </div>

                  {/* Summary grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                      <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider">
                        📈 Analyse des fiches de cours
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 text-sm font-semibold">Leçons mémorisées :</span>
                        <span className="text-lg font-black text-slate-800">
                          {completedLessonIds.length} / {lessons.length}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${(completedLessonIds.length / lessons.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                      <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider">
                        📝 Performance aux évaluations
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 text-sm font-semibold">Quiz tentés :</span>
                        <span className="text-lg font-black text-slate-800">
                          {Object.keys(completedQuizzes).length} terminés
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${(Object.keys(completedQuizzes).length / SAMPLE_QUIZZES.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Complete learning activities table */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-base text-slate-900 mb-4 font-heading">
                      📋 Grand Journal des Activités d'Études
                    </h3>
                    {history.length === 0 ? (
                      <p className="text-slate-400 text-xs italic">Aucune activité enregistrée pour le moment.</p>
                    ) : (
                      <div className="space-y-4">
                        {history.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between border-b border-slate-50 pb-3.5 last:border-0 last:pb-0 text-xs"
                          >
                            <div className="flex gap-3 items-center min-w-0">
                              <span className="text-lg">
                                {item.type === "cours" ? "📚" : item.type === "defi_bac" ? "🎯" : "📝"}
                              </span>
                              <div className="min-w-0">
                                <h4 className="font-bold text-slate-800 truncate">{item.itemTitle}</h4>
                                <p className="text-slate-400 mt-0.5">
                                  {item.subject} · {item.date}
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="font-extrabold text-blue-600 block">+{item.xpEarned} XP</span>
                              {item.score !== undefined && (
                                <span className="font-bold text-slate-500 text-[10px]">
                                  Note: {item.score} / {item.totalQuestions}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "exercices" && (
                <motion.div
                  key="exercices"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <ExercisesScreen
                    userProfile={userProfile}
                    onAddXp={(xp) => {
                      const updated = { ...userProfile, xp: userProfile.xp + xp };
                      handleUpdateProfile(updated);
                    }}
                  />
                </motion.div>
              )}

              {activeTab === "bulletin" && (
                <motion.div
                  key="bulletin"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <BulletinScreen
                    userProfile={userProfile}
                    history={history}
                  />
                </motion.div>
              )}

              {activeTab === "citations" && (
                <motion.div
                  key="citations"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <CitationsScreen
                    userProfile={userProfile}
                  />
                </motion.div>
              )}

              {activeTab === "parametres" && (
                <motion.div
                  key="parametres"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <ProfileSettingsScreen
                    userProfile={userProfile}
                    onUpdateProfile={handleUpdateProfile}
                    onLogout={handleLogout}
                  />
                </motion.div>
              )}

              {activeTab === "admin" && (
                <motion.div
                  key="admin"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <AdminPanelScreen
                    lessons={lessons}
                    onAddLesson={handleAddLesson}
                    onDeleteLesson={handleDeleteLesson}
                    onUpdateLesson={handleUpdateLesson}
                    userProfile={userProfile}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </main>

      </div>
    </div>
  );
}
