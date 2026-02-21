let audioContext = null

export function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

export async function unlockAudio() {
  const ctx = getAudioContext()
  if (ctx.state === "suspended") {
    await ctx.resume()
  }
}

export function playKick() {
  const ctx = getAudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.frequency.setValueAtTime(150, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)

  gain.gain.setValueAtTime(1, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start()
  osc.stop(ctx.currentTime + 0.5)
}

export function playSnare() {
  const ctx = getAudioContext()

  const noise = ctx.createBufferSource()
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < buffer.length; i++) {
    data[i] = Math.random() * 2 - 1
  }

  noise.buffer = buffer

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(1, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)

  noise.connect(gain)
  gain.connect(ctx.destination)

  noise.start()
  noise.stop(ctx.currentTime + 0.2)
}

export function playHat() {
  const ctx = getAudioContext()

  const noise = ctx.createBufferSource()
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < buffer.length; i++) {
    data[i] = Math.random() * 2 - 1
  }

  noise.buffer = buffer

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.5, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)

  noise.connect(gain)
  gain.connect(ctx.destination)

  noise.start()
  noise.stop(ctx.currentTime + 0.05)
}
