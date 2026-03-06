import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import LoopBrowser from "../components/LoopBrowser";
import EffectsRack from "../components/EffectsRack";
import CommentSection from "../components/CommentSection";
import RecordRTC from 'recordrtc';
import * as Tone from 'tone';
import { generatePattern } from '../audio/AIAssist';

// Real audio URLs for previewing samples
const sampleAudioUrls = {
  "Kick 808": "https://assets.codepen.io/605876/808-kick.mp3",
  "Snare Tight": "https://assets.codepen.io/605876/808-snare.mp3",
  "HiHat Trap": "https://assets.codepen.io/605876/808-hihat-closed.mp3",
  "Sub Bass": "https://assets.codepen.io/605876/808-sub-bass.mp3",
  "Pluck Melody": "https://assets.codepen.io/605876/pluck-melody-short.mp3",
};

function createNoiseBuffer(ctx, duration) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

export default function Circuit() {
  /* ================= CORE STATE ================= */
  const [bpm, setBpm] = useState(120);
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playStep, setPlayStep] = useState(0);
  const [darkMode, setDarkMode] = useState(true);

  const [tracks, setTracks] = useState(
    Array.from({ length: 8 }, () => Array(16).fill(false))
  );

  const [tracksMeta, setTracksMeta] = useState(
    Array.from({ length: 8 }, (_, i) => ({
      name: `Track ${i + 1}`,
      volume: 0.8,
      pan: 0,
      mute: false,
      solo: false,
      assignedSample: null,
    }))
  );

  const anySoloOn = useMemo(() => {
    return tracksMeta.some(t => t.solo);
  }, [tracksMeta]);

  const [selectedSample, setSelectedSample] = useState(null);
  const [shareLink, setShareLink] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [forkInfo, setForkInfo] = useState(null);

  /* ================= EFFECTS STATE ================= */
  const [reverbWet, setReverbWet] = useState(0.3);
  const [delayWet, setDelayWet] = useState(0.2);

  const [reverbOn, setReverbOn] = useState(true);
  const [delayOn, setDelayOn] = useState(true);
  const [eqLow, setEqLow] = useState(0);
  const [eqMid, setEqMid] = useState(0);
  const [eqHigh, setEqHigh] = useState(0);
  const [compressAmount, setCompressAmount] = useState(0.3);
  const [filterCutoff, setFilterCutoff] = useState(800);
  const [distortionAmount, setDistortionAmount] = useState(0.2);
  const [masterGain, setMasterGain] = useState(1);

  /* ================= UNDO / REDO ================= */
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  /* ================= CHAT ================= */
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  /* ================= RECORDING ================= */
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [showRecordOverlay, setShowRecordOverlay] = useState(false);
  const [monitorBeat, setMonitorBeat] = useState(true);

  /* ================= DRAWING ================= */
  const [isDrawing, setIsDrawing] = useState(false);

  /* ================= SAVED SESSIONS & SOCIAL ================= */
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('circuit_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [likesMap, setLikesMap] = useState({});
  const [followingMap, setFollowingMap] = useState({});
  const [selectedCreator, setSelectedCreator] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const schedulerRef = useRef(null);

  // ================= AUDIO ENGINE =================
  const audioEngine = useRef(null);

  const initAudio = async () => {
    if (audioEngine.current) return;

    await Tone.start();
    console.log("Tone started, context state:", Tone.context.state);

    const reverb = new Tone.Reverb({ decay: 2, wet: reverbWet });
    const delay = new Tone.FeedbackDelay("8n", delayWet);

    reverb.connect(delay);
    delay.toDestination();

    audioEngine.current = {
      reverb,
      delay,
      kick: new Tone.MembraneSynth().connect(reverb),
      snare: new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.001, decay: 0.15, sustain: 0 }
      }).connect(reverb),
      hat: new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.001, decay: 0.05, sustain: 0 }
      }).connect(reverb),
      bass: new Tone.Synth({ oscillator: { type: "sine" } }).connect(reverb),
      melody: new Tone.Synth({ oscillator: { type: "triangle" } }).connect(reverb),
    };

    console.log("Audio engine initialized with Tone.js instruments");
  };

  // Unlock on first gesture
  useEffect(() => {
    const unlock = async () => {
      try {
        await Tone.start();
      } catch (err) {
        console.warn("Tone unlock failed:", err);
      }
    };

    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });

    return () => {
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, []);

  // Metronome using Tone
  function playTick() {
    if (!audioEngine.current) return;

    const tick = new Tone.Synth({
      oscillator: { type: "square" },
      envelope: { attack: 0.001, decay: 0.05 }
    }).connect(audioEngine.current.reverb);

    tick.triggerAttackRelease("C6", "16n");
    setTimeout(() => tick.dispose(), 100);
  }

  // Play sound using Tone instruments
  function playSound(trackIndex) {
    if (!audioEngine.current) return;

    const meta = tracksMeta[trackIndex];
    if (meta.mute) return;
    if (anySoloOn && !meta.solo) return;

    const engine = audioEngine.current;

    if (trackIndex === 0) engine.kick.triggerAttackRelease("C1", "8n");
    else if (trackIndex === 1) engine.snare.triggerAttackRelease("16n");
    else if (trackIndex === 2) engine.hat.triggerAttackRelease("32n");
    else if (trackIndex === 3) engine.bass.triggerAttackRelease("C2", "8n");
    else {
      const notes = ["C4", "D4", "E4", "G4", "A4"];
      const note = notes[Math.floor(Math.random() * notes.length)];
      engine.melody.triggerAttackRelease(note, "8n");
    }
  }

  // Scheduler
  useEffect(() => {
    if (!isPlaying) {
      if (schedulerRef.current) clearInterval(schedulerRef.current);
      return;
    }

    const interval = (60000 / bpm) / 4;

    schedulerRef.current = setInterval(() => {
      setPlayStep(prev => {
        const next = (prev + 1) % 16;
        if (metronomeOn && next % 4 === 0) playTick();
        tracks.forEach((track, i) => {
          if (track[next]) playSound(i);
        });
        return next;
      });
    }, interval);

    return () => clearInterval(schedulerRef.current);
  }, [isPlaying, bpm, metronomeOn, tracks, tracksMeta, anySoloOn]);

  // Grid interaction – improved pointer handling
  function toggleStep(trackIndex, stepIndex) {
    setTracks(prev => {
      const newTracks = prev.map((row, i) =>
        i === trackIndex
          ? row.map((cell, j) => (j === stepIndex ? !cell : cell))
          : row
      );

      const newHistory = history.slice(0, historyIndex + 1);
      setHistory([...newHistory, newTracks]);
      setHistoryIndex(newHistory.length);

      return newTracks;
    });
  }

  function handlePointerDown(trackIndex, stepIndex, e) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    toggleStep(trackIndex, stepIndex);
  }

  function handlePointerEnter(trackIndex, stepIndex) {
    if (!isDrawing) return;
    toggleStep(trackIndex, stepIndex);
  }

  function handlePointerUp(e) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDrawing(false);
  }

  // Sample preview (unchanged)
  const previewSample = (sampleName) => {
    const url = sampleAudioUrls[sampleName];
    if (!url) return;
    const audio = new Audio(url);
    audio.currentTime = 0;
    audio.volume = 0.7;
    audio.play().catch(e => console.log("Preview play error:", e));
  };

  // ... all your other functions remain completely unchanged ...
  // handleToggleRecord, cleanupAfterRecord, handleSaveBeat, handleLoadBeat,
  // handleExport, handleShareSession, handleForkSession, handleRemix,
  // handleClear, handleAIGenerate, getBotReply, controlBtn, stepStyle

  /* ================= UI ================= */
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: window.innerWidth < 900 ? "column" : "row",
        padding: window.innerWidth < 900 ? 12 : 24,
        gap: 16,
        minHeight: "100dvh",
        overflowY: "auto",
        background: darkMode ? "#0b0f14" : "#f5f5f5",
        color: darkMode ? "#ffffff" : "#111111",
      }}
      onMouseUp={handlePointerUp}
      onTouchEnd={handlePointerUp}
    >
      {/* RECORDING OVERLAY – unchanged */}
      {isRecording && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            color: "#00ffff",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 20, animation: "pulse 1.5s infinite" }}>
            RECORDING...
          </div>
          <div style={{ fontSize: 24, marginBottom: 30 }}>
            {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, "0")}
          </div>
          <div style={{ width: 200, height: 8, background: "rgba(0,255,255,0.2)", borderRadius: 4, overflow: "hidden", marginBottom: 40 }}>
            <div style={{ width: "60%", height: "100%", background: "#ff4444", borderRadius: 4 }} />
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <button style={controlBtn} onClick={() => setMonitorBeat(p => !p)}>
              Monitor Beat: {monitorBeat ? "ON" : "OFF"}
            </button>
            <button
              style={{ ...controlBtn, background: "rgba(255,0,0,0.4)", borderColor: "#ff4444" }}
              onClick={handleToggleRecord}
            >
              STOP
            </button>
          </div>
        </div>
      )}

      {/* POST-RECORDING OVERLAY – unchanged */}
      {showRecordOverlay && recordedUrl && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001,
            color: "#00ffff",
            padding: 20,
          }}
        >
          <h2 style={{ marginBottom: 20 }}>Recording Complete</h2>
          <audio controls src={recordedUrl} style={{ marginBottom: 30, width: "80%", maxWidth: 400 }} />
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <button style={controlBtn} onClick={() => { alert("Added to samples"); cleanupAfterRecord(); }}>
              Keep Full
            </button>
            <button style={controlBtn} onClick={() => { alert("Chopped & added"); cleanupAfterRecord(); }}>
              Chop & Add
            </button>
            <button style={{ ...controlBtn, background: "rgba(100,100,100,0.4)" }} onClick={cleanupAfterRecord}>
              Discard
            </button>
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR – unchanged except sample assignment logic kept as-is */}
      <div style={{ width: window.innerWidth < 900 ? "100%" : 240 }}>
        <div
          style={{
            border: "1px solid rgba(0,255,255,0.15)",
            borderRadius: 14,
            padding: 16,
            background: "rgba(0,255,255,0.04)"
          }}
        >
          <h3 style={{ color: "#00ffff", marginBottom: 16 }}>Samples</h3>
          {["Kick 808", "Snare Tight", "HiHat Trap", "Sub Bass", "Pluck Melody"].map(sample => (
            <div
              key={sample}
              onClick={() => {
                setSelectedSample(sample);
                const updated = [...tracksMeta];
                updated[0].assignedSample = sample; // your original logic
                setTracksMeta(updated);
                previewSample(sample);
              }}
              style={{
                padding: "8px 10px",
                marginBottom: 8,
                borderRadius: 10,
                cursor: "pointer",
                background: selectedSample === sample ? "rgba(0,255,255,0.25)" : "rgba(255,255,255,0.05)",
                border: "1px solid rgba(0,255,255,0.25)",
                transition: "all 0.15s ease",
                fontSize: 13
              }}
            >
              {sample}
            </div>
          ))}
        </div>
      </div>

      {/* CENTER - Sequencer */}
      <div style={{ flex: 1 }}>
        {/* Transport Bar – updated Play button to init audio */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 20,
          padding: 12,
          borderRadius: 14,
          background: "rgba(0,255,255,0.04)",
          border: "1px solid rgba(0,255,255,0.15)"
        }}>
          <button
            onClick={async () => {
              if (!audioEngine.current) {
                await initAudio();
              }
              if (Tone.context.state !== "running") {
                await Tone.context.resume();
              }
              setIsPlaying(prev => !prev);
            }}
            style={{
              padding: "10px 18px",
              borderRadius: 10,
              fontWeight: 600,
              border: "1px solid #00ffff",
              background: isPlaying ? "rgba(0,255,255,0.3)" : "transparent",
              color: "#00ffff",
              cursor: "pointer",
              boxShadow: isPlaying ? "0 0 15px rgba(0,255,255,0.5)" : "none",
              transition: "all 0.2s ease"
            }}
          >
            {isPlaying ? "■ Stop" : "▶ Play"}
          </button>

          <button
            onClick={() => setMetronomeOn(p => !p)}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid rgba(0,255,255,0.4)",
              background: metronomeOn ? "rgba(0,255,255,0.3)" : "transparent",
              color: "#00ffff",
              cursor: "pointer",
              fontSize: 12
            }}
          >
            {metronomeOn ? "● Metronome" : "Metronome"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#00ffff", fontSize: 13 }}>BPM</span>
            <input
              type="number"
              value={bpm}
              min="60"
              max="200"
              onChange={e => setBpm(+e.target.value)}
              style={{
                width: 60,
                padding: 4,
                background: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(0,255,255,0.4)",
                color: "#00ffff",
                borderRadius: 6
              }}
            />
            <input
              type="range"
              min="60"
              max="200"
              value={bpm}
              onChange={e => setBpm(+e.target.value)}
              style={{ width: 120 }}
            />
          </div>

          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button style={controlBtn} onClick={handleRemix}>Remix</button>
            <button style={controlBtn} onClick={handleClear}>Clear</button>
            <button style={controlBtn} onClick={handleSaveBeat}>Save</button>
            <button style={controlBtn} onClick={handleExport}>Export</button>
          </div>
        </div>

        {/* Grid - Tracks */}
        {tracks.map((track, trackIndex) => {
          const meta = tracksMeta[trackIndex];

          return (
            <div
              key={trackIndex}
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 10,
                padding: 6,
                borderRadius: 10,
                background: meta.solo ? "rgba(0,255,255,0.08)" : "transparent",
                transition: "all 0.2s ease"
              }}
            >
              {/* Track controls – unchanged */}
              <div style={{ width: 110, marginRight: 8, fontSize: 10, opacity: 0.9 }}>
                <div
                  style={{
                    marginBottom: 4,
                    color: meta.solo ? "#00ffff" : "white",
                    fontWeight: meta.solo ? 700 : 400
                  }}
                >
                  {meta.name}
                </div>

                <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                  <button
                    onClick={() => {
                      const updated = [...tracksMeta];
                      updated[trackIndex].mute = !meta.mute;
                      setTracksMeta(updated);
                    }}
                    style={{
                      flex: 1,
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "4px 0",
                      borderRadius: 6,
                      border: "1px solid rgba(0,255,255,0.5)",
                      background: meta.mute ? "#ff3b3b" : "rgba(0,255,255,0.08)",
                      color: meta.mute ? "#fff" : "#00ffff",
                      cursor: "pointer"
                    }}
                  >
                    M
                  </button>

                  <button
                    onClick={() => {
                      const updated = [...tracksMeta];
                      updated[trackIndex].solo = !meta.solo;
                      setTracksMeta(updated);
                    }}
                    style={{
                      flex: 1,
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "4px 0",
                      borderRadius: 6,
                      border: "1px solid rgba(0,255,255,0.5)",
                      background: meta.solo ? "#00ffff" : "rgba(0,255,255,0.08)",
                      color: meta.solo ? "#000" : "#00ffff",
                      cursor: "pointer"
                    }}
                  >
                    S
                  </button>
                </div>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={meta.volume}
                  onChange={(e) => {
                    const updated = [...tracksMeta];
                    updated[trackIndex] = {
                      ...updated[trackIndex],
                      volume: parseFloat(e.target.value)
                    };
                    setTracksMeta(updated);
                  }}
                  style={{ width: "100%", marginBottom: 4 }}
                />

                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.01"
                  value={meta.pan}
                  onChange={(e) => {
                    const updated = [...tracksMeta];
                    updated[trackIndex] = {
                      ...updated[trackIndex],
                      pan: parseFloat(e.target.value)
                    };
                    setTracksMeta(updated);
                  }}
                  style={{ width: "100%" }}
                />
              </div>

              {/* Steps – FIXED responsiveness */}
              <div style={{ display: "flex", gap: 4, flex: 1 }}>
                {track.map((step, stepIndex) => (
                  <div
                    key={stepIndex}
                    onPointerDown={(e) => handlePointerDown(trackIndex, stepIndex, e)}
                    onPointerEnter={(e) => handlePointerEnter(trackIndex, stepIndex, e)}
                    onPointerUp={(e) => handlePointerUp(e)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: step ? "#00ffff" : "rgba(255,255,255,0.08)",
                      border:
                        isPlaying && playStep === stepIndex
                          ? "2px solid #ffffff"
                          : "1px solid rgba(0,255,255,0.2)",
                      boxShadow: step ? "0 0 12px rgba(0,255,255,0.6)" : "none",
                      transition: "all 0.08s ease",
                      cursor: "pointer",
                      touchAction: "none",
                      userSelect: "none",
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}

        <CommentSection sessionId="circuit-session" />
      </div>

      {/* RIGHT - Effects – unchanged */}
      <div style={{ width: window.innerWidth < 900 ? "100%" : 260 }}>
        <EffectsRack
          reverbWet={reverbWet} setReverbWet={setReverbWet}
          delayWet={delayWet} setDelayWet={setDelayWet}
          reverbOn={reverbOn} setReverbOn={setReverbOn}
          delayOn={delayOn} setDelayOn={setDelayOn}
          eqLow={eqLow} setEqLow={setEqLow}
          eqMid={eqMid} setEqMid={setEqMid}
          eqHigh={eqHigh} setEqHigh={setEqHigh}
          compressAmount={compressAmount} setCompressAmount={setCompressAmount}
          filterCutoff={filterCutoff} setFilterCutoff={setFilterCutoff}
          distortionAmount={distortionAmount} setDistortionAmount={setDistortionAmount}
          masterGain={masterGain} setMasterGain={setMasterGain}
        />
      </div>

      {/* SOCIAL FEED – unchanged */}
      <div
        style={{
          width: window.innerWidth < 900 ? "100%" : 300,
          border: "1px solid rgba(0,255,255,0.15)",
          borderRadius: 14,
          padding: 16,
          maxHeight: window.innerWidth < 900 ? "none" : 420,
          overflowY: window.innerWidth < 900 ? "visible" : "auto",
        }}
      >
        <h3 style={{ color: "#00ffff" }}>Trending</h3>
        {[
          { id: 1, name: "Neon Pulse", creator: "circuit.skr", likes: 124 },
          // ... your other trending items ...
          { id: 12, name: "Static Horizon", creator: "glitchmode.skr", likes: 128 },
        ].map((track) => (
          <div
            key={track.id}
            style={{
              marginBottom: 12,
              padding: 12,
              borderRadius: 12,
              border: "1px solid rgba(0,255,255,0.12)",
            }}
          >
            <div style={{ color: "#00ffff", fontWeight: 700 }}>{track.name}</div>
            <div
              style={{ fontSize: 12, cursor: "pointer" }}
              onClick={() => setSelectedCreator(track.creator)}
            >
              {track.creator}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button
                style={controlBtn}
                onClick={() =>
                  setLikesMap(prev => ({
                    ...prev,
                    [track.id]: (prev[track.id] ?? track.likes) + 1,
                  }))
                }
              >
                ❤️ {likesMap[track.id] ?? track.likes}
              </button>
              <button
                style={controlBtn}
                onClick={() =>
                  setFollowingMap(prev => ({
                    ...prev,
                    [track.id]: !prev[track.id],
                  }))
                }
              >
                {followingMap[track.id] ? "Following" : "Follow"}
              </button>
            </div>
          </div>
        ))}

        {selectedCreator && (
          <div style={{ marginTop: 20, padding: 12, border: "1px solid rgba(0,255,255,0.12)" }}>
            <h4 style={{ color: "#00ffff" }}>Creator Profile</h4>
            <div>{selectedCreator}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              Independent producer building on Circuit.
            </div>
          </div>
        )}
      </div>

      {/* Floating Chat Button – unchanged */}
      <div
        style={{
          position: "fixed",
          bottom: 80,
          right: 24,
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => setChatOpen(prev => !prev)}
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#00ffff",
            border: "3px solid #00ccff",
            cursor: "pointer",
            boxShadow: "0 0 25px cyan",
            fontSize: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          🧑‍🚀
        </button>

        {chatOpen && (
          <div
            style={{
              position: "absolute",
              bottom: 80,
              right: 0,
              width: 340,
              background: "rgba(0,0,0,0.92)",
              border: "2px solid #00ffff",
              borderRadius: 16,
              padding: 20,
              color: "#00ffff",
              boxShadow: "0 0 40px rgba(0,255,255,0.5)",
            }}
          >
            <h3>Circuit Assistant</h3>

            <div
              style={{
                maxHeight: 200,
                overflowY: "auto",
                marginBottom: 16,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    background: msg.role === "user" ? "rgba(0,255,255,0.2)" : "rgba(255,255,255,0.08)",
                    padding: "8px 12px",
                    borderRadius: 10,
                    maxWidth: "80%",
                    fontSize: 13,
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <input
              type="text"
              value={chatMessage}
              onChange={e => setChatMessage(e.target.value)}
              placeholder="Type your question..."
              style={{
                width: "100%",
                padding: 10,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid #00ffff",
                borderRadius: 8,
                color: "white",
                marginBottom: 12,
              }}
            />

            <button
              style={controlBtn}
              onClick={() => {
                if (!chatMessage.trim()) return;
                const reply = getBotReply(chatMessage);
                setChatHistory(prev => [
                  ...prev,
                  { role: "user", text: chatMessage },
                  { role: "bot", text: reply }
                ]);
                setChatMessage("");
              }}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}