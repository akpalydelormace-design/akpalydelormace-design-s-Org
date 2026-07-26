import React, { useState, useEffect } from "react";
import { Download, Smartphone, X, Check, Sparkles, Share, PlusSquare, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import EduMentorLogo from "./EduMentorLogo";

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes("android-app://");
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Listen for beforeinstallprompt event (Chrome, Edge, Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);

      // Check if user previously dismissed prompt in this session
      const dismissed = sessionStorage.getItem("edumentor_pwa_dismissed");
      if (!dismissed) {
        // Show prompt after a short delay so user can experience app
        setTimeout(() => setShowPrompt(true), 2000);
      }
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      setShowPrompt(false);
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 5000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Show iOS install instructions if not standalone
    if (isIosDevice && !window.matchMedia("(display-mode: standalone)").matches) {
      const dismissed = sessionStorage.getItem("edumentor_pwa_dismissed");
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (isIos) {
        alert("Pour installer EduMentor sur iPhone/iPad :\n1. Appuyez sur le bouton Partager (icône carré avec flèche)\n2. Sélectionnez 'Sur l'écran d'accueil'");
      } else {
        alert("Pour installer l'application EduMentor sur Android :\n1. Appuyez sur le menu (⋮) en haut à droite de Chrome.\n2. Sélectionnez 'Installer l'application' (ou 'Ajouter à l'écran d'accueil').\n\nL'application s'installera sous forme d'application autonome WebAPK.");
      }
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setInstallSuccess(true);
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setIsDismissed(true);
    sessionStorage.setItem("edumentor_pwa_dismissed", "true");
  };

  if (isStandalone) {
    return null; // App is already installed and running as standalone native PWA!
  }

  return (
    <AnimatePresence>
      {/* Floating Installation Banner */}
      {showPrompt && !isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md bg-slate-900/95 backdrop-blur-xl border border-blue-500/30 p-4 sm:p-5 rounded-2xl shadow-2xl z-[90] text-white flex flex-col gap-3"
        >
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <EduMentorLogo variant="square" size="sm" theme="dark" />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-sm text-white font-heading">
                    Installer EduMentor
                  </h4>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-600 text-white">
                    App
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5 font-medium leading-tight">
                  Accès instantané hors-ligne, notifications et confort plein écran.
                </p>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors shrink-0"
              title="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* iOS Special Helper */}
          {isIos && (
            <div className="bg-slate-800/80 border border-slate-700/60 p-2.5 rounded-xl text-[11px] text-slate-300 flex items-center gap-2">
              <Share className="w-4 h-4 text-blue-400 shrink-0" />
              <span>
                Sur iOS : appuyez sur <span className="font-bold text-white">Partager</span> puis <span className="font-bold text-blue-300">"Sur l'écran d'accueil"</span>.
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleInstallClick}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span>Installer l'application</span>
            </button>

            <button
              onClick={handleDismiss}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
            >
              Plus tard
            </button>
          </div>
        </motion.div>
      )}

      {/* Success Notification */}
      {installSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 bg-emerald-900 border border-emerald-500/50 text-emerald-100 p-3.5 rounded-2xl shadow-xl z-[100] flex items-center gap-2.5 text-xs font-bold"
        >
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>EduMentor a été installé avec succès sur votre appareil !</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
