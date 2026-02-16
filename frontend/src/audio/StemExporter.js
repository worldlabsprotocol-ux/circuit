export async function exportStem(duration = 4) {
  const offline = new OfflineAudioContext(1, 44100 * duration, 44100)

  const osc = offline.createOscillator()
  osc.frequency.value = 220
  osc.connect(offline.destination)
  osc.start(0)
  osc.stop(duration)

  const rendered = await offline.startRendering()

  const channelData = rendered.getChannelData(0)
  const buffer = new ArrayBuffer(channelData.length * 2)
  const view = new DataView(buffer)

  for (let i = 0; i < channelData.length; i++) {
    view.setInt16(i * 2, channelData[i] * 0x7fff, true)
  }

  const blob = new Blob([buffer], { type: "audio/wav" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = "stem.wav"
  a.click()
}
