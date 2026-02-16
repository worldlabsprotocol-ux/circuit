export function exportMIDI(pattern) {
  const header = "MThd\\x00\\x00\\x00\\x06\\x00\\x01\\x00\\x01\\x01\\xE0"
  const track = "MTrk"

  const blob = new Blob([header + track], { type: "audio/midi" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = "pattern.mid"
  a.click()
}
