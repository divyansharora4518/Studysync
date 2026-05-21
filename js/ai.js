// =============================================
//  StudySync — AI Chat / Doubt Solver
//  js/ai.js  (uses Gemini API)
// =============================================

// 🔴 APNI GEMINI API KEY YAHAN LAGAO
const GEMINI_API_KEY = "AIzaSyBlOwi71dheWwZ7YttUlkg9dvo0wAYXbeg"; 
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyBlOwi71dheWwZ7YttUlkg9dvo0wAYXbeg";
let history = [];

// ── ASK AI (with conversation context) ───────────────────────────────────────
export async function askAI(userMessage, systemContext = "") {
  history.push({ role: "user", parts: [{ text: userMessage }] });

  const systemPrompt = systemContext || `
You are StudySync AI — a friendly, knowledgeable study assistant for Indian students.
You help with JEE, NEET, and NCERT subjects (Maths, Physics, Chemistry, Biology).
Answer in the same language the student uses (Hindi or English).
Keep answers clear, step-by-step, and encouraging.
Use simple examples to explain concepts.
`;

  const payload = {
    systemInstruction: { parts: [{ text: systemPrompt }] }, 
    contents: history
  };

  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const textData = await res.text(); 
    
    if (!res.ok) {
        console.error("API Error Details:", textData);
        throw new Error("Error status: " + res.status);
    }

    const data = JSON.parse(textData);
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, kuch galat ho gaya. Try again!";

    history.push({ role: "model", parts: [{ text: reply }] });
    return reply;
    
  } catch (error) {
    console.error("AI Fetch Error:", error);
    history.pop(); 
    return "Sorry, API connect nahi ho paayi. Apna browser console check karo!";
  }
}

// ── EXPLAIN QUIZ SOLUTION ─────────────────────────────────────────────────────
export async function explainSolution(question, correctAnswer, language = "english") {
  const lang = language === "hindi" ? "Hindi mein samjhao" : "Explain in English";
  const prompt = `${lang}:
Question: ${question}
Correct Answer: ${correctAnswer}
Provide a clear, step-by-step explanation that a student can easily understand.`;

  return askAI(prompt, `You are a subject expert helping students understand quiz solutions. Be clear and concise.`);
}

// ── SUMMARIZE TOPIC ───────────────────────────────────────────────────────────
export async function summarizeTopic(topic, subject, language = "english") {
  const lang = language === "hindi" ? "Hindi mein" : "in English";
  const prompt = `${lang} briefly summarize the topic "${topic}" for ${subject}. Include key points, formulas if any, and a quick tip to remember.`;
  history = []; // fresh context
  return askAI(prompt);
}

// ── RESET CONVERSATION ────────────────────────────────────────────────────────
export function resetChat() {
  history = [];
}
