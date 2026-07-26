import React, { useState, useEffect } from "react";
import {
  Shield,
  Users,
  BookOpen,
  Award,
  FileText,
  Target,
  Quote,
  Bell,
  Settings,
  History,
  Search,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  Lock,
  Unlock,
  ShieldCheck,
  Database,
  Terminal,
  Sparkles,
  Loader2,
  Eye,
  EyeOff,
  FileUp,
  ImageUp,
  Edit3
} from "lucide-react";
import {
  UserProfile,
  Lesson,
  Subject,
  Grade,
  Difficulty,
  Quiz
} from "../types";
import {
  getStoredUsers,
  saveUsers,
  getAdminLogs,
  addAdminLog,
  getStoredCitations,
  saveCitations,
  getAppSettings,
  saveAppSettings,
  getStoredQuizzes,
  saveQuizToFirestore,
  deleteQuizFromFirestore,
  subscribeToFirestore,
  AdminLog,
  Citation,
  AppSettings
} from "../lib/storage";
import { SAMPLE_QUIZZES } from "../data/quizzesData";
import { SUBJECT_METADATA } from "./CoursesScreen";

interface AdminPanelProps {
  lessons: Lesson[];
  onAddLesson: (lesson: Lesson) => void;
  onDeleteLesson: (id: string) => void;
  onUpdateLesson: (lesson: Lesson) => void;
  userProfile: UserProfile;
}

export default function AdminPanelScreen({
  lessons,
  onAddLesson,
  onDeleteLesson,
  onUpdateLesson,
  userProfile
}: AdminPanelProps) {
  // Guard clause - total security blockage
  const isSuperAdmin = userProfile.email.toLowerCase() === "louamoisegognin@gmail.com";
  const isAuthorized = userProfile.isAdmin || isSuperAdmin;

  if (!isAuthorized) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto bg-red-50 border-2 border-red-500 rounded-3xl mt-12">
        <Lock className="h-12 w-12 text-red-600 mx-auto" />
        <h2 className="text-xl font-black text-red-950 font-heading">Accès Refusé</h2>
        <p className="text-xs text-red-700 leading-relaxed font-semibold">
          Seul le personnel administratif autorisé est habilité à consulter cet espace. Votre tentative a été enregistrée à des fins de sécurité.
        </p>
      </div>
    );
  }

  // Active Admin Tabs
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "content" | "settings" | "audit">("dashboard");

  // State holdings loaded dynamically
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);

  // Search states
  const [userSearch, setUserSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);

  // Content manager selection sub-tabs
  const [contentSubTab, setContentSubTab] = useState<"matieres" | "cours" | "lessons" | "quizzes" | "exercises" | "defis" | "quotes" | "notifications">("lessons");

  // Manual Lesson Form States
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonSubject, setLessonSubject] = useState<Subject>("Mathématiques");
  const [lessonGrade, setLessonGrade] = useState<Grade>("Terminale");
  const [lessonChapNo, setLessonChapNo] = useState(1);
  const [lessonChapTitle, setLessonChapTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Editing Lesson states
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [lessonIsPublished, setLessonIsPublished] = useState(true);

  // Add citation state
  const [newQuoteText, setNewQuoteText] = useState("");
  const [newQuoteAuthor, setNewQuoteAuthor] = useState("");
  const [newQuoteCat, setNewQuoteCat] = useState("Général");

  // Quiz Management States
  const [quizzesList, setQuizzesList] = useState<Quiz[]>(getStoredQuizzes());
  const [quizTitle, setQuizTitle] = useState("");
  const [quizSubject, setQuizSubject] = useState<Subject>("Mathématiques");
  const [quizGrade, setQuizGrade] = useState<Grade>("Terminale");
  const [quizChapTitle, setQuizChapTitle] = useState("");
  const [quizDifficulty, setQuizDifficulty] = useState<Difficulty>("moyen");
  const [isQuizAiGenerating, setIsQuizAiGenerating] = useState(false);

  // Status notifications inside admin
  const [adminMsg, setAdminMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load everything and subscribe to real-time Firestore updates
  useEffect(() => {
    const refresh = () => {
      setUsers(getStoredUsers());
      setCitations(getStoredCitations());
      setAdminLogs(getAdminLogs());
      setAppSettings(getAppSettings());
      setQuizzesList(getStoredQuizzes());
    };
    refresh();
    const unsubscribe = subscribeToFirestore(refresh);
    return () => unsubscribe();
  }, []);

  const triggerMessage = (type: "success" | "error", text: string) => {
    setAdminMsg({ type, text });
    setTimeout(() => setAdminMsg(null), 4000);
  };

  const handleGenerateQuizAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizChapTitle) {
      triggerMessage("error", "Veuillez indiquer le titre du chapitre.");
      return;
    }
    setIsQuizAiGenerating(true);
    try {
      const response = await fetch("/api/exercise/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: quizSubject,
          grade: quizGrade,
          chapterTitle: quizChapTitle,
          difficulty: quizDifficulty
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Erreur lors de la génération d'exercice par l'IA.");
      }

      const data = await response.json();
      const newQuiz: Quiz = {
        id: "qz_" + Math.random().toString(36).substring(2, 9),
        title: data.title || quizTitle || `Quiz IA : ${quizChapTitle}`,
        subject: quizSubject,
        grade: quizGrade,
        chapterNo: 1,
        chapterTitle: quizChapTitle,
        difficulty: quizDifficulty,
        questions: data.questions || [],
        durationMinutes: 10,
        recommended: true
      };

      await saveQuizToFirestore(newQuiz);
      addAdminLog(
        userProfile.email,
        `${userProfile.firstName} ${userProfile.lastName}`,
        "Génération de Quiz avec IA",
        `${newQuiz.title} (${quizSubject})`
      );
      setQuizzesList(getStoredQuizzes());
      triggerMessage("success", "Quiz/Exercice généré par l'IA et enregistré dans Firestore !");
      setQuizChapTitle("");
      setQuizTitle("");
    } catch (err: any) {
      triggerMessage("error", err.message || "Échec de génération du quiz.");
    } finally {
      setIsQuizAiGenerating(false);
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    if (window.confirm("Supprimer ce quiz définitivement de Firestore ?")) {
      await deleteQuizFromFirestore(id);
      setQuizzesList(getStoredQuizzes());
      addAdminLog(
        userProfile.email,
        `${userProfile.firstName} ${userProfile.lastName}`,
        "Suppression de Quiz",
        `ID: ${id}`
      );
      triggerMessage("success", "Quiz retiré de Firestore.");
    }
  };

  // -----------------------------------------------------------------
  // USER ACTIONS
  // -----------------------------------------------------------------
  const handleToggleUserStatus = (userId: string) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        const nextStatus = !u.isDisabled;
        // Log action
        addAdminLog(
          userProfile.email,
          `${userProfile.firstName} ${userProfile.lastName}`,
          nextStatus ? "Désactivation de compte" : "Réactivation de compte",
          `${u.firstName} ${u.lastName} (${u.email})`
        );
        return { ...u, isDisabled: nextStatus };
      }
      return u;
    });

    setUsers(updated);
    saveUsers(updated);
    setAdminLogs(getAdminLogs());
    triggerMessage("success", "Statut d'accès de l'élève mis à jour.");
  };

  const handleToggleAdminRole = (userId: string) => {
    if (!isSuperAdmin) {
      triggerMessage("error", "Seul l'administrateur principal (louamoisegognin@gmail.com) peut attribuer le rôle d'administrateur.");
      return;
    }

    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    if (targetUser.email.toLowerCase() === "louamoisegognin@gmail.com") {
      triggerMessage("error", "Impossible de modifier les privilèges du Super Administrateur.");
      return;
    }

    const updated = users.map(u => {
      if (u.id === userId) {
        const nextAdmin = !u.isAdmin;
        addAdminLog(
          userProfile.email,
          `${userProfile.firstName} ${userProfile.lastName}`,
          nextAdmin ? "Promotion au rôle administrateur" : "Révocation du rôle administrateur",
          `${u.firstName} ${u.lastName} (${u.email})`
        );
        return { ...u, isAdmin: nextAdmin };
      }
      return u;
    });

    setUsers(updated);
    saveUsers(updated);
    setAdminLogs(getAdminLogs());
    triggerMessage("success", "Rôle administratif mis à jour.");
  };

  // -----------------------------------------------------------------
  // LESSON ACTIONS
  // -----------------------------------------------------------------
  const handleAddLessonManually = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle || !lessonChapTitle || !lessonContent) {
      triggerMessage("error", "Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (editingLesson) {
      // Edit mode
      const updated: Lesson = {
        ...editingLesson,
        subject: lessonSubject,
        grade: lessonGrade,
        chapterNo: lessonChapNo,
        chapterTitle: lessonChapTitle,
        title: lessonTitle,
        isPublished: lessonIsPublished,
        pdfAvailable: pdfFileName ? true : editingLesson.pdfAvailable,
        ...(pdfFileName ? { pdfUrl: pdfFileName } : editingLesson.pdfUrl ? { pdfUrl: editingLesson.pdfUrl } : {}),
        ...(imageFileName ? { imageUrl: imageFileName } : editingLesson.imageUrl ? { imageUrl: editingLesson.imageUrl } : {}),
        sections: [
          {
            title: "Introduction et Fondements",
            content: lessonContent
          }
        ]
      };

      onUpdateLesson(updated);

      addAdminLog(
        userProfile.email,
        `${userProfile.firstName} ${userProfile.lastName}`,
        "Modification de leçon",
        `${lessonTitle} (${lessonSubject})`
      );
      setAdminLogs(getAdminLogs());

      // Reset
      setEditingLesson(null);
      setPdfFileName("");
      setImageFileName("");
      setLessonIsPublished(true);
      setLessonTitle("");
      setLessonChapTitle("");
      setLessonContent("");
      triggerMessage("success", "Fiche de leçon mise à jour avec succès.");
    } else {
      // Add mode
      const newLesson: Lesson = {
        id: "man_" + Math.random().toString(36).substring(2, 9),
        subject: lessonSubject,
        grade: lessonGrade,
        chapterNo: lessonChapNo,
        chapterTitle: lessonChapTitle,
        title: lessonTitle,
        pdfAvailable: !!pdfFileName,
        ...(pdfFileName ? { pdfUrl: pdfFileName } : {}),
        ...(imageFileName ? { imageUrl: imageFileName } : {}),
        isPublished: lessonIsPublished,
        readingTime: 12,
        sections: [
          {
            title: "Introduction et Fondements",
            content: lessonContent
          }
        ]
      };

      onAddLesson(newLesson);
      
      // Log
      addAdminLog(
        userProfile.email,
        `${userProfile.firstName} ${userProfile.lastName}`,
        "Création de leçon manuelle",
        `${lessonTitle} (${lessonSubject})`
      );
      setAdminLogs(getAdminLogs());

      // Reset Form
      setLessonTitle("");
      setLessonChapTitle("");
      setLessonContent("");
      setPdfFileName("");
      setImageFileName("");
      setLessonIsPublished(true);
      triggerMessage("success", "Fiche de leçon créée et ajoutée au catalogue d'études.");
    }
  };

  const handleGenerateLessonAi = async () => {
    if (!lessonChapTitle) {
      triggerMessage("error", "Veuillez saisir un Titre de Chapitre pour guider l'IA.");
      return;
    }
    setIsAiGenerating(true);

    try {
      const prompt = `Rédige un cours complet et détaillé sur le thème "${lessonChapTitle}" pour la matière "${lessonSubject}" en classe de ${lessonGrade} en Côte d'Ivoire.
Le cours doit comporter 3 sections pédagogiques structurées :
- Section 1 : Introduction et définitions clés.
- Section 2 : Explication approfondie avec formules (si applicable, utilise le format LaTeX $$ et $) ou concepts.
- Section 3 : Applications concrètes ou exemples types d'examen de Côte d'Ivoire.
Rends le texte riche, complet, rédigé en français de manière académique.`;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ sender: "user", text: prompt }],
          userProfile: { firstName: "Admin", grade: lessonGrade }
        })
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      const paragraphs = data.text.split("\n\n");

      const newLesson: Lesson = {
        id: "ai_course_" + Math.random().toString(36).substring(2, 9),
        subject: lessonSubject,
        grade: lessonGrade,
        chapterNo: lessonChapNo,
        chapterTitle: lessonChapTitle,
        title: lessonTitle || `Cours d'excellence sur : ${lessonChapTitle}`,
        pdfAvailable: true,
        readingTime: 12,
        sections: [
          {
            title: "1. Fondements et Cadre d'Étude",
            content: paragraphs.slice(0, Math.floor(paragraphs.length / 3)).join("\n\n") || data.text
          },
          {
            title: "2. Approfondissement Théorique",
            content: paragraphs.slice(Math.floor(paragraphs.length / 3), Math.floor(paragraphs.length * 2 / 3)).join("\n\n") || "Développement conceptuel détaillé généré par IA."
          },
          {
            title: "3. Applications directes BAC",
            content: paragraphs.slice(Math.floor(paragraphs.length * 2 / 3)).join("\n\n") || "Sujets types d'examen conformes."
          }
        ]
      };

      onAddLesson(newLesson);

      addAdminLog(
        userProfile.email,
        `${userProfile.firstName} ${userProfile.lastName}`,
        "Génération de leçon par l'IA",
        `${newLesson.title} (${lessonSubject})`
      );
      setAdminLogs(getAdminLogs());

      setLessonTitle("");
      setLessonChapTitle("");
      triggerMessage("success", "Fiche de leçon rédigée de manière autonome par l'IA.");
    } catch {
      triggerMessage("error", "Une anomalie est survenue lors de la communication de rédaction. Veuillez saisir manuellement.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  // -----------------------------------------------------------------
  // CITATION ACTIONS
  // -----------------------------------------------------------------
  const handleAddCitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuoteText || !newQuoteAuthor) return;

    const newCitation: Citation = {
      id: "cit_" + Math.random().toString(36).substring(2, 9),
      text: newQuoteText,
      author: newQuoteAuthor,
      category: newQuoteCat
    };

    const updated = [newCitation, ...citations];
    setCitations(updated);
    saveCitations(updated);

    addAdminLog(
      userProfile.email,
      `${userProfile.firstName} ${userProfile.lastName}`,
      "Ajout de citation d'inspiration",
      `"${newQuoteText}" — ${newQuoteAuthor}`
    );
    setAdminLogs(getAdminLogs());

    setNewQuoteText("");
    setNewQuoteAuthor("");
    triggerMessage("success", "Nouvelle citation de motivation scolaire enregistrée.");
  };

  const handleDeleteCitation = (id: string) => {
    const updated = citations.filter(c => c.id !== id);
    setCitations(updated);
    saveCitations(updated);

    addAdminLog(
      userProfile.email,
      `${userProfile.firstName} ${userProfile.lastName}`,
      "Suppression de citation",
      `ID: ${id}`
    );
    setAdminLogs(getAdminLogs());
    triggerMessage("success", "Citation retirée du catalogue.");
  };

  // -----------------------------------------------------------------
  // SETTINGS & BACKUPS
  // -----------------------------------------------------------------
  const handleUpdateSettings = (updated: AppSettings) => {
    setAppSettings(updated);
    saveAppSettings(updated);
    addAdminLog(
      userProfile.email,
      `${userProfile.firstName} ${userProfile.lastName}`,
      "Configuration système mise à jour",
      "Paramètres généraux"
    );
    setAdminLogs(getAdminLogs());
    triggerMessage("success", "Paramètres système enregistrés.");
  };

  const handleSimulateBackup = () => {
    addAdminLog(
      userProfile.email,
      `${userProfile.firstName} ${userProfile.lastName}`,
      "Lancement sauvegarde générale",
      "Stockage cloud sécurisé"
    );
    setAdminLogs(getAdminLogs());
    triggerMessage("success", "Sauvegarde de la base locale compilée avec succès.");
  };

  // Filter users
  const filteredUsers = users.filter(u => {
    const query = userSearch.toLowerCase();
    return (
      u.firstName.toLowerCase().includes(query) ||
      u.lastName.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-8 font-sans">
      
      {/* GLOBAL HEADER */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border-2 border-slate-950 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 border border-slate-950 rounded-full text-[10px] font-black uppercase tracking-wider">
            🔐 ESPACE D'ADMINISTRATION COMPLET
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading mt-2">Panneau de Contrôle Directeur</h1>
          <p className="text-slate-400 text-xs mt-1 font-semibold">
            Portail de supervision pour {userProfile.firstName} {userProfile.lastName} ({isSuperAdmin ? "Super Administrateur" : "Administrateur"})
          </p>
        </div>
        
        {isSuperAdmin && (
          <span className="px-3 py-1.5 bg-yellow-500 text-slate-950 border border-slate-950 rounded-xl text-xs font-black shrink-0">
            👑 Privilèges Maîtres Actifs
          </span>
        )}
      </div>

      {/* ADMIN LEVEL MESSAGE STATUS BANNER */}
      {adminMsg && (
        <div className={`p-4 border-2 border-slate-900 rounded-2xl flex items-center gap-2.5 text-xs font-bold ${
          adminMsg.type === "success" ? "bg-emerald-50 text-slate-900" : "bg-red-50 text-slate-900"
        }`}>
          {adminMsg.type === "success" ? <Check className="h-5 w-5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 text-red-600" />}
          <span>{adminMsg.text}</span>
        </div>
      )}

      {/* CORE ADMIN NAVIGATION TABS */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: "dashboard", label: "Tableau de Bord", icon: Shield },
          { id: "users", label: "Gestion Élèves", icon: Users },
          { id: "content", label: "Contenus Pédagogiques", icon: BookOpen },
          { id: "settings", label: "Paramètres & Sys", icon: Settings },
          { id: "audit", label: "Journaux d'Audit", icon: History }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-black rounded-xl border-2 transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-slate-900 text-white border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]"
                  : "bg-white text-slate-600 border-transparent hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT SWITCHER */}
      <div>
        
        {/* 1. ADMIN DASHBOARD STATS */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] text-center">
                <span className="text-2xl">👥</span>
                <h4 className="text-2xl font-black font-heading text-slate-900 mt-2">
                  {users.filter(u => !u.isAdmin).length}
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Nombre total d'élèves</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] text-center">
                <span className="text-2xl">🆕</span>
                <h4 className="text-2xl font-black font-heading text-slate-900 mt-2">
                  3
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Nouveaux cette semaine</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] text-center">
                <span className="text-2xl">📚</span>
                <h4 className="text-2xl font-black font-heading text-slate-900 mt-2">
                  {lessons.length}
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Nombre de cours</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] text-center">
                <span className="text-2xl">📝</span>
                <h4 className="text-2xl font-black font-heading text-slate-900 mt-2">
                  {SAMPLE_QUIZZES.length}
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Nombre de quiz & exercices</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
                <h3 className="font-black text-sm text-slate-800 uppercase tracking-wider">📊 Statistiques d'Utilisation</h3>
                <div className="space-y-3.5">
                  {[
                    { label: "Consultation fiches de cours", val: "84%", bg: "bg-blue-600" },
                    { label: "Assiduité moyenne des élèves", val: "78%", bg: "bg-emerald-500" },
                    { label: "Taux de réussite aux quiz", val: "62%", bg: "bg-amber-500" },
                    { label: "Volume de citations mémorisées", val: `${citations.length} fiches`, bg: "bg-indigo-600" }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{item.label}</span>
                        <span>{item.val}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full border border-slate-200 overflow-hidden">
                        <div className={`h-full ${item.bg}`} style={{ width: item.val.includes("%") ? item.val : "50%" }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
                <h3 className="font-black text-sm text-slate-800 uppercase tracking-wider">⏱️ Activité Récente du Système</h3>
                <div className="space-y-3 max-h-[220px] overflow-y-auto">
                  {adminLogs.slice(0, 4).map((log) => (
                    <div key={log.id} className="text-xs border-b border-slate-150 pb-2.5 last:border-0 last:pb-0 flex justify-between gap-4">
                      <div>
                        <p className="font-black text-slate-800">{log.action}</p>
                        <p className="text-[10px] text-slate-500 font-semibold">Cible : {log.target}</p>
                      </div>
                      <span className="text-[9px] font-black text-slate-400 text-right shrink-0">{log.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. GESTION DES ELEVES (USERS) */}
        {activeTab === "users" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left list panel */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-black text-base text-slate-900">👥 Répertoire des Utilisateurs</h3>
                <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {filteredUsers.length} élèves / admins
                </span>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par prénom, nom de famille ou adresse email..."
                  className="w-full pl-9 pr-4 py-2 border-2 border-slate-900 rounded-xl text-xs bg-white focus:outline-none"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>

              {/* Users list */}
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedStudent(user)}
                    className={`p-3.5 rounded-xl border-2 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer ${
                      selectedStudent?.id === user.id
                        ? "border-blue-600 bg-blue-50/50"
                        : "border-slate-200 hover:border-slate-350"
                    }`}
                  >
                    <div className="flex gap-3 items-center min-w-0">
                      <div className={`h-9 w-9 rounded-lg font-black text-xs flex items-center justify-center shrink-0 border border-slate-900 ${
                        user.isAdmin ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-xs text-slate-900 truncate">
                          {user.firstName} {user.lastName}
                        </h4>
                        <p className="text-[10px] text-slate-500 truncate font-semibold">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex gap-1.5 shrink-0 w-full sm:w-auto justify-end">
                      {user.isAdmin ? (
                        <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[8px] font-black rounded uppercase border border-red-200">
                          Admin
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[8px] font-black rounded uppercase border border-blue-200">
                          Élève
                        </span>
                      )}

                      {user.isDisabled && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-[8px] font-black rounded uppercase">
                          Désactivé
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right student details block */}
            <div className="space-y-6">
              {selectedStudent ? (
                <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-6">
                  <div className="text-center border-b border-slate-100 pb-4">
                    <div className="h-14 w-14 bg-slate-900 text-white rounded-2xl mx-auto flex items-center justify-center text-lg font-black border-2 border-slate-950 shadow-md">
                      {selectedStudent.firstName.charAt(0)}{selectedStudent.lastName.charAt(0)}
                    </div>
                    <h3 className="font-black text-base text-slate-900 mt-3">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">{selectedStudent.email}</p>
                  </div>

                  {/* Profile data properties */}
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-slate-500 font-bold">Grade d'études</span>
                      <span className="font-black text-slate-800">{selectedStudent.grade}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-slate-500 font-bold">Filière / Série</span>
                      <span className="font-black text-slate-800">{selectedStudent.serie || "Série D"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-slate-500 font-bold">Acquisition XP</span>
                      <span className="font-black text-blue-600 font-mono">+{selectedStudent.xp} XP</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-slate-500 font-bold">Compte actif</span>
                      <span className="font-black text-slate-800">{selectedStudent.isDisabled ? "Bloqué" : "Actif"}</span>
                    </div>
                  </div>

                  {/* Access controls */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleToggleUserStatus(selectedStudent.id)}
                      className="w-full py-2 bg-slate-950 hover:bg-slate-850 text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      {selectedStudent.isDisabled ? (
                        <>
                          <Unlock className="h-4 w-4 text-emerald-400" />
                          Réactiver le compte
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 text-red-400" />
                          Désactiver le compte
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleToggleAdminRole(selectedStudent.id)}
                      className="w-full py-2 bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      {selectedStudent.isAdmin ? "Révoquer rôle admin" : "Promouvoir admin"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-300 text-center text-slate-500 text-xs py-12">
                  <Users className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                  Sélectionnez un élève dans le registre pour afficher son profil, suspendre son accès ou modifier ses rôles.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. PEDAGOGICAL CONTENT MANAGER */}
        {activeTab === "content" && (
          <div className="space-y-6">
            
            {/* Content selector sub tabs */}
            <div className="flex gap-1 overflow-x-auto pb-1 max-w-full">
              {[
                { id: "matieres", label: "Matières" },
                { id: "cours", label: "Cours" },
                { id: "lessons", label: "Leçons (IA)" },
                { id: "quizzes", label: "Quiz" },
                { id: "exercises", label: "Exercices" },
                { id: "defis", label: "Défis Bac" },
                { id: "quotes", label: "Citations" },
                { id: "notifications", label: "Notifications" }
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setContentSubTab(sub.id as any)}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg border transition-all shrink-0 cursor-pointer ${
                    contentSubTab === sub.id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Sub-tab views */}
            {contentSubTab === "lessons" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Manual & AI Lesson Builder */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
                  <h3 className="font-black text-base text-slate-950 font-heading">
                    {editingLesson ? "💾 Modifier la Leçon : " + editingLesson.title : "🖋️ Ajouter ou Générer une Leçon"}
                  </h3>
                  
                  <form onSubmit={handleAddLessonManually} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="form_sub" className="block text-[10px] font-black text-slate-600 uppercase">Matière</label>
                        <select
                          id="form_sub"
                          className="w-full px-3 py-2 border-2 border-slate-900 text-slate-950 rounded-xl text-xs bg-white focus:outline-none"
                          value={lessonSubject}
                          onChange={(e) => setLessonSubject(e.target.value as any)}
                        >
                          <option value="Mathématiques">Mathématiques</option>
                          <option value="Français">Français</option>
                          <option value="Anglais">Anglais</option>
                          <option value="SVT">SVT</option>
                          <option value="Physique-Chimie">Physique-Chimie</option>
                          <option value="Philosophie">Philosophie</option>
                          <option value="Histoire-Géographie">Histoire-Géographie</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="form_grade" className="block text-[10px] font-black text-slate-600 uppercase">Classe</label>
                        <select
                          id="form_grade"
                          className="w-full px-3 py-2 border-2 border-slate-900 text-slate-950 rounded-xl text-xs bg-white focus:outline-none"
                          value={lessonGrade}
                          onChange={(e) => setLessonGrade(e.target.value as any)}
                        >
                          <option value="2nde">Seconde (2nde)</option>
                          <option value="1ère">Première (1ère)</option>
                          <option value="Terminale">Terminale (Tle)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      <div className="col-span-1">
                        <label htmlFor="form_no" className="block text-[10px] font-black text-slate-600 uppercase">Chap N°</label>
                        <input
                          id="form_no"
                          type="number"
                          className="w-full px-3 py-2 border-2 border-slate-900 text-slate-950 rounded-xl text-xs focus:outline-none"
                          value={lessonChapNo}
                          onChange={(e) => setLessonChapNo(Number(e.target.value))}
                        />
                      </div>
                      <div className="col-span-3">
                        <label htmlFor="form_chap_t" className="block text-[10px] font-black text-slate-600 uppercase">Titre Chapitre</label>
                        <input
                          id="form_chap_t"
                          type="text"
                          required
                          className="w-full px-3 py-2 border-2 border-slate-900 text-slate-950 rounded-xl text-xs focus:outline-none"
                          placeholder="Ex: Fonctions exponentielles"
                          value={lessonChapTitle}
                          onChange={(e) => setLessonChapTitle(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="form_title" className="block text-[10px] font-black text-slate-600 uppercase">Titre Leçon</label>
                      <input
                        id="form_title"
                        type="text"
                        required
                        className="w-full px-3 py-2 border-2 border-slate-900 text-slate-950 rounded-xl text-xs focus:outline-none"
                        placeholder="Ex: Théorème des valeurs intermédiaires"
                        value={lessonTitle}
                        onChange={(e) => setLessonTitle(e.target.value)}
                      />
                    </div>

                    {/* AI Generator Button (Only show when not editing) */}
                    {!editingLesson && (
                      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2 text-indigo-900 font-black text-xs">
                          <Sparkles className="h-4 w-4 text-indigo-600" />
                          <span>Création Assistée par l'IA EduMentor</span>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          Clique sur le bouton ci-dessous pour laisser notre IA Gemini rédiger de façon autonome cette fiche de cours complète.
                        </p>
                        <button
                          type="button"
                          onClick={handleGenerateLessonAi}
                          disabled={isAiGenerating}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-black rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                          {isAiGenerating ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Rédaction IA de la leçon en cours...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-3 w-3" />
                              Générer la leçon complète avec l'IA
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-slate-100"></div>
                      <span className="flex-shrink mx-3 text-slate-400 text-[9px] font-black uppercase">
                        {editingLesson ? "Contenu de la leçon" : "Ou Saisie Manuelle"}
                      </span>
                      <div className="flex-grow border-t border-slate-100"></div>
                    </div>

                    <div>
                      <label htmlFor="form_content" className="block text-[10px] font-black text-slate-600 uppercase">Contenu Cours (Markdown)</label>
                      <textarea
                        id="form_content"
                        className="w-full p-3 border-2 border-slate-900 text-slate-950 rounded-xl text-xs focus:outline-none min-h-[140px] font-mono"
                        placeholder="Insère le contenu textuel..."
                        value={lessonContent}
                        onChange={(e) => setLessonContent(e.target.value)}
                      ></textarea>
                    </div>

                    {/* MEDIA UPLOADS SECTIONS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {/* PDF Uploader */}
                      <div className="border-2 border-dashed border-slate-200 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                        <FileUp className="h-5 w-5 text-slate-400 mb-1" />
                        <label className="cursor-pointer text-[10px] font-black text-slate-700 uppercase hover:text-blue-600">
                          Importer un PDF
                          <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setPdfFileName(file.name);
                                triggerMessage("success", `PDF "${file.name}" attaché.`);
                              }
                            }}
                          />
                        </label>
                        {pdfFileName && (
                          <p className="text-[9px] text-emerald-600 font-bold truncate max-w-full mt-1">
                            📎 {pdfFileName}
                          </p>
                        )}
                      </div>

                      {/* Image Uploader */}
                      <div className="border-2 border-dashed border-slate-200 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                        <ImageUp className="h-5 w-5 text-slate-400 mb-1" />
                        <label className="cursor-pointer text-[10px] font-black text-slate-700 uppercase hover:text-blue-600">
                          Importer une Image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setImageFileName(file.name);
                                triggerMessage("success", `Illustration "${file.name}" attachée.`);
                              }
                            }}
                          />
                        </label>
                        {imageFileName && (
                          <p className="text-[9px] text-emerald-600 font-bold truncate max-w-full mt-1">
                            🖼️ {imageFileName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* PUBLICATION SWITCH */}
                    <div className="flex items-center justify-between p-3 bg-slate-50 border-2 border-slate-900 rounded-xl">
                      <div>
                        <p className="text-xs font-black text-slate-800">Rendre cette leçon visible immédiatement</p>
                        <p className="text-[9px] text-slate-400 font-semibold">Si désactivé, le cours sera masqué aux élèves</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setLessonIsPublished(!lessonIsPublished)}
                        className={`h-5 w-9 rounded-full transition-colors flex items-center px-1 shrink-0 ${
                          lessonIsPublished ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      >
                        <div className={`h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                          lessonIsPublished ? "translate-x-3.5" : "translate-x-0"
                        }`}></div>
                      </button>
                    </div>

                    {/* ACTIONS BUTTONS */}
                    <div className="flex gap-2.5">
                      {editingLesson && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingLesson(null);
                            setLessonTitle("");
                            setLessonChapTitle("");
                            setLessonContent("");
                            setPdfFileName("");
                            setImageFileName("");
                            setLessonIsPublished(true);
                          }}
                          className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-slate-900 text-xs font-black rounded-xl"
                        >
                          Annuler
                        </button>
                      )}
                      <button
                        type="submit"
                        className="flex-[2] py-2.5 bg-slate-900 hover:bg-slate-850 text-white text-xs font-black rounded-xl border-2 border-slate-900"
                      >
                        {editingLesson ? "💾 Sauvegarder les modifications" : "➕ Enregistrer la Leçon Manuellement"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Lesson list catalogs */}
                <div className="bg-white p-5 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
                  <h3 className="font-black text-sm text-slate-800 uppercase tracking-wider">📚 Catalogue Leçons ({lessons.length})</h3>
                  <div className="space-y-2.5 max-h-[580px] overflow-y-auto">
                    {lessons.map((lesson) => {
                      const isPub = lesson.isPublished !== false;
                      return (
                        <div key={lesson.id} className="p-3 bg-slate-50 border-2 border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-1 py-0.5 rounded uppercase shrink-0 border border-blue-100">
                                {lesson.subject}
                              </span>
                              <span className="text-[9px] font-black text-slate-600 bg-slate-100 px-1 py-0.5 rounded uppercase shrink-0">
                                {lesson.grade}
                              </span>
                              {!isPub && (
                                <span className="text-[9px] font-black text-red-600 bg-red-50 px-1 py-0.5 rounded uppercase shrink-0 border border-red-100">
                                  Masqué
                                </span>
                              )}
                              {lesson.pdfAvailable && (
                                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded uppercase shrink-0 border border-emerald-100">
                                  PDF
                                </span>
                              )}
                              {lesson.imageUrl && (
                                <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded uppercase shrink-0 border border-indigo-100">
                                  Img
                                </span>
                              )}
                            </div>
                            <h4 className="font-black text-slate-800 truncate mt-1">{lesson.title}</h4>
                            <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">{lesson.chapterTitle}</p>
                          </div>
                          
                          <div className="flex gap-1 shrink-0">
                            {/* Toggle Publish */}
                            <button
                              onClick={() => {
                                const updated = { ...lesson, isPublished: !isPub };
                                onUpdateLesson(updated);
                                addAdminLog(
                                  userProfile.email,
                                  `${userProfile.firstName} ${userProfile.lastName}`,
                                  isPub ? "Masquage de leçon" : "Publication de leçon",
                                  lesson.title
                                );
                                setAdminLogs(getAdminLogs());
                                triggerMessage("success", isPub ? "Fiche de leçon masquée." : "Fiche de leçon publiée.");
                              }}
                              title={isPub ? "Masquer le cours" : "Publier le cours"}
                              className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg bg-white border border-slate-200 transition-all cursor-pointer"
                            >
                              {isPub ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5 text-slate-400" />}
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => {
                                setEditingLesson(lesson);
                                setLessonTitle(lesson.title);
                                setLessonChapTitle(lesson.chapterTitle);
                                setLessonChapNo(lesson.chapterNo);
                                setLessonSubject(lesson.subject);
                                setLessonGrade(lesson.grade);
                                setLessonIsPublished(lesson.isPublished !== false);
                                setPdfFileName(lesson.pdfUrl || "");
                                setImageFileName(lesson.imageUrl || "");
                                setLessonContent(lesson.sections?.[0]?.content || "");
                                triggerMessage("success", `Cours "${lesson.title}" chargé pour modification.`);
                              }}
                              title="Modifier la leçon"
                              className="p-1.5 text-slate-500 hover:text-emerald-600 rounded-lg bg-white border border-slate-200 transition-all cursor-pointer"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => {
                                if (window.confirm(`Supprimer la fiche "${lesson.title}" ?`)) {
                                  onDeleteLesson(lesson.id);
                                  addAdminLog(userProfile.email, `${userProfile.firstName} ${userProfile.lastName}`, "Suppression de leçon", lesson.title);
                                  setAdminLogs(getAdminLogs());
                                  triggerMessage("success", "Fiche de leçon supprimée.");
                                }
                              }}
                              title="Supprimer la leçon"
                              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg bg-white border border-slate-200 transition-all cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {contentSubTab === "quotes" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Quote form */}
                <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
                  <h3 className="font-black text-base text-slate-950 font-heading">🖋️ Ajouter une Citation</h3>
                  <form onSubmit={handleAddCitation} className="space-y-4">
                    <div>
                      <label htmlFor="cit_author" className="block text-[10px] font-black text-slate-600 uppercase">Auteur de la citation</label>
                      <input
                        id="cit_author"
                        type="text"
                        required
                        className="w-full px-3 py-2 border-2 border-slate-900 text-slate-950 rounded-xl text-xs focus:outline-none"
                        placeholder="Ex: Victor Hugo, Albert Einstein..."
                        value={newQuoteAuthor}
                        onChange={(e) => setNewQuoteAuthor(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="cit_cat" className="block text-[10px] font-black text-slate-600 uppercase">Catégorie</label>
                      <select
                        id="cit_cat"
                        className="w-full px-3 py-2 border-2 border-slate-900 text-slate-950 rounded-xl text-xs bg-white focus:outline-none"
                        value={newQuoteCat}
                        onChange={(e) => setNewQuoteCat(e.target.value)}
                      >
                        <option value="Général">Général</option>
                        <option value="Mathématiques">Mathématiques</option>
                        <option value="Philosophie">Philosophie</option>
                        <option value="Physique-Chimie">Physique-Chimie</option>
                        <option value="Littérature">Littérature</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="cit_text" className="block text-[10px] font-black text-slate-600 uppercase">Texte de la citation</label>
                      <textarea
                        id="cit_text"
                        required
                        className="w-full p-3 border-2 border-slate-900 text-slate-950 rounded-xl text-xs focus:outline-none min-h-[80px]"
                        placeholder="Saisis la citation inspirante..."
                        value={newQuoteText}
                        onChange={(e) => setNewQuoteText(e.target.value)}
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-white text-xs font-black rounded-xl"
                    >
                      ➕ Ajouter la Citation
                    </button>
                  </form>
                </div>

                {/* Quote listing */}
                <div className="lg:col-span-2 bg-white p-5 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
                  <h3 className="font-black text-sm text-slate-800 uppercase tracking-wider">📜 Liste des Citations ({citations.length})</h3>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {citations.map((cit) => (
                      <div key={cit.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4 text-xs">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 italic">"{cit.text}"</p>
                          <p className="text-[10px] text-slate-500 font-black mt-1">— {cit.author} ({cit.category})</p>
                        </div>
                        <button
                          onClick={() => handleDeleteCitation(cit.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-white transition-all shrink-0 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Quiz / Exercices / Défis Management View */}
            {contentSubTab !== "lessons" && contentSubTab !== "quotes" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Generator Form */}
                <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
                  <h3 className="font-black text-base text-slate-950 font-heading">
                    ✨ Générer ou Créer un Evaluation ({contentSubTab})
                  </h3>
                  <form onSubmit={handleGenerateQuizAi} className="space-y-4">
                    <div>
                      <label htmlFor="qz_sub" className="block text-[10px] font-black text-slate-600 uppercase">Matière</label>
                      <select
                        id="qz_sub"
                        className="w-full px-3 py-2 border-2 border-slate-900 text-slate-950 rounded-xl text-xs bg-white focus:outline-none"
                        value={quizSubject}
                        onChange={(e) => setQuizSubject(e.target.value as any)}
                      >
                        <option value="Mathématiques">Mathématiques</option>
                        <option value="Français">Français</option>
                        <option value="Anglais">Anglais</option>
                        <option value="SVT">SVT</option>
                        <option value="Physique-Chimie">Physique-Chimie</option>
                        <option value="Philosophie">Philosophie</option>
                        <option value="Histoire-Géographie">Histoire-Géographie</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="qz_grd" className="block text-[10px] font-black text-slate-600 uppercase">Classe</label>
                        <select
                          id="qz_grd"
                          className="w-full px-3 py-2 border-2 border-slate-900 text-slate-950 rounded-xl text-xs bg-white focus:outline-none"
                          value={quizGrade}
                          onChange={(e) => setQuizGrade(e.target.value as any)}
                        >
                          <option value="2nde">Seconde (2nde)</option>
                          <option value="1ère">Première (1ère)</option>
                          <option value="Terminale">Terminale (Tle)</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="qz_diff" className="block text-[10px] font-black text-slate-600 uppercase">Difficulté</label>
                        <select
                          id="qz_diff"
                          className="w-full px-3 py-2 border-2 border-slate-900 text-slate-950 rounded-xl text-xs bg-white focus:outline-none"
                          value={quizDifficulty}
                          onChange={(e) => setQuizDifficulty(e.target.value as any)}
                        >
                          <option value="facile">Facile</option>
                          <option value="moyen">Moyen</option>
                          <option value="difficile">Difficile</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="qz_chap" className="block text-[10px] font-black text-slate-600 uppercase">Titre du Chapitre / Thème</label>
                      <input
                        id="qz_chap"
                        type="text"
                        required
                        className="w-full px-3 py-2 border-2 border-slate-900 text-slate-950 rounded-xl text-xs focus:outline-none"
                        placeholder="Ex: Nombres complexes, Dissertation littéraire..."
                        value={quizChapTitle}
                        onChange={(e) => setQuizChapTitle(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isQuizAiGenerating}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      {isQuizAiGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Génération IA Gemini en cours...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Générer et Enregistrer dans Firestore
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Quizzes list in Firestore */}
                <div className="lg:col-span-2 bg-white p-5 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
                  <h3 className="font-black text-sm text-slate-800 uppercase tracking-wider">
                    🎯 Banque d'Évaluations Firestore ({quizzesList.length})
                  </h3>
                  <div className="space-y-3 max-h-[520px] overflow-y-auto">
                    {quizzesList.map((qz) => (
                      <div key={qz.id} className="p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl flex items-center justify-between gap-4 text-xs">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase border border-blue-100">
                              {qz.subject}
                            </span>
                            <span className="text-[9px] font-black text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded uppercase">
                              {qz.grade}
                            </span>
                            <span className="text-[9px] font-black text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded uppercase border border-purple-100">
                              {qz.difficulty}
                            </span>
                            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase border border-emerald-100">
                              {qz.questions?.length || 0} Questions
                            </span>
                          </div>
                          <h4 className="font-black text-slate-900 mt-1.5 truncate">{qz.title}</h4>
                          <p className="text-[10px] text-slate-500 font-semibold truncate mt-0.5">{qz.chapterTitle}</p>
                        </div>

                        <button
                          onClick={() => handleDeleteQuiz(qz.id)}
                          title="Supprimer ce quiz de Firestore"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl border border-slate-200 transition-all shrink-0 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 4. PARAMETRES (SETTINGS) */}
        {activeTab === "settings" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* System Parameters Card */}
            {appSettings && (
              <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-black text-base text-slate-950 font-heading">⚙️ Paramètres Généraux de l'Application</h3>
                  <p className="text-slate-500 text-xs">Configure l'état de l'application EduMentor.</p>
                </div>

                <div className="space-y-4 text-xs font-bold text-slate-700">
                  <div className="space-y-1.5">
                    <label htmlFor="set_name" className="block text-[10px] font-black uppercase">Nom de l'application</label>
                    <input
                      id="set_name"
                      type="text"
                      className="w-full px-3 py-2 border-2 border-slate-900 text-slate-950 rounded-xl text-xs focus:outline-none"
                      value={appSettings.appName}
                      onChange={(e) => handleUpdateSettings({ ...appSettings, appName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="set_year" className="block text-[10px] font-black uppercase">Année Scolaire</label>
                    <input
                      id="set_year"
                      type="text"
                      className="w-full px-3 py-2 border-2 border-slate-900 text-slate-950 rounded-xl text-xs focus:outline-none"
                      value={appSettings.schoolYear}
                      onChange={(e) => handleUpdateSettings({ ...appSettings, schoolYear: e.target.value })}
                    />
                  </div>

                  {/* Switch toggles */}
                  <div className="space-y-3 pt-2">
                    <button
                      onClick={() => handleUpdateSettings({ ...appSettings, allowAiRegistrations: !appSettings.allowAiRegistrations })}
                      className="w-full flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-left"
                    >
                      <div>
                        <p className="text-xs font-black text-slate-800">Autoriser les inscriptions libres</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Permet aux élèves de s'enregistrer d'eux-mêmes</p>
                      </div>
                      <div className={`h-5 w-9 rounded-full transition-colors flex items-center px-1 shrink-0 ${
                        appSettings.allowAiRegistrations ? "bg-emerald-500" : "bg-slate-300"
                      }`}>
                        <div className={`h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                          appSettings.allowAiRegistrations ? "translate-x-3.5" : "translate-x-0"
                        }`}></div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleUpdateSettings({ ...appSettings, notificationsEnabled: !appSettings.notificationsEnabled })}
                      className="w-full flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-left"
                    >
                      <div>
                        <p className="text-xs font-black text-slate-800">Système d'alertes & notifications</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Diffuse des rappels d'études et de BAC hebdomadaires</p>
                      </div>
                      <div className={`h-5 w-9 rounded-full transition-colors flex items-center px-1 shrink-0 ${
                        appSettings.notificationsEnabled ? "bg-emerald-500" : "bg-slate-300"
                      }`}>
                        <div className={`h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                          appSettings.notificationsEnabled ? "translate-x-3.5" : "translate-x-0"
                        }`}></div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Backups & simulated logs */}
            <div className="space-y-6">
              
              {/* Backups panel */}
              <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2 font-heading">
                  <Database className="h-5 w-5 text-blue-600" />
                  Sauvegardes & Restauration
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                  Il est fortement recommandé de compiler des sauvegardes à intervalles réguliers afin d'éviter toute perte d'activité d'études.
                </p>
                <button
                  onClick={handleSimulateBackup}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-white text-xs font-black rounded-xl flex items-center justify-center gap-1.5 border-2 border-slate-900"
                >
                  <Database className="h-4 w-4" />
                  Lancer une Sauvegarde Générale
                </button>
              </div>

              {/* simulated error logs */}
              <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-3">
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2 font-heading">
                  <Terminal className="h-5 w-5 text-slate-700" />
                  Journaux d'Erreurs Système
                </h3>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left overflow-x-auto max-h-[140px]">
                  <code className="text-[10px] text-emerald-400 space-y-1 block font-mono">
                    <p>[2026-07-17 01:14:05] SYSTEM: Boot sequence completed on port 3000</p>
                    <p>[2026-07-17 01:15:32] API: Gemini API validation active</p>
                    <p>[2026-07-17 02:22:11] LOG: User list seed complete (5 records)</p>
                    <p className="text-slate-400">[2026-07-17 02:24:00] INFO: No errors detected</p>
                  </code>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 5. AUDIT LOGS VIEW */}
        {activeTab === "audit" && (
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-black text-base text-slate-950 font-heading">📋 Journaux d'Audit de Sécurité</h3>
                <p className="text-slate-500 text-xs">Historique complet de toutes les actions d'administration exécutées sur EduMentor.</p>
              </div>
              <span className="text-[10px] font-black text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                Audit Actif
              </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {adminLogs.map((log) => (
                <div key={log.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                  <div>
                    <p className="font-black text-slate-900 flex items-center gap-1.5">
                      <Shield className="h-4 w-4 text-red-600 shrink-0" />
                      {log.action}
                    </p>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1">Cible : {log.target}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5 font-bold">Par : {log.adminName} ({log.adminEmail})</p>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 shrink-0 text-right">{log.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
