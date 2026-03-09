import React from "react";

export default function Home() {
  const goToStudio = () => {
    // Works with HashRouter routes like "/studio" which become "#/studio"
    window.location.hash = "#/studio";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0f1a 0%, #000814 100%)",
        color: "#ffffff",
        padding: "2rem 1rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          width: "100%",
          maxWidth: 900,
          margin: "0 auto",
          padding: "5rem 1rem 4rem",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(4rem, 12vw, 8rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            background: "linear-gradient(90deg, #00f0ff, #a78bfa, #ff6bcb)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0 0 1.2rem",
            textShadow: "0 0 60px rgba(0, 240, 255, 0.5)",
          }}
        >
          CIRCUIT
        </h1>

        <p
          style={{
            fontSize: "clamp(1.3rem, 4vw, 1.9rem)",
            maxWidth: 720,
            margin: "0 auto 1.6rem",
            opacity: 0.92,
            lineHeight: 1.5,
          }}
        >
          Make a beat in 30 seconds on your phone.
        </p>

        <h2
          style={{
            fontSize: "clamp(2.0rem, 6vw, 2.8rem)",
            color: "#00f0ff",
            margin: "0 0 1.2rem",
            textShadow: "0 0 18px rgba(0, 240, 255, 0.35)",
          }}
        >
          Ready to Create the Future?
        </h2>

        <button
          onClick={goToStudio}
          style={{
            padding: "18px 60px",
            fontSize: "1.5rem",
            background: "linear-gradient(90deg, #00f0ff, #ff6bcb)",
            border: "none",
            borderRadius: 50,
            color: "#000",
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 0 50px rgba(0, 240, 255, 0.5)",
            transition: "all 0.3s ease",
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Jump to Studio →
        </button>

        <div
          style={{
            marginTop: 14,
            fontSize: "0.98rem",
            opacity: 0.75,
          }}
        >
          No wallet needed to create. Minting and royalties ship next.
        </div>
      </div>
    </div>
  );
}