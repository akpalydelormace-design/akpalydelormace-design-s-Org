import React, { useState } from "react";
import {
  BookOpen,
  Trophy,
  Flame,
  CheckCircle,
  ArrowRight,
  Play,
  BrainCircuit,
  Target,
  Sparkles,
  BookMarked,
  CheckSquare,
  Square,
  GraduationCap,
  Award,
  TrendingUp,
  FileText,
  Quote
} from "lucide-react";
import { motion } from "motion/react";
import { UserProfile, LearningHistory } from "../types";
import { SAMPLE_LESSONS } from "../data/coursesData";

interface DashboardProps {
  userProfile: UserProfile;
  history: LearningHistory[];
  completedLessonIds: string[];
  completedQuizzesCount: number;
  onNavigateToTab: (tabName: string) => void;
  onSelectLesson: (lessonId: string) => void;
  onStartDefiBac: () => void;
}

export default function DashboardScreen({
  userProfile,
  history,
  completedLessonIds,
  completedQuizzesCount,
  onNavigateToTab,
  onSelectLesson,
  onStartDefiBac
}: DashboardProps) {
  // Safe fallbacks for customized fields
  const userGrade = userProfile.grade || "Terminale";
  const userSerie = userProfile.serie || "Série D";
  const userSchoolYear = userProfile.schoolYear || "2026-2027";

  // Checkable Weekly Goals
  const [weeklyGoals, setWeeklyGoals] = useState([
    { id: 1, text: "Lire au moins 2 fiches de cours", completed: completedLessonIds.length >= 2 },
    { id: 2, text: "Réussir 1 quiz ou exercice d'entraînement", completed: completedQuizzesCount >= 1 },
    { id: 3, text: "S'entraîner sur un Défi Bac Blanc IA", completed: history.some(h => h.type === "defi_bac") },
    { id: 4, text: "Poser une question difficile au Mentor IA", completed: false }
  ]);

  const toggleGoal = (id: number) => {
    setWeeklyGoals(prev =>
      prev.map(goal => (goal.id === id ? { ...goal, completed: !goal.completed } : goal))
    );
  };

  const completedGoalsCount = weeklyGoals.filter(g => g.completed).length;
  const totalLessonsCount = SAMPLE_LESSONS && SAMPLE_LESSONS.length > 0 ? SAMPLE_LESSONS.length : 0;
  const progressPercent = totalLessonsCount > 0 
    ? Math.min(100, Math.max(0, Math.round((completedLessonIds.length / totalLessonsCount) * 100))) 
    : 0;

  // Recommended course cards
  const recommendedLessons = SAMPLE_LESSONS.filter(l => l.grade === userGrade);

  return (
    <div className="space-y-8 font-sans">
      
      {/* 1. WELCOME BANNER & STUDENT ID CARD */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-5 translate-x-12 translate-y-12">
          <BrainCircuit className="h-64 w-64" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-slate-900 rounded-full text-xs font-bold text-blue-700">
              <Sparkles className="h-3.5 w-3.5 text-yellow-500 fill-yellow-200 animate-pulse" />
              <span>Année Scolaire {userSchoolYear}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black font-heading tracking-tight text-slate-900">
              Ravi de te revoir, {userProfile.firstName} ! 👋
            </h1>
            
            <p className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed">
              Prépare sereinement ton année d'examen en Côte d'Ivoire. Révise les cours du programme national et entraîne-toi avec nos modules d'Intelligence Artificielle.
            </p>

            {/* Class Stream and Info */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-black">
                🎓 {userGrade}
              </span>
              <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-black">
                ⚡ {userSerie}
              </span>
              <span className="px-3 py-1 bg-yellow-500 text-slate-950 border border-slate-900 rounded-lg text-xs font-black">
                🇨🇮 Programme National
              </span>
            </div>
          </div>

          <div className="shrink-0 flex md:flex-col gap-3">
            <button
              onClick={() => onNavigateToTab("assistant")}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-sm transition-all flex items-center justify-center gap-2 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
            >
              <BrainCircuit className="h-4.5 w-4.5" />
              Mentor IA
            </button>
            <button
              onClick={() => onNavigateToTab("cours")}
              className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-900 font-black rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#0f172a]"
            >
              <BookOpen className="h-4.5 w-4.5" />
              Fiches de Cours
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS PANELS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex items-center gap-4">
          <div className="p-3 bg-yellow-100 border border-slate-900 rounded-xl text-yellow-700 shrink-0">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Score Global</p>
            <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900">{userProfile.xp} XP</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex items-center gap-4">
          <div className="p-3 bg-red-100 border border-slate-900 rounded-xl text-red-500 shrink-0">
            <Flame className="h-6 w-6 animate-bounce" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Assiduité</p>
            <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900">{userProfile.streak} Jours</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex items-center gap-4">
          <div className="p-3 bg-emerald-100 border border-slate-900 rounded-xl text-emerald-600 shrink-0">
            <BookMarked className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Fiches Validées</p>
            <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
              {completedLessonIds.length} cours
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex items-center gap-4">
          <div className="p-3 bg-blue-100 border border-slate-900 rounded-xl text-blue-600 shrink-0">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Exercices Faits</p>
            <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
              {completedQuizzesCount} validés
            </h3>
          </div>
        </div>
      </div>

      {/* 3. RAPID MODULE NAVIGATION */}
      <div className="bg-slate-100 p-6 rounded-3xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
        <h2 className="text-xl font-black font-heading text-slate-900 mb-4 flex items-center gap-2">
          ⚡ Accès Rapide aux Modules d'Étude
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { id: "dashboard", label: "Accueil", icon: Trophy, color: "bg-amber-100 text-amber-700 hover:bg-amber-200" },
            { id: "cours", label: "Cours", icon: GraduationCap, color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
            { id: "quiz", label: "Quiz", icon: Award, color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" },
            { id: "exercices", label: "Exercices", icon: FileText, color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
            { id: "assistant", label: "Mentor IA", icon: BrainCircuit, color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" },
            { id: "defi_bac", label: "Défi Bac", icon: Target, color: "bg-red-100 text-red-700 hover:bg-red-200" },
            { id: "bulletin", label: "Bulletin", icon: TrendingUp, color: "bg-teal-100 text-teal-700 hover:bg-teal-200" }
          ].map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                onClick={() => {
                  if (mod.id === "defi_bac") {
                    onStartDefiBac();
                  } else {
                    onNavigateToTab(mod.id);
                  }
                }}
                className={`flex flex-col items-center justify-center p-3 text-center rounded-2xl border-2 border-slate-900 transition-all transform hover:-translate-y-0.5 cursor-pointer ${mod.color}`}
              >
                <Icon className="h-6 w-6 mb-1.5 shrink-0" />
                <span className="text-xs font-black">{mod.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. MAIN DASHBOARD CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 spans wide): Objectives + Progression + Recommended */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* A. WEEKLY GOALS */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-black text-lg text-slate-950 font-heading">
                  🎯 Objectifs de la Semaine
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">Complète les tâches pour progresser vers ton BAC !</p>
              </div>
              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 font-extrabold text-xs rounded-lg border border-slate-900 shrink-0">
                {completedGoalsCount} / {weeklyGoals.length} validés
              </span>
            </div>

            <div className="space-y-3">
              {weeklyGoals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-left"
                >
                  {goal.completed ? (
                    <CheckSquare className="h-5 w-5 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="h-5 w-5 text-slate-400 shrink-0" />
                  )}
                  <span className={`text-xs font-semibold ${goal.completed ? "line-through text-slate-400" : "text-slate-800"}`}>
                    {goal.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* B. GENERAL PROGRESS */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
            <h3 className="font-black text-lg text-slate-950 font-heading">
              📈 Progression du Programme Général
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Validation du programme ({userGrade})</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-4 bg-slate-100 rounded-full border border-slate-900 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              Cette barre montre le pourcentage de fiches de leçons validées sur l'ensemble du catalogue de ta classe ({userGrade}).
            </p>
          </div>

          {/* C. RECOMMENDED LESSONS */}
          <div>
            <h2 className="text-xl font-black font-heading text-slate-900 mb-4">
              💡 Fiches recommandées pour la classe de {userGrade}
            </h2>
            <div className="space-y-4">
              {recommendedLessons.slice(0, 2).map((lesson) => (
                <div
                  key={lesson.id}
                  className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:-translate-y-0.5 transition-all"
                >
                  <div className="space-y-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-slate-900">
                      {lesson.subject}
                    </span>
                    <h4 className="text-base font-black text-slate-950 font-heading">
                      {lesson.title}
                    </h4>
                    <p className="text-xs font-medium text-slate-400">
                      Chapitre {lesson.chapterNo} · {lesson.chapterTitle}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                    <span className="text-xs font-black text-slate-500 shrink-0">⏱️ {lesson.readingTime} min</span>
                    <button
                      onClick={() => onSelectLesson(lesson.id)}
                      className="flex-grow sm:flex-grow-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]"
                    >
                      Étudier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (1 span wide): Défi Bac + Citation d'inspiration + Recent Activities */}
        <div className="space-y-8">
          
          {/* A. DÉFI BAC ADVERTISMENT */}
          <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden border-2 border-slate-950">
            <div className="absolute right-0 top-0 opacity-10 translate-x-4 -translate-y-4">
              <Target className="h-32 w-32" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-[10px] font-black uppercase tracking-wider border border-red-500/30">
                🎯 Simulation BAC 2026-2027
              </div>
              <div>
                <h3 className="text-xl font-black font-heading leading-tight text-white">
                  Défi Bac Blanc IA
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Mesure-toi au simulateur d'examen national avec correction et commentaires IA instantanés.
                </p>
              </div>

              <div className="border-t border-slate-800 my-2 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Matière : Philosophie</span>
                  <span>Correction : Immédiate</span>
                </div>
              </div>

              <button
                onClick={onStartDefiBac}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 border border-slate-900"
              >
                🎯 Démarrer un Défi Bac
              </button>
            </div>
          </div>

          {/* B. QUOTE OF THE DAY */}
          <div className="bg-amber-50 p-5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-black text-xs">
              <Quote className="h-4 w-4 shrink-0 text-amber-600" />
              <span>Inspiration Scolaire</span>
            </div>
            <p className="text-xs italic text-slate-800 leading-relaxed font-semibold">
              "L'éducation est l'arme la plus puissante qu'on puisse utiliser pour changer le monde."
            </p>
            <p className="text-[10px] text-right font-black text-slate-500">— Nelson Mandela</p>
          </div>

          {/* C. RECENT ACTIVITY LIST */}
          <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">⏱️ Activité Récente</h3>
              <button
                onClick={() => onNavigateToTab("historique")}
                className="text-xs font-black text-blue-600 hover:text-blue-700"
              >
                Tout voir
              </button>
            </div>
            <div className="space-y-4">
              {history.length === 0 ? (
                <p className="text-slate-400 text-xs italic">Aucune activité enregistrée.</p>
              ) : (
                history.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex gap-3 items-start border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                    <div className="p-1.5 rounded-lg text-xs shrink-0 bg-slate-100 border border-slate-900">
                      {item.type === "cours" ? "📚" : "📝"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-slate-800 truncate">{item.itemTitle}</p>
                      <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                        {item.subject} · {item.date}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-xs font-extrabold text-blue-600 block">+{item.xpEarned} XP</span>
                      {item.score !== undefined && (
                        <p className="text-[10px] font-bold text-slate-500 mt-0.5">Score: {item.score}/{item.totalQuestions}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
