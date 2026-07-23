import React, { useState } from "react";
import { User, Globe, School, GraduationCap, Target, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { UserProfile, Grade } from "../types";
import { COUNTRIES_TABLE, CLASSES_TABLE, SERIES_TABLE, SCHOOL_YEARS_TABLE } from "../lib/storage";

interface OnboardingProps {
  userProfile: UserProfile;
  onCompleteOnboarding: (updatedProfile: UserProfile) => void;
}

const PRESET_AVATARS = [
  { id: "avatar_1", name: "Aminata", emoji: "👩‍🔬", bg: "bg-emerald-100 text-emerald-800" },
  { id: "avatar_2", name: "Koffi", emoji: "👨‍💻", bg: "bg-blue-100 text-blue-800" },
  { id: "avatar_3", name: "Mariam", emoji: "👩‍🏫", bg: "bg-purple-100 text-purple-800" },
  { id: "avatar_4", name: "Soro", emoji: "👨‍🎓", bg: "bg-amber-100 text-amber-800" },
  { id: "avatar_5", name: "Kouamé", emoji: "👨‍🔬", bg: "bg-teal-100 text-teal-800" },
  { id: "avatar_6", name: "Awa", emoji: "👩‍🎨", bg: "bg-rose-100 text-rose-800" },
];

export default function OnboardingScreen({ userProfile, onCompleteOnboarding }: OnboardingProps) {
  const [firstName, setFirstName] = useState(userProfile.firstName || "");
  const [lastName, setLastName] = useState(userProfile.lastName || "");
  const [country, setCountry] = useState(userProfile.country || "Côte d'Ivoire");
  const [schoolName, setSchoolName] = useState(userProfile.schoolName || "");
  const [grade, setGrade] = useState<Grade>(userProfile.grade || "Terminale");
  const [serie, setSerie] = useState(userProfile.serie || "Série D");
  const [schoolYear, setSchoolYear] = useState(userProfile.schoolYear || "2026-2027");
  const [selectedAvatar, setSelectedAvatar] = useState(userProfile.profilePicture || "avatar_1");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const handleNextStep = () => {
    if (step === 1) {
      if (!firstName.trim()) {
        setError("Veuillez renseigner votre prénom.");
        return;
      }
      if (!lastName.trim()) {
        setError("Veuillez renseigner votre nom de famille.");
        return;
      }
      setError("");
      setStep(2);
    } else if (step === 2) {
      if (!country) {
        setError("Veuillez sélectionner un pays d'études.");
        return;
      }
      setError("");
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setError("");
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !country || !grade || !serie || !schoolYear) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const updatedProfile: UserProfile = {
      ...userProfile,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      country,
      schoolName: schoolName.trim(),
      grade,
      serie,
      schoolYear,
      profilePicture: selectedAvatar,
      isOnboarded: true,
    };

    onCompleteOnboarding(updatedProfile);
  };

  return (
    <div id="onboarding_container" className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100">
          <motion.div
            className="h-full bg-blue-600"
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="flex items-center justify-between mb-6 mt-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Étape {step} sur 3
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Profil Scolaire
          </span>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-center gap-2 text-xs font-medium">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Faisons connaissance ! 👋
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Configure ton identité pour personnaliser ton expérience d'apprentissage.
                </p>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
                  Choisis ton avatar d'étude
                </label>
                <div className="grid grid-cols-6 gap-2 sm:gap-3">
                  {PRESET_AVATARS.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar.id)}
                      className={`relative aspect-square flex flex-col items-center justify-center rounded-xl transition-all border-2 text-2xl ${
                        selectedAvatar === avatar.id
                          ? "border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/50 scale-105 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-slate-50"
                      }`}
                    >
                      <span>{avatar.emoji}</span>
                      <span className="text-[10px] font-semibold text-slate-500 absolute bottom-1">
                        {avatar.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="onboarding_lastname" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Nom de famille <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      id="onboarding_lastname"
                      type="text"
                      required
                      placeholder="Ex: Koffi"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 placeholder-slate-400 text-slate-950 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="onboarding_firstname" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      id="onboarding_firstname"
                      type="text"
                      required
                      placeholder="Ex: Amani"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 placeholder-slate-400 text-slate-950 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md shadow-blue-500/10 transition-colors mt-6"
              >
                Suivant <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Origine & Établissement 🌍
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  EduMentor s'adapte aux programmes scolaires d'Afrique de l'Ouest.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="onboarding_country" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Pays d'études <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <select
                      id="onboarding_country"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-950 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold bg-white"
                    >
                      {COUNTRIES_TABLE.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="onboarding_school" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Établissement scolaire <span className="text-slate-400 font-normal">(Optionnel)</span>
                  </label>
                  <div className="relative">
                    <School className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      id="onboarding_school"
                      type="text"
                      placeholder="Ex: Lycée Classique d'Abidjan"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 placeholder-slate-400 text-slate-950 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-1/3 py-2.5 px-4 border border-slate-200 text-sm font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-2/3 flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10 transition-colors"
                >
                  Suivant <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Classe & Programme d'études 📚
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Sélectionne ton niveau et ta série pour configurer ton programme d'examen.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="onboarding_grade" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Classe / Niveau <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <select
                      id="onboarding_grade"
                      required
                      value={grade}
                      onChange={(e) => setGrade(e.target.value as Grade)}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-950 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold bg-white"
                    >
                      {CLASSES_TABLE.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="onboarding_serie" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Série <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Target className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <select
                      id="onboarding_serie"
                      required
                      value={serie}
                      onChange={(e) => setSerie(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-950 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold bg-white"
                    >
                      {SERIES_TABLE.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="onboarding_year" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Année Scolaire <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <select
                      id="onboarding_year"
                      required
                      value={schoolYear}
                      onChange={(e) => setSchoolYear(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-950 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold bg-white"
                    >
                      {SCHOOL_YEARS_TABLE.map((y) => (
                        <option key={y.id} value={y.id}>
                          {y.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-1/3 py-2.5 px-4 border border-slate-200 text-sm font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  className="w-2/3 flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-colors"
                >
                  Terminer l'onboarding 🚀
                </button>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
}
