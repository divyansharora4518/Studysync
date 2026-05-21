// =============================================
//  StudySync — Quiz Logic (Gemini AI)
//  js/quiz.js
// =============================================

import { db, auth } from "./firebase-config.js";
import {
  doc, collection, setDoc, addDoc, onSnapshot,
  serverTimestamp, query, orderBy, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔴 APNI GEMINI API KEY YAHAN LAGAO
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"; // ⚠️ aistudio.google.com se API key lo
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_GEMINI_API_KEY";
// ── GENERATE QUIZ from Gemini ─────────────────────────────────────────────────
export async function generateQuiz({ subject, category, language, numQuestions = 5 }) {
  const lang = language === "hindi" ? "Hindi" : "English";
  const prompt = `
Generate ${numQuestions} multiple choice questions for a student studying ${subject} for ${category} exam.
Language: ${lang}
Format: Return ONLY a valid JSON array. No explanation. No markdown. No backticks.
Each object must have:
{
  "question": "question text",
  "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
  "correct": 0,   // index of correct option (0-3)
  "explanation": "why this answer is correct"
}
`;

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });
  const data = await res.json();
  const raw  = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ── SAVE QUIZ to Firestore (for group use) ────────────────────────────────────
export async function saveGroupQuiz(groupId, questions) {
  const quizRef = doc(collection(db, "groups", groupId, "quizzes"));
  await setDoc(quizRef, {
    questions,
    createdAt: serverTimestamp(),
    active: true
  });
  return quizRef.id;
}

// ── SUBMIT ANSWER & SAVE SCORE ────────────────────────────────────────────────
export async function submitQuizScore(groupId, quizId, score, total) {
  const uid  = auth.currentUser.uid;
  const snap = await getDoc(doc(db, "users", uid));
  const name = snap.data()?.name || "Anonymous";

  await setDoc(
    doc(db, "groups", groupId, "quizzes", quizId, "scores", uid),
    { uid, name, score, total, submittedAt: serverTimestamp() }
  );
}

// ── LISTEN TO LEADERBOARD ─────────────────────────────────────────────────────
export function listenToLeaderboard(groupId, quizId, callback) {
  const q = query(
    collection(db, "groups", groupId, "quizzes", quizId, "scores"),
    orderBy("score", "desc")
  );
  return onSnapshot(q, (snap) => {
    const entries = snap.docs.map((d) => d.data());
    callback(entries);
  });
}

// ── SAVE SOLO QUIZ RESULT ─────────────────────────────────────────────────────
export async function saveSoloResult(subject, category, score, total, questions) {
  const uid = auth.currentUser.uid;
  await addDoc(collection(db, "users", uid, "soloQuizzes"), {
    subject, category, score, total, questions,
    createdAt: serverTimestamp()
  });
}

// ── CREATE POLL ───────────────────────────────────────────────────────────────
export async function createPoll(groupId, question, options) {
  const uid = auth.currentUser.uid;
  const pollRef = doc(collection(db, "groups", groupId, "polls"));
  const opts = {};
  options.forEach((o, i) => { opts[i] = { text: o, votes: [] }; });
  await setDoc(pollRef, { question, options: opts, createdBy: uid, createdAt: serverTimestamp() });
  return pollRef.id;
}

// ── VOTE ON POLL ──────────────────────────────────────────────────────────────
export async function votePoll(groupId, pollId, optionIndex) {
  const uid = auth.currentUser.uid;
  const pollSnap = await getDoc(doc(db, "groups", groupId, "polls", pollId));
  const data = pollSnap.data();
  // Remove previous vote
  Object.values(data.options).forEach(o => {
    const idx = o.votes.indexOf(uid);
    if (idx > -1) o.votes.splice(idx, 1);
  });
  data.options[optionIndex].votes.push(uid);
  const { updateDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
  await updateDoc(doc(db, "groups", groupId, "polls", pollId), { options: data.options });
}
