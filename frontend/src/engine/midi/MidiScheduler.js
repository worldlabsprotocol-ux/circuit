export class MidiScheduler {
  constructor(audioContext, instrument, tempo) {
    this.context = audioContext
    this.instrument = instrument
    this.tempo = tempo
  }

  beatsToSeconds(beats) {
    return (60 / this.tempo) * beats
  }

  scheduleClip(clip, offset = 0) {
    clip.notes.forEach(note => {
      const startTime =
        this.context.currentTime +
        this.beatsToSeconds(note.start + offset)

      const duration = this.beatsToSeconds(note.duration)

      this.instrument.triggerNote(
        note.pitch,
        note.velocity,
        startTime,
        duration
      )
    })
  }
}
