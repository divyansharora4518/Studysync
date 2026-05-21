// =============================================
//  StudySync — Firebase Configuration
//  ⚠️  STEP 1: Apna Firebase config yahan paste karo
//  Guide: https://console.firebase.google.com/
// =============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth }        from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore }   from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage }     from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// 🔴 YAHAN APNA FIREBASE CONFIG PASTE KARO
// Firebase Console → Project Settings → Your apps → SDK setup → Config
const firebaseConfig = {
  apiKey: "AIzaSyDIRELnO2ZJARyJMgaxfDjLmkHwKxUaX8o",
  authDomain: "studysync-66b1d.firebaseapp.com",
  projectId: "studysync-66b1d",
  storageBucket: "studysync-66b1d.firebasestorage.app",
  messagingSenderId: "661532906619",
  appId: "1:661532906619:web:908038c62adedb78eabede",
  measurementId: "G-LHFT14VXQ3"
};

const app     = initializeApp(firebaseConfig);
const auth    = getAuth(app);
const db      = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
