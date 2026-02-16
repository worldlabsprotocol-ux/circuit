import * as Tone from 'tone'

export const transport = Tone.Transport
export const recorder = new Tone.Recorder()

export const channels = {
  kick: {
    gain: new Tone.Gain(0.8),
    synth: new Tone.MembraneSynth(),
  },
  snare: {
    gain: new Tone.Gain(0.8),
    synth: new Tone.NoiseSynth({ envelope: { decay: 0.2 } }),
  },
  hat: {
    gain: new Tone.Gain(0.8),
    synth: new Tone.MetalSynth(),
  },
}

Object.values(channels).forEach(c => {
  c.synth.connect(c.gain)
  c.gain.connect(recorder)
  c.gain.toDestination()
})

export async function initAudio() {
  await Tone.start()
  transport.bpm.value = 120
}

export function playStep(pattern, step) {
  Object.entries(pattern).forEach(([lane, steps]) => {
    const v = steps[step]
    if (v === 0) return
    const velocity = v / 3
    const c = channels[lane]
    c.gain.gain.value = velocity
    c.synth.triggerAttackRelease('C2', '8n')
  })
}

export async function startRecording() {
  recorder.start()
}

export async function stopRecording() {
  const recording = await recorder.stop()
  const url = URL.createObjectURL(recording)
  const a = document.createElement('a')
  a.href = url
  a.download = 'wl-studio.wav'
  a.click()
}
