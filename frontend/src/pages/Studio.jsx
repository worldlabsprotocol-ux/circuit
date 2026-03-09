import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import EffectsRack from "../components/EffectsRack";
import CommentSection from "../components/CommentSection";
import RecordRTC from "recordrtc";
import * as Tone from "tone";

const controlBtn = {
  background: "rgba(0,255,255,0.10)",
  border: "1px solid rgba(0,255,255,0.35)",
  padding: "10px 14px",
  borderRadius: 12,
  cursor: "pointer",
  color: "#00ffff",
  fontSize: 13,
  fontWeight: 600,
  touchAction: "manipulation",
  WebkitTapHighlightColor: "transparent",
};

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

  // SAFE ADD: wallet injection check (prevents WalletNotReadyError / phantom.com behavior)
  const hasInjectedSolana =
    typeof window !== "undefined" &&
    (window.solana?.isPhantom ||
      window.solana?.isBackpack ||
      window.phantom?.solana ||
      window.backpack);

  // SAFE ADD: lightweight in-app toast instead of blocking alerts
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const showToast = (message, type = "info") => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 2800);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Replace alert popups with a toast
  const comingSoon = (feature = "This feature") =>
    showToast(`${feature} coming soon`, "soon");

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

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  // SAFE ADD: Deep assistant Q and A (local, no API)
  const CIRCUIT_ASSISTANT_FAQ = [
    {
      q: "What is Circuit",
      a: "Circuit is a mobile music studio built for Solana, you can make beats, remix, and mint your work when you are ready.",
    },
    {
      q: "Do I need a wallet to use Circuit",
      a: "No, you can create without a wallet, you only need one for minting, royalties, or on-chain actions.",
    },
    {
      q: "What does on-chain mean here",
      a: "It means ownership and actions like minting, remix credits, and splits can be recorded on Solana.",
    },
    {
      q: "What exactly gets minted",
      a: "Typically your finished beat and its metadata, like title, cover, and creator info. The exact content depends on the mint settings.",
    },
    {
      q: "Can I mint later",
      a: "Yes, you can create first and mint when you are ready.",
    },
    {
      q: "Can I edit a beat after minting",
      a: "You can always make a new version, but the minted version stays as it was when minted.",
    },
    {
      q: "What is a remix in Circuit",
      a: "A remix is a new version built from an existing beat, with credits and splits tied back to the original.",
    },
    {
      q: "Do I need permission to remix",
      a: "It depends on the beat’s remix settings. If remix is enabled, you can remix. If not, you cannot.",
    },
    {
      q: "How do splits work",
      a: "Splits define how earnings are divided between collaborators and remix contributors.",
    },
    {
      q: "What does pending royalties mean",
      a: "It means earnings are tracked but not claimable yet, usually waiting on settlement or wallet actions.",
    },
    {
      q: "What does claimed mean",
      a: "It means the payout was processed to the connected wallet.",
    },
    {
      q: "Why do I not see royalties yet",
      a: "Royalties only show when your minted or split-enabled content generates earnings, and the feature may still be rolling out.",
    },
    {
      q: "My audio has no sound",
      a: "Check volume, track mute, device silent mode, and headphones or Bluetooth, then restart the app.",
    },
    {
      q: "I hear a delay when I play",
      a: "Turn on low latency mode if available, close other apps, use wired headphones, and lower CPU heavy effects.",
    },
    {
      q: "How do I export my beat",
      a: "Open the project menu, choose Export, then select format and quality, then save or share.",
    },
    {
      q: "What file types can I export",
      a: "Most workflows use WAV or MP3. If your app supports stems, you can export tracks separately.",
    },
    {
      q: "Can I import my own samples",
      a: "Yes, if sample import is enabled, add them through the sample browser or import menu.",
    },
    {
      q: "My project is not saving",
      a: "Make sure storage permission is enabled, you have free space, and your app is updated.",
    },
    {
      q: "I cannot connect my wallet",
      a: "Make sure you approved the connection in your wallet app, then retry, and confirm you are on the right network.",
    },
    {
      q: "Can you recover my seed phrase",
      a: "No, nobody can recover it safely. I can help you secure your wallet and avoid scams.",
    },
  ];

  const normalizeAssistantText = (s) =>
    (s || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const getAssistantReply = (userText) => {
    const input = normalizeAssistantText(userText);
    if (!input) return "Type a question and I will help.";

    let bestItem = null;
    let bestHits = 0;

    for (const item of CIRCUIT_ASSISTANT_FAQ) {
      const tokens = normalizeAssistantText(item.q).split(" ").filter(Boolean);
      let hits = 0;
      for (const t of tokens) {
        if (input.includes(t)) hits += 1;
      }
      if (hits > bestHits) {
        bestHits = hits;
        bestItem = item;
      }
    }

    if (bestItem && bestHits >= 2) return bestItem.a;

    return "Tell me what you are trying to do and what happened, and I will guide you step by step.";
  };

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [showRecordOverlay, setShowRecordOverlay] = useState(false);
  const [monitorBeat, setMonitorBeat] = useState(true);

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("circuit_sessions");
    return saved ? JSON.parse(saved) : [];
  });

  const [showAudioOverlay, setShowAudioOverlay] = useState(true);
  const [micReady, setMicReady] = useState(false);

  const audioEngine = useRef(null);
  const transportIdRef = useRef(null);
  const stepRef = useRef(0);

  const tracksRef = useRef(tracks);
  const tracksMetaRef = useRef(tracksMeta);
  const anySoloOnRef = useRef(anySoloOn);
  const metronomeOnRef = useRef(metronomeOn);

  useEffect(() => {
    tracksRef.current = tracks;
  }, [tracks]);
  useEffect(() => {
    tracksMetaRef.current = tracksMeta;
  }, [tracksMeta]);
  useEffect(() => {
    anySoloOnRef.current = anySoloOn;
  }, [anySoloOn]);
  useEffect(() => {
    metronomeOnRef.current = metronomeOn;
  }, [metronomeOn]);

  // Seeker-safe tap helper: touchstart + click, no preventDefault globally
  const tap = (fn) => ({
    onClick: (e) => {
      e.stopPropagation();
      fn(e);
    },
    onTouchStart: (e) => {
      e.stopPropagation();
      fn(e);
    },
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

  const ensureMicPermission = async () => {
    try {
      if (streamRef.current && streamRef.current.getTracks?.().some((t) => t.readyState === "live")) {
        setMicReady(true);
        return streamRef.current;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      setMicReady(true);
      return stream;
    } catch (err) {
      setMicReady(false);
      console.error("Mic permission failed:", err);
      throw err;
    }
  };

  // Audio unlock on any interaction, no preventDefault
  useEffect(() => {
    let unlocked = false;

    const unlockAudio = async () => {
      if (unlocked) return;
      unlocked = true;

      try {
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
    events.forEach((event) => window.addEventListener(event, unlockAudio, { passive: true }));

    return () => {
      events.forEach((event) => window.removeEventListener(event, unlockAudio));
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
        i === trackIndex ? row.map((cell, j) => (j === stepIndex ? !cell : cell)) : row
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
    if (isDrawing) e.preventDefault();
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
        if (Tone.context.state !== "running") await Tone.start();
        await initAudio();

        const stream = await ensureMicPermission();

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
        showToast("Microphone permission denied", "error");
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
      streamRef.current = null;
    }
    setMicReady(false);
  };

  const handleChopAndAdd = () => {
    if (!recordedBlob) return;
    const chopName = `Chopped Mic ${Object.keys(customSamples).length + 1}`;
    setCustomSamples((prev) => ({ ...prev, [chopName]: recordedUrl }));
    showToast(`${chopName} added to Samples`, "success");
    cleanupAfterRecord();
  };

  const handleKeepFull = () => {
    if (!recordedBlob) return;
    const fullName = `Full Mic ${Object.keys(customSamples).length + 1}`;
    setCustomSamples((prev) => ({ ...prev, [fullName]: recordedUrl }));
    showToast(`${fullName} added to Samples`, "success");
    cleanupAfterRecord();
  };

  const onRemix = async () => {
    try {
      if (Tone.context.state !== "running") await Tone.start();
      if (!audioEngine.current) await initAudio();

      const random = Array.from({ length: 8 }, () =>
        Array(16)
          .fill(false)
          .map(() => Math.random() > 0.72)
      );
      setTracks(random);
    } catch (e) {
      console.error("Remix failed:", e);
      showToast("Remix failed", "error");
    }
  };

  const onClear = () => setTracks(Array.from({ length: 8 }, () => Array(16).fill(false)));

  const onSave = () => comingSoon("Saving beats");
  const onExport = () => comingSoon("Export");

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
        touchAction: "pan-y",
      }}
      onPointerUp={() => setIsDrawing(false)}
      onPointerCancel={() => setIsDrawing(false)}
    >
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 14,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 99999,
            padding: "10px 14px",
            borderRadius: 14,
            maxWidth: "92%",
            textAlign: "center",
            fontWeight: 700,
            fontSize: 13,
            color: "#001014",
            background:
              toast.type === "error"
                ? "rgba(255, 80, 80, 0.95)"
                : toast.type === "success"
                ? "rgba(0, 240, 180, 0.95)"
                : "rgba(0, 240, 255, 0.92)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
            border: "1px solid rgba(255,255,255,0.18)",
            backdropFilter: "blur(10px)",
          }}
        >
          {toast.message}
        </div>
      )}

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
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
          }}
          {...tap(async () => {
            try {
              await Tone.start();
              await initAudio();
              try {
                await ensureMicPermission();
              } catch (e) {}
              setShowAudioOverlay(false);
            } catch (err) {
              console.error("Overlay unlock failed:", err);
            }
          })}
        >
          <div style={{ marginBottom: "30px" }}>TAP ANYWHERE TO ENABLE SOUND</div>
          <div style={{ fontSize: "24px", opacity: 0.8, maxWidth: "80%" }}>
            Tap once to unlock audio. Rec will request mic permission.
          </div>
          <div style={{ fontSize: "14px", opacity: 0.75, marginTop: 16 }}>
            Mic: {micReady ? "ready" : "not granted yet"}
          </div>
        </div>
      )}

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
          <div style={{ fontSize: 48, marginBottom: 20 }}>RECORDING...</div>
          <div style={{ fontSize: 24, marginBottom: 30 }}>
            {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, "0")}
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <button style={controlBtn} {...tap(() => setMonitorBeat((p) => !p))}>
              Monitor Beat: {monitorBeat ? "ON" : "OFF"}
            </button>
            <button
              style={{
                ...controlBtn,
                background: "rgba(255,0,0,0.4)",
                borderColor: "#ff4444",
              }}
              {...tap(handleToggleRecord)}
            >
              STOP
            </button>
          </div>
        </div>
      )}

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
            <button style={controlBtn} {...tap(handleKeepFull)}>
              Keep Full
            </button>
            <button style={controlBtn} {...tap(handleChopAndAdd)}>
              Chop & Add
            </button>
            <button
              style={{ ...controlBtn, background: "rgba(100,100,100,0.4)" }}
              {...tap(cleanupAfterRecord)}
            >
              Discard
            </button>
          </div>
        </div>
      )}

      <div style={{ width: isMobile ? "100%" : 280, display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            border: "1px solid rgba(0,255,255,0.15)",
            borderRadius: 14,
            padding: 16,
            background: "rgba(0,255,255,0.04)",
          }}
        >
          <h3 style={{ color: "#00ffff", marginBottom: 12 }}>Samples</h3>
          {["Kick 808", "Snare Tight", "HiHat Trap", "Sub Bass", "Pluck Melody", ...Object.keys(customSamples)].map(
            (sample) => (
              <div
                key={sample}
                {...tap(() => {
                  setSelectedSample(sample);
                  const updated = [...tracksMeta];
                  updated[0].assignedSample = sample;
                  setTracksMeta(updated);
                  previewSample(sample);
                })}
                style={{
                  padding: "8px 10px",
                  marginBottom: 8,
                  borderRadius: 10,
                  cursor: "pointer",
                  background:
                    selectedSample === sample ? "rgba(0,255,255,0.25)" : "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(0,255,255,0.25)",
                  transition: "all 0.15s ease",
                  fontSize: 13,
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {sample}
              </div>
            )
          )}
        </div>

        <div
          style={{
            border: "1px solid rgba(0,255,255,0.15)",
            borderRadius: 14,
            padding: 12,
            background: "rgba(0,255,255,0.04)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <h3 style={{ color: "#00ffff", marginBottom: 8, fontSize: 14 }}>Effects Chain</h3>
          <EffectsRack
            reverbWet={reverbWet}
            setReverbWet={setReverbWet}
            delayWet={delayWet}
            setDelayWet={setDelayWet}
            reverbOn={reverbOn}
            setReverbOn={setReverbOn}
            delayOn={delayOn}
            setDelayOn={setDelayOn}
            eqLow={eqLow}
            setEqLow={setEqLow}
            eqMid={eqMid}
            setEqMid={setEqMid}
            eqHigh={eqHigh}
            setEqHigh={setEqHigh}
            compressAmount={compressAmount}
            setCompressAmount={setCompressAmount}
            filterCutoff={filterCutoff}
            setFilterCutoff={setFilterCutoff}
            distortionAmount={distortionAmount}
            setDistortionAmount={setDistortionAmount}
            masterGain={masterGain}
            setMasterGain={setMasterGain}
          />
        </div>
      </div>

      <div style={{ flex: 1, paddingRight: isMobile ? 8 : 12, paddingBottom: isMobile ? 16 : 20 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
            padding: 12,
            borderRadius: 14,
            background: "rgba(0,255,255,0.04)",
            border: "1px solid rgba(0,255,255,0.15)",
          }}
        >
          <button
            {...tap(async () => {
              setIsPlaying((p) => !p);
              try {
                await Tone.start();
                await initAudio();
              } catch (err) {
                console.error("[PLAY] Error:", err);
              }
            })}
            style={{
              padding: "10px 18px",
              borderRadius: 10,
              fontWeight: 600,
              border: "1px solid #00ffff",
              background: isPlaying ? "rgba(0,255,255,0.3)" : "transparent",
              color: "#00ffff",
              cursor: "pointer",
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {isPlaying ? "■ Stop" : "▶ Play"}
          </button>

          <button
            {...tap(() => setMetronomeOn((p) => !p))}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid rgba(0,255,255,0.4)",
              background: metronomeOn ? "rgba(0,255,255,0.3)" : "transparent",
              color: "#00ffff",
              cursor: "pointer",
              fontSize: 12,
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {metronomeOn ? "● Metronome" : "Metronome"}
          </button>

          <button
            {...tap(() => comingSoon("Recording"))}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid rgba(255,100,100,0.6)",
              background: "transparent",
              color: "#ff6666",
              cursor: "pointer",
              fontSize: 12,
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            ○ Rec <span style={{ opacity: 0.85 }}>(Soon)</span>
          </button>

          <div style={{ display: "flex", gap: 8, marginLeft: "auto", flexWrap: "wrap" }}>
            <button style={controlBtn} {...tap(() => comingSoon("Wallet connect"))}>
              Connect (Soon)
            </button>

            <button
              style={{
                ...controlBtn,
                background: chatOpen ? "rgba(0,255,255,0.22)" : "rgba(0,255,255,0.10)",
                borderColor: "rgba(0,255,255,0.45)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
              {...tap(() => setChatOpen((p) => !p))}
            >
              🧑‍🚀 Assistant
            </button>

            <button style={controlBtn} {...tap(onRemix)}>
              Remix
            </button>
            <button style={controlBtn} {...tap(onClear)}>
              Clear
            </button>
            <button style={controlBtn} {...tap(onSave)}>
              Save (Soon)
            </button>
            <button style={controlBtn} {...tap(onExport)}>
              Export (Soon)
            </button>
          </div>
        </div>

        {chatOpen && (
          <div
            style={{
              marginBottom: 16,
              width: "100%",
              background: "rgba(0,0,0,0.92)",
              border: "2px solid #00ffff",
              borderRadius: 16,
              padding: 16,
              color: "#00ffff",
              boxShadow: "0 0 40px rgba(0,255,255,0.35)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <h3 style={{ margin: 0 }}>Circuit Assistant</h3>
              <button style={controlBtn} {...tap(() => setChatOpen(false))}>
                Close
              </button>
            </div>

            <div
              style={{
                maxHeight: 200,
                overflowY: "auto",
                marginBottom: 12,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
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

            <div style={{ display: "flex", gap: 10 }}>
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your question..."
                style={{
                  flex: 1,
                  padding: 10,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid #00ffff",
                  borderRadius: 8,
                  color: "white",
                }}
              />
              <button
                style={controlBtn}
                {...tap(() => {
                  if (!chatMessage.trim()) return;
                  const reply = getAssistantReply(chatMessage);
                  setChatHistory((prev) => [
                    ...prev,
                    { role: "user", text: chatMessage },
                    { role: "bot", text: reply },
                  ]);
                  setChatMessage("");
                })}
              >
                Send
              </button>
            </div>
          </div>
        )}

        <div style={{ paddingRight: isMobile ? 10 : 14, paddingBottom: isMobile ? 18 : 24 }}>
          {tracks.map((track, trackIndex) => (
            <div
              key={trackIndex}
              style={{ display: "flex", alignItems: "center", marginTop: 10, padding: 6, borderRadius: 10 }}
            >
              <div style={{ width: 110, marginRight: 8, fontSize: 10, opacity: 0.9 }}>
                <div style={{ marginBottom: 4, color: "white", fontWeight: 400 }}>
                  {tracksMeta[trackIndex]?.name}
                </div>
              </div>

              <div style={{ display: "flex", gap: 4, flex: 1, paddingRight: isMobile ? 10 : 14 }}>
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
                      cursor: "pointer",
                      touchAction: "none",
                      userSelect: "none",
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 20,
            padding: 16,
            border: "1px solid rgba(0,255,255,0.15)",
            borderRadius: 14,
            background: "rgba(0,255,255,0.04)",
          }}
        >
          <h3 style={{ color: "#00ffff", marginBottom: 12 }}>Comments</h3>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input
              type="text"
              placeholder="Leave feedback..."
              style={{
                flex: 1,
                padding: 10,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid #00ffff",
                borderRadius: 8,
                color: "white",
              }}
            />
            <button
              style={{ ...controlBtn, background: "rgba(0,180,255,0.2)", borderColor: "#00aaff" }}
              {...tap(() => {
                const commentText = "Check out this beat I made on Circuit! #Web3Music #MusicProd";
                const url = `https://x.com/intent/tweet?text=${encodeURIComponent(commentText)}&url=${encodeURIComponent(
                  "https://circuit.skr"
                )}`;
                window.open(url, "_blank");
              })}
            >
              Post to X
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}