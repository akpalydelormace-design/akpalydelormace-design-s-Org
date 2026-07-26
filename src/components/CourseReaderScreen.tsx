import React, { useState } from "react";
import { ArrowLeft, BookOpen, ChevronRight, FileText, CheckCircle, Clock, Award, Play } from "lucide-react";
import { motion } from "motion/react";
import { Lesson } from "../types";
import { SUBJECT_METADATA } from "./CoursesScreen";

interface CourseReaderProps {
  lesson: Lesson;
  isCompleted: boolean;
  onBack: () => void;
  onMarkCompleted: () => void;
  onGotoQuiz: () => void;
}

export default function CourseReaderScreen({
  lesson,
  isCompleted,
  onBack,
  onMarkCompleted,
  onGotoQuiz
}: CourseReaderProps) {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [markedRead, setMarkedRead] = useState(isCompleted);

  const meta = SUBJECT_METADATA[lesson.subject];
  const activeSection = lesson.sections[activeSectionIndex];

  const handleMarkAsRead = () => {
    setMarkedRead(true);
    onMarkCompleted();
  };

  const handleDownloadPdf = () => {
    // Simulate beautiful formatted PDF content download
    const boundary = "==================================================";
    const textContent = `${boundary}\n     EDUMENTOR - FICHE DE RÉVISION BAC 2026-2027\n${boundary}\n\nMatière : ${lesson.subject}\nNiveau : ${lesson.grade}\nChapitre : ${lesson.chapterTitle}\n\nTITRE DU COURS : ${lesson.title}\n\n${lesson.sections.map((sec, i) => `${i+1}. ${sec.title}\n\n${sec.content.replace(/\$\$/g, '').replace(/\$/g, '')}`).join('\n\n')}\n\n${boundary}\nDocument pédagogique certifié conforme au programme national ivoirien.\nTéléchargé sur EduMentor.ci\n${boundary}`;

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `EduMentor_${lesson.subject.replace(/ /g, '_')}_Ch${lesson.chapterNo}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const nextSection = () => {
    if (activeSectionIndex < lesson.sections.length - 1) {
      setActiveSectionIndex(activeSectionIndex + 1);
    } else {
      handleMarkAsRead();
    }
  };

  const prevSection = () => {
    if (activeSectionIndex > 0) {
      setActiveSectionIndex(activeSectionIndex - 1);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* HEADER */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Retour aux cours
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700">
              {lesson.subject}
            </span>
            <span className="text-xs font-semibold text-slate-400">· Classe de {lesson.grade}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black font-heading text-slate-900 tracking-tight">
            {lesson.title}
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
          {lesson.pdfAvailable && (
            <button
              onClick={handleDownloadPdf}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-all border border-emerald-100"
            >
              <FileText className="h-4 w-4" /> Télécharger le PDF
            </button>
          )}

          <button
            onClick={onGotoQuiz}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/10 transition-all"
          >
            <Award className="h-4 w-4" /> Faire les exercices
          </button>
        </div>
      </div>

      {/* Main Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* SIDEBAR GAUCHE (Desktop only, hidden on mobile) */}
        <div className="hidden lg:block space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3 shadow-sm">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider px-1">
              Sommaire de la Leçon
            </h3>
            <div className="space-y-1">
              {lesson.sections.map((section, index) => {
                const isActive = index === activeSectionIndex;
                const isSectionCompleted = index < activeSectionIndex || markedRead;

                return (
                  <button
                    key={index}
                    onClick={() => setActiveSectionIndex(index)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between gap-2 ${
                      isActive
                        ? "bg-blue-600 text-white font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="truncate">{section.title}</span>
                    <span className="shrink-0 text-[10px]">
                      {isSectionCompleted ? "✓" : isActive ? "⏳" : "○"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-slate-50 pt-4 px-1">
              {(() => {
                const totalSections = lesson.sections?.length || 0;
                const sectionProgress = markedRead 
                  ? 100 
                  : (totalSections > 0 ? Math.min(100, Math.max(0, Math.round((activeSectionIndex / totalSections) * 100))) : 0);
                return (
                  <>
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 mb-1">
                      <span>Leçon assimilée</span>
                      <span>{sectionProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${sectionProgress}%` }}
                      ></div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* CONTENU PRINCIPAL */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm min-h-[400px] flex flex-col justify-between">
            {/* Sub-chapter display */}
            <div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-4 mb-6">
                <h2 className="text-lg font-black font-heading text-slate-800">
                  {activeSection.title}
                </h2>
                <span className="text-xs font-extrabold text-slate-400">
                  Section {activeSectionIndex + 1} sur {lesson.sections.length}
                </span>
              </div>

              {/* Course text paragraphs */}
              <div className="markdown-body text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {activeSection.content}
              </div>
            </div>

            {/* ACTION BOX FOR RETENTION */}
            <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={prevSection}
                disabled={activeSectionIndex === 0}
                className={`w-full sm:w-auto px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold transition-all ${
                  activeSectionIndex === 0
                    ? "opacity-40 cursor-not-allowed text-slate-400 bg-slate-50"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                ← Section précédente
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <span>Section {activeSectionIndex + 1} / {lesson.sections.length}</span>
              </div>

              <button
                onClick={nextSection}
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/10 transition-all"
              >
                {activeSectionIndex === lesson.sections.length - 1 ? (
                  markedRead ? "✓ Terminer la leçon" : "Marquer comme lu et finir"
                ) : (
                  "Section suivante →"
                )}
              </button>
            </div>
          </div>

          {/* Quick interactive self-test warning or notes */}
          <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex items-start gap-4">
            <div className="p-2.5 bg-blue-100 rounded-xl text-blue-600 shrink-0 text-xl">
              💡
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Le conseil d'EduMentor</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Prends des notes manuscrites sur ton cahier de révision. Pour tester tes connaissances sur cette notion, clique sur le bouton **"Faire les exercices"** ci-dessus. L'IA d'EduMentor pourra également t'interroger si tu lui demandes dans l'onglet **Assistant IA**.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
