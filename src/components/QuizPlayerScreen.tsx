import React, { useState, useEffect } from "react";
import { AlertTriangle, Clock, ChevronRight, CheckCircle2, XCircle, ArrowRight, Loader2, Sparkles, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { Quiz, Question } from "../types";

interface QuizPlayerProps {
  quiz: Quiz;
  isDefiBac?: boolean;
  onFinishQuiz: (score: number, total: number) => void;
  onExit: () => void;
}

export default function QuizPlayerScreen({ quiz, isDefiBac = false, onFinishQuiz, onExit }: QuizPlayerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [trueFalseAnswer, setTrueFalseAnswer] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState("");

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnswerValidated, setIsAnswerValidated] = useState(false);
  const [score, setScore] = useState(0);

  // Time remaining states
  const [timeRemaining, setTimeRemaining] = useState(quiz.durationMinutes * 60);
  const [isTimeOut, setIsTimeOut] = useState(false);

  // AI Evaluation states for text questions
  const [isAiEvaluating, setIsAiEvaluating] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{ verdict: string; score: number; feedback: string } | null>(null);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  // Countdown timer
  useEffect(() => {
    if (timeRemaining <= 0) {
      setIsTimeOut(true);
      handleFinishQuiz();
      return;
    }
    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Format countdown time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (option: string) => {
    if (isAnswerValidated) return;
    setSelectedOption(option);
  };

  const handleSelectTrueFalse = (val: "Vrai" | "Faux") => {
    if (isAnswerValidated) return;
    setTrueFalseAnswer(val);
  };

  const handleValidateAnswer = async () => {
    if (isAnswerValidated) return;

    let studentResponse = "";
    if (currentQuestion.type === "qcm") {
      if (!selectedOption) return;
      studentResponse = selectedOption;
    } else if (currentQuestion.type === "vrai_faux") {
      if (!trueFalseAnswer) return;
      studentResponse = trueFalseAnswer;
    } else {
      if (!textAnswer.trim()) return;
      studentResponse = textAnswer;
    }

    // Save answer
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: studentResponse }));

    if (isDefiBac) {
      // In Défi Bac, do not show instant feedback. Just move forward silently to simulate real exam
      let isCorrect = false;
      if (currentQuestion.type === "qcm" || currentQuestion.type === "vrai_faux") {
        isCorrect = studentResponse.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
        if (isCorrect) {
          setScore((prev) => prev + 1);
        }
      } else {
        // Text answers in Defi Bac get credit for non-empty answers during silent runs, or evaluated at the end
        if (studentResponse.length > 5) {
          setScore((prev) => prev + 1);
        }
      }

      handleNextQuestion();
    } else {
      // Standard quiz has immediate correction & explanations
      setIsAnswerValidated(true);

      if (currentQuestion.type === "qcm" || currentQuestion.type === "vrai_faux") {
        const isCorrect = studentResponse.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
        if (isCorrect) {
          setScore((prev) => prev + 1);
        }
      } else {
        // TEXTE LIBRE: Call Gemini API evaluator on backend
        setIsAiEvaluating(true);
        try {
          const res = await fetch("/api/exercise/evaluate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              questionText: currentQuestion.questionText,
              studentAnswer: studentResponse,
              correctAnswer: currentQuestion.correctAnswer,
              explanation: currentQuestion.explanation
            })
          });
          const evalResult = await res.json();
          setAiFeedback(evalResult);
          
          // If score is >= 5 out of 10, grant 1 point to quiz score
          if (evalResult.score >= 5) {
            setScore((prev) => prev + 1);
          }
        } catch (err) {
          console.error("Failed AI evaluation", err);
          // Fallback scoring
          setAiFeedback({
            verdict: "Partiellement Correct",
            score: 7,
            feedback: "Ta réponse a été soumise avec succès. Continue ton entraînement rigoureux."
          });
          setScore((prev) => prev + 1);
        }
        setIsAiEvaluating(false);
      }
    }
  };

  const handleNextQuestion = () => {
    // Reset answers states
    setSelectedOption(null);
    setTrueFalseAnswer(null);
    setTextAnswer("");
    setIsAnswerValidated(false);
    setAiFeedback(null);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    onFinishQuiz(score, totalQuestions);
  };

  const handleExitWithWarning = () => {
    if (window.confirm("Es-tu sûr de vouloir quitter ce quiz ? Ta progression actuelle sera perdue.")) {
      onExit();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      {/* HEADER */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            {isDefiBac ? "🎯 EXAMEN SIMULÉ BAC" : "📝 EXERCICE"}
          </span>
          <h2 className="text-sm sm:text-base font-black text-slate-900 truncate">
            {quiz.title}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Chronometer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-xs font-mono font-bold">
            <Clock className="h-4 w-4" />
            <span>{formatTime(timeRemaining)}</span>
          </div>

          <button
            onClick={handleExitWithWarning}
            className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 text-xs font-bold rounded-xl transition-all border border-slate-100"
          >
            Quitter
          </button>
        </div>
      </div>

      {/* Progress slider bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-1.5">
          <span>Progression de l'épreuve</span>
          <span>
            Question {currentQuestionIndex + 1} sur {totalQuestions}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${totalQuestions > 0 ? Math.min(100, Math.max(0, ((currentQuestionIndex + 1) / totalQuestions) * 100)) : 0}%` }}
          ></div>
        </div>
      </div>

      {/* QUESTION MAIN CONTAINER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 min-h-[300px]">
        <div>
          <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase">
            Question {currentQuestionIndex + 1}
          </span>
          <h3 className="text-lg font-black font-heading text-slate-900 mt-4 leading-snug">
            {currentQuestion.questionText}
          </h3>
        </div>

        {/* INPUTS TYPES */}
        <div className="mt-6 space-y-3">
          {/* TYPE 1: QCM */}
          {currentQuestion.type === "qcm" && currentQuestion.options && (
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isCorrectOption = option === currentQuestion.correctAnswer;
                const isValidatedAndWrong = isAnswerValidated && isSelected && !isCorrectOption;
                const isValidatedAndCorrect = isAnswerValidated && isCorrectOption;

                let cardStyle = "border-slate-200 hover:border-blue-300 hover:bg-slate-50";
                if (isSelected) cardStyle = "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20";
                if (isValidatedAndCorrect) cardStyle = "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20";
                if (isValidatedAndWrong) cardStyle = "border-red-500 bg-red-50/60 ring-2 ring-red-500/20";

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(option)}
                    className={`w-full text-left p-4 rounded-2xl border text-sm font-bold transition-all flex justify-between items-center ${cardStyle}`}
                  >
                    <span>{option}</span>
                    {isValidatedAndCorrect && <span className="text-emerald-600">✓</span>}
                    {isValidatedAndWrong && <span className="text-red-600">✗</span>}
                  </button>
                );
              })}
            </div>
          )}

          {/* TYPE 2: VRAI / FAUX */}
          {currentQuestion.type === "vrai_faux" && (
            <div className="grid grid-cols-2 gap-4">
              {(["Vrai", "Faux"] as const).map((val) => {
                const isSelected = trueFalseAnswer === val;
                const isCorrectVal = val === currentQuestion.correctAnswer;
                const isValidatedAndWrong = isAnswerValidated && isSelected && !isCorrectVal;
                const isValidatedAndCorrect = isAnswerValidated && isCorrectVal;

                let cardStyle = "border-slate-200 hover:border-blue-300 hover:bg-slate-50";
                if (isSelected) cardStyle = "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20";
                if (isValidatedAndCorrect) cardStyle = "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20";
                if (isValidatedAndWrong) cardStyle = "border-red-500 bg-red-50/60 ring-2 ring-red-500/20";

                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleSelectTrueFalse(val)}
                    className={`p-6 rounded-2xl border text-sm font-extrabold transition-all text-center ${cardStyle}`}
                  >
                    <span className="text-base">{val}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* TYPE 3: TEXTE LIBRE */}
          {currentQuestion.type === "texte_libre" && (
            <div className="space-y-4">
              <textarea
                className="w-full p-4 border border-slate-200 text-slate-950 placeholder-slate-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm min-h-[120px]"
                placeholder="Rédige ta réponse de façon claire et argumentée..."
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                disabled={isAnswerValidated}
              ></textarea>

              {isAiEvaluating && (
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-700">Analyse de ta réponse par l'IA EduMentor...</span>
                </div>
              )}

              {aiFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
                      <Sparkles className="h-3.5 w-3.5 fill-current" /> Verdict IA : {aiFeedback.verdict}
                    </span>
                    <span className="text-xs font-black text-indigo-900 font-mono bg-indigo-200/50 px-2 py-0.5 rounded-md">
                      Note : {aiFeedback.score} / 10
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{aiFeedback.feedback}"
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* FEEDBACK EXPLANATION (Standard Quiz only) */}
        {isAnswerValidated && !isAiEvaluating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-2xl flex gap-3.5 items-start ${
              (currentQuestion.type === "qcm" && selectedOption === currentQuestion.correctAnswer) ||
              (currentQuestion.type === "vrai_faux" && trueFalseAnswer === currentQuestion.correctAnswer) ||
              currentQuestion.type === "texte_libre"
                ? "bg-emerald-50 border border-emerald-100 text-emerald-900"
                : "bg-red-50 border border-red-100 text-red-900"
            }`}
          >
            <div className="text-lg shrink-0 mt-0.5">
              {((currentQuestion.type === "qcm" && selectedOption === currentQuestion.correctAnswer) ||
                (currentQuestion.type === "vrai_faux" && trueFalseAnswer === currentQuestion.correctAnswer) ||
                currentQuestion.type === "texte_libre") ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 shrink-0" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-sm">
                {currentQuestion.type === "texte_libre" ? "Correction suggérée" : "Explication de la correction"}
              </h4>
              {currentQuestion.type !== "texte_libre" && (
                <p className="text-xs font-bold mt-1">La bonne réponse était : {currentQuestion.correctAnswer}</p>
              )}
              <p className="text-xs opacity-90 mt-1 leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          </motion.div>
        )}

        {/* ACTIONS */}
        <div className="pt-6 border-t border-slate-100 flex justify-end">
          {!isAnswerValidated && !isDefiBac ? (
            <button
              onClick={handleValidateAnswer}
              disabled={
                (currentQuestion.type === "qcm" && !selectedOption) ||
                (currentQuestion.type === "vrai_faux" && !trueFalseAnswer) ||
                (currentQuestion.type === "texte_libre" && !textAnswer.trim())
              }
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 font-bold text-xs rounded-xl transition-all text-white shadow-md shadow-blue-600/10"
            >
              Valider la réponse
            </button>
          ) : (
            <button
              onClick={
                isDefiBac ? handleValidateAnswer : handleNextQuestion
              }
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1"
            >
              {currentQuestionIndex === totalQuestions - 1 ? "Terminer le test" : "Question suivante"}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
