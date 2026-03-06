import { useEffect } from "react";

export default function Home() {
  const isMobile = window.innerWidth < 900;

  useEffect(() => {
    const loadParticles = async () => {
      await import("https://cdn.jsdelivr.net/npm/@tsparticles/engine@3/tsparticles.engine.min.js");
      await import("https://cdn.jsdelivr.net/npm/tsparticles-preset-stars@3/tsparticles.preset.stars.min.js");

      window.tsParticles.load("tsparticles", {
        preset: "stars",
        background: { color: { value: "transparent" } },
        particles: {
          number: { value: isMobile ? 40 : 80 },
          move: { speed: isMobile ? 0.4 : 0.6 },
        },
        detectRetina: true,
      });
    };

    loadParticles().catch(console.error);

    return () => {
      window.tsParticles?.domItem(0)?.destroy();
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(135deg, #0a001f 0%, #000814 100%)",
        color: "#ffffff",
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Particles */}
      <div
        id="tsparticles"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Hero */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "1.5rem" : "2rem",
          textAlign: "center",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: isMobile ? "3.2rem" : "7rem",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            background:
              "linear-gradient(90deg, #00f0ff, #a78bfa, #ff6bcb, #00f0ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "1.2rem",
          }}
        >
          CIRCUIT
        </h1>

        <p
          style={{
            fontSize: isMobile ? "1.1rem" : "1.8rem",
            maxWidth: "780px",
            marginBottom: "2rem",
            lineHeight: 1.5,
            opacity: 0.92,
          }}
        >
          Create, collaborate, and monetize on Solana with instant on-chain
          royalty splits. The operating system for modern artists.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "1.2rem",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "2.5rem",
            width: "100%",
          }}
        >
          <a
            href="/circuit"
            style={{
              padding: isMobile ? "16px 32px" : "18px 56px",
              fontSize: isMobile ? "1.1rem" : "1.35rem",
              fontWeight: 700,
              background: "linear-gradient(90deg, #00f0ff, #00aaff)",
              color: "#000",
              borderRadius: 50,
              textDecoration: "none",
              boxShadow: "0 0 35px rgba(0, 240, 255, 0.6)",
              width: isMobile ? "100%" : "auto",
              textAlign: "center",
            }}
          >
            Enter Circuit Studio →
          </a>

          <a
            href="https://x.com/circuit808"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: isMobile ? "16px 32px" : "18px 48px",
              fontSize: isMobile ? "1.1rem" : "1.35rem",
              fontWeight: 700,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(0,240,255,0.45)",
              color: "#00f0ff",
              borderRadius: 50,
              textDecoration: "none",
              width: isMobile ? "100%" : "auto",
              textAlign: "center",
            }}
          >
            Follow @circuit808
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          position: "relative",
          zIndex: 1,
          padding: "1rem",
          background: "rgba(0,0,0,0.6)",
          borderTop: "1px solid rgba(0,240,255,0.15)",
          fontSize: "0.9rem",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div>Powered by Solana</div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <a href="/docs" style={{ color: "#00f0ff" }}>Docs</a>
          <a href="https://x.com/circuit808" style={{ color: "#00f0ff" }}>
            Twitter/X
          </a>
          <a href="#" style={{ color: "#00f0ff" }}>Discord</a>
          <a href="#" style={{ color: "#00f0ff" }}>GitHub</a>
        </div>
      </footer>
    </div>
  );
}