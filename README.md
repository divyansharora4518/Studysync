# 📚 StudySync — AI-Powered Study Companion for Indian Students

> JEE • NEET • NCERT ke liye ek smart study platform — AI quizzes, real-time chat, group study rooms, aur past papers sab ek jagah!

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **AI Solo Quiz** | Gemini AI se personalized MCQ questions — JEE, NEET, NCERT ke liye |
| 👥 **Group Quiz** | Doston ke saath real-time competitive quiz |
| 💬 **1-on-1 Chat** | Matching students ke saath direct messaging (file/image support) |
| 🏆 **Leaderboard** | Group quiz ke baad live score ranking |
| 📄 **Past Papers** | JEE/NEET ke previous year questions browser mein |
| 🤖 **AI Doubt Solver** | Quiz ke baad directly AI se doubts clear karo |
| 🔍 **Smart Matchmaking** | Subject, language, aur category ke basis pe study partners milte hain |
| 🌐 **Hindi + English** | Dono languages mein quiz aur AI responses |

---

## 🛠️ Tech Stack

- **Frontend** — Pure HTML, CSS, Vanilla JavaScript (no framework)
- **Backend / Database** — Firebase Firestore (real-time DB)
- **Authentication** — Firebase Auth (Email/Password)
- **File Storage** — Firebase Storage
- **AI Engine** — Google Gemini 2.5 Flash API
- **Hosting** — GitHub Pages / Firebase Hosting

---

## 📁 Project Structure

```
studysync/
├── index.html              # Landing / Home page
├── css/
│   └── style.css           # Global stylesheet
├── js/
│   ├── firebase-config.js  # Firebase initialization
│   ├── auth.js             # Login, Register, Auth guard
│   ├── quiz.js             # Quiz generation (Gemini) + Firestore save
│   ├── ai.js               # AI chat / doubt solver
│   ├── chat.js             # 1-on-1 & group messaging
│   └── matchmaking.js      # Smart peer matching
├── quiz/
│   ├── solo-quiz.html      # AI solo quiz page
│   └── quiz_feature.html   # Group quiz room
├── chat/
│   └── chat.html           # 1-on-1 chat UI
├── past-paper/
│   └── past-paper.html     # Past papers browser
└── README.md
```

---

## ⚙️ Setup & Installation

### 1. Repository Clone karo

```bash
git clone https://github.com/YOUR_USERNAME/studysync.git
cd studysync
```

### 2. Firebase Setup

1. [Firebase Console](https://console.firebase.google.com/) pe jao
2. New project banao → **StudySync**
3. Yeh services enable karo:
   - **Authentication** → Email/Password sign-in enable karo
   - **Firestore Database** → Production mode mein banao
   - **Storage** → Default rules ke saath banao
4. Project Settings → Your apps → Web app add karo
5. Config copy karo aur `js/firebase-config.js` mein paste karo:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Gemini API Key Setup

1. [Google AI Studio](https://aistudio.google.com/) pe jao
2. **Get API Key** pe click karo
3. `js/quiz.js` aur `js/ai.js` mein apni key paste karo:

```javascript
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_GEMINI_API_KEY`;
```

### 4. Firestore Security Rules

Firebase Console → Firestore → Rules mein paste karo:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == uid;
    }
    match /chats/{roomId}/messages/{msgId} {
      allow read, write: if request.auth != null;
    }
    match /groups/{groupId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
      match /{subcollection}/{docId} {
        allow read, write: if request.auth != null;
      }
    }
    match /users/{uid}/soloQuizzes/{quizId} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

---

## 🚀 GitHub pe Deploy karna

### Option A — GitHub Pages (Free, Recommended)

```bash
# 1. Git initialize karo
git init
git add .
git commit -m "Initial commit: StudySync launch 🚀"

# 2. GitHub pe new repository banao (studysync naam se)
# 3. Remote add karo
git remote add origin https://github.com/YOUR_USERNAME/studysync.git
git branch -M main
git push -u origin main

# 4. GitHub → Settings → Pages → Source: main branch → Save
# 5. Tera site live ho jayega:
# https://YOUR_USERNAME.github.io/studysync/
```

### Option B — Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Public directory: . (root)
# Single page app: No
firebase deploy
```

---

## 🔒 Important — API Keys Security

> ⚠️ **Production mein API keys ko kabhi bhi directly HTML/JS files mein mat rakho!**

Proper production setup ke liye:
- Firebase Functions use karo Gemini API calls ke liye (server-side)
- Environment variables ya Firebase Remote Config use karo
- `.gitignore` mein sensitive files add karo

**`.gitignore` example:**
```
# Agar separate config file banao toh
config.local.js
.env
```

---

## 📸 Screenshots

| Solo Quiz | Group Chat | Past Papers |
|---|---|---|
| AI se questions milte hain | Real-time messaging | JEE/NEET papers |

---

## 🤝 Contributing

Pull requests welcome hain! Bade changes ke liye pehle issue open karo.

1. Fork karo
2. Feature branch banao (`git checkout -b feature/AmazingFeature`)
3. Commit karo (`git commit -m 'Add some AmazingFeature'`)
4. Push karo (`git push origin feature/AmazingFeature`)
5. Pull Request open karo

---

## 📜 License

MIT License — freely use, modify, distribute karo.

---

## 👨‍💻 Made with ❤️ for Indian Students

> *"Padhai mushkil hai, lekin sahi tools ho toh aasan ho jaati hai."*

**StudySync** — Akele ya saath mein, hum saath padhte hain! 🎯
