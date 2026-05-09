export default function DamageOverlay({ src, boxes }) {
  return (
    <div className="img-wrap" style={{ position: "relative", display: "inline-block", width: "100%" }}>
      <img src={src} alt="Analyzed Heritage" style={{ width: "100%", borderRadius: "8px", display: "block" }} />
      {boxes && boxes.map((b, i) => (
        <div
          key={i}
          className="bbox"
          style={{
            position: "absolute",
            border: "2px solid red",
            backgroundColor: "rgba(255, 0, 0, 0.2)",
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: `${b.width}%`,
            height: `${b.height}%`,
            boxSizing: "border-box"
          }}
        />
      ))}
    </div>
  );
}
