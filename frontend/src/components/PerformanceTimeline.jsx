import { useEffect, useRef } from "react"

export default function PerformanceTimeline({
  events,
  setEvents,
  playhead,
  setPlayhead
}) {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    canvas.width = canvas.offsetWidth
    canvas.height = 80

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    events.forEach((event, i) => {
      const x = i * 100
      ctx.fillStyle = event.color
      ctx.fillRect(x, 20, 80, 40)

      ctx.beginPath()
      for (let j = 0; j < 80; j++) {
        const y = 40 + Math.sin(j * 0.2) * 10
        ctx.lineTo(x + j, y)
      }
      ctx.strokeStyle = "black"
      ctx.stroke()
    })

    ctx.fillStyle = "white"
    ctx.fillRect(playhead * 100, 0, 2, 80)

  }, [events, playhead])

  return (
    <div style={{ margin: "20px 0" }}>
      <canvas ref={canvasRef} style={{ width: "100%" }} />
      <input
        type="range"
        min="0"
        max={events.length}
        value={playhead}
        onChange={(e) => setPlayhead(parseInt(e.target.value))}
        style={{ width: "100%" }}
      />
    </div>
  )
}
