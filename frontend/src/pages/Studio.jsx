import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import EffectsRack from "../components/EffectsRack";
import CommentSection from "../components/CommentSection";
import RecordRTC from "recordrtc";
import * as Tone from "tone";

// Button style
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

// Real audio URLs for preview
const sampleAudioUrls = {
  "Kick 808": "https://assets.codepen.io/605876/808-kick.mp3",
  "Snare Tight": "https://assets.codepen.io/605876/808-snare.mp3",
  "HiHat Trap": "https://assets.codepen.io/605876/808-hihat-closed.mp3",
  "Sub Bass": "https://assets.codepen.io/605876/808-sub-bass.mp3",
  "Pluck Melody": "https://assets.codepen.io/605876/pluck-melody-short.mp3",
};

export default function Studio() {
  const [bpm, setBpm] = useState(120);
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playStep, setPlayStep] = useState(0);
  const [darkMode, setDarkMode] = useState(true);

  // ✅ Added: responsive flag (replaces window.innerWidth checks in styles)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 900);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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

  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();

  const [customSamples, setCustomSamples] = useState({});

  const anySoloOn = useMemo(() => tracksMeta.some((t) => t.solo), [tracksMeta]);

  const [selectedSample, setSelectedSample] = useState(null);
  const [shareLink, setShareLink] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [forkInfo, setForkInfo] = useState(null);

  /* EFFECTS STATE */
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

  /* UNDO / REDO */
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  /* CHAT */
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  /* RECORDING */
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [showRecordOverlay, setShowRecordOverlay] = useState(false);
  const [monitorBeat, setMonitorBeat] = useState(true);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  /* DRAWING */
  const [isDrawing, setIsDrawing] = useState(false);

  /* SAVED SESSIONS & SOCIAL */
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("circuit_sessions");
    return saved ? JSON.parse(saved) : [];
  });

  const [likesMap, setLikesMap] = useState({});
  const [followingMap, setFollowingMap] = useState({});
  const [selectedCreator, setSelectedCreator] = useState(null);

  /* AUDIO OVERLAY */
  const [showAudioOverlay, setShowAudioOverlay] = useState(true);

  const audioEngine = useRef(null);
  const transportIdRef = useRef(null);
  const stepRef = useRef(0);

  const tracksRef = useRef(tracks);
  const tracksMetaRef = useRef(tracksMeta);
  const anySoloOnRef = useRef(anySoloOn);
  const metronomeOnRef = useRef(metronomeOn);

  useEffect(() => { tracksRef.current = tracks; }, [tracks]);
  useEffect(() => { tracksMetaRef.current = tracksMeta; }, [tracksMeta]);
  useEffect(() => { anySoloOnRef.current = anySoloOn; }, [anySoloOn]);
  useEffect(() => { metronomeOnRef.current = metronomeOn; }, [metronomeOn]);

  // Trending ticker
  const trendingItems = [
    { id: 1, name: "Neon Pulse", creator: "circuit.skr", likes: 124 },
    { id: 2, name: "808 Galaxy", creator: "pabloretroworld.skr", likes: 98 },
    { id: 3, name: "Solar Bounce", creator: "stardrummer.skr", likes: 76 },
    { id: 4, name: "Midnight Drift", creator: "voidproducer.skr", likes: 142 },
    { id: 5, name: "Chrome Dreams", creator: "futurevibes.skr", likes: 117 },
    { id: 6, name: "Bass Reactor", creator: "lowfreqlord.skr", likes: 89 },
    { id: 7, name: "Digital Mirage", creator: "hologramkid.skr", likes: 134 },
    { id: 8, name: "Skyline Bounce", creator: "aerobeats.skr", likes: 73 },
    { id: 9, name: "Trap Nebula", creator: "cosmic808.skr", likes: 156 },
    { id: 10, name: "Velocity Loop", creator: "tempoengine.skr", likes: 101 },
    { id: 11, name: "Aurora 140", creator: "nightshift.skr", likes: 92 },
    { id: 12, name: "Static Horizon", creator: "glitchmode.skr", likes: 128 },
  ].map((item) => ({
    ...item,
    likes: item.likes + Math.floor(Math.random() * 3),
  }));

  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % trendingItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const visibleTrending = Array.from({ length: 5 }, (_, i) => {
    const idx = (tickerIndex + i) % trendingItems.length;
    return trendingItems[idx];
  });

  const initAudio = async () => {
    if (audioEngine.current) return;

    try {
      await Tone.start();

      const reverb = new Tone.Reverb({ decay: 2, wet: reverbWet });
      const delay = new Tone.FeedbackDelay("8n", delayWet);
      reverb.connect(delay);
      delay.toDestination();

      const kick = new Tone.MembraneSynth().connect(reverb);
      const snare = new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.001, decay: 0.15, sustain: 0 },
      }).connect(reverb);
      const hat = new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.001, decay: 0.05, sustain: 0 },
      }).connect(reverb);
      const bass = new Tone.Synth({ oscillator: { type: "sine" } }).connect(reverb);

      const melody4 = new Tone.Synth({ oscillator: { type: "triangle" } }).connect(reverb);
      const melody5 = new Tone.Synth({ oscillator: { type: "triangle" } }).connect(reverb);
      const melody6 = new Tone.Synth({ oscillator: { type: "triangle" } }).connect(reverb);
      const melody7 = new Tone.Synth({ oscillator: { type: "triangle" } }).connect(reverb);

      const metronome = new Tone.Synth({
        oscillator: { type: "square" },
        envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.01 },
      }).connect(reverb);

      audioEngine.current = {
        reverb,
        delay,
        instruments: [kick, snare, hat, bass, melody4, melody5, melody6, melody7],
        metronome,
      };

      console.log("Audio engine initialized");
    } catch (err) {
      console.error("initAudio failed:", err);
    }
  };

  // Audio unlock on first real interaction (improved for mobile/Seeker)
  useEffect(() => {
    let unlocked = false;

    const unlockAudio = async (e) => {
      if (unlocked) return;
      unlocked = true;

      try {
        if (e.type === "touchstart") e.preventDefault();

        await Tone.start();
        await initAudio();
        setShowAudioOverlay(false);

        const silentOsc = new Tone.Oscillator(440, "sine").toDestination();
        silentOsc.volume.value = -Infinity;
        silentOsc.start("+0.01").stop("+0.05");
      } catch (err) {
        console.error("Audio unlock failed:", err);
        unlocked = false;
      }
    };

    const events = ["click", "touchstart", "pointerdown", "mousedown"];
    events.forEach((event) => {
      window.addEventListener(event, unlockAudio, { passive: false });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, unlockAudio);
      });
    };
  }, []);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  useEffect(() => {
    if (!isPlaying) {
      if (transportIdRef.current !== null) {
        Tone.Transport.clear(transportIdRef.current);
        transportIdRef.current = null;
      }
      Tone.Transport.stop();
      Tone.Transport.position = 0;
      stepRef.current = 0;
      setPlayStep(0);
      return;
    }

    let disposed = false;

    (async () => {
      try {
        await Tone.start();
        if (!audioEngine.current) await initAudio();

        Tone.Transport.stop();
        Tone.Transport.position = 0;
        stepRef.current = 0;

        if (transportIdRef.current !== null) {
          Tone.Transport.clear(transportIdRef.current);
          transportIdRef.current = null;
        }

        transportIdRef.current = Tone.Transport.scheduleRepeat((time) => {
          const step = stepRef.current;

          Tone.Draw.schedule(() => {
            if (!disposed) setPlayStep(step);
          }, time);

          if (metronomeOnRef.current && step % 4 === 0) playTick(time);

          const curTracks = tracksRef.current;
          for (let i = 0; i < curTracks.length; i++) {
            if (curTracks[i][step]) playSound(i, time);
          }

          stepRef.current = (step + 1) % 16;
        }, "16n");

        Tone.Transport.start("+0.05");
      } catch (err) {
        console.error("[TRANSPORT] Start failed:", err);
      }
    })();

    return () => {
      disposed = true;
      if (transportIdRef.current !== null) {
        Tone.Transport.clear(transportIdRef.current);
        transportIdRef.current = null;
      }
      Tone.Transport.stop();
    };
  }, [isPlaying, bpm]);

  function playTick(time) {
    if (!audioEngine.current) return;
    audioEngine.current.metronome.triggerAttackRelease("C6", "16n", time);
  }

  function playSound(trackIndex, time) {
    if (!audioEngine.current) return;

    const meta = tracksMetaRef.current?.[trackIndex];
    if (!meta) return;

    if (meta.mute || (anySoloOnRef.current && !meta.solo)) return;

    const inst = audioEngine.current.instruments?.[trackIndex];
    if (!inst) return;

    if (trackIndex === 0) inst.triggerAttackRelease("C1", "8n", time);
    else if (trackIndex === 1) inst.triggerAttackRelease("16n", time);
    else if (trackIndex === 2) inst.triggerAttackRelease("32n", time);
    else if (trackIndex === 3) inst.triggerAttackRelease("C2", "8n", time);
    else {
      const notes = ["C4", "D4", "E4", "G4", "A4"];
      const note = notes[Math.floor(Math.random() * notes.length)];
      inst.triggerAttackRelease(note, "8n", time);
    }
  }

  const toggleStep = (trackIndex, stepIndex) => {
    setTracks((prev) => {
      const newTracks = prev.map((row, i) =>
        i === trackIndex
          ? row.map((cell, j) => (j === stepIndex ? !cell : cell))
          : row
      );

      setHistory((prevHistory) => {
        const newHistory = prevHistory.slice(0, historyIndex + 1);
        return [...newHistory, newTracks];
      });
      setHistoryIndex((prevIdx) => prevIdx + 1);

      return newTracks;
    });
  };

  const handlePointerDown = (trackIndex, stepIndex, e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    toggleStep(trackIndex, stepIndex);
  };

  const handlePointerEnter = (trackIndex, stepIndex) => {
    if (isDrawing) toggleStep(trackIndex, stepIndex);
  };

  const handlePointerUp = (e) => {
    e.preventDefault();
    if (e.currentTarget?.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDrawing(false);
  };

  const previewSample = (sampleName) => {
    const url = customSamples[sampleName] || sampleAudioUrls[sampleName];
    if (!url) return;
    const audio = new Audio(url);
    audio.currentTime = 0;
    audio.volume = 0.7;
    audio.play().catch((e) => console.log("Preview play error:", e));
  };

  const handleToggleRecord = async () => {
    if (isRecording) {
      if (recorderRef.current) {
        recorderRef.current.stopRecording(() => {
          const blob = recorderRef.current.getBlob();
          const url = URL.createObjectURL(blob);
          setRecordedBlob(blob);
          setRecordedUrl(url);
          setShowRecordOverlay(true);
          setIsRecording(false);
          clearInterval(timerRef.current);
        });
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const recorder = new RecordRTC(stream, {
          type: "audio",
          mimeType: "audio/webm",
          recorderType: RecordRTC.StereoAudioRecorder,
          timeSlice: 1000,
        });
        recorderRef.current = recorder;
        recorder.startRecording();
        setIsRecording(true);
        setRecordingTime(0);
        timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
      } catch (err) {
        console.error("Mic access denied:", err);
        alert("Microphone access denied. Please allow permission.");
      }
    }
  };

  const cleanupAfterRecord = () => {
    setShowRecordOverlay(false);
    setRecordedBlob(null);
    setRecordedUrl(null);
    setRecordingTime(0);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const handleChopAndAdd = () => {
    if (!recordedBlob) return;
    const chopName = `Chopped Mic ${Object.keys(customSamples).length + 1}`;
    setCustomSamples((prev) => ({ ...prev, [chopName]: recordedUrl }));
    alert(`"${chopName}" added to Samples! Click it to assign to a track and layer over your beat.`);
    cleanupAfterRecord();
  };

  const handleKeepFull = () => {
    if (!recordedBlob) return;
    const fullName = `Full Mic ${Object.keys(customSamples).length + 1}`;
    setCustomSamples((prev) => ({ ...prev, [fullName]: recordedUrl }));
    alert(`"${fullName}" added to Samples! Click it to assign and play/layer.`);
    cleanupAfterRecord();
  };

  const onRemix = async () => {
    try {
      if (Tone.context.state !== "running") await Tone.start();
      if (!audioEngine.current) await initAudio();

      const random = Array.from({ length: 8 }, () =>
        Array(16).fill(false).map(() => Math.random() > 0.72)
      );
      setTracks(random);
    } catch (e) {
      console.error("Remix failed:", e);
      const random = Array.from({ length: 8 }, () =>
        Array(16).fill(false).map(() => Math.random() > 0.72)
      );
      setTracks(random);
    }
  };

  const onClear = () =>
    setTracks(Array.from({ length: 8 }, () => Array(16).fill(false)));

  const onSave = () => {
    if (!connected || !publicKey) {
      alert("Connect wallet to save your beat.");
      return;
    }

    const session = {
      id: Date.now(),
      owner: publicKey ? publicKey.toString() : "guest",
      name: `Session ${new Date().toLocaleTimeString()}`,
      tracks: tracks.map((row) => [...row]),
      tracksMeta: tracksMeta.map((m) => ({ ...m })),
      bpm,
      timestamp: Date.now(),
    };

    const updated = [...sessions, session];
    setSessions(updated);
    localStorage.setItem("circuit_sessions", JSON.stringify(updated));

    alert("Beat saved under wallet: " + publicKey.toString());
  };

  const onExport = () => {
    alert("Preview Export: Recording feature allows capturing your loop for now.");
  };

  const onMintPreview = () => {
    if (!connected) {
      alert("Connect wallet to mint.");
      return;
    }

    const metadata = {
      name: `Circuit Beat #${Date.now() % 100000}`,
      symbol: "CIRCUIT",
      description: "Created on Circuit - Web3 Mobile Beat Lab",
      attributes: [
        { trait_type: "BPM", value: bpm },
        { trait_type: "Tracks", value: tracks.length },
        { trait_type: "Creator", value: publicKey?.toString() },
      ],
    };

    console.log("Mint Preview Metadata:", metadata);
    alert("NFT metadata generated. Check console.");
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        padding: isMobile ? 12 : 24,
        gap: 16,
        overflowX: "hidden",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        background: darkMode ? "#0b0f14" : "#f5f5f5",
        color: darkMode ? "#ffffff" : "#111111",
      }}
      onMouseUp={handlePointerUp}
      onTouchEnd={handlePointerUp}
    >
      {showAudioOverlay && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.95)",
            color: "#00ffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            fontSize: "36px",
            fontWeight: 700,
            textAlign: "center",
            padding: "40px",
            cursor: "pointer",
            touchAction: "manipulation", // Improves touch response on mobile
          }}
          onClick={async (e) => {
            e.preventDefault();
            try {
              await Tone.start();
              await initAudio();
              setShowAudioOverlay(false);
            } catch (err) {
              console.error("Overlay unlock failed:", err);
            }
          }}
          onTouchStart={async (e) => {
            e.preventDefault();
            try {
              await Tone.start();
              await initAudio();
              setShowAudioOverlay(false);
            } catch (err) {
              console.error("Touch unlock failed:", err);
            }
          }}
        >
          <div style={{ marginBottom: "30px" }}>TAP ANYWHERE TO ENABLE SOUND</div>
          <div style={{ fontSize: "24px", opacity: 0.8, maxWidth: "80%" }}>
            Tap once (or double-tap if needed) to unlock audio – required on Seeker/Android
          </div>
        </div>
      )}

      {/* RECORDING OVERLAY */}
      {isRecording && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            zIndex: 1000,
            color: "#00ffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
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
            <button style={controlBtn} onClick={() => setMonitorBeat((p) => !p)}>
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
            zIndex: 1001,
            color: "#00ffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <h2 style={{ marginBottom: 20 }}>Recording Complete</h2>
          <audio controls src={recordedUrl} style={{ marginBottom: 30, width: "80%", maxWidth: 400 }} />
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <button style={controlBtn} onClick={handleKeepFull}>Keep Full</button>
            <button style={controlBtn} onClick={handleChopAndAdd}>Chop & Add</button>
            <button style={{ ...controlBtn, background: "rgba(100,100,100,0.4)" }} onClick={cleanupAfterRecord}>Discard</button>
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR */}
      <div style={{ width: isMobile ? "100%" : 280, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ border: "1px solid rgba(0,255,255,0.18)", borderRadius: 12, padding: 10, background: "rgba(0,255,255,0.03)", overflow: "hidden", height: 140 }}>
          <h3 style={{ color: "#00ffff", margin: "0 0 8px 0", fontSize: 15 }}>Trending</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {visibleTrending.map((track) => (
              <div key={track.id} style={{ padding: "4px 0", fontSize: 13, borderBottom: "1px solid rgba(0,255,255,0.08)" }}>
                <div style={{ color: "#00ffff", fontWeight: 600 }}>{track.name}</div>
                <div style={{ fontSize: 11, opacity: 0.75 }}>{track.creator} · ❤️ {track.likes}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ border: "1px solid rgba(0,255,255,0.15)", borderRadius: 14, padding: 16, background: "rgba(0,255,255,0.04)" }}>
          <h3 style={{ color: "#00ffff", marginBottom: 12 }}>Samples</h3>
          {["Kick 808", "Snare Tight", "HiHat Trap", "Sub Bass", "Pluck Melody", ...Object.keys(customSamples)].map((sample) => (
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
                fontSize: 13,
              }}
            >
              {sample}
            </div>
          ))}
        </div>

        <div style={{ border: "1px solid rgba(0,255,255,0.15)", borderRadius: 14, padding: 12, background: "rgba(0,255,255,0.04)", display: "flex", flexDirection: "column", gap: 8 }}>
          <h3 style={{ color: "#00ffff", marginBottom: 8, fontSize: 14 }}>Effects Chain</h3>
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
      </div>

      {/* CENTER */}
      <div style={{ flex: 1 }}>
        {connected && publicKey && (
          <div style={{ fontSize: 11, color: "#00ffff", opacity: 0.7, marginTop: 6 }}>
            🟢 Wallet Active {publicKey.toString().slice(0, 4)}…{publicKey.toString().slice(-4)}
          </div>
        )}

        {/* ✅ Optional fix added: flexWrap on toolbar row so it doesn't overflow on mobile */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 20, padding: 12, borderRadius: 14, background: "rgba(0,255,255,0.04)", border: "1px solid rgba(0,255,255,0.15)" }}>
          <button
            onClick={async () => {
              try {
                await Tone.start();
                await initAudio();
                setIsPlaying((p) => !p);
              } catch (err) {
                console.error("[PLAY] Error:", err);
              }
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
              transition: "all 0.2s ease",
            }}
          >
            {isPlaying ? "■ Stop" : "▶ Play"}
          </button>

          <button
            onClick={() => setMetronomeOn((p) => !p)}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid rgba(0,255,255,0.4)",
              background: metronomeOn ? "rgba(0,255,255,0.3)" : "transparent",
              color: "#00ffff",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            {metronomeOn ? "● Metronome" : "Metronome"}
          </button>

          <button
            onClick={handleToggleRecord}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid rgba(255,100,100,0.6)",
              background: isRecording ? "rgba(255,0,0,0.4)" : "transparent",
              color: isRecording ? "#ff4444" : "#ff6666",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            {isRecording ? "■ Rec" : "○ Rec"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#00ffff", fontSize: 13 }}>BPM</span>
            <input
              type="number"
              value={bpm}
              min="60"
              max="200"
              onChange={(e) => setBpm(+e.target.value)}
              style={{
                width: 60,
                padding: 4,
                background: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(0,255,255,0.4)",
                color: "#00ffff",
                borderRadius: 6,
              }}
            />
            <input type="range" min="60" max="200" value={bpm} onChange={(e) => setBpm(+e.target.value)} style={{ width: 120 }} />
          </div>

          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <WalletMultiButton />
            {connected && (
              <div
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 600,
                  background: "rgba(0,255,255,0.12)",
                  border: "1px solid rgba(0,255,255,0.35)",
                  color: "#00ffff",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                ● Wallet Active
              </div>
            )}
            <button style={controlBtn} onClick={onRemix}>Remix</button>
            <button style={controlBtn} onClick={onClear}>Clear</button>
            <button style={controlBtn} onClick={onSave}>Save</button>
            <button style={controlBtn} onClick={onExport}>Export</button>
            {connected && <button style={controlBtn} onClick={onMintPreview}>Mint as NFT</button>}
          </div>
        </div>

        {/* Grid */}
        {tracks.map((track, trackIndex) => {
          const meta = tracksMeta[trackIndex];
          return (
            <div key={trackIndex} style={{ display: "flex", alignItems: "center", marginTop: 10, padding: 6, borderRadius: 10, background: meta.solo ? "rgba(0,255,255,0.08)" : "transparent", transition: "all 0.2s ease" }}>
              <div style={{ width: 110, marginRight: 8, fontSize: 10, opacity: 0.9 }}>
                <div style={{ marginBottom: 4, color: meta.solo ? "#00ffff" : "white", fontWeight: meta.solo ? 700 : 400 }}>{meta.name}</div>
                <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                  <button onClick={() => { const u = [...tracksMeta]; u[trackIndex].mute = !meta.mute; setTracksMeta(u); }} style={{ flex: 1, fontSize: 10, fontWeight: 700, padding: "4px 0", borderRadius: 6, border: "1px solid rgba(0,255,255,0.5)", background: meta.mute ? "#ff3b3b" : "rgba(0,255,255,0.08)", color: meta.mute ? "#fff" : "#00ffff", cursor: "pointer" }}>M</button>
                  <button onClick={() => { const u = [...tracksMeta]; u[trackIndex].solo = !meta.solo; setTracksMeta(u); }} style={{ flex: 1, fontSize: 10, fontWeight: 700, padding: "4px 0", borderRadius: 6, border: "1px solid rgba(0,255,255,0.5)", background: meta.solo ? "#00ffff" : "rgba(0,255,255,0.08)", color: meta.solo ? "#000" : "#00ffff", cursor: "pointer" }}>S</button>
                </div>
                <input type="range" min="0" max="1" step="0.01" value={meta.volume} onChange={(e) => { const u = [...tracksMeta]; u[trackIndex].volume = +e.target.value; setTracksMeta(u); }} style={{ width: "100%", marginBottom: 4 }} />
                <input type="range" min="-1" max="1" step="0.01" value={meta.pan} onChange={(e) => { const u = [...tracksMeta]; u[trackIndex].pan = +e.target.value; setTracksMeta(u); }} style={{ width: "100%" }} />
              </div>

              <div style={{ display: "flex", gap: 4, flex: 1 }}>
                {track.map((step, stepIndex) => (
                  <div
                    key={stepIndex}
                    onPointerDown={(e) => handlePointerDown(trackIndex, stepIndex, e)}
                    onPointerEnter={() => handlePointerEnter(trackIndex, stepIndex)}
                    onPointerUp={handlePointerUp}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: step ? "#00ffff" : "rgba(255,255,255,0.08)",
                      border: isPlaying && playStep === stepIndex ? "2px solid #ffffff" : "1px solid rgba(0,255,255,0.2)",
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

        {/* Comments */}
        <div style={{ marginTop: 20, padding: 16, border: "1px solid rgba(0,255,255,0.15)", borderRadius: 14, background: "rgba(0,255,255,0.04)" }}>
          <h3 style={{ color: "#00ffff", marginBottom: 12 }}>Comments</h3>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input type="text" placeholder="Leave feedback..." style={{ flex: 1, padding: 10, background: "rgba(255,255,255,0.08)", border: "1px solid #00ffff", borderRadius: 8, color: "white" }} />
            <button
              style={{ ...controlBtn, background: "rgba(0,180,255,0.2)", borderColor: "#00aaff" }}
              onClick={() => {
                const commentText = "Check out this beat I made on Circuit! #Web3Music #MusicProd";
                const url = `https://x.com/intent/tweet?text=${encodeURIComponent(commentText)}&url=${encodeURIComponent("https://circuit.skr")}`;
                window.open(url, "_blank");
              }}
            >
              Post to X
            </button>
          </div>
        </div>
      </div>

      {/* Floating chat button */}
      <div style={{ position: "fixed", bottom: 80, right: 24, zIndex: 1000 }}>
        <button onClick={() => setChatOpen(!chatOpen)} style={{ width: 64, height: 64, borderRadius: "50%", background: "#00ffff", border: "3px solid #00ccff", cursor: "pointer", boxShadow: "0 0 25px cyan", fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>🧑‍🚀</button>

        {chatOpen && (
          <div style={{ position: "absolute", bottom: 80, right: 0, width: 340, background: "rgba(0,0,0,0.92)", border: "2px solid #00ffff", borderRadius: 16, padding: 20, color: "#00ffff", boxShadow: "0 0 40px rgba(0,255,255,0.5)" }}>
            <h3>Circuit Assistant</h3>
            <p style={{ fontSize: 14, opacity: 0.9, marginBottom: 16 }}>Hi! Ask me anything about Circuit.</p>

            <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              {chatHistory.map((msg, i) => (
                <div key={i} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", background: msg.role === "user" ? "rgba(0,255,255,0.2)" : "rgba(255,255,255,0.08)", padding: "8px 12px", borderRadius: 10, maxWidth: "80%", fontSize: 13 }}>
                  {msg.text}
                </div>
              ))}
            </div>

            <input type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} placeholder="Type your question..." style={{ width: "100%", padding: 10, background: "rgba(255,255,255,0.08)", border: "1px solid #00ffff", borderRadius: 8, color: "white", marginBottom: 12 }} />

            <button style={controlBtn} onClick={() => {
              if (!chatMessage.trim()) return;
              const reply = "Tell me what you're trying to do and what happened, and I’ll guide you step by step.";
              setChatHistory((prev) => [...prev, { role: "user", text: chatMessage }, { role: "bot", text: reply }]);
              setChatMessage("");
            }}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
}