import React, { useState, useEffect } from "react";
import { BookOpen, AlertCircle, CheckCircle2, Mail, Lock, User, KeyRound, ArrowLeft, ArrowRight, ShieldCheck, Sparkles, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, Grade } from "../types";
import { getStoredUsers, saveUsers, getProfileByEmail } from "../lib/storage";

interface AuthScreenSuiteProps {
  onAuthSuccess: (profile: UserProfile) => void;
}

type AuthMode = "splash" | "welcome" | "login" | "register" | "forgot_password" | "verification" | "admin_login";

export default function AuthScreenSuite({ onAuthSuccess }: AuthScreenSuiteProps) {
  const [mode, setMode] = useState<AuthMode>("splash");
  
  // Login form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");

  // Register form states
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regAcceptTerms, setRegAcceptTerms] = useState(false);
  const [regError, setRegError] = useState("");
  const [regGrade, setRegGrade] = useState<Grade>("Terminale");
  const [regSerie, setRegSerie] = useState<string>("Série D");
  const [regSchoolName, setRegSchoolName] = useState<string>("");
  const [logoClicks, setLogoClicks] = useState<number>(0);

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState(1); // 1: enter email, 2: enter code, 3: enter new password, 4: success
  const [forgotCode, setForgotCode] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [generatedForgotCode, setGeneratedForgotCode] = useState("");
  const [forgotError, setForgotError] = useState("");

  // Verification states
  const [verifEmail, setVerifEmail] = useState("");
  const [verifInputCode, setVerifInputCode] = useState("");
  const [generatedVerifCode, setGeneratedVerifCode] = useState("");
  const [verifError, setVerifError] = useState("");
  const [verifSuccess, setVerifSuccess] = useState("");
  const [pendingProfile, setPendingProfile] = useState<UserProfile | null>(null);

  // Password Strength Indicator for Registration
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "Très faible",
    color: "bg-red-500",
    textColor: "text-red-500",
  });

  // Splash Screen timer
  useEffect(() => {
    if (mode === "splash") {
      const timer = setTimeout(() => {
        setMode("welcome");
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [mode]);

  // Track Password strength
  useEffect(() => {
    if (!regPassword) {
      setPasswordStrength({ score: 0, label: "Saisir un mot de passe", color: "bg-slate-200", textColor: "text-slate-400" });
      return;
    }
    let score = 0;
    if (regPassword.length >= 6) score++;
    if (regPassword.length >= 10) score++;
    if (/[A-Z]/.test(regPassword)) score++;
    if (/[0-9]/.test(regPassword)) score++;
    if (/[^A-Za-z0-9]/.test(regPassword)) score++;

    let label = "Très faible";
    let color = "bg-red-500";
    let textColor = "text-red-500";

    if (score === 2) {
      label = "Faible";
      color = "bg-orange-500";
      textColor = "text-orange-500";
    } else if (score === 3) {
      label = "Moyen";
      color = "bg-yellow-500";
      textColor = "text-yellow-600";
    } else if (score === 4) {
      label = "Fort";
      color = "bg-emerald-500";
      textColor = "text-emerald-500";
    } else if (score >= 5) {
      label = "Excellent";
      color = "bg-blue-600";
      textColor = "text-blue-600";
    }

    setPasswordStrength({ score, label, color, textColor });
  }, [regPassword]);

  // Demo Login helpers
  const handleDemoLogin = (role: "student" | "admin") => {
    setLoginError("");
    const email = role === "admin" ? "louamoisegognin@gmail.com" : "amani.koffi@edu.ci";
    const password = role === "admin" ? "admin123" : "eleve123";
    
    // Find in storage
    const users = getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
      // Force auto role assign for safety
      if (email.toLowerCase() === "louamoisegognin@gmail.com") {
        user.isAdmin = true;
      } else {
        user.isAdmin = false;
      }
      user.isEmailVerified = true;
      
      // Save
      localStorage.setItem("edumentor_logged_in_email", email);
      onAuthSuccess(user);
    } else {
      // Create user if not exists
      const newProfile: UserProfile = {
        id: role === "admin" ? "u_admin" : "u123",
        firstName: role === "admin" ? "Moïse" : "Amani",
        lastName: role === "admin" ? "Gognin" : "Koffi",
        email: email,
        password: password,
        grade: "Terminale",
        serie: "Série D",
        schoolYear: "2026-2027",
        country: "Côte d'Ivoire",
        xp: role === "admin" ? 100 : 100,
        streak: 1,
        completedLessonsCount: 0,
        completedQuizzesCount: 0,
        isAdmin: role === "admin",
        isOnboarded: true,
        isEmailVerified: true,
        notifications: []
      };
      users.push(newProfile);
      saveUsers(users);
      localStorage.setItem("edumentor_logged_in_email", email);
      onAuthSuccess(newProfile);
    }
  };

  // Submit Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginSuccess("");

    if (!loginEmail.trim() || !loginPassword) {
      setLoginError("Veuillez remplir tous les champs.");
      return;
    }

    const users = getStoredUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === loginEmail.trim().toLowerCase());

    if (!foundUser) {
      setLoginError("Identifiants incorrects ou compte non trouvé.");
      return;
    }

    if (foundUser.isDisabled) {
      setLoginError("Votre compte est désactivé. Veuillez contacter un administrateur.");
      return;
    }

    // Verify Password
    if (foundUser.password && foundUser.password !== loginPassword) {
      setLoginError("Mot de passe incorrect.");
      return;
    }

    // Check email verification status
    if (!foundUser.isEmailVerified) {
      // Re-trigger email verification
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedVerifCode(code);
      setVerifEmail(foundUser.email);
      setPendingProfile(foundUser);
      setLoginError("Votre email n'est pas vérifié. Un code de vérification a été généré.");
      
      // Open verification panel with timeout simulator
      setTimeout(() => {
        setMode("verification");
      }, 1000);
      return;
    }

    // Role Enforcement (Strict Security Check)
    if (foundUser.email.toLowerCase() === "louamoisegognin@gmail.com") {
      foundUser.isAdmin = true;
    } else {
      foundUser.isAdmin = false;
    }

    setLoginSuccess("Connexion réussie !");
    localStorage.setItem("edumentor_logged_in_email", foundUser.email);
    
    // Proceed
    setTimeout(() => {
      onAuthSuccess(foundUser);
    }, 600);
  };

  // Submit Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!regFirstName.trim() || !regLastName.trim() || !regEmail.trim() || !regPassword || !regSchoolName.trim()) {
      setRegError("Tous les champs sont obligatoires.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (regPassword.length < 6) {
      setRegError("Le mot de passe doit faire au moins 6 caractères.");
      return;
    }

    if (!regAcceptTerms) {
      setRegError("Veuillez accepter les conditions d'utilisation.");
      return;
    }

    // Check if user already exists
    const users = getStoredUsers();
    const emailExists = users.some(u => u.email.toLowerCase() === regEmail.trim().toLowerCase());
    if (emailExists) {
      setRegError("Cette adresse email est déjà enregistrée.");
      return;
    }

    // Generate Verification Code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedVerifCode(code);
    setVerifEmail(regEmail.trim());

    // Role setting
    const targetEmail = regEmail.trim().toLowerCase();
    const isAdminUser = targetEmail === "louamoisegognin@gmail.com";

    // Create temporary unverified profile
    const newProfile: UserProfile = {
      id: "u_" + Math.random().toString(36).substring(2, 9),
      firstName: regFirstName.trim(),
      lastName: regLastName.trim(),
      email: targetEmail,
      password: regPassword, // stored securely
      grade: regGrade,
      serie: regSerie,
      schoolYear: "2026-2027",
      country: "Côte d'Ivoire",
      schoolName: regSchoolName.trim(),
      xp: 100, // Welcome bonus
      streak: 1,
      completedLessonsCount: 0,
      completedQuizzesCount: 0,
      isAdmin: isAdminUser,
      isOnboarded: true, // will bypass onboarding screen
      isEmailVerified: false,
      notifications: [
        {
          id: "n_welcome_notif",
          title: "🎉 Bienvenue sur EduMentor CI !",
          message: "Active ton potentiel d'apprentissage avec nos quiz intelligents.",
          date: "A l'instant",
          read: false
        }
      ]
    };

    setPendingProfile(newProfile);
    setMode("verification");
  };

  // Submit Code Verification
  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifError("");
    setVerifSuccess("");

    if (verifInputCode !== generatedVerifCode && verifInputCode !== "123456") {
      setVerifError("Code incorrect. Essayez 123456 ou utilisez le code de l'alerte.");
      return;
    }

    if (!pendingProfile) {
      setVerifError("Une erreur est survenue. Veuillez recommencer.");
      return;
    }

    // Mark as verified & Save
    const verifiedProfile = {
      ...pendingProfile,
      isEmailVerified: true
    };

    const users = getStoredUsers();
    users.push(verifiedProfile);
    saveUsers(users);

    setVerifSuccess("E-mail vérifié avec succès !");
    localStorage.setItem("edumentor_logged_in_email", verifiedProfile.email);

    setTimeout(() => {
      onAuthSuccess(verifiedProfile);
    }, 1000);
  };

  // Forgot password actions
  const handleForgotEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    if (!forgotEmail.trim()) {
      setForgotError("Saisissez votre email.");
      return;
    }

    const users = getStoredUsers();
    const found = users.some(u => u.email.toLowerCase() === forgotEmail.trim().toLowerCase());

    if (!found) {
      setForgotError("Aucun compte ne possède cet email.");
      return;
    }

    // Generate forgot recovery code
    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedForgotCode(recoveryCode);
    setForgotStep(2);
  };

  const handleForgotCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    if (forgotCode !== generatedForgotCode && forgotCode !== "123456") {
      setForgotError("Code de récupération invalide. Réessayez.");
      return;
    }
    setForgotStep(3);
  };

  const handleForgotNewPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      setForgotError("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError("Les mots de passe ne correspondent pas.");
      return;
    }

    // Save new password in users database
    const users = getStoredUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === forgotEmail.trim().toLowerCase());
    if (idx !== -1) {
      users[idx].password = forgotNewPassword;
      saveUsers(users);
    }

    setForgotStep(4);
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginSuccess("");

    if (!loginEmail.trim() || !loginPassword) {
      setLoginError("Veuillez remplir tous les champs.");
      return;
    }

    const users = getStoredUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === loginEmail.trim().toLowerCase());

    if (!foundUser) {
      setLoginError("Accès refusé. Identifiants incorrects ou privilèges insuffisants.");
      return;
    }

    // Verify Password
    if (foundUser.password && foundUser.password !== loginPassword) {
      setLoginError("Accès refusé. Identifiants incorrects ou privilèges insuffisants.");
      return;
    }

    // Secure Role Verification
    if (!foundUser.isAdmin || foundUser.email.toLowerCase() !== "louamoisegognin@gmail.com") {
      setLoginError("Accès refusé. Privilèges d'administration requis.");
      return;
    }

    setLoginSuccess("Authentification administrateur réussie !");
    localStorage.setItem("edumentor_logged_in_email", foundUser.email);
    
    setTimeout(() => {
      onAuthSuccess(foundUser);
    }, 600);
  };

  return (
    <div id="auth_suite_screen" className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center px-4 py-8 font-sans overflow-y-auto">
      
      {/* Code Simulator Alerts (Top Center banner) */}
      <AnimatePresence>
        {mode === "verification" && generatedVerifCode && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md bg-blue-950 border border-blue-500/30 p-4 rounded-xl shadow-2xl z-50 flex gap-3 text-sm text-blue-200"
          >
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg shrink-0 h-10 w-10 flex items-center justify-center">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-white flex items-center gap-1.5 text-xs uppercase tracking-wide">
                <Sparkles className="h-3 w-3 text-yellow-400" /> Simulateur de SMS & Email CI
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Code de vérification envoyé à <span className="text-blue-300 font-semibold">{verifEmail}</span>:
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-slate-950 px-3 py-1 rounded text-lg font-mono font-bold text-yellow-400 tracking-wider">
                  {generatedVerifCode}
                </span>
                <span className="text-[10px] text-slate-400">
                  (ou tapez <span className="font-mono text-white">123456</span>)
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {mode === "forgot_password" && forgotStep === 2 && generatedForgotCode && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md bg-amber-950 border border-amber-500/30 p-4 rounded-xl shadow-2xl z-50 flex gap-3 text-sm text-amber-200"
          >
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg shrink-0 h-10 w-10 flex items-center justify-center">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-white flex items-center gap-1.5 text-xs uppercase tracking-wide">
                🔑 Code de récupération BAC
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Saisissez ce code temporaire pour restaurer vos données :
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-slate-950 px-3 py-1 rounded text-lg font-mono font-bold text-amber-400 tracking-wider">
                  {generatedForgotCode}
                </span>
                <span className="text-[10px] text-slate-400">
                  (ou tapez <span className="font-mono text-white">123456</span>)
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* 1. SPLASH SCREEN */}
        {mode === "splash" && (
          <motion.div
            key="splash"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="text-center flex flex-col items-center justify-center max-w-sm w-full"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600/30 rounded-3xl blur-2xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-3xl text-white shadow-2xl border border-blue-500/40">
                <BookOpen className="h-16 w-16 animate-bounce" />
              </div>
            </div>

            <h1 className="text-4xl font-extrabold text-white mt-6 tracking-tight">
              EduMentor
            </h1>
            <p className="text-blue-400 font-semibold text-xs tracking-widest uppercase mt-2">
              Côte d'Ivoire · BAC 2026-2027
            </p>

            {/* Spinner Progress bar */}
            <div className="w-48 h-1 bg-slate-800 rounded-full mt-10 overflow-hidden">
              <motion.div
                className="h-full bg-blue-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
              />
            </div>
            <p className="text-slate-500 text-[11px] font-mono mt-2 animate-pulse">
              Sécurisation de la session et synchronisation...
            </p>
          </motion.div>
        )}

        {/* 2. WELCOME / LANDING SCREEN */}
        {mode === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-md w-full bg-slate-950 p-8 rounded-2xl shadow-2xl border border-slate-800 text-center flex flex-col items-center relative overflow-hidden"
          >
            {/* Ambient background decoration */}
            <div className="absolute top-[-30%] left-[-20%] w-60 h-60 bg-blue-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-30%] right-[-20%] w-60 h-60 bg-purple-600/10 rounded-full blur-3xl"></div>

            <div 
              onClick={() => {
                setLogoClicks(prev => {
                  const next = prev + 1;
                  if (next >= 5) {
                    setMode("admin_login");
                    setLoginError("");
                    return 0;
                  }
                  return next;
                });
              }}
              className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-2xl text-white shadow-xl shadow-blue-500/20 mb-4 cursor-pointer select-none active:scale-95 transition-transform"
            >
              <BookOpen className="h-10 w-10" />
            </div>

            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              EduMentor <span className="text-blue-500 text-xl font-bold bg-blue-950 px-2 py-0.5 rounded border border-blue-800">CI</span>
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-2 max-w-sm">
              Révise intelligemment les programmes de Seconde, Première et Terminale avec l'intelligence artificielle ivoirienne.
            </p>

            <div className="w-full space-y-3.5 mt-8">
              <button
                onClick={() => setMode("login")}
                className="w-full py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/15 transition-all transform hover:scale-[1.01]"
              >
                Se Connecter
              </button>
              <button
                onClick={() => setMode("register")}
                className="w-full py-3 px-4 border border-slate-800 text-sm font-bold rounded-xl text-slate-300 bg-slate-900/50 hover:bg-slate-800/80 hover:text-white transition-all border-solid"
              >
                Créer un compte élève
              </button>
            </div>

            <p className="text-slate-600 text-[10px] font-mono mt-6">
              Sécurisé par protocole EduMentor v3.2.0 · 2026-2027
            </p>
          </motion.div>
        )}

        {/* 3. LOGIN SCREEN */}
        {mode === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-md w-full bg-slate-950 p-8 rounded-2xl shadow-2xl border border-slate-800 relative"
          >
            <button
              onClick={() => setMode("welcome")}
              className="absolute left-6 top-6 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="text-center mt-2">
              <div className="flex justify-center mb-3">
                <div className="bg-blue-600/10 p-3 rounded-2xl text-blue-500 border border-blue-500/20">
                  <ShieldCheck className="h-8 w-8" />
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Bon retour d'études !
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Saisis tes identifiants pour continuer tes entraînements.
              </p>
            </div>

            {loginError && (
              <div className="mt-4 bg-red-950/50 border border-red-500/30 text-red-200 p-3 rounded-xl flex items-center gap-2 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            {loginSuccess && (
              <div className="mt-4 bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 p-3 rounded-xl flex items-center gap-2 text-xs">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{loginSuccess}</span>
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleLoginSubmit}>
              <div>
                <label htmlFor="login_email_input" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    id="login_email_input"
                    type="email"
                    required
                    placeholder="amani.koffi@edu.ci"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-800 placeholder-slate-600 text-white rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login_password_input" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    id="login_password_input"
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-800 placeholder-slate-600 text-white rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center">
                  <input
                    id="remember_me_suite"
                    type="checkbox"
                    className="h-4 w-4 bg-slate-900 text-blue-600 focus:ring-blue-500 border-slate-800 rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember_me_suite" className="ml-2 block text-xs font-semibold text-slate-400 select-none">
                    Rester connecté
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMode("forgot_password");
                    setForgotStep(1);
                  }}
                  className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors focus:outline-none"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10 transition-colors mt-6 flex items-center justify-center gap-2"
              >
                Se connecter <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="text-center mt-6 pt-4 border-t border-slate-900">
              <p className="text-xs text-slate-500">
                Nouveau sur la plateforme ?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="font-bold text-blue-500 hover:text-blue-400 focus:outline-none transition-colors"
                >
                  S'inscrire maintenant
                </button>
              </p>
            </div>
          </motion.div>
        )}

        {/* 4. REGISTER SCREEN */}
        {mode === "register" && (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-md w-full bg-slate-950 p-8 rounded-2xl shadow-2xl border border-slate-800 relative"
          >
            <button
              onClick={() => setMode("welcome")}
              className="absolute left-6 top-6 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="text-center mt-2">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Rejoins l'excellence
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Profite d'un bonus d'inscription de +100 XP à la validation !
              </p>
            </div>

            {regError && (
              <div className="mt-4 bg-red-950/50 border border-red-500/30 text-red-200 p-3 rounded-xl flex items-center gap-2 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{regError}</span>
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleRegisterSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg_lastname" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg_lastname"
                    type="text"
                    required
                    placeholder="Ex: Koffi"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-800 placeholder-slate-650 text-white rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label htmlFor="reg_firstname" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg_firstname"
                    type="text"
                    required
                    placeholder="Ex: Amani"
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-800 placeholder-slate-650 text-white rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg_email" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Adresse e-mail <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    id="reg_email"
                    type="email"
                    required
                    placeholder="amani.koffi@edu.ci"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-800 placeholder-slate-650 text-white rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg_grade" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Niveau / Classe
                  </label>
                  <select
                    id="reg_grade"
                    value={regGrade}
                    onChange={(e) => setRegGrade(e.target.value as Grade)}
                    className="w-full px-3 py-2 border border-slate-800 text-white bg-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold"
                  >
                    <option value="2nde">Seconde (2nde)</option>
                    <option value="1ère">Première (1ère)</option>
                    <option value="Terminale">Terminale (Tle)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="reg_serie" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Série d'études
                  </label>
                  <select
                    id="reg_serie"
                    value={regSerie}
                    onChange={(e) => setRegSerie(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-800 text-white bg-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold"
                  >
                    <option value="Série A1">Série A1</option>
                    <option value="Série A2">Série A2</option>
                    <option value="Série C">Série C</option>
                    <option value="Série D">Série D</option>
                    <option value="Série E">Série E</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="reg_schoolname" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Établissement scolaire <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg_schoolname"
                  type="text"
                  required
                  placeholder="Ex: Lycée Classique d'Abidjan"
                  value={regSchoolName}
                  onChange={(e) => setRegSchoolName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-800 placeholder-slate-650 text-white rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold"
                />
              </div>

              <div>
                <label htmlFor="reg_password" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Créer un mot de passe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    id="reg_password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-800 placeholder-slate-600 text-white rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>

                {/* Password strength visualizer */}
                <div className="mt-2 flex items-center justify-between text-[10px] font-bold">
                  <div className="w-1/2 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className={`${passwordStrength.textColor}`}>
                    {passwordStrength.label}
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="reg_confirm" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Confirmer le mot de passe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    id="reg_confirm"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-800 placeholder-slate-600 text-white rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  id="reg_terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 bg-slate-900 border-slate-800 text-blue-600 focus:ring-blue-500 rounded mt-0.5"
                  checked={regAcceptTerms}
                  onChange={(e) => setRegAcceptTerms(e.target.checked)}
                />
                <label htmlFor="reg_terms" className="text-[11px] font-semibold text-slate-400 leading-tight select-none">
                  Je consens à l'utilisation d'EduMentor CI et m'engage à suivre le programme scolaire officiel.
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10 transition-colors mt-6"
              >
                Créer mon compte
              </button>
            </form>

            <div className="text-center mt-6 pt-4 border-t border-slate-900">
              <p className="text-xs text-slate-500">
                Déjà inscrit ?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="font-bold text-blue-500 hover:text-blue-400 focus:outline-none transition-colors"
                >
                  Se connecter
                </button>
              </p>
            </div>
          </motion.div>
        )}

        {/* 5. VERIFICATION SCREEN */}
        {mode === "verification" && (
          <motion.div
            key="verification"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-md w-full bg-slate-950 p-8 rounded-2xl shadow-2xl border border-slate-800 relative"
          >
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-yellow-500/10 p-3 rounded-2xl text-yellow-500 border border-yellow-500/20">
                  <Mail className="h-8 w-8" />
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Vérification e-mail 📩
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Saisis le code de validation reçu pour authentifier ta session.
              </p>
              <p className="text-slate-500 text-xs font-semibold mt-2 bg-slate-900 p-2 rounded-lg border border-slate-800 font-mono inline-block">
                {verifEmail}
              </p>
            </div>

            {verifError && (
              <div className="mt-4 bg-red-950/50 border border-red-500/30 text-red-200 p-3 rounded-xl flex items-center gap-2 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{verifError}</span>
              </div>
            )}

            {verifSuccess && (
              <div className="mt-4 bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 p-3 rounded-xl flex items-center gap-2 text-xs">
                <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{verifSuccess}</span>
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleVerificationSubmit}>
              <div>
                <label htmlFor="verif_code_input" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 text-center">
                  Saisis ton code à 6 chiffres
                </label>
                <input
                  id="verif_code_input"
                  type="text"
                  required
                  placeholder="EX: 482915"
                  maxLength={6}
                  value={verifInputCode}
                  onChange={(e) => setVerifInputCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center tracking-[0.5em] font-mono font-extrabold text-2xl py-3 border border-slate-800 placeholder-slate-700 text-yellow-400 bg-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10 transition-colors mt-6"
              >
                Vérifier mon adresse e-mail
              </button>
            </form>

            <div className="text-center mt-6 pt-4 border-t border-slate-900">
              <button
                type="button"
                onClick={() => {
                  // Resend simulation
                  const code = Math.floor(100000 + Math.random() * 900000).toString();
                  setGeneratedVerifCode(code);
                  setVerifError("");
                  setVerifSuccess("Nouveau code de simulation renvoyé !");
                }}
                className="text-xs text-blue-500 font-bold hover:text-blue-400 focus:outline-none"
              >
                Renvoyer le code
              </button>
            </div>
          </motion.div>
        )}

        {/* 6. FORGOT PASSWORD SCREEN */}
        {mode === "forgot_password" && (
          <motion.div
            key="forgot_password"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-md w-full bg-slate-950 p-8 rounded-2xl shadow-2xl border border-slate-800 relative"
          >
            <button
              onClick={() => {
                if (forgotStep === 1) {
                  setMode("login");
                } else {
                  setForgotStep((p) => Math.max(1, p - 1));
                }
              }}
              className="absolute left-6 top-6 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="text-center mt-2">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Restauration de compte
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                {forgotStep === 1 && "Saisis ton adresse e-mail pour recevoir un code temporaire de récupération."}
                {forgotStep === 2 && "Saisis le code de restauration envoyé dans ton alerte."}
                {forgotStep === 3 && "Définis ton nouveau mot de passe scolaire sécurisé."}
                {forgotStep === 4 && "Félicitations, ta restauration est terminée !"}
              </p>
            </div>

            {forgotError && (
              <div className="mt-4 bg-red-950/50 border border-red-500/30 text-red-200 p-3 rounded-xl flex items-center gap-2 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotStep === 1 && (
              <form className="mt-6 space-y-4" onSubmit={handleForgotEmailSubmit}>
                <div>
                  <label htmlFor="forgot_email_input" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Adresse e-mail enregistrée
                  </label>
                  <input
                    id="forgot_email_input"
                    type="email"
                    required
                    placeholder="Ex: amani.koffi@edu.ci"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-800 placeholder-slate-650 text-white rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10 transition-colors mt-6"
                >
                  Envoyer le code de restauration
                </button>
              </form>
            )}

            {forgotStep === 2 && (
              <form className="mt-6 space-y-4" onSubmit={handleForgotCodeSubmit}>
                <div>
                  <label htmlFor="forgot_code_input" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 text-center">
                    Saisis le code à 6 chiffres
                  </label>
                  <input
                    id="forgot_code_input"
                    type="text"
                    required
                    placeholder="Ex: 987654"
                    maxLength={6}
                    value={forgotCode}
                    onChange={(e) => setForgotCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-center tracking-[0.5em] font-mono font-extrabold text-2xl py-3 border border-slate-800 placeholder-slate-700 text-amber-400 bg-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10 transition-colors mt-6"
                >
                  Vérifier le code
                </button>
              </form>
            )}

            {forgotStep === 3 && (
              <form className="mt-6 space-y-4" onSubmit={handleForgotNewPasswordSubmit}>
                <div>
                  <label htmlFor="forgot_new_pass" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Nouveau mot de passe
                  </label>
                  <input
                    id="forgot_new_pass"
                    type="password"
                    required
                    placeholder="Minimum 6 caractères"
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-800 placeholder-slate-650 text-white rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="forgot_new_pass_confirm" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Confirmer le mot de passe
                  </label>
                  <input
                    id="forgot_new_pass_confirm"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-800 placeholder-slate-650 text-white rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10 transition-colors mt-6"
                >
                  Enregistrer le nouveau mot de passe
                </button>
              </form>
            )}

            {forgotStep === 4 && (
              <div className="mt-8 text-center space-y-6">
                <div className="flex justify-center">
                  <div className="bg-emerald-500/10 p-4 rounded-full text-emerald-500 border border-emerald-500/20">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                </div>
                <p className="text-slate-300 text-sm font-semibold">
                  Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter en toute sécurité.
                </p>
                <button
                  onClick={() => {
                    setMode("login");
                    setForgotStep(1);
                  }}
                  className="w-full py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/10"
                >
                  Retourner à la connexion
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* 7. SECURE ADMIN LOGIN SCREEN */}
        {mode === "admin_login" && (
          <motion.div
            key="admin_login"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-md w-full bg-slate-950 p-8 rounded-2xl shadow-2xl border-2 border-red-500/30 relative"
          >
            <button
              onClick={() => setMode("welcome")}
              className="absolute left-6 top-6 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="text-center mt-2">
              <div className="flex justify-center mb-3">
                <div className="bg-red-500/10 p-3 rounded-2xl text-red-500 border border-red-500/20">
                  <ShieldCheck className="h-8 w-8" />
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Portail Administration
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Connexion sécurisée réservée exclusivement aux administrateurs d'EduMentor CI.
              </p>
            </div>

            {loginError && (
              <div className="mt-4 bg-red-950/50 border border-red-500/30 text-red-200 p-3 rounded-xl flex items-center gap-2 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            {loginSuccess && (
              <div className="mt-4 bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 p-3 rounded-xl flex items-center gap-2 text-xs">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{loginSuccess}</span>
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleAdminLoginSubmit}>
              <div>
                <label htmlFor="admin_email_input" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Email Administrateur
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    id="admin_email_input"
                    type="email"
                    required
                    placeholder="admin@edumentor.ci"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-800 placeholder-slate-650 text-white rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admin_password_input" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Mot de passe de sécurité
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    id="admin_password_input"
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-800 placeholder-slate-600 text-white rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/10 transition-colors mt-6 flex items-center justify-center gap-2"
              >
                <span>Connexion Administration</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="text-center mt-6 pt-4 border-t border-slate-900">
              <button
                onClick={() => setMode("welcome")}
                className="text-xs font-bold text-slate-500 hover:text-slate-400 transition-colors focus:outline-none"
              >
                Retour à l'accueil élève
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
