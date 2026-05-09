import { useRef, useState } from "react";
import LanguageSelector from "./LanguageSelector";
import { LANGUAGES } from "./i18n";

export default function Home({ onStart, language, setLanguage }) {
  const videoRef = useRef(null);
  const [showUI, setShowUI] = useState(false);
  const t = LANGUAGES[language];

  const handleVideoEnd = () => {
    if (videoRef.current) videoRef.current.pause(); // freeze on last frame
    setTimeout(() => setShowUI(true), 300); // slight delay — feels intentional
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">

      {/* 🎬 Video — stays visible, freezes on last frame */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute w-full h-full object-cover"
        onEnded={handleVideoEnd}
        style={{ filter: "none", transform: "none" }}
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>

      {/* 🎯 UI rises from the scene */}
      {showUI && (
        <>
          {/* 🌐 Language button — top right */}
          <LanguageSelector language={language} setLanguage={setLanguage} />

          {/* 🎯 Buttons — bottom center, part of the scene */}
          <div className="button-container">
            <button className="gold-btn" onClick={() => onStart("chat")}>
              {t.exploreStories}
            </button>
          </div>
        </>
      )}

    </div>
  );
}
