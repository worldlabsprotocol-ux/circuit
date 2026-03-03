import { useEffect, useRef } from "react"

export default function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    const stars = Array.from({ length: 200 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: Math.random() * 0.5 + 0.2
    }))

    function animate() {
      ctx.fillStyle = "black"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#00ffff"

      stars.forEach(star => {
        star.y += star.speed
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
        ctx.fillRect(star.x, star.y, 2, 2)
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => window.removeEventListener("resize", resize)
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
