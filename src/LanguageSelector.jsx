import { useState, useRef, useEffect } from "react";
import { LANGUAGES } from "./i18n";

export default function LanguageSelector({ language, setLanguage }) {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target))
        setShowLangMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const t = LANGUAGES[language];

  return (
    <div
      ref={langRef}
      style={{ position: "absolute", top: "20px", right: "24px", zIndex: 100 }}
    >
      <button
        onClick={() => setShowLangMenu((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 16px",
          background: "rgba(60,35,10,0.7)",
          border: "1px solid rgba(201,166,70,0.6)",
          borderRadius: "20px",
          color: "#f5d27a",
          fontFamily: "'Cinzel', serif",
          fontSize: "12px",
          letterSpacing: "1px",
          cursor: "pointer",
          backdropFilter: "blur(6px)",
        }}
      >
        {t.flag} {t.label} ▼
      </button>

      {/* Dropdown */}
      {showLangMenu && (
        <div
          style={{
            position: "absolute",
            top: "44px",
            right: 0,
            background: "rgba(40,22,5,0.97)",
            border: "1px solid rgba(201,166,70,0.4)",
            borderRadius: "12px",
            overflow: "hidden",
            minWidth: "160px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          {Object.entries(LANGUAGES).map(([code, lang]) => (
            <button
              key={code}
              onClick={() => { setLanguage(code); setShowLangMenu(false); }}
              style={{
                width: "100%",
                padding: "12px 20px",
                background: language === code ? "rgba(201,166,70,0.15)" : "transparent",
                border: "none",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                color: language === code ? "#f5d27a" : "rgba(255,255,255,0.7)",
                fontFamily: "'Cinzel', serif",
                fontSize: "13px",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(201,166,70,0.1)"}
              onMouseLeave={(e) => e.currentTarget.style.background = language === code ? "rgba(201,166,70,0.15)" : "transparent"}
            >
              {lang.flag} {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
