// =============================================
//  StudySync — Auth Logic
//  js/auth.js
// =============================================

import { auth, db, storage } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc, setDoc, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// ── REGISTER ──────────────────────────────────────────────────────────────────
export async function registerUser({ name, email, password, location, language, category, subject, imageFile }) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid  = cred.user.uid;

    let photoURL = "";
    if (imageFile) {
      const imgRef = ref(storage, `avatars/${uid}`);
      await uploadBytes(imgRef, imageFile);
      photoURL = await getDownloadURL(imgRef);
    }

    await setDoc(doc(db, "users", uid), {
      uid, name, email, location, language, category, subject,
      photoURL, online: true, createdAt: serverTimestamp()
    });

    return { success: true, uid };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
export async function loginUser(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ── LOGOUT ────────────────────────────────────────────────────────────────────
export async function logoutUser() {
  const uid = auth.currentUser?.uid;
  if (uid) {
    const { updateDoc, doc: dRef } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    await updateDoc(doc(db, "users", uid), { online: false });
  }
  await signOut(auth);
  window.location.href = "../index.html";
}

// ── GET CURRENT USER PROFILE ──────────────────────────────────────────────────
export async function getCurrentUserProfile() {
  const user = auth.currentUser;
  if (!user) return null;
  const snap = await getDoc(doc(db, "users", user.uid));
  return snap.exists() ? snap.data() : null;
}

// ── AUTH GUARD ────────────────────────────────────────────────────────────────
export function requireAuth(redirectTo = "../auth/login.html") {
  onAuthStateChanged(auth, (user) => {
    if (!user) window.location.href = redirectTo;
  });
}

// ── REDIRECT IF LOGGED IN ──────────────────────────────────────────────────────
export function redirectIfLoggedIn(redirectTo = "../dashboard/dashboard.html") {
  onAuthStateChanged(auth, (user) => {
    if (user) window.location.href = redirectTo;
  });
}
