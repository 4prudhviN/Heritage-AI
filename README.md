# 🏛️ Heritage AI

Heritage AI is a cinematic AI-powered heritage exploration platform designed to preserve, analyze, and narrate the stories of historical monuments around the world.

The project combines:
- AI-powered storytelling
- Multilingual voice narration
- Vision-based monument understanding
- Interactive digital book UI
- Heritage-themed immersive experience

---

# 🚀 Features

## 🧠 Advanced AI Vision Analysis

- Powered by Groq Vision API
- Uses:
  `meta-llama/llama-4-scout-17b-16e-instruct`

### Capabilities
- Monument recognition
- Architectural understanding
- Heritage damage analysis
- Context-aware historical interpretation

### Strict Topic Accuracy
A custom "STRICT TOPIC" system prevents hallucinations and forces the AI to focus only on the monument requested by the user.

---

# 🎙️ Premium Voice Narration

Integrated with ElevenLabs for cinematic multilingual narration.

### Features
- Natural human-like voices
- Telugu / Hindi / Tamil / English support
- Long-story narration support
- Sequential chunk streaming
- Audiobook-style storytelling

---

# 📖 Interactive Digital Book Experience

The chatbot output is displayed as a premium animated digital heritage book.

### Includes
- Cinematic opening animation
- Story chapters
- Dynamic localized titles
- Page-by-page reveal
- Smooth transitions

---

# 🌍 Multilingual Support

The application supports:

- English
- Telugu
- Hindi
- Tamil

### Fully Localized UI
- Sidebar
- Buttons
- Upload labels
- Status messages
- Story titles
- Chapter headings

---

# 🎮 Heritage Quest Game

An AI-powered heritage runner quiz game.

### Features
- AI-generated questions
- Multiple regions & monuments
- Dynamic levels
- Combo speed boosts
- Cinematic moving backgrounds
- Monument-based maps

---

# 🛠️ Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS
- Framer Motion

## Backend
- Node.js
- Express.js

## AI Services
- Groq API
- ElevenLabs API

---

# 📁 Project Structure

```plaintext
Heritage-AI/
│
├── public/
│   ├── intro.mp4
│
├── src/
│   ├── assets/
│   │   ├── chatbot-bg.mp4
│   │
│   ├── components/
│   │   ├── Book.jsx
│   │   ├── LanguageSelector.jsx
│   │
│   ├── utils/
│   │   ├── speakLongText.js
│   │
│   ├── App.jsx
│   ├── HeritageAI.jsx
│   ├── Game.jsx
│   ├── i18n.js
│   ├── index.css
│
├── server.js
├── .env
├── package.json
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/4prudhviN/Heritage-ai.git
```

---

## 2️⃣ Install Dependencies

### Frontend

```bash
npm install
```

### Backend

```bash
npm install express cors dotenv openai multer
```

---

# 🔑 Environment Variables

Create a `.env` file in the root folder.

```env
GROQ_API_KEY=your_groq_api_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

---

# ▶️ Running the Project

## Start Frontend

```bash
npm run dev
```

Frontend:
```plaintext
http://localhost:5175/
```

---

## Start Backend

```bash
node server.js
```

Backend:
```plaintext
http://localhost:5000/
```

---

# 🎙️ Voice System

The narration system uses:
- Sequential chunk processing
- Auto audio queueing
- Streaming-style playback

This enables:
✅ Massive stories  
✅ 10+ chapter narration  
✅ No API cutoffs  

---

# 🌟 Major Improvements

## ✅ Vision Upgrade
Migrated to:
`Llama 4 Scout Vision`

## ✅ Stability Fixes
- Fixed upload persistence bug
- Fixed localization bleed
- Fixed API rate limit issues

## ✅ Localization Engine
Implemented:
- Dynamic regional titles
- Localized chapter generation
- Multi-language UI system

## ✅ Premium UX
- Cinematic intro
- Animated video backgrounds
- Glassmorphism UI
- Interactive heritage book

---

# 🚀 Deployment

Recommended Platforms:
- Vercel
- Netlify

---

# 🔒 Security

API keys are securely stored using:
`.env`

Never upload `.env` to GitHub.

---

# 📌 Final Status

✅ Frontend Stable  
✅ Backend Stable  
✅ Vision Working  
✅ Voice Working  
✅ Localization Working  
✅ Game Functional  

---

# 👨‍💻 Developed By

Prudhvi K

---

# ✨ Special Note

Heritage AI is designed not just as a chatbot, but as an immersive AI-powered cultural storytelling experience that combines history, cinema, interaction, and education into a single platform.
