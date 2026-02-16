import { useEffect } from 'react'
import { initAudio, playStep } from '../audio/engine'

export function useAudioEngine(step, playing, clip) {
  useEffect(() => {
    initAudio()
  }, [])

  useEffect(() => {
    if (!playing || !clip) return
    playStep(clip.pattern, step)
  }, [step, playing, clip])
}
