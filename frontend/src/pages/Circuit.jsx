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

  const audioRef = useRef(null);

const initAudio = async () => {
  if (audioRef.current) return;

  await Tone.start();

  const sharedReverb = new Tone.Reverb({ decay: 2, wet: 0.3 });
  const sharedDelay = new Tone.FeedbackDelay("8n", 0.2);

  sharedReverb.connect(sharedDelay);
  sharedDelay.toDestination();

  const kick = new Tone.MembraneSynth().connect(sharedReverb);
  const snare = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.15, sustain: 0 }
  }).connect(sharedReverb);

  const hat = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.05, sustain: 0 }
  }).connect(sharedReverb);

  const bass = new Tone.Synth({ oscillator: { type: "sine" } }).connect(sharedReverb);
  const melody = new Tone.Synth({ oscillator: { type: "triangle" } }).connect(sharedReverb);

  audioRef.current = {
    sharedReverb,
    sharedDelay,
    kick,
    snare,
    hat,
    bass,
    melody
  };
};
  // Single audio context unlock
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

  // Metronome
function playTick() {
  const engine = audioRef.current;
  if (!engine) return;

  const tick = new Tone.Synth({
    oscillator: { type: "square" },
    envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 }
  }).connect(engine.sharedReverb);

  tick.triggerAttackRelease("C6", "16n");
  setTimeout(() => tick.dispose(), 200);
}

  // Play sound
 function playSound(trackIndex) {
  const engine = audioRef.current;
  if (!engine) return;

  const meta = tracksMeta[trackIndex];
  if (meta.mute) return;
  if (anySoloOn && !meta.solo) return;

  if (trackIndex === 0) return engine.kick.triggerAttackRelease("C1", "8n");
  if (trackIndex === 1) return engine.snare.triggerAttackRelease("16n");
  if (trackIndex === 2) return engine.hat.triggerAttackRelease("32n");
  if (trackIndex === 3) return engine.bass.triggerAttackRelease("C2", "8n");

  const notes = ["C4", "D4", "E4", "G4", "A4"];
  const note = notes[Math.floor(Math.random() * notes.length)];
  engine.melody.triggerAttackRelease(note, "8n");
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

  // Grid interaction
  function toggleStep(trackIndex, stepIndex) {
    setTracks((prev) => {
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

  function handlePointerDown(trackIndex, stepIndex) {
    setIsDrawing(true);
    toggleStep(trackIndex, stepIndex);
  }

  function handlePointerEnter(trackIndex, stepIndex) {
    if (!isDrawing) return;
    toggleStep(trackIndex, stepIndex);
  }

  function handlePointerUp() {
    setIsDrawing(false);
  }

  function undo() {
    if (historyIndex <= 0) return;
    setHistoryIndex(historyIndex - 1);
    setTracks(history[historyIndex - 1]);
  }

  function redo() {
    if (historyIndex >= history.length - 1) return;
    setHistoryIndex(historyIndex + 1);
    setTracks(history[historyIndex + 1]);
  }

  // Sample preview
  const previewSample = (sampleName) => {
    const url = sampleAudioUrls[sampleName];
    if (!url) return;
    const audio = new Audio(url);
    audio.currentTime = 0;
    audio.volume = 0.7;
    audio.play().catch(e => console.log("Preview play error:", e));
  };

  // Recording
  const handleToggleRecord = useCallback(async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedBlob(blob);
        setRecordedUrl(url);
        setShowRecordOverlay(true);
        setIsRecording(false);
        setRecordingTime(0);

        setTracks(prev => [...prev, Array(16).fill(false)]);
        setTracksMeta(prev => [...prev, {
          name: 'Vocal Rec ' + new Date().toLocaleTimeString(),
          volume: 0.9,
          pan: 0,
          mute: false,
          solo: false,
          assignedSample: url,
        }]);

        streamRef.current?.getTracks().forEach(t => t.stop());
        clearInterval(timerRef.current);
      };

      recorder.start();
      setIsRecording(true);
      setShowRecordOverlay(false);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Mic error:", err);
      alert("Couldn't access microphone. Please allow permission.");
    }
  }, [isRecording]);

  const cleanupAfterRecord = () => {
    setShowRecordOverlay(false);
    setRecordedBlob(null);
    setRecordedUrl(null);
    setRecordingTime(0);
    clearInterval(timerRef.current);
  };

  // Save / Load / Export / Other actions (unchanged)
  const handleSaveBeat = () => {
    const name = prompt("Name your beat:", `Beat ${sessions.length + 1}`);
    if (!name) return;

    const newSession = { id: Date.now(), name, tracks, tracksMeta, bpm };
    const updated = [newSession, ...sessions.slice(0, 9)];
    setSessions(updated);
    localStorage.setItem('circuit_sessions', JSON.stringify(updated));
    alert(`Saved as "${name}"`);
  };

  const handleLoadBeat = (e) => {
    const id = e.target.value;
    if (!id) return;
    const sess = sessions.find(s => s.id == id);
    if (sess) {
      setTracks(sess.tracks);
      setTracksMeta(sess.tracksMeta);
      setBpm(sess.bpm);
      alert(`Loaded "${sess.name}"`);
    }
  };

  const handleExport = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new RecordRTC(stream, { type: 'audio', mimeType: 'audio/wav' });

      setIsPlaying(true);
      await new Promise(r => setTimeout(r, 8000));
      setIsPlaying(false);

      recorder.stopRecording(() => {
        const blob = recorder.getBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'circuit_beat.wav';
        a.click();
        stream.getTracks().forEach(t => t.stop());
      });
    } catch (err) {
      alert("Export failed: " + err.message);
    }
  };

  function handleShareSession() {
    const id = "session-" + Math.random().toString(36).slice(2, 8);
    setSessionId("chain-" + Math.random().toString(36).slice(2, 6));
    setShareLink(window.location.origin + "?session=" + id);
  }

  function handleForkSession() {
    const forked = tracks.map(track => [...track]);
    setForkInfo({ original: 20, you: 80 });
    setTracks(forked);
  }

  function handleRemix() {
    const demo = Array.from({ length: 8 }, () =>
      Array.from({ length: 16 }, () => Math.random() > 0.7)
    );
    setTracks(demo);
  }

  function handleClear() {
    if (confirm("Clear current beat?")) {
      setTracks(Array.from({ length: 8 }, () => Array(16).fill(false)));
      setTracksMeta(tracksMeta.map(m => ({ ...m, assignedSample: null })));
    }
  }

  const handleAIGenerate = async () => {
    try {
      const pattern = await generatePattern("energetic trap");
      setTracks(prev => {
        const newTracks = [...prev];
        if (newTracks[0]) newTracks[0] = pattern.kick;
        if (newTracks[1]) newTracks[1] = pattern.snare;
        return newTracks;
      });
      alert("AI beat generated on tracks 1 & 2");
    } catch (err) {
      console.error(err);
      alert("AI generation failed");
    }
  };

  function getBotReply(message) {
    const msg = message.toLowerCase();
    // ... (your original getBotReply logic unchanged)
    if (msg.includes("beat") || msg.includes("start")) return "Tap squares on the grid to place sounds. Press Play to hear your loop.";
    if (msg.includes("drag") || msg.includes("multiple")) return "You can tap and drag across the grid to activate multiple squares at once.";
    // ... rest of your replies ...
    return "Ask me about making beats, exporting, recording, effects, wallet, or royalties.";
  }

  /* ================= STYLES ================= */
  const controlBtn = {
    background: "rgba(0,255,255,0.10)",
    border: "1px solid rgba(0,255,255,0.35)",
    padding: "10px 14px",
    borderRadius: 12,
    cursor: "pointer",
    color: "#00ffff",
    fontSize: 13,
    fontWeight: 600,
  };

  const stepStyle = (on, active) => ({
    width: 32,
    height: 32,
    borderRadius: 8,
    background: on ? "#00ffff" : "#1b1b1b",
    border: active ? "2px solid #00ffff" : "1px solid rgba(0,255,255,0.2)",
    transition: "all 0.05s ease",
  });

  /* ================= UI ================= */
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        padding: 24,
        gap: 18,
        minHeight: "80vh",
        background: darkMode ? "#0b0f14" : "#f5f5f5",
        color: darkMode ? "#ffffff" : "#111111",
      }}
      onMouseUp={handlePointerUp}
      onTouchEnd={handlePointerUp}
    >
      {/* RECORDING OVERLAY */}
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

      {/* POST-RECORDING OVERLAY */}
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

      {/* LEFT SIDEBAR - Samples */}
      <div style={{ width: 240 }}>
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
                updated[0].assignedSample = sample;
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
        {/* Transport Bar */}
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
  await initAudio();
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
              {/* Track controls */}
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

                {/* Volume & Pan */}
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

              {/* Steps */}
              <div style={{ display: "flex", gap: 4, flex: 1 }}>
                {track.map((step, stepIndex) => (
                  <div
                    key={stepIndex}
                    onMouseDown={() => handlePointerDown(trackIndex, stepIndex)}
                    onMouseEnter={() => handlePointerEnter(trackIndex, stepIndex)}
                    onTouchStart={() => handlePointerDown(trackIndex, stepIndex)}
                    onTouchMove={() => handlePointerEnter(trackIndex, stepIndex)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: step ? "#00ffff" : "rgba(255,255,255,0.08)",
                      border: isPlaying && playStep === stepIndex
                        ? "2px solid #ffffff"
                        : "1px solid rgba(0,255,255,0.2)",
                      boxShadow: step ? "0 0 12px rgba(0,255,255,0.6)" : "none",
                      transition: "all 0.08s ease",
                      cursor: "pointer"
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}

        <CommentSection sessionId="circuit-session" />
      </div>

      {/* RIGHT - Effects */}
      <div style={{ width: 260 }}>
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

      {/* SOCIAL FEED */}
      <div
        style={{
          width: 300,
          border: "1px solid rgba(0,255,255,0.15)",
          borderRadius: 14,
          padding: 16,
          maxHeight: 420,
          overflowY: "auto",
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

      {/* Floating Chat Button */}
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