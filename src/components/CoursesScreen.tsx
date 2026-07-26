import React, { useState, useMemo } from "react";
import { Search, Filter, BookOpen, Clock, FileText, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { Lesson, Subject, Grade } from "../types";
import { SAMPLE_LESSONS, CURRICULUM_OUTLINE } from "../data/coursesData";

interface CoursesScreenProps {
  lessons: Lesson[];
  completedLessonIds: string[];
  onSelectLesson: (lessonId: string) => void;
  userProfile: UserProfile;
}

import { UserProfile } from "../types";

export const SUBJECT_METADATA: Record<Subject, { color: string; bg: string; border: string; icon: string }> = {
  "Mathématiques": {
    color: "text-blue-600 bg-blue-50",
    bg: "from-blue-500 to-blue-600",
    border: "border-blue-100 hover:border-blue-300",
    icon: "📐"
  },
  "Français": {
    color: "text-rose-600 bg-rose-50",
    bg: "from-rose-500 to-rose-600",
    border: "border-rose-100 hover:border-rose-300",
    icon: "✍️"
  },
  "Anglais": {
    color: "text-emerald-600 bg-emerald-50",
    bg: "from-emerald-500 to-emerald-600",
    border: "border-emerald-100 hover:border-emerald-300",
    icon: "🇬🇧"
  },
  "SVT": {
    color: "text-green-800 bg-green-50",
    bg: "from-green-700 to-green-800",
    border: "border-green-100 hover:border-green-300",
    icon: "🌿"
  },
  "Physique-Chimie": {
    color: "text-orange-600 bg-orange-50",
    bg: "from-orange-500 to-orange-600",
    border: "border-orange-100 hover:border-orange-300",
    icon: "🧪"
  },
  "Philosophie": {
    color: "text-purple-600 bg-purple-50",
    bg: "from-purple-500 to-purple-600",
    border: "border-purple-100 hover:border-purple-300",
    icon: "⚖️"
  },
  "Histoire-Géographie": {
    color: "text-amber-800 bg-amber-50",
    bg: "from-amber-700 to-amber-800",
    border: "border-amber-100 hover:border-amber-300",
    icon: "🌍"
  }
};

export default function CoursesScreen({ lessons, completedLessonIds, onSelectLesson, userProfile }: CoursesScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<Subject | "Tous">("Tous");

  const userGrade = userProfile?.grade || "Terminale";
  const userSerie = userProfile?.serie || "Série D";

  const subjectsList: Subject[] = [
    "Mathématiques",
    "Français",
    "Anglais",
    "SVT",
    "Physique-Chimie",
    "Philosophie",
    "Histoire-Géographie"
  ];

  // Filter lessons based on user's grade and serie (strict profile isolation for students)
  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchesSearch =
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === "Tous" || lesson.subject === selectedSubject;
      
      // Strict profile matching: match grade and series
      const matchesGrade = userProfile?.isAdmin ? true : lesson.grade === userGrade;
      const matchesSerie = userProfile?.isAdmin ? true : (!lesson.serie || lesson.serie === "Toutes" || lesson.serie === userSerie);

      const isVisible = lesson.isPublished !== false || userProfile?.isAdmin;
      return matchesSearch && matchesSubject && matchesGrade && matchesSerie && isVisible;
    });
  }, [lessons, searchQuery, selectedSubject, userGrade, userSerie, userProfile]);

  // List of theoretical chapters matching filters to show the syllabus outline
  const outlineChapters = useMemo(() => {
    const chaptersBySubject: Array<{ subject: Subject; chapterNo: number; title: string }> = [];
    const activeSubjects = selectedSubject === "Tous" ? subjectsList : [selectedSubject as Subject];
    
    activeSubjects.forEach((sub) => {
      const chapters = CURRICULUM_OUTLINE[userGrade]?.[sub] || [];
      chapters.forEach((ch) => {
        chaptersBySubject.push({
          subject: sub,
          chapterNo: ch.chapterNo,
          title: ch.title
        });
      });
    });

    return chaptersBySubject;
  }, [selectedSubject, userGrade]);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black font-heading text-slate-900 tracking-tight">
            Mes Cours — <span className="text-blue-600">{userGrade} {userSerie}</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Programme officiel du Ministère de l'Éducation Nationale pour votre niveau.
          </p>
        </div>

        {/* Profile Level Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-bold shrink-0 self-start sm:self-auto">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>Profil : {userGrade} {userSerie}</span>
        </div>
      </div>

      {/* FILTRES (en haut) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-slate-200 text-slate-950 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm font-medium"
              placeholder="Chercher un cours ou un chapitre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Matières */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide shrink-0 hidden sm:inline">Matière :</span>
            <select
              className="w-full px-3 py-2 border border-slate-200 text-slate-950 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white font-medium"
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
          </div>
        </div>
      </div>

      {/* Courses Grid Content */}
      <div className="space-y-8">
        {/* Leçons de démonstration fiches de révision complètes */}
        <div>
          <h2 className="text-lg font-bold font-heading text-slate-800 mb-4 flex items-center gap-2">
            📖 Fiches de Cours Détaillées
            <span className="text-xs font-extrabold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {filteredLessons.length} Disponibles
            </span>
          </h2>

          {filteredLessons.length === 0 ? (
            <div className="bg-slate-50 border border-slate-100 text-center p-8 rounded-2xl">
              <BookOpen className="h-10 w-10 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-600 font-semibold">Aucun contenu disponible</p>
              <p className="text-slate-400 text-xs mt-1">Aucun cours n'est actuellement enregistré dans la base de données.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessons.map((lesson) => {
                const meta = SUBJECT_METADATA[lesson.subject];
                const isCompleted = completedLessonIds.includes(lesson.id);

                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white rounded-2xl border ${meta.border} p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between`}
                  >
                    <div>
                      {/* Header Card */}
                      <div className="flex justify-between items-start">
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                          {meta.icon} {lesson.subject}
                        </span>
                        <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          {lesson.grade}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold font-heading text-slate-900 mt-3 line-clamp-2">
                        {lesson.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-400 mt-1 truncate">
                        Chapitre {lesson.chapterNo} · {lesson.chapterTitle}
                      </p>

                      {/* Badges details */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                          <Clock className="h-3.5 w-3.5" /> {lesson.readingTime} min
                        </span>
                        {lesson.pdfAvailable && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                            <FileText className="h-3.5 w-3.5" /> PDF Téléchargeable
                          </span>
                        )}
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Terminé
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action / Progress bar */}
                    <div className="mt-5 pt-4 border-t border-slate-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-slate-400">Progression</span>
                        <span className="text-[11px] font-extrabold text-slate-700">{isCompleted ? "100%" : "0%"}</span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mb-4">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${isCompleted ? "bg-blue-600" : "bg-slate-200"}`}
                          style={{ width: isCompleted ? "100%" : "0%" }}
                        ></div>
                      </div>

                      <button
                        onClick={() => onSelectLesson(lesson.id)}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all text-center ${
                          isCompleted
                            ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            : `bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/10`
                        }`}
                      >
                        {isCompleted ? "Relire le cours" : "Lire le cours"}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Syllabus / Chapters structural outline according to program 2026-2027 */}
        <div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm tracking-wider uppercase mb-3">
              📋 Répertoire Général des Chapitres ({userGrade})
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Voici les chapitres officiels requis pour l'année scolaire 2026-2027. Tu peux demander à notre assistant IA de rédiger ou de générer des exercices sur n'importe lequel de ces thèmes !
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {outlineChapters.map((ch, index) => {
                const meta = SUBJECT_METADATA[ch.subject];
                return (
                  <div key={index} className="bg-white p-3.5 rounded-xl border border-slate-100 flex items-start gap-2.5">
                    <span className="text-base leading-none mt-0.5">{meta.icon}</span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{ch.subject}</p>
                      <p className="text-xs font-bold text-slate-800 line-clamp-2 mt-0.5">
                        Ch.{ch.chapterNo} : {ch.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
