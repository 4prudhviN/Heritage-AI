import { forwardRef, useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";

const CHARS_PER_PAGE = 700; // optimized for full pages without overflow

// ── Cover page ──
const CoverPage = forwardRef(({ title }, ref) => (
  <div ref={ref} className="page-outer" data-density="hard">
    <div className="cover-page">
      <div className="cover-border">
        <svg className="cover-floral" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="48" cy="52" r="30" fill="none" stroke="#c9a646" strokeWidth="2.5"/>
          <circle cx="48" cy="52" r="24" fill="rgba(201,166,70,0.15)" stroke="#c9a646" strokeWidth="1"/>
          <text x="48" y="58" textAnchor="middle" fill="#c9a646" fontSize="18" fontFamily="serif">✦</text>
          <path d="M75 30 Q110 10 160 5 Q180 3 195 8" fill="none" stroke="#c9a646" strokeWidth="1.5" opacity="0.8"/>
          <path d="M78 35 Q120 20 170 18 Q185 17 195 22" fill="none" stroke="#c9a646" strokeWidth="1" opacity="0.6"/>
          <ellipse cx="100" cy="14" rx="8" ry="4" fill="#c9a646" opacity="0.7" transform="rotate(-20,100,14)"/>
          <ellipse cx="125" cy="9" rx="7" ry="3.5" fill="#c9a646" opacity="0.6" transform="rotate(-10,125,9)"/>
          <ellipse cx="150" cy="7" rx="6" ry="3" fill="#c9a646" opacity="0.5" transform="rotate(5,150,7)"/>
          <ellipse cx="175" cy="10" rx="5" ry="2.5" fill="#c9a646" opacity="0.5" transform="rotate(15,175,10)"/>
          <ellipse cx="110" cy="22" rx="7" ry="3" fill="#c9a646" opacity="0.5" transform="rotate(-15,110,22)"/>
          <ellipse cx="140" cy="20" rx="6" ry="3" fill="#c9a646" opacity="0.4" transform="rotate(5,140,20)"/>
          <path d="M30 80 Q15 120 20 170 Q22 185 18 195" fill="none" stroke="#c9a646" strokeWidth="1.5" opacity="0.7"/>
          <ellipse cx="18" cy="110" rx="4" ry="8" fill="#c9a646" opacity="0.5" transform="rotate(10,18,110)"/>
          <ellipse cx="22" cy="140" rx="4" ry="7" fill="#c9a646" opacity="0.4" transform="rotate(-10,22,140)"/>
          <ellipse cx="17" cy="165" rx="3" ry="6" fill="#c9a646" opacity="0.4" transform="rotate(5,17,165)"/>
          <circle cx="90" cy="40" r="2" fill="#c9a646" opacity="0.6"/>
          <circle cx="115" cy="35" r="1.5" fill="#c9a646" opacity="0.5"/>
          <circle cx="140" cy="32" r="1.5" fill="#c9a646" opacity="0.5"/>
        </svg>
        <div className="cover-title-block">
          <h2 className="cover-title">{title}</h2>
          <div className="cover-divider" />
          <p className="cover-sub">Heritage AI Guardian</p>
        </div>
      </div>
    </div>
  </div>
));
CoverPage.displayName = "CoverPage";

// ── Content page ──
const ContentPage = forwardRef(({ label, text, pageNum, totalPages }, ref) => (
  <div ref={ref} className="page-outer">
    <div className="page-inner">
      <div className="page-worn-top" />
      {label && <p className="page-label">{label}</p>}
      <div className="page-text">
        <p>{text}</p>
      </div>
      <p className="page-pagenum">— {pageNum} —</p>
      <div className="page-worn-bottom" />
    </div>
  </div>
));
ContentPage.displayName = "ContentPage";

// ── Monument SVG Paths ──
const getMonumentSVG = (query) => {
  const q = query.toLowerCase();
  if (q.includes("taj mahal")) {
    return (
      <g className="pulse-shape" transform="translate(50, 50) scale(0.5)" fill="none" stroke="#c9a646" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {/* Main Dome */}
        <path d="M100 20 C100 20 60 70 60 110 C60 120 70 130 100 130 C130 130 140 120 140 110 C140 70 100 20 100 20 Z" />
        {/* Main Building */}
        <rect x="50" y="130" width="100" height="50" />
        {/* Main Arch */}
        <path d="M75 180 L75 145 A25 25 0 0 1 125 145 L125 180" />
        {/* Left Minaret */}
        <rect x="10" y="70" width="16" height="110" />
        <path d="M10 70 L18 50 L26 70 Z" />
        <line x1="5" y1="105" x2="31" y2="105" />
        <line x1="5" y1="140" x2="31" y2="140" />
        {/* Right Minaret */}
        <rect x="174" y="70" width="16" height="110" />
        <path d="M174 70 L182 50 L190 70 Z" />
        <line x1="169" y1="105" x2="195" y2="105" />
        <line x1="169" y1="140" x2="195" y2="140" />
        {/* Side Domes */}
        <path d="M50 110 C50 110 30 130 50 130 Z" />
        <path d="M150 110 C150 110 170 130 150 130 Z" />
        {/* Base */}
        <rect x="-10" y="180" width="220" height="10" />
      </g>
    );
  }
  if (q.includes("pyramid") || q.includes("giza") || q.includes("egypt")) {
    return (
      <g className="pulse-shape" transform="translate(50, 70) scale(0.5)" fill="none" stroke="#c9a646" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="100,10 20,130 180,130" />
        <line x1="100" y1="10" x2="130" y2="130" />
        <line x1="80" y1="40" x2="115" y2="40" />
        <line x1="60" y1="70" x2="140" y2="70" />
        <line x1="40" y1="100" x2="160" y2="100" />
        <polygon points="160,60 120,130 200,130" />
        <line x1="160" y1="60" x2="175" y2="130" />
      </g>
    );
  }
  if (q.includes("eiffel") || q.includes("paris") || q.includes("france")) {
    return (
      <g className="pulse-shape" transform="translate(60, 40) scale(0.6)" fill="none" stroke="#c9a646" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M70 10 L70 0" />
        <path d="M65 40 L75 40 L70 10 Z" />
        <path d="M55 100 L85 100 L75 40 L65 40 Z" />
        <path d="M35 200 L105 200 L85 100 L55 100 Z" />
        <path d="M45 200 Q70 150 95 200" />
        <line x1="50" y1="100" x2="90" y2="100" />
        <line x1="60" y1="40" x2="80" y2="40" />
        <line x1="65" y1="40" x2="85" y2="100" />
        <line x1="75" y1="40" x2="55" y2="100" />
        <line x1="55" y1="100" x2="105" y2="200" />
        <line x1="85" y1="100" x2="35" y2="200" />
      </g>
    );
  }
  if (q.includes("colosseum") || q.includes("rome") || q.includes("italy")) {
    return (
      <g className="pulse-shape" transform="translate(45, 75) scale(0.55)" fill="none" stroke="#c9a646" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="100" cy="40" rx="90" ry="20" />
        <path d="M10 40 L10 110 Q100 140 190 110 L190 40" />
        <path d="M10 75 Q100 105 190 75" />
        <path d="M150 45 L150 25 L120 25 L120 40" />
        <path d="M100 40 L100 20 L70 20 L70 35" />
        <path d="M30 75 L30 55 A10 10 0 0 1 50 55 L50 75" />
        <path d="M70 82 L70 62 A10 10 0 0 1 90 62 L90 82" />
        <path d="M110 82 L110 62 A10 10 0 0 1 130 62 L130 82" />
        <path d="M150 75 L150 55 A10 10 0 0 1 170 55 L170 75" />
        <path d="M30 105 L30 85 A10 10 0 0 1 50 85 L50 108" />
        <path d="M70 115 L70 95 A10 10 0 0 1 90 95 L90 120" />
        <path d="M110 115 L110 95 A10 10 0 0 1 130 95 L130 120" />
        <path d="M150 105 L150 85 A10 10 0 0 1 170 85 L170 108" />
      </g>
    );
  }
  if (q.includes("liberty") || q.includes("statue") || q.includes("york")) {
    return (
       <g className="pulse-shape" transform="translate(60, 40) scale(0.6)" fill="none" stroke="#c9a646" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="40" y="160" width="60" height="40" />
        <rect x="30" y="200" width="80" height="10" />
        <path d="M50 160 C50 100 60 70 70 70 C80 70 90 100 90 160 Z" />
        <path d="M80 90 L100 40 L110 40" />
        <path d="M100 40 L95 20 L115 20 L110 40 Z" />
        <path d="M100 20 Q105 0 110 20" fill="#c9a646" />
        <circle cx="70" cy="55" r="15" />
        <path d="M55 50 L45 40 M60 45 L55 30 M70 40 L70 25 M80 45 L85 30 M85 50 L95 40" />
        <path d="M60 100 L45 110 L45 130" />
        <rect x="35" y="115" width="10" height="20" transform="rotate(-20 40 120)" />
      </g>
    );
  }
  if (q.includes("ben") || q.includes("london") || q.includes("uk")) {
     return (
      <g className="pulse-shape" transform="translate(60, 30) scale(0.6)" fill="none" stroke="#c9a646" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="50" y="80" width="40" height="140" />
        <rect x="45" y="60" width="50" height="20" />
        <polygon points="45,60 70,10 95,60" />
        <circle cx="70" cy="110" r="15" />
        <line x1="70" y1="110" x2="70" y2="100" />
        <line x1="70" y1="110" x2="78" y2="110" />
        <line x1="55" y1="140" x2="85" y2="140" />
        <line x1="55" y1="170" x2="85" y2="170" />
        <line x1="55" y1="200" x2="85" y2="200" />
      </g>
    );
  }

  // Generic Parthenon / Temple Fallback
  return (
    <g className="pulse-shape" transform="translate(40, 70) scale(0.6)" fill="none" stroke="#c9a646" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="100,20 10,70 190,70" />
      <line x1="100" y1="20" x2="100" y2="70" />
      <line x1="55" y1="45" x2="55" y2="70" />
      <line x1="145" y1="45" x2="145" y2="70" />
      <rect x="20" y="70" width="160" height="10" />
      <rect x="30" y="80" width="15" height="70" />
      <rect x="65" y="80" width="15" height="70" />
      <rect x="100" y="80" width="15" height="70" />
      <rect x="135" y="80" width="15" height="70" />
      <rect x="170" y="80" width="15" height="70" />
      <rect x="10" y="150" width="180" height="15" />
      <rect x="5" y="165" width="190" height="15" />
    </g>
  );
};

// ── Architectural Blueprint Page (static, no animation) ──
const BlueprintPage = forwardRef(({ query }, ref) => (
  <div ref={ref} className="page-outer">
    <div className="page-inner image-page" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div className="page-worn-top" />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '320px' }}>
        <div style={{ position: 'relative', width: '260px', height: '260px' }}>
          {/* Outer static dashed circle */}
          <svg className="blueprint-svg" viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <circle cx="100" cy="100" r="90" fill="none" stroke="#c9a646" strokeWidth="2" strokeDasharray="10 15" />
          </svg>
          {/* Inner static dashed circle */}
          <svg className="blueprint-svg" viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <circle cx="100" cy="100" r="75" fill="none" stroke="#c9a646" strokeWidth="1" strokeDasharray="5 5" />
          </svg>
          {/* Monument + crosshair lines */}
          <svg className="blueprint-svg" viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <line x1="100" y1="10" x2="100" y2="190" stroke="#c9a646" strokeWidth="1" strokeDasharray="4 4" opacity="0.35" />
            <line x1="10" y1="100" x2="190" y2="100" stroke="#c9a646" strokeWidth="1" strokeDasharray="4 4" opacity="0.35" />
            {getMonumentSVG(query)}
          </svg>
          {/* Label */}
          <div style={{ position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', width: '200%' }}>
            <p style={{ fontFamily: "'Cinzel', serif", color: "#3b2510", fontSize: "14px", letterSpacing: "3px", margin: 0 }}>{query.toUpperCase()}</p>
            <p style={{ fontFamily: "'Cinzel', serif", color: "#8b6b4a", fontSize: "9px", letterSpacing: "4px", margin: "5px 0 0 0", textTransform: 'uppercase' }}>Visualization</p>
          </div>
        </div>
      </div>

      <p className="page-pagenum" style={{ marginTop: 'auto' }}>— Architectural Plan —</p>
      <div className="page-worn-bottom" />
    </div>
  </div>
));
BlueprintPage.displayName = "BlueprintPage";

const BackCoverPage = forwardRef(({ onClose }, ref) => (
  <div ref={ref} className="page-outer" data-density="hard" onClick={onClose} style={{ cursor: 'pointer' }}>
    <div className="back-cover-page">
      <div className="back-cover-spine" />
      <div className="back-cover-scuffs" />
      <div style={{ 
        position: 'absolute', 
        bottom: '40px', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        color: 'rgba(201,166,70,0.4)', 
        fontFamily: "'Cinzel', serif", 
        fontSize: '10px', 
        letterSpacing: '3px',
        whiteSpace: 'nowrap'
      }}>
        TAP TO CLOSE
      </div>
    </div>
  </div>
));
BackCoverPage.displayName = "BackCoverPage";

// ── Cinematic Image Page ──
const ImagePage = forwardRef(({ query, imageUrl }, ref) => (
  <div ref={ref} className="page-outer">
    <div className="page-inner image-page" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div className="page-worn-top" />
      
      {imageUrl ? (
        <div className="cinematic-image-container">
          <img src={imageUrl} alt={query} className="cinematic-image" crossOrigin="anonymous" />
        </div>
      ) : (
        <div className="cinematic-image-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.1)' }}>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: "14px", color: "rgba(139,107,74,0.5)", animation: "pulseScale 2s infinite alternate" }}>Searching Archives...</span>
        </div>
      )}

      <div style={{ padding: "20px", textAlign: "center", borderTop: "1px solid rgba(139,107,74,0.3)", marginTop: "20px", width: "80%" }}>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: "18px", color: "#3b2510", marginBottom: "8px" }}>
          {query.toUpperCase()}
        </p>
        <p style={{ fontSize: "10px", color: "#8b6b4a", letterSpacing: "2px", textTransform: "uppercase" }}>
          Historical Archive
        </p>
      </div>

      <p className="page-pagenum" style={{ marginTop: 'auto' }}>— Illustration —</p>
      <div className="page-worn-bottom" />
    </div>
  </div>
));
ImagePage.displayName = "ImagePage";



// Parse AI response into full pages without empty half-pages
function parseIntoPages(text, query) {
  // Replace headers with inline bold-like markers so text flows continuously
  const cleanText = text
    .replace(/\[TITLE\]\s*\n?.*?\n/i, '')
    .replace(/\*+/g, '')
    .replace(/✦ (.*?) ✦/g, '\n\n$1\n\n');

  // Filter out empty words entirely to guarantee no empty pages
  const words = cleanText.split(/\s+/).filter(w => w.trim().length > 0);
  const allPages = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).length > CHARS_PER_PAGE && current.length > 0) {
      allPages.push({ type: 'text', text: current.trim(), label: "" });
      current = word;
    } else {
      current += (current ? " " : "") + word;
    }
  }
  if (current.trim()) {
    allPages.push({ type: 'text', text: current.trim(), label: "" });
  }

  return allPages;
}

export default function Book({ text, query = "Heritage Site", language = "en-US", onClose }) {
  const bookRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Track title
  const titleMatch = text.match(/\[TITLE\]\s*\n?(.*)/i);
  const title = titleMatch ? titleMatch[1].trim() : "Heritage Story";

  // Build all pages
  const pages = parseIntoPages(text, query);
  let totalPages = pages.length + 1; // +1 for cover

  // Ensure total pages is even for the flipbook
  if (totalPages % 2 !== 0) {
    pages.push({ type: 'text', text: "The End", label: "" });
    totalPages += 1;
  }

  // Track page flip
  const handleFlip = (e) => {
    const idx = e.data;
    setCurrentPage(idx);
  };

  return (
    <div className="book-scene">
      <div className="book-wrapper">
        <HTMLFlipBook
          ref={bookRef}
          width={420}
          height={540}
          size="fixed"
          showCover={true}
          mobileScrollSupport={true}
          onFlip={handleFlip}
          flippingTime={900}
          usePortrait={false}
          startZIndex={10}
          className="book-flip"
        >
          {/* Front Cover */}
          <CoverPage title={title} />

          {/* Content pages */}
          {pages.map((page, i) => (
            <ContentPage
              key={i}
              label={page.label}
              text={page.text}
              pageNum={i + 1}
              totalPages={totalPages}
            />
          ))}

          {/* Back Cover — dark worn leather */}
          <BackCoverPage onClose={onClose} />
        </HTMLFlipBook>
      </div>

      <p className="book-hint">← drag or click page edges to turn →</p>
    </div>
  );
}
