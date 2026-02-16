import { useEffect } from 'react'
import { WebMidi } from 'webmidi'
import { synth } from '../audio/engine'

export function useMidi() {
  useEffect(() => {
    WebMidi.enable()
      .then(() => {
        WebMidi.inputs.forEach(input => {
          input.addListener('noteon', e => {
            synth.triggerAttackRelease(
              e.note.name + e.note.octave,
              '8n'
            )
          })
        })
      })
      .catch(() => {})
  }, [])
}
