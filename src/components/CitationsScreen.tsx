import React, { useState, useEffect } from "react";
import { Quote, Search, Filter, Sparkles, Loader2, Plus, Copy, Check, Trash2, Heart } from "lucide-react";
import { getStoredCitations, saveCitations, Citation } from "../lib/storage";

interface CitationsScreenProps {
  userProfile: any;
}

export default function CitationsScreen({ userProfile }: CitationsScreenProps) {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // AI custom generator
  const [userMood, setUserMood] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCitation, setGeneratedCitation] = useState<Citation | null>(null);

  // Load from storage
  useEffect(() => {
    setCitations(getStoredCitations());
  }, []);

  // Filter
  const filteredCitations = citations.filter((c) => {
    const matchesSearch =
      c.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "Tous" || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ["Tous", "Général", "Mathématiques", "Philosophie", "Physique-Chimie", "Littérature"];

  const handleCopyQuote = (c: Citation) => {
    navigator.clipboard.writeText(`"${c.text}" — ${c.author}`);
    setCopiedId(c.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateAiQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMood.trim()) return;

    setIsGenerating(true);
    setGeneratedCitation(null);

    try {
      const prompt = `Génère une citation de motivation scolaire ou philosophique unique en français.
Le contexte de l'élève est : "${userMood}". Il est en classe de ${userProfile.grade} en Côte d'Ivoire.
La citation doit être inspirante, profonde, digne d'un grand auteur classique ou d'un enseignant bienveillant.
Renvoie un format JSON contenant exclusivement l'auteur ("author"), le texte de la citation ("text") et la catégorie ("category").`;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ sender: "user", text: prompt }],
          userProfile: { firstName: userProfile.firstName, grade: userProfile.grade }
        })
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      
      // Attempt to parse JSON from chat output
      let parsed = { text: "", author: "", category: "Inspiration" };
      try {
        const text = data.text;
        const jsonMatch = text.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          parsed = {
            text: text.replace(/["']/g, "").split("—")[0] || text,
            author: text.split("—")[1] || "EduMentor IA",
            category: "Général"
          };
        }
      } catch {
        parsed = {
          text: data.text,
          author: "EduMentor IA",
          category: "Général"
        };
      }

      const newQuote: Citation = {
        id: "ai_q_" + Math.random().toString(36).substring(2, 9),
        text: parsed.text || "La constance et la persévérance sont les clés de toutes les victoires académiques.",
        author: parsed.author || "Sagesse EduMentor",
        category: parsed.category || "Général"
      };

      setGeneratedCitation(newQuote);
    } catch {
      // Fallback
      setGeneratedCitation({
        id: "ai_fb_q",
        text: "Le succès n'est pas la clé du bonheur. Le bonheur est la clé du succès. Si vous aimez ce que vous faites, vous réussirez.",
        author: "Albert Schweitzer",
        category: "Général"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveGenerated = () => {
    if (!generatedCitation) return;
    const updated = [generatedCitation, ...citations];
    setCitations(updated);
    saveCitations(updated);
    setGeneratedCitation(null);
    setUserMood("");
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-3xl font-black font-heading text-slate-900 tracking-tight">💫 Citations & Philosophie de Réussite</h1>
        <p className="text-slate-500 font-medium mt-1">
          Découvre des paroles inspirantes de philosophes, scientifiques et mathématiciens pour booster ton mental d'acier avant les examens.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column (2 cols wide): Citations list, search, filter */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
            
            {/* Search and filter tools */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher une citation ou un auteur..."
                  className="w-full pl-9 pr-4 py-2 border-2 border-slate-900 rounded-xl text-xs bg-white focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-1 overflow-x-auto pb-1 max-w-full sm:max-w-xs shrink-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-black rounded-lg border-2 transition-all shrink-0 cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Citations Grid */}
            <div className="space-y-4">
              {filteredCitations.length === 0 ? (
                <p className="text-slate-400 text-xs italic text-center py-6">Aucune citation trouvée.</p>
              ) : (
                filteredCitations.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)] relative flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <Quote className="h-8 w-8 text-blue-200 shrink-0" />
                      <p className="text-xs sm:text-sm font-black text-slate-900 leading-relaxed italic">
                        "{item.text}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                      <div>
                        <span className="text-[10px] font-black text-slate-500">— {item.author}</span>
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-[8px] font-black rounded uppercase">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => handleCopyQuote(item)}
                          className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all shrink-0 cursor-pointer"
                          title="Copier la citation"
                        >
                          {copiedId === item.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right column: AI Quote Generator */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-1.5 font-heading">
                <Sparkles className="h-5 w-5 text-indigo-500 fill-indigo-100" />
                Inspirateur Mental IA
              </h3>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Besoin d'un boost moral ? Décris ton état d'esprit et laisse l'IA formuler ta citation personnalisée.
              </p>
            </div>

            <form onSubmit={handleGenerateAiQuote} className="space-y-3">
              <div>
                <label htmlFor="user_mood" className="block text-xs font-black text-slate-600 mb-1">
                  Comment te sens-tu aujourd'hui ?
                </label>
                <textarea
                  id="user_mood"
                  required
                  rows={2}
                  className="w-full p-3 border-2 border-slate-900 rounded-xl text-xs font-semibold focus:outline-none"
                  placeholder="Ex: Fatigué avant le devoir de SVT, stressé pour l'épreuve de philo..."
                  value={userMood}
                  onChange={(e) => setUserMood(e.target.value)}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Création philosophique en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Générer ma citation IA
                  </>
                )}
              </button>
            </form>

            {/* Display newly generated quote */}
            {generatedCitation && (
              <div className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-2xl space-y-3">
                <p className="text-xs italic font-semibold text-indigo-950 leading-relaxed">
                  "{generatedCitation.text}"
                </p>
                <p className="text-[10px] font-black text-indigo-700 text-right">— {generatedCitation.author}</p>
                <button
                  onClick={handleSaveGenerated}
                  className="w-full py-1.5 bg-white hover:bg-indigo-100 text-indigo-700 text-xs font-black rounded-lg border border-indigo-300 transition-colors cursor-pointer"
                >
                  ➕ Enregistrer dans mes inspirations
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
