import { useRef } from 'react'

export function usePerformance() {
  const events = useRef([])

  const record = (lane, step, velocity) => {
    events.current.push({
      lane,
      step,
      velocity,
      time: performance.now(),
    })
  }

  const stop = () => {
    const take = [...events.current]
    events.current = []
    return take
  }

  return { record, stop }
}
