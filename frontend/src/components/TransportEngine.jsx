import { useEffect } from "react"

export default function TransportEngine({
  playing,
  tempo,
  loop,
  loopStart,
  loopEnd,
  step,
  setStep
}) {
  useEffect(() => {
    if (!playing) return

    const interval = setInterval(() => {
      setStep(prev => {
        let next = prev + 1
        if (loop && next >= loopEnd) {
          next = loopStart
        }
        return next
      })
    }, (60000 / tempo) / 4)

    return () => clearInterval(interval)
  }, [playing, tempo, loop, loopStart, loopEnd])

  return null
}
