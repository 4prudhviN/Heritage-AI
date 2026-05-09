import { useState, useRef, useEffect } from "react";
import Book from "./Book";
import LanguageSelector from "./LanguageSelector";
import { LANGUAGES } from "./i18n";
import DamageOverlay from "./DamageOverlay";
import chatbotBg from "./assets/chatbot-bg.mp4";

// ─── Animated Particle Canvas ───────
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        ctx.fillStyle = `rgba(201, 166, 70, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

export default function HeritageAI({ mode, onBack, language, setLanguage }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [output, setOutput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const [chatImage, setChatImage] = useState(null);
  const chatFileRef = useRef(null);

  // Analyze specific states
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const t = LANGUAGES[language];
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleChat = async () => {
    if (!input.trim() && !chatImage) return;
    setLoading(true);
    setError(null);
    setShowBook(false);
    setOutput("");
    
    setHistory((prev) => [...prev, { role: "user", content: input || "Sent an image" }]);
    
    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, imageBase64: chatImage, language })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setOutput(data.reply);
      setOutput(data.reply);
      setTimeout(() => {
        setShowBook(true);
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setChatImage(null);
      if (chatFileRef.current) chatFileRef.current.value = "";
    }
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setShowReport(false);
    setShowVideo(false);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setAnalysis(data);
      setShowVideo(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (output && showBook) {
      // Initial narration is handled in handleChat, but this could handle page-specific narration if needed
    }
  }, [showBook, output]);

  useEffect(() => {
    if (showReport && analysis) {
      speakText(analysis.likely_causes || analysis.description);
    }
  }, [showReport, analysis]);

  return (
    <div className="heritage-container">
      <div style={{ position: "relative", width: "100%", minHeight: "100vh", display: "flex", color: "#fff", zIndex: 1 }}>
      <ParticleCanvas />
      
      <div className="glass-sidebar">
        <div className="sidebar-logo">
          <span>🏛️ {mode === "chat" ? t.title : t.damageAnalyzer}</span>
        </div>
        <div className="sidebar-label">{t.history}</div>
        <div className="sidebar-list">
          {history.length === 0 ? (
            <div className="sidebar-empty">{t.noHistory}</div>
          ) : (
            history.map((item, i) => (
              <div key={i} className="sidebar-item">
                <span className="sidebar-item-query">
                  {item.content && item.content !== "Sent an image" 
                    ? item.content.substring(0, 20) 
                    : "🖼️ Visual Analysis"}
                </span>
                <span className="sidebar-item-time">Just now</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 10, overflowY: "auto" }}>
        <video autoPlay muted loop playsInline className="chatbot-video-bg" style={{ position: "absolute", zIndex: -1 }}>
          <source src={chatbotBg} type="video/mp4" />
        </video>
        <button className="lang-btn" onClick={onBack} style={{ left: "30px", right: "auto", top: "20px" }}>
          ← {t.back}
        </button>
        <LanguageSelector language={language} setLanguage={setLanguage} />

        <div className="premium-header">
          <div className="header-ornament">✧</div>
          <h1 className="premium-title">{mode === "chat" ? t.title : t.damageAnalyzer}</h1>
          <div className="premium-subtitle">{mode === "chat" ? t.subtitle : t.damageSubtitle}</div>
          <div className="header-line"></div>
        </div>

        {mode === "chat" && (
          <div className="glass-panel input-panel">
            {chatImage && (
              <div style={{ position: "relative", marginBottom: "15px", width: "100px" }}>
                <img src={chatImage} alt="Preview" style={{ width: "100%", borderRadius: "8px", border: "1px solid #c9a646" }} />
                <button 
                  onClick={() => setChatImage(null)}
                  style={{ position: "absolute", top: "-5px", right: "-5px", background: "red", color: "#fff", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer", fontSize: "12px" }}
                >
                  ×
                </button>
              </div>
            )}
            <div className="input-wrapper">
              <textarea
                className="premium-textarea"
                placeholder={isListening ? "Listening..." : t.placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={2}
              />
              <div className="textarea-glow"></div>
            </div>
            <div className="btn-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <button 
                  className={`mic-btn ${isListening ? "listening" : ""}`} 
                  onClick={toggleListening}
                  title="Voice Input"
                >
                  {isListening ? "🛑" : "🎤"}
                </button>
                <button 
                  className="image-btn" 
                  onClick={() => chatFileRef.current.click()}
                  title="Analyze Image"
                >
                  📷
                </button>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={chatFileRef} 
                  style={{ display: "none" }} 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setChatImage(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
              <button className="gold-btn" onClick={handleChat} disabled={loading}>
                {loading ? t.loading : t.exploreStories}
              </button>
            </div>
          </div>
        )}

        {mode === "analyze" && !showReport && !showVideo && (
          <div className="glass-panel input-panel" style={{ textAlign: "center" }}>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
            <div className="upload-label" onClick={() => fileInputRef.current.click()}>
              <span className="upload-icon">📷</span> {t.uploadLabel}
            </div>
            {previewUrl && (
              <div className="upload-confirm">
                <img src={previewUrl} alt="preview" style={{ maxHeight: "150px", borderRadius: "8px", marginTop: "10px" }} />
              </div>
            )}
            <div className="btn-row" style={{ marginTop: "20px" }}>
              <button className="gold-btn" onClick={handleAnalyze} disabled={loading || !file}>
                {loading ? "ANALYZING..." : "ANALYZE DAMAGE"}
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="glass-panel loading-panel">
            <div className="loading-orb"></div>
            <div className="loading-text">Consulting the Archives...</div>
            <div className="loading-bar-track">
              <div className="loading-bar-fill"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="glass-panel error-panel" style={{ textAlign: "center" }}>
            {error}
          </div>
        )}

        {showVideo && (
          <div className="video-overlay" style={{ position: "fixed", inset: 0, zIndex: 100, background: "black" }}>
            <video 
              className="video" 
              src="/analyze.mp4" 
              autoPlay 
              onEnded={() => { setShowVideo(false); setShowReport(true); }}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}

        {showReport && analysis && (
          <div className="report slideUp" style={{ margin: "40px auto", maxWidth: "680px", padding: "30px", background: "rgba(255,255,255,0.05)", borderLeft: "5px solid #c9a646", borderRadius: "12px", backdropFilter: "blur(10px)" }}>
            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontFamily: "Cinzel, serif", color: "#f0d98a" }}>📜 LAB REPORT</h2>
              <span className={`badge ${analysis.severity?.toLowerCase()}`}>{analysis.severity} SEVERITY</span>
            </div>
            
            <DamageOverlay src={previewUrl} boxes={analysis.boxes} />

            <div className="section" style={{ marginTop: "20px" }}>
              <h3>DAMAGE DETECTED</h3>
              <p>{analysis.damage_type || analysis.description}</p>
            </div>
            <div className="section">
              <h3>LIKELY CAUSES</h3>
              <p>{analysis.likely_causes}</p>
            </div>
            <div className="section">
              <h3>PRESERVATION ADVICE</h3>
              <p>{analysis.prevention}</p>
            </div>
            
            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <button className="outline-btn" onClick={() => { setShowReport(false); setFile(null); setPreviewUrl(null); setAnalysis(null); }}>
                ANALYZE ANOTHER
              </button>
            </div>
          </div>
        )}

        {output && !showBook && mode === "chat" && (
          <div className="glass-panel typing-panel">
            <div className="typing-header">
              <div className="typing-dot"></div>
              <span className="typing-label">Writing story...</span>
            </div>
            <div className="typing-text">
              {output.substring(0, 150)}... <span className="typing-cursor">|</span>
            </div>
          </div>
        )}

        {showBook && mode === "chat" && (
          <div className="book-reveal">
            <Book text={output} query={input} language={language} onClose={() => {
              setShowBook(false);
              window.speechSynthesis.cancel();
            }} />
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
