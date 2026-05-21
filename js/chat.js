// =============================================
//  StudySync — Chat Logic (1-on-1 & Group)
//  js/chat.js
// =============================================

import { db, auth, storage } from "./firebase-config.js";
import {
  collection, doc, setDoc, addDoc, onSnapshot,
  query, orderBy, serverTimestamp, getDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// ── GENERATE CHAT ROOM ID (for 1-on-1) ────────────────────────────────────────
export function getChatRoomId(uid1, uid2) {
  return [uid1, uid2].sort().join("_");
}

// ── SEND MESSAGE ──────────────────────────────────────────────────────────────
export async function sendMessage(roomId, text, type = "text") {
  const uid  = auth.currentUser.uid;
  const snap = await getDoc(doc(db, "users", uid));
  const me   = snap.data();

  await addDoc(collection(db, "chats", roomId, "messages"), {
    uid, senderName: me.name, text, type,
    createdAt: serverTimestamp()
  });

  // Update last message in room doc
  await setDoc(doc(db, "chats", roomId), {
    lastMessage: text,
    updatedAt:   serverTimestamp(),
    members: [uid]
  }, { merge: true });
}

// ── SEND FILE (image or document) ─────────────────────────────────────────────
export async function sendFile(roomId, file) {
  const uid     = auth.currentUser.uid;
  const fileRef = ref(storage, `chat_files/${roomId}/${Date.now()}_${file.name}`);
  await uploadBytes(fileRef, file);
  const url  = await getDownloadURL(fileRef);
  const type = file.type.startsWith("image/") ? "image" : "file";
  await sendMessage(roomId, url, type);
  return url;
}

// ── LISTEN TO MESSAGES ────────────────────────────────────────────────────────
export function listenToMessages(roomId, callback) {
  const q = query(
    collection(db, "chats", roomId, "messages"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(msgs);
  });
}

// ── GROUP: CREATE GROUP ───────────────────────────────────────────────────────
export async function createGroup(groupData) {
  const uid  = auth.currentUser.uid;
  const snap = await getDoc(doc(db, "users", uid));
  const me   = snap.data();

  const groupRef = doc(collection(db, "groups"));
  await setDoc(groupRef, {
    ...groupData,
    createdBy: uid,
    creatorName: me.name,
    members: [uid],
    subject: me.subject,
    language: me.language,
    category: me.category,
    createdAt: serverTimestamp()
  });
  return groupRef.id;
}

// ── GROUP: JOIN GROUP ─────────────────────────────────────────────────────────
export async function joinGroup(groupId) {
  const uid = auth.currentUser.uid;
  const ref_ = doc(db, "groups", groupId);
  const snap = await getDoc(ref_);
  if (!snap.exists()) return false;
  const members = snap.data().members || [];
  if (!members.includes(uid)) {
    await updateDoc(ref_, { members: [...members, uid] });
  }
  return true;
}

// ── GROUP: SEND MESSAGE ───────────────────────────────────────────────────────
export async function sendGroupMessage(groupId, text, type = "text") {
  return sendMessage(`group_${groupId}`, text, type);
}

// ── GROUP: SEND FILE ──────────────────────────────────────────────────────────
export async function sendGroupFile(groupId, file) {
  return sendFile(`group_${groupId}`, file);
}

// ── GROUP: LISTEN MESSAGES ────────────────────────────────────────────────────
export function listenGroupMessages(groupId, callback) {
  return listenToMessages(`group_${groupId}`, callback);
}
