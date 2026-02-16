export default function RecordButton() {

  async function exportWav() {
    const ctx = new OfflineAudioContext(1, 44100 * 3, 44100)

    const osc = ctx.createOscillator()
    osc.frequency.value = 220
    osc.connect(ctx.destination)
    osc.start(0)
    osc.stop(1)

    const rendered = await ctx.startRendering()
    const wav = encodeWAV(rendered)

    const blob = new Blob([wav], { type: "audio/wav" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "circuit-export.wav"
    a.click()
  }

  return (
    <button
      onClick={exportWav}
      style={{
        marginTop: 40,
        padding: "15px 30px",
        borderRadius: 30,
        border: "none",
        background: "#00F0FF",
        color: "black",
        fontWeight: 700
      }}
    >
      EXPORT WAV
    </button>
  )
}

function encodeWAV(buffer) {
  const length = buffer.length * 2
  const view = new DataView(new ArrayBuffer(44 + length))

  function writeString(offset, str) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i))
    }
  }

  writeString(0, "RIFF")
  view.setUint32(4, 36 + length, true)
  writeString(8, "WAVE")
  writeString(12, "fmt ")
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, 44100, true)
  view.setUint32(28, 44100 * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeString(36, "data")
  view.setUint32(40, length, true)

  let offset = 44
  const channel = buffer.getChannelData(0)
  for (let i = 0; i < channel.length; i++) {
    view.setInt16(offset, channel[i] * 0x7fff, true)
    offset += 2
  }

  return view.buffer
}
