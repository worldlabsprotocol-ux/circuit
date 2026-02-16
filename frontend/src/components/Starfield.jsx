import { useEffect, useRef } from "react"

export default function Starfield() {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars = Array.from({ length: 350 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      speed: Math.random() * 0.4 + 0.1,
      depth: Math.random()
    }))

    function animate() {
      ctx.fillStyle = "#050816"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      stars.forEach(star => {
        star.y += star.speed * (0.5 + star.depth)
        if (star.y > canvas.height) star.y = 0

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)

        if (star.depth > 0.8) {
          ctx.fillStyle = "#8A2BE2"
        } else {
          ctx.fillStyle = "#00F0FF"
        }

        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0
      }}
    />
  )
}
