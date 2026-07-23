import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2, BrainCircuit, AlertCircle, Trash2, HelpCircle } from "lucide-react";
import { motion } from "motion/react";
import { ChatMessage, UserProfile } from "../types";

interface AiAssistantProps {
  userProfile: UserProfile;
}

const PRESET_PROMPTS = [
  "Explique-moi la différence entre ln(x) et exp(x) 📐",
  "Donne-moi un exemple d'introduction de dissertation de philo ⚖️",
  "Quelles sont les formules indispensables de physique-chimie en Terminale ? 🧪",
  "Donne-moi des astuces méthodologiques pour réussir le BAC ivoirien 🎓"
];

export default function AiAssistantScreen({ userProfile }: AiAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "wel1",
      sender: "assistant",
      text: `Bonjour **${userProfile.firstName}** ! Je suis **EduMentor IA**, ton tuteur pédagogique personnel. 🇨🇮

Je connais parfaitement le programme officiel ivoirien de la classe de **${userProfile.grade}**. Comment puis-je t'aider aujourd'hui ? Tu peux me poser des questions sur tes cours de Maths, SVT, Physique-Chimie, Philosophie, Histoire-Géo, Français ou Anglais, ou me demander un exercice d'entraînement.`,
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isSending) return;
    setErrorMsg("");

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputValue("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ sender: m.sender, text: m.text })),
          userProfile
        })
      });

      if (!response.ok) {
        throw new Error("Impossible de joindre le tuteur IA.");
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "assistant",
        text: data.text,
        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Une erreur de réseau s'est produite.");
      
      // Educational demo mode fallback message to avoid blocking student revisions
      const fallbackMsg: ChatMessage = {
        id: "fb_" + Math.random().toString(),
        sender: "assistant",
        text: `**[Mode Démo]** Désolé, je rencontre une difficulté de connexion avec mes serveurs de calcul IA. 

Voici toutefois un conseil de révision pour le chapitre correspondant :
*   Assure-toi d'étudier la fiche de cours complète dans l'onglet **Mes Cours**.
*   Fais des séances de révision espacées de 25 minutes (méthode Pomodoro).
*   Entraîne-toi sur l'onglet **Quiz & Exercices** qui comporte des quiz interactifs déjà prêts à l'emploi !

Recommence ta saisie ou écris à nouveau s'il s'agissait d'une coupure réseau temporaire.`,
        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Es-tu sûr de vouloir effacer l'historique de cette discussion ?")) {
      setMessages([
        {
          id: "wel2",
          sender: "assistant",
          text: `Discussion effacée. Re-bonjour ${userProfile.firstName} ! De quelle notion du programme ivoirien souhaites-tu débattre maintenant ?`,
          timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }
  };

  // Simple Markdown-to-HTML parser helper for elegant display in assistant speech bubbles
  const renderMessageText = (text: string) => {
    // Simple replacements for bolding, list items, and math blocks
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*)$/gm, '• $1')
      .replace(/\n/g, '<br />');
    
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="space-y-6 font-sans h-[calc(100vh-210px)] min-h-[480px] flex flex-col justify-between">
      {/* HEADER IA */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <BrainCircuit className="h-5.5 w-5.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm sm:text-base font-black text-slate-900 font-heading">
                Tuteur IA EduMentor
              </h2>
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" title="IA en ligne"></span>
            </div>
            <p className="text-[11px] font-bold text-slate-400">
              Programme Officiel CI · Classe de {userProfile.grade}
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 transition-all"
          title="Effacer la discussion"
        >
          <Trash2 className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* CHAT MESSAGES PANEL */}
      <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => {
          const isAssistant = msg.sender === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex ${isAssistant ? "justify-start" : "justify-end"} items-start gap-2.5`}
            >
              {isAssistant && (
                <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs shrink-0 mt-1">
                  🎓
                </div>
              )}
              <div className="max-w-[85%] space-y-1">
                <div
                  className={`p-3.5 rounded-2xl text-sm border ${
                    isAssistant
                      ? "bg-white text-slate-800 border-slate-100 rounded-tl-none shadow-sm"
                      : "bg-blue-600 text-white border-transparent rounded-tr-none shadow-sm shadow-blue-500/5"
                  }`}
                >
                  <div className="prose prose-sm max-w-none text-xs sm:text-sm leading-relaxed">
                    {renderMessageText(msg.text)}
                  </div>
                </div>
                <p className={`text-[10px] font-bold text-slate-400 px-1 ${!isAssistant && "text-right"}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex justify-start items-center gap-2.5">
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs shrink-0">
              🎓
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 text-slate-500 text-xs font-bold shadow-sm flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <span>EduMentor IA réfléchit...</span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 border border-red-100 text-red-700 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0" />
            <span>Erreur : {errorMsg} (Utilisation du mode secours démo automatique)</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* QUICK SUGGESTIONS */}
      {messages.length <= 1 && (
        <div className="shrink-0 space-y-2">
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-1">
            💡 Essaye une question suggérée :
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESET_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="text-xs font-semibold bg-white hover:bg-blue-50 border border-slate-150 text-slate-600 hover:text-blue-600 px-3.5 py-2 rounded-xl text-left transition-all shadow-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* INPUT PANEL */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
        }}
        className="flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          className="flex-1 px-4 py-3 border border-slate-200 text-slate-950 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white"
          placeholder="Pose ta question sur le programme scolaire de Côte d'Ivoire..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isSending}
          className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 rounded-xl text-white transition-all shadow-md shadow-blue-500/10 flex items-center justify-center shrink-0"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </form>
    </div>
  );
}
