import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Mail,
  Lock,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  GraduationCap,
  Award,
  BrainCircuit,
  Building,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, Grade } from "../types";
import { getStoredUsers, saveUserToFirestore, getProfileByEmail, setActiveSessionEmail } from "../lib/storage";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import EduMentorLogo from "./EduMentorLogo";

interface AuthScreenSuiteProps {
  onAuthSuccess: (profile: UserProfile) => void;
}

type AuthMode = "welcome" | "login" | "register" | "admin_login";

export default function AuthScreenSuite({ onAuthSuccess }: AuthScreenSuiteProps) {
  const [mode, setMode] = useState<AuthMode>("welcome");

  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  // Login form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
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

  // Admin Login States (Secret 5 Clicks)
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  // Secret Logo Click Handler
  const [logoClicks, setLogoClicks] = useState<number>(0);

  // Password Strength Indicator for Registration
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "Très faible",
    color: "bg-red-500",
    textColor: "text-red-400",
  });

  useEffect(() => {
    if (!regPassword) {
      setPasswordStrength({ score: 0, label: "Saisir un mot de passe", color: "bg-slate-700", textColor: "text-slate-400" });
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
    let textColor = "text-red-400";

    if (score === 2) {
      label = "Faible";
      color = "bg-orange-500";
      textColor = "text-orange-400";
    } else if (score === 3) {
      label = "Moyen";
      color = "bg-amber-500";
      textColor = "text-amber-400";
    } else if (score === 4) {
      label = "Fort";
      color = "bg-emerald-500";
      textColor = "text-emerald-400";
    } else if (score >= 5) {
      label = "Excellent";
      color = "bg-blue-500";
      textColor = "text-blue-400";
    }

    setPasswordStrength({ score, label, color, textColor });
  }, [regPassword]);

  // Submit Student Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginSuccess("");
    setIsLoading(true);

    const emailClean = loginEmail.trim().toLowerCase();

    if (!emailClean || !loginPassword) {
      setLoginError("Veuillez remplir tous les champs.");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Try Firebase Auth
      try {
        await signInWithEmailAndPassword(auth, emailClean, loginPassword);
      } catch (authErr: any) {
        console.info("Firebase auth status:", authErr?.message);
      }

      // 2. Fetch User Profile from Firestore / Local Users
      const users = getStoredUsers();
      let foundUser = users.find(u => u.email.toLowerCase() === emailClean);

      if (!foundUser) {
        // Look up by email
        foundUser = getProfileByEmail(emailClean);
      }

      if (foundUser.isDisabled) {
        setLoginError("Votre compte est désactivé. Veuillez contacter l'administration.");
        setIsLoading(false);
        return;
      }

      // Verify Password if set locally
      if (foundUser.password && foundUser.password !== loginPassword) {
        setLoginError("Mot de passe incorrect.");
        setIsLoading(false);
        return;
      }

      const isSuperAdmin = emailClean === "louamoisegognin@gmail.com";
      foundUser.isAdmin = isSuperAdmin;
      foundUser.isEmailVerified = true;

      setLoginSuccess("Connexion réussie ! Chargement de votre espace...");
      setActiveSessionEmail(foundUser.email);
      await saveUserToFirestore(foundUser);

      setTimeout(() => {
        setIsLoading(false);
        onAuthSuccess(foundUser!);
      }, 600);

    } catch (err: any) {
      console.error("Login error:", err);
      setLoginError(err.message || "Erreur de connexion. Vérifiez vos identifiants.");
      setIsLoading(false);
    }
  };

  // Submit Student Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setIsLoading(true);

    const emailClean = regEmail.trim().toLowerCase();

    if (!regFirstName.trim() || !regLastName.trim() || !emailClean || !regPassword || !regSchoolName.trim()) {
      setRegError("Tous les champs obligatoires (*) doivent être renseignés.");
      setIsLoading(false);
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError("Les mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }

    if (regPassword.length < 6) {
      setRegError("Le mot de passe doit contenir au moins 6 caractères.");
      setIsLoading(false);
      return;
    }

    if (!regAcceptTerms) {
      setRegError("Veuillez accepter les conditions d'utilisation d'EduMentor.");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Try Creating Firebase Auth User
      try {
        await createUserWithEmailAndPassword(auth, emailClean, regPassword);
      } catch (fbErr: any) {
        if (fbErr.code === "auth/email-already-in-use") {
          // Attempt sign in if password matches or warn user
          try {
            await signInWithEmailAndPassword(auth, emailClean, regPassword);
          } catch {
            setRegError("Cette adresse email est déjà enregistrée sur EduMentor.");
            setIsLoading(false);
            return;
          }
        }
      }

      const isSuperAdmin = emailClean === "louamoisegognin@gmail.com";

      const newProfile: UserProfile = {
        id: "u_" + Math.random().toString(36).substring(2, 9),
        firstName: regFirstName.trim(),
        lastName: regLastName.trim(),
        email: emailClean,
        password: regPassword,
        grade: regGrade,
        serie: regSerie,
        schoolYear: "2026-2027",
        country: "Côte d'Ivoire",
        schoolName: regSchoolName.trim(),
        xp: 100,
        streak: 1,
        completedLessonsCount: 0,
        completedQuizzesCount: 0,
        isAdmin: isSuperAdmin,
        isOnboarded: true,
        isEmailVerified: true,
        notifications: [
          {
            id: "welcome_notif_" + Date.now(),
            title: "🎉 Bienvenue sur EduMentor !",
            message: `Ton espace ${regGrade} ${regSerie} est prêt ! Accède à tes cours et ton tuteur IA.`,
            date: "À l'instant",
            read: false
          }
        ]
      };

      await saveUserToFirestore(newProfile);
      setActiveSessionEmail(newProfile.email);

      setTimeout(() => {
        setIsLoading(false);
        onAuthSuccess(newProfile);
      }, 600);

    } catch (err: any) {
      console.error("Registration error:", err);
      setRegError(err.message || "Échec de création de compte. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  // Secret Admin Login Submit (Triggered by 5 Clicks on Logo)
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    setIsLoading(true);

    const emailClean = adminEmail.trim().toLowerCase();

    if (!emailClean || !adminPassword) {
      setAdminError("Veuillez renseigner l'email et le mot de passe administrateur.");
      setIsLoading(false);
      return;
    }

    try {
      try {
        await signInWithEmailAndPassword(auth, emailClean, adminPassword);
      } catch (authErr: any) {
        console.info("Admin auth notice:", authErr?.message);
      }

      const users = getStoredUsers();
      let foundUser = users.find(u => u.email.toLowerCase() === emailClean);

      if (!foundUser) {
        foundUser = getProfileByEmail(emailClean);
      }

      const isSuperAdmin = emailClean === "louamoisegognin@gmail.com";
      const hasAdminRights = isSuperAdmin || foundUser.isAdmin === true;

      if (!hasAdminRights) {
        setAdminError("Accès refusé. Ce compte ne possède pas les privilèges administrateur.");
        setIsLoading(false);
        return;
      }

      foundUser.isAdmin = true;
      foundUser.isEmailVerified = true;
      setActiveSessionEmail(foundUser.email);
      await saveUserToFirestore(foundUser);

      setTimeout(() => {
        setIsLoading(false);
        onAuthSuccess(foundUser!);
      }, 500);

    } catch (err: any) {
      console.error("Admin login error:", err);
      setAdminError("Identifiants administration invalides.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center px-4 py-8 font-sans relative overflow-x-hidden">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <AnimatePresence mode="wait">
        
        {/* 1. WELCOME SCREEN */}
        {mode === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-md w-full bg-slate-950/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-800/80 text-center flex flex-col items-center relative overflow-hidden"
          >
            {/* Secret Logo Click Area */}
            <div 
              onClick={() => {
                setLogoClicks(prev => {
                  const next = prev + 1;
                  if (next >= 5) {
                    setMode("admin_login");
                    setAdminError("");
                    return 0;
                  }
                  return next;
                });
              }}
              className="cursor-pointer select-none py-2 transition-transform active:scale-95"
              title="EduMentor"
            >
              <EduMentorLogo variant="square" size="xl" theme="dark" showTagline={false} />
            </div>

            <div className="mt-4 space-y-1">
              <h1 className="text-3xl font-black font-heading text-white tracking-tight">
                Edu<span className="text-blue-500">Mentor</span>
              </h1>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
                L'Excellence Scolaire Intelligente
              </p>
            </div>

            <p className="text-slate-400 text-sm font-medium mt-3 leading-relaxed">
              Votre plateforme d'apprentissage connectée à Cloud Firestore et propulsée par l'IA Gemini.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-3 gap-2 w-full my-6 text-[11px] font-bold text-slate-300">
              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl flex flex-col items-center gap-1">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                <span>Programme officiel</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl flex flex-col items-center gap-1">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Quiz & BAC</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl flex flex-col items-center gap-1">
                <BrainCircuit className="w-4 h-4 text-amber-400" />
                <span>Tuteur IA</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="w-full space-y-3">
              <button
                onClick={() => setMode("login")}
                className="w-full py-3.5 px-4 text-sm font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 transition-all transform hover:scale-[1.01]"
              >
                Se Connecter
              </button>
              <button
                onClick={() => setMode("register")}
                className="w-full py-3.5 px-4 text-sm font-bold rounded-2xl text-slate-300 bg-slate-900 hover:bg-slate-800/80 hover:text-white transition-all border border-slate-800"
              >
                Créer un compte élève
              </button>
            </div>
          </motion.div>
        )}

        {/* 2. LOGIN SCREEN */}
        {mode === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-md w-full bg-slate-950/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-800/80 relative"
          >
            <button
              onClick={() => setMode("welcome")}
              className="absolute left-6 top-6 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="text-center mt-2 flex flex-col items-center">
              <EduMentorLogo variant="icon-only" size="lg" theme="dark" />
              <h2 className="text-2xl font-black font-heading text-white tracking-tight mt-3">
                Connexion Élève
              </h2>
              <p className="text-slate-400 text-xs font-medium mt-1">
                Saisissez vos identifiants pour accéder à vos cours.
              </p>
            </div>

            {loginError && (
              <div className="mt-4 bg-red-950/60 border border-red-500/30 text-red-200 p-3 rounded-xl flex items-center gap-2 text-xs font-medium">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            {loginSuccess && (
              <div className="mt-4 bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 p-3 rounded-xl flex items-center gap-2 text-xs font-medium">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{loginSuccess}</span>
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleLoginSubmit}>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="votre.email@exemple.ci"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 border border-slate-800 placeholder-slate-600 text-white rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 border border-slate-800 placeholder-slate-600 text-white rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 text-sm font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Vérification...</span>
                  </>
                ) : (
                  <>
                    <span>Se connecter</span> <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-6 pt-4 border-t border-slate-900">
              <p className="text-xs text-slate-500">
                Nouveau sur EduMentor ?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="font-bold text-blue-400 hover:underline"
                >
                  S'inscrire maintenant
                </button>
              </p>
            </div>
          </motion.div>
        )}

        {/* 3. REGISTER SCREEN */}
        {mode === "register" && (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-md w-full bg-slate-950/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-800/80 relative my-4"
          >
            <button
              onClick={() => setMode("welcome")}
              className="absolute left-6 top-6 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="text-center mt-2 flex flex-col items-center">
              <EduMentorLogo variant="icon-only" size="md" theme="dark" />
              <h2 className="text-2xl font-black font-heading text-white tracking-tight mt-2">
                Inscription Élève
              </h2>
              <p className="text-slate-400 text-xs font-medium mt-1">
                Configurez votre profil d'apprentissage personnalisé.
              </p>
            </div>

            {regError && (
              <div className="mt-4 bg-red-950/60 border border-red-500/30 text-red-200 p-3 rounded-xl flex items-center gap-2 text-xs font-medium">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{regError}</span>
              </div>
            )}

            <form className="mt-5 space-y-3.5" onSubmit={handleRegisterSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Nom <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nom"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-800 placeholder-slate-600 text-white rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Prénom <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Prénom"
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-800 placeholder-slate-600 text-white rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Adresse e-mail <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="eleve@exemple.ci"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-800 placeholder-slate-600 text-white rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Niveau <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={regGrade}
                    onChange={(e) => setRegGrade(e.target.value as Grade)}
                    className="w-full px-3 py-2 border border-slate-800 text-white bg-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-medium"
                  >
                    <option value="2nde">Seconde (2nde)</option>
                    <option value="1ère">Première (1ère)</option>
                    <option value="Terminale">Terminale (Tle)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Série <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={regSerie}
                    onChange={(e) => setRegSerie(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-800 text-white bg-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-medium"
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
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Établissement scolaire <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Nom de votre établissement"
                    value={regSchoolName}
                    onChange={(e) => setRegSchoolName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-800 placeholder-slate-600 text-white rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Mot de passe <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-800 placeholder-slate-600 text-white rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[10px] font-bold">
                  <div className="w-1/2 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className={passwordStrength.textColor}>
                    {passwordStrength.label}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Confirmer mot de passe <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-800 placeholder-slate-600 text-white rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  required
                  className="h-4 w-4 bg-slate-900 border-slate-800 text-blue-600 focus:ring-blue-500 rounded mt-0.5"
                  checked={regAcceptTerms}
                  onChange={(e) => setRegAcceptTerms(e.target.checked)}
                />
                <label className="text-[11px] font-medium text-slate-400 leading-tight select-none">
                  Je m'engage à respecter les règles d'utilisation d'EduMentor.
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 text-sm font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Création du compte...</span>
                  </>
                ) : (
                  <span>Créer mon compte EduMentor</span>
                )}
              </button>
            </form>

            <div className="text-center mt-5 pt-3 border-t border-slate-900">
              <p className="text-xs text-slate-500">
                Déjà inscrit ?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="font-bold text-blue-400 hover:underline"
                >
                  Se connecter
                </button>
              </p>
            </div>
          </motion.div>
        )}

        {/* 4. SECRET ADMIN LOGIN SCREEN (5 CLICKS ON LOGO) */}
        {mode === "admin_login" && (
          <motion.div
            key="admin_login"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-md w-full bg-slate-950/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-amber-500/30 relative"
          >
            <button
              onClick={() => setMode("welcome")}
              className="absolute left-6 top-6 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="text-center mt-2 flex flex-col items-center">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 mb-2">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-black font-heading text-white tracking-tight">
                Espace Administration
              </h2>
              <p className="text-slate-400 text-xs font-medium mt-1">
                Authentification réservée au personnel administratif autorisé.
              </p>
            </div>

            {adminError && (
              <div className="mt-4 bg-red-950/60 border border-red-500/30 text-red-200 p-3 rounded-xl flex items-center gap-2 text-xs font-medium">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{adminError}</span>
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleAdminLoginSubmit}>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Email Administrateur
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="admin@edumentor.ci"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 border border-slate-800 placeholder-slate-600 text-white rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Mot de passe Administrateur
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 border border-slate-800 placeholder-slate-600 text-white rounded-xl bg-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 text-sm font-bold rounded-2xl text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 transition-all mt-6 flex items-center justify-center gap-2 font-heading uppercase tracking-wider disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Vérification Admin...</span>
                  </>
                ) : (
                  <span>Valider Accès Administrateur</span>
                )}
              </button>
            </form>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
