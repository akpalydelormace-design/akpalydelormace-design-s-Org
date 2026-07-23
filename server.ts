import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini Client Getter
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error(
      "La clé API GEMINI_API_KEY n'est pas configurée dans les secrets de l'application."
    );
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// -----------------------------------------------------------------
// API ENDPOINTS
// -----------------------------------------------------------------

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 1. CHAT ASSISTANT IA
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, userProfile } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Historique des messages invalide" });
    }

    const ai = getGeminiClient();

    // Contextual system instruction based on curriculum and user profile
    const grade = userProfile?.grade || "Terminale";
    const firstName = userProfile?.firstName || "Étudiant";
    const systemInstruction = `Tu es EduMentor, un assistant IA pédagogique et bienveillant, spécialement conçu pour les étudiants du secondaire en Côte d'Ivoire (niveaux de la 2nde à la Terminale).
L'étudiant actuel s'appelle ${firstName} et est en classe de ${grade}.
Tu dois respecter scrupuleusement le programme ivoirien 2026-2027.
Réponds toujours en français, de manière claire, concise, encourageante et structurée. Utilise des expressions pédagogiques positives ("Excellent travail !", "Courage !", "Voici une astuce...").
Utilise la notation mathématique LaTeX (ex: $x^2$ ou $$y = ax + b$$) pour les formules si nécessaire.
Encourage l'étudiant s'il fait des erreurs et donne des explications étape par étape.
Rappelle-toi de l'environnement ivoirien (exemples locaux, épreuves de BAC / BEPC de Côte d'Ivoire).`;

    // Map messages history to Gemini model content format
    const contents = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const responseText = response.text || "Désolé, je n'ai pas pu générer de réponse.";
    res.json({ text: responseText });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({
      error: error.message || "Erreur de communication avec l'assistant IA",
      isDemoFallback: !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY"
    });
  }
});

// 2. GENERATION D'EXERCICES AVEC IA
app.post("/api/exercise/generate", async (req, res) => {
  try {
    const { subject, grade, chapterTitle, difficulty } = req.body;
    if (!subject || !grade || !chapterTitle) {
      return res.status(400).json({ error: "Matière, classe et chapitre requis" });
    }

    const ai = getGeminiClient();
    const prompt = `Génère un mini-quiz d'évaluation de 3 questions sur le sujet : "${chapterTitle}" (${subject}) pour un élève en classe de ${grade} en Côte d'Ivoire.
Niveau de difficulté requis : ${difficulty || "moyen"}.
Le quiz doit inclure :
- Question 1 : De type QCM (Choix Multiples) avec 4 options.
- Question 2 : De type Vrai ou Faux.
- Question 3 : De type Texte Libre (une question conceptuelle ou de calcul où l'élève écrit sa réponse).
Propose des questions et des réponses adaptées au BAC ou examens ivoiriens, avec des explications détaillées (en français) pour chaque réponse.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Le titre du quiz généré" },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "Identifiant unique" },
                  type: { type: Type.STRING, description: "Soit 'qcm', 'vrai_faux' ou 'texte_libre'" },
                  questionText: { type: Type.STRING, description: "L'énoncé de la question" },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Liste de 4 réponses possibles pour le QCM. Laisser vide pour les autres types."
                  },
                  correctAnswer: { type: Type.STRING, description: "La bonne réponse exacte (pour QCM, mettre l'intitulé exact de l'option choisie. Pour Vrai/Faux, mettre 'Vrai' ou 'Faux')." },
                  explanation: { type: Type.STRING, description: "L'explication détaillée de la correction en français." }
                },
                required: ["id", "type", "questionText", "correctAnswer", "explanation"]
              }
            }
          },
          required: ["title", "questions"]
        }
      }
    });

    const quizData = JSON.parse(response.text.trim());
    res.json(quizData);
  } catch (error: any) {
    console.error("Gemini Exercise Generator Error:", error);
    // Graceful rich fallback in case of no API key or failure to avoid blocking user flow
    res.status(200).json({
      title: `Évaluation d'entraînement IA (${req.body.subject || "Général"})`,
      questions: [
        {
          id: "fb_1",
          type: "qcm",
          questionText: `[Mode Démo] Quelle est la méthode principale d'étude pour un chapitre de ${req.body.subject || "cette matière"} ?`,
          options: ["La mémorisation bête", "L'analyse critique et les exercices pratiques", "Ignorer les cours", "Regarder l'IA faire"],
          correctAnswer: "L'analyse critique et les exercices pratiques",
          explanation: "La réussite au BAC en Côte d'Ivoire repose sur la compréhension en profondeur des notions et la pratique assidue d'anciens sujets d'examen."
        },
        {
          id: "fb_2",
          type: "vrai_faux",
          questionText: "[Mode Démo] Les annales de Côte d'Ivoire sont indispensables pour préparer l'examen.",
          correctAnswer: "Vrai",
          explanation: "S'entraîner sur des sujets réels permet de s'adapter aux consignes et aux exigences de notation des correcteurs."
        },
        {
          id: "fb_3",
          type: "texte_libre",
          questionText: "[Mode Démo] Donnez un conseil essentiel que vous appliqueriez pour réussir vos examens cette année.",
          correctAnswer: "La régularité",
          explanation: "La clé de l'excellence académique est le travail continu et la révision quotidienne de chaque leçon."
        }
      ],
      isFallback: true
    });
  }
});

// 3. EVALUATION DE TEXTE LIBRE PAR IA
app.post("/api/exercise/evaluate", async (req, res) => {
  const { questionText, studentAnswer, correctAnswer, explanation } = req.body || {};
  try {
    if (!questionText || studentAnswer === undefined) {
      return res.status(400).json({ error: "Éléments requis manquants pour évaluation" });
    }

    const ai = getGeminiClient();
    const prompt = `En tant qu'enseignant du secondaire en Côte d'Ivoire, évalue la réponse d'un étudiant à la question suivante :
Énoncé : "${questionText}"
Réponse de l'étudiant : "${studentAnswer}"
Bonne réponse attendue : "${correctAnswer}"
Explication officielle : "${explanation}"

Analyse si la réponse de l'étudiant est correcte (entièrement ou partiellement) ou fausse. Donne un retour constructif en français avec :
- Un verdict clair : "Correct", "Partiellement Correct", ou "Incorrect"
- Une note indicative sur 10 (un nombre entier)
- Un court commentaire explicatif personnalisé de 2-3 phrases maximum encouragant l'étudiant.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING, description: "Verdict ('Correct', 'Partiellement Correct', 'Incorrect')" },
            score: { type: Type.INTEGER, description: "Note sur 10 de l'élève" },
            feedback: { type: Type.STRING, description: "Commentaire constructif et encourageant" }
          },
          required: ["verdict", "score", "feedback"]
        }
      }
    });

    const evaluationResult = JSON.parse(response.text.trim());
    res.json(evaluationResult);
  } catch (error: any) {
    console.error("Gemini Evaluator Error:", error);
    // Graceful fallback evaluation logic
    const inputAns = studentAnswer || "";
    const score = inputAns.trim().length > 10 ? 8 : inputAns.trim().length > 3 ? 5 : 2;
    res.json({
      verdict: score >= 8 ? "Correct" : score >= 5 ? "Partiellement Correct" : "Incorrect",
      score,
      feedback: "[Mode Démo] Votre réponse a été analysée localement. Félicitations pour votre tentative ! Continuez à enrichir vos explications.",
      isFallback: true
    });
  }
});

// -----------------------------------------------------------------
// VITE OR STATIC SERVING MIDDLEWARE
// -----------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduMentor Server is listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
