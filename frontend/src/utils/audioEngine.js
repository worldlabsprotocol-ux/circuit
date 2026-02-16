let ctx
let buffers = {}

export async function initAudio() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  return ctx
}

export async function loadSample(name, url) {
  const res = await fetch(url)
  const arrayBuffer = await res.arrayBuffer()
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
  buffers[name] = audioBuffer
}

export function playSample(name, velocity = 1) {
  if (!buffers[name]) return
  const src = ctx.createBufferSource()
  const gain = ctx.createGain()
  gain.gain.value = velocity
  src.buffer = buffers[name]
  src.connect(gain)
  gain.connect(ctx.destination)
  src.start()
}
