import { useEffect, useRef } from 'react'
import { playSample } from '../utils/audioEngine'

export function useScheduler(playing, clip, tempo = 120) {
  const stepRef = useRef(0)
  const timer = useRef(null)
  const interval = (60 / tempo) * 1000 / 4

  useEffect(() => {
    if (!playing || !clip) return

    timer.current = setInterval(() => {
      Object.entries(clip.pattern).forEach(([lane, steps]) => {
        const v = steps[stepRef.current]
        if (v > 0) playSample(lane, v * 0.4)
      })
      stepRef.current = (stepRef.current + 1) % 16
    }, interval)

    return () => clearInterval(timer.current)
  }, [playing, clip, tempo])
}
