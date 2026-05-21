// =============================================
//  StudySync — Matchmaking Logic
//  js/matchmaking.js
// =============================================

import { db, auth } from "./firebase-config.js";
import {
  collection, query, where, onSnapshot, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── FIND MATCHING USERS (live listener) ───────────────────────────────────────
// Returns an unsubscribe function. Calls callback(users[]) on every change.
export function listenToMatchingUsers(myProfile, callback) {
  const q = query(
    collection(db, "users"),
    where("subject",  "==", myProfile.subject),
    where("language", "==", myProfile.language),
    where("category", "==", myProfile.category),
    where("online",   "==", true)
  );

  return onSnapshot(q, (snap) => {
    const users = [];
    snap.forEach((d) => {
      if (d.id !== auth.currentUser?.uid) users.push(d.data());
    });
    callback(users);
  });
}

// ── FIND MATCHING GROUPS ──────────────────────────────────────────────────────
export function listenToMatchingGroups(myProfile, callback) {
  const q = query(
    collection(db, "groups"),
    where("subject",  "==", myProfile.subject),
    where("language", "==", myProfile.language),
    where("category", "==", myProfile.category)
  );

  return onSnapshot(q, (snap) => {
    const groups = [];
    snap.forEach((d) => groups.push({ id: d.id, ...d.data() }));
    callback(groups);
  });
}

// ── ONE-TIME FETCH (for solo quiz check) ──────────────────────────────────────
export async function hasMatchingUsers(myProfile) {
  const q = query(
    collection(db, "users"),
    where("subject",  "==", myProfile.subject),
    where("language", "==", myProfile.language),
    where("online",   "==", true)
  );
  const snap = await getDocs(q);
  return snap.size > 1; // >1 means others exist besides self
}
