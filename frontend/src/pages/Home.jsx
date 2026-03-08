import React from "react";

export default function Home() {
  // Mock trending data (replace with real fetch later)
  const trendingBeats = [
    { name: "Neon Pulse", creator: "@circuit.skr", likes: 125, plays: 3400, minted: true },
    { name: "808 Galaxy", creator: "@pabloretroworld", likes: 98, plays: 2800, minted: true },
    { name: "Solar Bounce", creator: "@stardrummer", likes: 77, plays: 2100, minted: false },
    { name: "Midnight Drift", creator: "@voidproducer", likes: 142, plays: 4200, minted: true },
    { name: "Chrome Dreams", creator: "@futurevibes", likes: 117, plays: 3100, minted: false },
  ];

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
      }}
    >
      {/* Hero Section */}
      <div style={{ textAlign: "center", padding: "6rem 1rem 4rem", maxWidth: 1200, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "clamp(4rem, 12vw, 8rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            background: "linear-gradient(90deg, #00f0ff, #a78bfa, #ff6bcb)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0 0 1.5rem",
            textShadow: "0 0 60px rgba(0, 240, 255, 0.5)",
          }}
        >
          CIRCUIT
        </h1>

        <p
          style={{
            fontSize: "clamp(1.4rem, 4vw, 2rem)",
            maxWidth: 800,
            margin: "0 auto 3rem",
            opacity: 0.9,
            lineHeight: 1.5,
          }}
        >
          The mobile-native DAW for Solana. Create beats, remix on-chain, mint NFTs, earn royalties, all in your pocket.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          <button
            onClick={goToStudio}
            style={{
              padding: "16px 48px",
              fontSize: "1.4rem",
              fontWeight: 700,
              background: "linear-gradient(90deg, #00f0ff, #a78bfa)",
              border: "none",
              borderRadius: 50,
              color: "#000",
              cursor: "pointer",
              boxShadow: "0 0 40px rgba(0, 240, 255, 0.6)",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Start Creating Now
          </button>
        </div>
      </div>

      {/* Mock Stats - makes it feel live */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          flexWrap: "wrap",
          margin: "4rem 0",
          fontSize: "1.3rem",
          textAlign: "center",
        }}
      >
        <div>
          <strong style={{ color: "#00f0ff", fontSize: "2rem" }}>5,200+</strong>
          <br />
          Beats Created
        </div>
        <div>
          <strong style={{ color: "#00f0ff", fontSize: "2rem" }}>1,800+</strong>
          <br />
          Active Creators
        </div>
        <div>
          <strong style={{ color: "#00f0ff", fontSize: "2rem" }}>12,400+</strong>
          <br />
          SOL in Royalties
        </div>
      </div>

      {/* Trending Teaser */}
      <div style={{ maxWidth: 1200, margin: "0 auto 6rem", padding: "0 1rem" }}>
        <h2
          style={{
            fontSize: "2.8rem",
            textAlign: "center",
            marginBottom: "2.5rem",
            color: "#00f0ff",
            textShadow: "0 0 20px rgba(0, 240, 255, 0.4)",
          }}
        >
          Trending Beats
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {trendingBeats.map((beat, index) => (
            <div
              key={index}
              style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: 16,
                padding: "1.5rem",
                border: "1px solid rgba(0, 240, 255, 0.15)",
                backdropFilter: "blur(12px)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-8px)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              onClick={goToStudio}
            >
              <h3 style={{ margin: 0, color: "#00f0ff", fontSize: "1.4rem" }}>{beat.name}</h3>
              <p style={{ opacity: 0.8, margin: "0.5rem 0" }}>by {beat.creator}</p>
              <div style={{ display: "flex", gap: "1rem", fontSize: "0.95rem" }}>
                <span>❤️ {beat.likes}</span>
                <span>▶ {beat.plays.toLocaleString()}</span>
                {beat.minted && <span style={{ color: "#a78bfa" }}>NFT Minted</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ textAlign: "center", margin: "6rem 0", padding: "0 1rem" }}>
        <h2 style={{ fontSize: "2.8rem", color: "#00f0ff", marginBottom: "1.5rem" }}>Ready to Create the Future?</h2>
        <button
          onClick={goToStudio}
          style={{
            padding: "18px 60px",
            fontSize: "1.5rem",
            background: "linear-gradient(90deg, #00f0ff, #ff6bcb)",
            border: "none",
            borderRadius: 50,
            color: "#000",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 0 50px rgba(0, 240, 255, 0.5)",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Jump to Studio →
        </button>
      </div>
    </div>
  );
}