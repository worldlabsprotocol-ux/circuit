import React, { useState } from "react";

export default function Royalties() {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => setNotification(null), 5000);
  };

  const comingSoon = (feature = "This feature") =>
    showNotification(`${feature} is coming soon. Thanks for checking it out.`);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(135deg, #0a0f1a 0%, #000814 100%)",
        color: "#ffffff",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "2rem 1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Notification */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: notification.isError ? "#ff4444" : "#00cc88",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            zIndex: 1000,
            maxWidth: "92%",
            textAlign: "center",
            fontWeight: 600,
            fontSize: "1rem",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          marginBottom: "1.5rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2.2rem, 6vw, 3.6rem)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            background: "linear-gradient(90deg, #00f0ff, #a78bfa, #ff6bcb)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0 0 0.8rem 0",
            textShadow: "0 0 40px rgba(0, 240, 255, 0.25)",
          }}
        >
          Royalties
        </h1>

        <div
          style={{
            fontSize: "1.05rem",
            background: "rgba(0, 240, 255, 0.08)",
            border: "1px solid rgba(0, 240, 255, 0.3)",
            borderRadius: 16,
            padding: "1rem 1.2rem",
            display: "inline-block",
            backdropFilter: "blur(10px)",
            boxShadow: "0 0 26px rgba(0, 240, 255, 0.12)",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 6 }}>
            Wallet connect, claims, and on-chain splits are coming soon.
          </div>

          <div style={{ opacity: 0.85, fontSize: "0.98rem" }}>
            Waitlist live, shipping on-chain splits next.
          </div>

          <div style={{ opacity: 0.85, fontSize: "0.98rem", marginTop: 6 }}>
            This page will show your earnings, payouts, and split history once live.
          </div>

          <div style={{ marginTop: 12 }}>
            <button
              onClick={() => comingSoon("Wallet connect")}
              style={{
                padding: "12px 22px",
                background: "linear-gradient(90deg, #00f0ff, #a78bfa)",
                color: "#000",
                border: "none",
                borderRadius: 999,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 0 22px rgba(0, 240, 255, 0.35)",
              }}
            >
              Connect (Soon)
            </button>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div
        style={{
          background: "rgba(0, 240, 255, 0.06)",
          border: "1px solid rgba(0, 240, 255, 0.25)",
          borderRadius: 20,
          padding: "2rem",
          maxWidth: 900,
          width: "100%",
          backdropFilter: "blur(16px)",
          boxShadow: "0 12px 40px rgba(0, 240, 255, 0.12)",
        }}
      >
        <h2
          style={{
            fontSize: "2.0rem",
            color: "#00f0ff",
            marginBottom: "1.25rem",
            textShadow: "0 0 18px rgba(0, 240, 255, 0.35)",
          }}
        >
          Dashboard (Coming Soon)
        </h2>

        <div
          style={{
            padding: "18px 18px",
            borderRadius: 16,
            border: "1px solid rgba(0, 240, 255, 0.22)",
            background: "rgba(0,0,0,0.25)",
            opacity: 0.9,
            textAlign: "center",
          }}
        >
          <div style={{ fontWeight: 800, color: "#00f0ff", marginBottom: 6 }}>
            No preview data shown yet
          </div>
          <div style={{ fontSize: "1rem", opacity: 0.85 }}>
            When royalties go live, you will see claimed payouts, pending balances, and split breakdowns here.
          </div>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => comingSoon("Royalties claiming")}
              style={{
                padding: "12px 18px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(0, 240, 255, 0.35)",
                borderRadius: 999,
                color: "#00f0ff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Claim (Soon)
            </button>

            <button
              onClick={() => comingSoon("Royalty splits")}
              style={{
                padding: "12px 18px",
                background: "linear-gradient(90deg, #00f0ff, #a78bfa)",
                color: "#000",
                border: "none",
                borderRadius: 999,
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 0 22px rgba(0, 240, 255, 0.25)",
              }}
            >
              Splits (Soon)
            </button>
          </div>
        </div>

        {/* Waitlist stays */}
        <div
          style={{
            marginTop: "2.5rem",
            padding: "2rem",
            background: "rgba(0, 240, 255, 0.06)",
            border: "1px solid rgba(0, 240, 255, 0.3)",
            borderRadius: 20,
            backdropFilter: "blur(16px)",
            boxShadow: "0 12px 40px rgba(0, 240, 255, 0.12)",
          }}
        >
          <h3
            style={{
              fontSize: "1.8rem",
              color: "#00f0ff",
              marginBottom: "1rem",
              textShadow: "0 0 15px rgba(0, 240, 255, 0.5)",
            }}
          >
            Join the Royalties Waitlist
          </h3>

          <p style={{ fontSize: "1.05rem", opacity: 0.9, marginBottom: "1.25rem" }}>
            Be the first to know when on-chain royalty splits, auto-payouts, and the full dashboard go live.
          </p>

          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdmp6TE_mySRDgpt40oddhvsYM-Qs58Nvdt8QgS65lOgowiGA/viewform?embedded=true"
            width="100%"
            height="900"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            title="Circuit Royalties Waitlist"
            style={{
              borderRadius: 16,
              background: "rgba(0,0,0,0.3)",
              minHeight: "600px",
            }}
          >
            Loading form...
          </iframe>

          <p style={{ marginTop: "1.25rem", fontSize: "0.95rem", opacity: 0.7 }}>
            Your data is private and will only be used for Circuit updates. Follow{" "}
            <a
              href="https://x.com/circuit808"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#00f0ff", textDecoration: "underline", fontWeight: 700 }}
            >
              @circuit808
            </a>{" "}
            for launch updates.
          </p>
        </div>
      </div>

      <footer
        style={{
          marginTop: "auto",
          padding: "3rem 0 1rem",
          fontSize: "0.95rem",
          opacity: 0.6,
          textAlign: "center",
        }}
      >
        On-chain royalty splits, automatic distribution, powered by Solana Mobile, built for independent artists
      </footer>
    </div>
  );
}