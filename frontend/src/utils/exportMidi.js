import { Midi } from '@tonejs/midi'

export function exportMidi(pattern, tempo = 120) {
  const midi = new Midi()
  midi.header.setTempo(tempo)

  Object.entries(pattern).forEach(([lane, steps], idx) => {
    const track = midi.addTrack()
    steps.forEach((v, i) => {
      if (v > 0) {
        track.addNote({
          midi: 36 + idx,
          time: i * 0.25,
          duration: 0.1,
          velocity: v / 3,
        })
      }
    })
  })

  const blob = new Blob([midi.toArray()], { type: 'audio/midi' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'wl-studio.mid'
  a.click()
}
