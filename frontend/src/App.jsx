import React, { useState, useEffect, useCallback } from "react";
import { Buffer } from "buffer";
window.Buffer = Buffer;

import Starfield from "./components/Starfield";

import Home from "./pages/Home";
import Studio from "./pages/Studio";
import Royalties from "./pages/Royalties";

const TABS = ["Explore", "Studio", "Royalties"];

// Accept: "#studio", "#Studio", "#/studio", "#/Studio"
function normalizeHashToTab(hash) {
  const raw = (hash || "").replace("#", "").trim();
  if (!raw) return null;

  const cleaned = raw.startsWith("/") ? raw.slice(1) : raw;
  const match = TABS.find((t) => t.toLowerCase() === cleaned.toLowerCase());
  return match || null;
}

function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const tab = normalizeHashToTab(window.location.hash);
    return tab || "Studio";
  });

  const goToTab = useCallback((tab) => {
    if (!TABS.includes(tab)) return;
    setActiveTab(tab);
    // write lowercase for nice URLs, App can read both
    window.location.hash = `#${tab.toLowerCase()}`;
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const tab = normalizeHashToTab(window.location.hash);
      if (tab) setActiveTab(tab);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <Starfield />

      <div style={{ position: "relative", zIndex: 2, color: "#0ff" }}>
        <header style={{ padding: "2rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "3rem" }}>CIRCUIT</h1>
        </header>

        <main style={{ padding: "1rem", paddingBottom: "5rem" }}>
          {activeTab === "Explore" && <Home goToTab={goToTab} />}
          {activeTab === "Studio" && <Studio />}
          {activeTab === "Royalties" && <Royalties />}
        </main>

        <nav
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(0,0,0,0.85)",
            borderTop: "1px solid rgba(0,255,255,0.25)",
            display: "flex",
            justifyContent: "space-around",
            padding: "12px 0",
            zIndex: 999,
            backdropFilter: "blur(8px)",
            transition: "all 0.3s ease",
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => goToTab(tab)}
              style={{
                background: activeTab === tab ? "#0ff" : "transparent",
                color: activeTab === tab ? "#000" : "#0ff",
                padding: "0.6rem 1.5rem",
                borderRadius: "20px",
                border: "none",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: activeTab === tab ? 700 : 500,
                transition: "all 0.2s ease",
                boxShadow: activeTab === tab ? "0 0 15px rgba(0,255,255,0.4)" : "none",
                transform: activeTab === tab ? "scale(1.08)" : "scale(1)",
              }}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default App;