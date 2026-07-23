import React, { useState } from "react";
import { User, Bell, Settings, Shield, HelpCircle, LogOut, CheckCircle, Save } from "lucide-react";
import { motion } from "motion/react";
import { UserProfile, Grade } from "../types";

interface ProfileProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onLogout: () => void;
}

export default function ProfileSettingsScreen({ userProfile, onUpdateProfile, onLogout }: ProfileProps) {
  const [firstName, setFirstName] = useState(userProfile.firstName);
  const [lastName, setLastName] = useState(userProfile.lastName);
  const [email, setEmail] = useState(userProfile.email);
  const [grade, setGrade] = useState<Grade>(userProfile.grade);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) return;

    const updated: UserProfile = {
      ...userProfile,
      firstName,
      lastName,
      email,
      grade
    };
    onUpdateProfile(updated);
    setSuccessMsg("Profil mis à jour avec succès ! Les recommandations s'adaptent désormais à ton niveau.");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black font-heading text-slate-900 tracking-tight">Paramètres</h1>
        <p className="text-slate-500 font-medium mt-1">
          Gère les informations de ton compte et change de classe pour adapter le programme d'études.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Profile Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-50 pb-5">
          <div className="h-14 w-14 bg-gradient-to-tr from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black font-heading shadow-md shadow-blue-500/10">
            {firstName.charAt(0)}{lastName.charAt(0)}
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 font-heading text-base sm:text-lg">
              {firstName} {lastName}
            </h3>
            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
              Élève · Classe de {grade}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="settings_last_name" className="block text-xs font-bold text-slate-700 mb-1">Nom</label>
              <input
                id="settings_last_name"
                type="text"
                className="w-full px-3 py-2 border border-slate-200 text-slate-950 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="settings_first_name" className="block text-xs font-bold text-slate-700 mb-1">Prénom</label>
              <input
                id="settings_first_name"
                type="text"
                className="w-full px-3 py-2 border border-slate-200 text-slate-950 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="settings_email" className="block text-xs font-bold text-slate-700 mb-1">Adresse email</label>
            <input
              id="settings_email"
              type="email"
              className="w-full px-3 py-2 border border-slate-200 text-slate-950 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="settings_grade" className="block text-xs font-bold text-slate-700 mb-1">Classe de Référence (Adapte le programme de révision)</label>
            <select
              id="settings_grade"
              className="w-full px-3 py-2 border border-slate-200 text-slate-950 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500"
              value={grade}
              onChange={(e) => setGrade(e.target.value as Grade)}
            >
              <option value="2nde">Seconde (2nde)</option>
              <option value="1ère">Première (1ère)</option>
              <option value="Terminale">Terminale (Tle)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/10 transition-colors flex items-center justify-center gap-1"
          >
            <Save className="h-4 w-4" /> Enregistrer les modifications
          </button>
        </form>
      </div>

      {/* Preferences & Info */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-extrabold text-slate-900 font-heading text-sm sm:text-base">Aide & Confidentialité</h3>
        
        <div className="space-y-2.5 text-xs text-slate-600 font-medium">
          <div className="flex justify-between py-2 border-b border-slate-50">
            <span>Version de l'application</span>
            <span className="font-bold text-slate-800">EduMentor MVP v1.2</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-50">
            <span>Disponibilité du serveur IA</span>
            <span className="font-bold text-emerald-600">● Opérationnel (Gemini 3.5 Flash)</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-50">
            <span>Directives réglementaires</span>
            <span className="font-bold text-slate-800">Conforme Ministère de l'Éducation CI</span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1"
        >
          <LogOut className="h-4 w-4" /> Déconnecter la session
        </button>
      </div>
    </div>
  );
}
