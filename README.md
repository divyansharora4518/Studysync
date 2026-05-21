# 📚 StudySync — AI-Powered Study Companion for Indian Students

> JEE • NEET • NCERT ke liye ek smart study platform — AI quizzes, real-time chat, group study rooms, aur past papers sab ek jagah!

![StudySync Banner](https://img.shields.io/badge/StudySync-AI%20Study%20Platform-6C4EFF?style=for-the-badge)
![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%7C%20Auth%20%7C%20Storage-FFCA28?style=for-the-badge&logo=firebase)
![Gemini AI](https://img.shields.io/badge/Gemini%20AI-2.5%20Flash-4285F4?style=for-the-badge&logo=google)
![License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)

---

## ✨ Features

| Feature                  | Description                                                           |
| ------------------------ | --------------------------------------------------------------------- |
| 🧠 **AI Solo Quiz**      | Gemini AI se personalized MCQ questions — JEE, NEET, NCERT ke liye    |
| 👥 **Group Quiz**        | Doston ke saath real-time competitive quiz                            |
| 💬 **1-on-1 Chat**       | Matching students ke saath direct messaging (file/image support)      |
| 🏆 **Leaderboard**       | Group quiz ke baad live score ranking                                 |
| 📄 **Past Papers**       | JEE/NEET ke previous year questions browser mein                      |
| 🤖 **AI Doubt Solver**   | Quiz ke baad directly AI se doubts clear karo                         |
| 🔍 **Smart Matchmaking** | Subject, language, aur category ke basis pe study partners milte hain |
| 🌐 **Hindi + English**   | Dono languages mein quiz aur AI responses                             |

---

## 🛠️ Tech Stack

- **Frontend** — Pure HTML, CSS, Vanilla JavaScript (no framework)
- **Backend / Database** — Firebase Firestore (real-time DB)
- **Authentication** — Firebase Auth (Email/Password)
- **File Storage** — Firebase Storage
- **AI Engine** — Google Gemini 2.5 Flash API
- **Hosting** — GitHub Pages

---

## 📁 Project Structure

```
studysync/
├── index.html                  # Landing / Home page
├── css/
│   └── style.css               # Global stylesheet
├── js/
│   ├── firebase-config.js      # Firebase initialization (apni keys daalo)
│   ├── auth.js                 # Login, Register, Auth guard
│   ├── quiz.js                 # Quiz generation (Gemini) + Firestore save
│   ├── ai.js                   # AI chat / doubt solver
│   ├── chat.js                 # 1-on-1 & group messaging
│   └── matchmaking.js          # Smart peer matching
├── quiz/
│   ├── solo-quiz.html          # AI solo quiz page
│   └── quiz_feature.html       # Group quiz room
├── chat/
│   └── chat.html               # 1-on-1 chat UI
├── past-paper/
│   └── past-paper.html         # Past papers browser
└── README.md
```

---

## ⚙️ Setup & Installation

### 1. Repository Clone karo

```bash
git clone https://github.com/YOUR_USERNAME/Studysync.git
cd Studysync
```

### 2. Firebase Setup

1. [Firebase Console](https://console.firebase.google.com/) pe jao
2. New project banao → **StudySync**
3. Yeh services enable karo:
   - **Authentication** → Email/Password sign-in enable karo
   - **Firestore Database** → Production mode mein banao
   - **Storage** → Default rules ke saath banao
4. Project Settings → Your apps → Web app add karo
5. Apna config copy karo aur `js/firebase-config.js` mein paste karo

### 3. Gemini API Key Setup

1. [Google AI Studio](https://aistudio.google.com/) pe jao
2. **Get API Key** pe click karo
3. Apni key `js/quiz.js` aur `js/ai.js` mein paste karo

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

## 🔒 Security — Zaroori Padho

> ⚠️ **Apni API keys kabhi bhi directly GitHub pe mat daalo!**

Is project ko clone karne ke baad:

- `js/firebase-config.js` mein apna Firebase config daalo
- `js/quiz.js` aur `js/ai.js` mein apni Gemini API key daalo
- Yeh files `.gitignore` mein add karo taaki galti se push na ho

**`.gitignore` banao aur yeh likho:**

```
# Sensitive config files
js/firebase-config.js
js/quiz.js
js/ai.js
```

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

> _"Padhai mushkil hai, lekin sahi tools ho toh aasan ho jaati hai."_

**StudySync** — Akele ya saath mein, hum saath padhte hain! 🎯

