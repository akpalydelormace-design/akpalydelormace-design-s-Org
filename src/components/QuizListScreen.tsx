import React, { useState, useMemo } from "react";
import { Search, Filter, Play, RefreshCw, Award, BookOpen, BrainCircuit, Loader2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Quiz, Subject, Difficulty, Grade } from "../types";
import { SAMPLE_QUIZZES } from "../data/quizzesData";
import { SUBJECT_METADATA } from "./CoursesScreen";

interface QuizListScreenProps {
  quizzes: Quiz[];
  completedQuizzes: Record<string, { score: number; total: number }>;
  onStartQuiz: (quiz: Quiz) => void;
  userProfile: any;
}

export default function QuizListScreen({ quizzes, completedQuizzes, onStartQuiz, userProfile }: QuizListScreenProps) {
  const [activeTab, setActiveTab] = useState<"todo" | "completed" | "ai_generator">("todo");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<Subject | "Tous">("Tous");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "Tous">("Tous");

  // AI Quiz generator states
  const [aiSubject, setAiSubject] = useState<Subject>("Mathématiques");
  const [aiTopic, setAiTopic] = useState("");
  const [aiDifficulty, setAiDifficulty] = useState<Difficulty>("moyen");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");

  const subjectsList: Subject[] = [
    "Mathématiques",
    "Français",
    "Anglais",
    "SVT",
    "Physique-Chimie",
    "Philosophie",
    "Histoire-Géographie"
  ];

  const userGrade = userProfile?.grade || "Terminale";
  const userSerie = userProfile?.serie || "Série D";

  // Filter quizzes according to tabs, search, subject, difficulty, grade, and series
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const matchesSearch =
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === "Tous" || quiz.subject === selectedSubject;
      const matchesDiff = selectedDifficulty === "Tous" || quiz.difficulty === selectedDifficulty;
      
      const matchesGrade = userProfile?.isAdmin ? true : (!quiz.grade || quiz.grade === userGrade);
      const matchesSerie = userProfile?.isAdmin ? true : (!quiz.serie || quiz.serie === "Toutes" || quiz.serie === userSerie);

      const isQuizCompleted = completedQuizzes[quiz.id] !== undefined;

      if (activeTab === "todo" && isQuizCompleted) return false;
      if (activeTab === "completed" && !isQuizCompleted) return false;

      return matchesSearch && matchesSubject && matchesDiff && matchesGrade && matchesSerie;
    });
  }, [quizzes, activeTab, searchQuery, selectedSubject, selectedDifficulty, completedQuizzes, userGrade, userSerie, userProfile]);

  // Handle Generating Quiz via Gemini
  const handleGenerateAiQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) {
      setGenerationError("Veuillez inscrire un sujet ou un chapitre.");
      return;
    }
    setGenerationError("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/exercise/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: aiSubject,
          grade: userProfile.grade,
          chapterTitle: aiTopic,
          difficulty: aiDifficulty
        })
      });

      if (!response.ok) {
        throw new Error("Impossible de joindre le serveur de génération IA.");
      }

      const generatedData = await response.json();
      
      // Adapt generated format to local quiz interface
      const newQuiz: Quiz = {
        id: generatedData.id || "ai_" + Math.random().toString(),
        title: generatedData.title || `Quiz IA : ${aiTopic}`,
        subject: aiSubject,
        grade: userProfile.grade,
        chapterNo: 0,
        chapterTitle: aiTopic,
        difficulty: aiDifficulty,
        questions: generatedData.questions,
        durationMinutes: 15
      };

      setIsGenerating(false);
      onStartQuiz(newQuiz);
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || "Une erreur s'est produite lors de la génération. Veuillez réessayer.");
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black font-heading text-slate-900 tracking-tight">
            Quiz & Évaluations — <span className="text-blue-600">{userGrade} {userSerie}</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Testez vos connaissances et préparez vos examens selon votre niveau d'inscription.
          </p>
        </div>

        {/* Profile Level Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-bold shrink-0 self-start sm:self-auto">
          <Award className="w-3.5 h-3.5 text-blue-600" />
          <span>Profil : {userGrade} {userSerie}</span>
        </div>
      </div>

      {/* Tabs / Onglets */}
      <div className="border-b border-slate-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("todo")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all px-1 ${
              activeTab === "todo"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            📝 À Faire
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all px-1 ${
              activeTab === "completed"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            🏆 Complétés
          </button>
          <button
            onClick={() => setActiveTab("ai_generator")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all px-1 flex items-center gap-1.5 ${
              activeTab === "ai_generator"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Sparkles className="h-4 w-4 text-indigo-500 fill-indigo-100" />
            Générateur IA
          </button>
        </div>
      </div>

      {activeTab !== "ai_generator" ? (
        <>
          {/* FILTRES */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                className="w-full pl-9 pr-4 py-2 border border-slate-200 text-slate-950 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                placeholder="Chercher un quiz..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="w-full px-3 py-2 border border-slate-200 text-slate-950 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as any)}
            >
              <option value="Tous">Toutes les matières</option>
              {subjectsList.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>

            <select
              className="w-full px-3 py-2 border border-slate-200 text-slate-950 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as any)}
            >
              <option value="Tous">Toutes les difficultés</option>
              <option value="facile">Facile</option>
              <option value="moyen">Moyen</option>
              <option value="difficile">Difficile</option>
            </select>
          </div>

          {/* QUIZ CARDS GRID */}
          {filteredQuizzes.length === 0 ? (
            <div className="bg-slate-50 border border-slate-100 text-center p-8 rounded-2xl">
              <Award className="h-10 w-10 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-600 font-semibold">Aucun contenu disponible</p>
              <p className="text-slate-400 text-xs mt-1">Aucun quiz n'est actuellement disponible dans la base de données. Crée ton propre exercice personnalisé en utilisant le **Générateur IA** !</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => {
                const meta = SUBJECT_METADATA[quiz.subject];
                const quizScore = completedQuizzes[quiz.id];

                // Code couleur difficulté
                const diffBadge = {
                  facile: "bg-green-50 text-green-700 border-green-100",
                  moyen: "bg-orange-50 text-orange-700 border-orange-100",
                  difficile: "bg-red-50 text-red-700 border-red-100"
                }[quiz.difficulty];

                return (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between`}
                  >
                    <div>
                      {/* Top labels */}
                      <div className="flex justify-between items-start">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {meta.icon} {quiz.subject}
                        </span>
                        <span className={`inline-flex items-center border px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${diffBadge}`}>
                          {quiz.difficulty}
                        </span>
                      </div>

                      {/* Info */}
                      <h3 className="text-base font-bold font-heading text-slate-900 mt-3 line-clamp-2">
                        {quiz.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-400 mt-1 truncate">
                        {quiz.chapterTitle}
                      </p>

                      <div className="flex gap-4 mt-4 text-[11px] font-bold text-slate-500">
                        <span>📝 {quiz.questions.length} questions</span>
                        <span>⏱️ {quiz.durationMinutes} min</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between gap-3">
                      {quizScore ? (
                        <>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Score obtenu</p>
                            <span className="text-sm font-black text-emerald-600 font-heading">
                              {quizScore.score} / {quizScore.total} ({quizScore.total > 0 ? Math.round((quizScore.score / quizScore.total) * 100) : 0}%)
                            </span>
                          </div>
                          <button
                            onClick={() => onStartQuiz(quiz)}
                            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                          >
                            Refaire
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => onStartQuiz(quiz)}
                          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1"
                        >
                          <Play className="h-3.5 w-3.5 fill-current" /> Commencer le quiz
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* PREMIUM WORKSPACE: GENERATEUR IA D'EXERCICES */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-6 sm:p-8 rounded-3xl shadow-sm max-w-2xl mx-auto"
        >
          <div className="text-center max-w-md mx-auto mb-6">
            <div className="inline-flex p-3 bg-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-500/20 mb-3">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold font-heading text-slate-900">Générateur d'Exercices IA</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Inscris n'importe quel chapitre du programme scolaire ou sujet libre. Notre IA va rédiger un quiz unique de 3 questions calibré pour ta classe.
            </p>
          </div>

          {generationError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span> <span>{generationError}</span>
            </div>
          )}

          <form onSubmit={handleGenerateAiQuiz} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                1. Sélectionner la matière
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {subjectsList.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setAiSubject(sub)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border text-left transition-all ${
                      aiSubject === sub
                        ? "bg-indigo-600 text-white border-transparent shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="ai_topic_input" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                2. Saisir le Chapitre ou le Sujet d'Étude
              </label>
              <input
                id="ai_topic_input"
                type="text"
                required
                className="w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-950 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm bg-white"
                placeholder="Ex : Probabilités conditionnelles, ou Les deux guerres mondiales"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  3. Difficulté de l'exercice
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["facile", "moyen", "difficile"] as Difficulty[]).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setAiDifficulty(diff)}
                      className={`py-2 text-xs font-extrabold rounded-xl border capitalize transition-all ${
                        aiDifficulty === diff
                          ? "bg-indigo-600 text-white border-transparent"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Informations de classe
                </label>
                <div className="px-4 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-bold text-slate-600">
                  📚 Classe : {userProfile.grade} (conforme BAC)
                </div>
              </div>
            </div>

            <button
              id="generate_ai_quiz_button"
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Rdaction de l'exercice par l'IA... (Patientez quelques secondes)
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Générer l'exercice IA immédiatement
                </>
              )}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
}
