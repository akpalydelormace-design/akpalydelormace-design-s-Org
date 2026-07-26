import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import EduMentorLogo from "./EduMentorLogo";
import { Sparkles, Database, ShieldCheck, Zap } from "lucide-react";

interface SplashScreenProps {
  onFinish?: () => void;
  autoHideDuration?: number;
}

export default function SplashScreen({
  onFinish,
  autoHideDuration = 2400,
}: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initialisation d'EduMentor...");

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(35);
      setStatusText("Connexion à Cloud Firestore...");
    }, 400);

    const timer2 = setTimeout(() => {
      setProgress(75);
      setStatusText("Chargement du Tuteur IA Gemini...");
    }, 1100);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText("Prêt ! Bienvenue sur EduMentor.");
    }, 1800);

    const timer4 = setTimeout(() => {
      if (onFinish) onFinish();
    }, autoHideDuration);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [autoHideDuration, onFinish]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] bg-slate-900 text-white flex flex-col items-center justify-between p-6 overflow-hidden select-none"
    >
      {/* Background Animated Gradient Blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>

      {/* Top Header Badge */}
      <div className="pt-6 z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300 text-xs font-semibold backdrop-blur-md"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>Plateforme Éducative Officielle</span>
        </motion.div>
      </div>

      {/* Main Logo & Title Centerpiece */}
      <div className="flex flex-col items-center text-center z-10 max-w-md w-full my-auto space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 via-indigo-500 to-amber-400 rounded-3xl blur-xl opacity-40 animate-pulse"></div>
          <EduMentorLogo variant="square" size="2xl" theme="dark" />
        </motion.div>

        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <h1 className="text-4xl sm:text-5xl font-black font-heading tracking-tight text-white">
            Edu<span className="text-blue-500">Mentor</span>
          </h1>
          <p className="text-slate-400 font-medium text-sm sm:text-base max-w-xs mx-auto">
            L'Excellence Scolaire Intelligente
          </p>
        </motion.div>

        {/* Feature Badges */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 pt-2"
        >
          <span className="px-3 py-1 rounded-lg bg-blue-950/60 border border-blue-800/50 text-blue-300 text-[11px] font-bold flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" /> Gemini 2.0 AI
          </span>
          <span className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 text-[11px] font-bold flex items-center gap-1.5">
            <Database className="w-3 h-3 text-emerald-400" /> Firestore Cloud
          </span>
        </motion.div>

        {/* Progress Bar & Status Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full space-y-2.5 pt-4"
        >
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-400 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>

          <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
            <span className="truncate">{statusText}</span>
            <span className="font-mono text-blue-400 font-bold">{progress}%</span>
          </div>
        </motion.div>
      </div>

      {/* Footer copyright / version */}
      <div className="pb-4 text-center text-slate-500 text-[11px] font-medium z-10">
        <p>© 2026 EduMentor CI · Version Officielle 2.0</p>
      </div>
    </motion.div>
  );
}
