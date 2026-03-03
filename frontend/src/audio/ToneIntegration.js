let ToneRef = null
let initialized = false
let kick
let snare
let hat
let reverb

export async function initAudio() {
if (initialized) return
const Tone = await import("tone")
ToneRef = Tone
await Tone.start()
kick = new Tone.MembraneSynth().toDestination()
snare = new Tone.NoiseSynth({ envelope: { decay: 0.2 } }).toDestination()
hat = new Tone.MetalSynth().toDestination()
reverb = new Tone.Reverb({ wet: 0.5 }).toDestination()
initialized = true
}

export function getInstruments() {
if (!initialized) return null
return { kick, snare, hat, reverb }
}
