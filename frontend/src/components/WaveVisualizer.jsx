import { useEffect, useRef } from "react"

export default function WaveVisualizer({ tempo }) {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    canvas.width = window.innerWidth
    canvas.height = 120

    let phase = 0

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        for (let x = 0; x < canvas.width; x++) {
          const y =
            60 +
            Math.sin((x + phase + i * 50) * 0.02) * (20 - i * 5)
          ctx.lineTo(x, y)
        }
        ctx.strokeStyle = i === 0 ? "#00F0FF" : i === 1 ? "#8A2BE2" : "#00FFAA"
        ctx.stroke()
      }

      phase += tempo * 0.02
      requestAnimationFrame(draw)
    }

    draw()
  }, [tempo])

  return (
    <canvas ref={canvasRef} style={{ width: "100%", margin: "20px 0" }} />
  )
}
