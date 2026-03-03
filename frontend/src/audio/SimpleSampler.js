export async function loadSample(url) {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  const audioContext = new AudioContext()
  return await audioContext.decodeAudioData(arrayBuffer)
}

export function playSample(buffer, volume = 1) {
  const audioContext = new AudioContext()
  const source = audioContext.createBufferSource()
  const gainNode = audioContext.createGain()

  gainNode.gain.value = volume

  source.buffer = buffer
  source.connect(gainNode)
  gainNode.connect(audioContext.destination)
  source.start(0)
}
