import { useEffect, useRef } from "react"

export default function AnalyticsCharts() {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    canvas.width = 700
    canvas.height = 250

    const revenueData = [120, 180, 240, 310, 420, 500]
    const platformData = [320, 210, 140, 90]

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Revenue Line
    ctx.beginPath()
    ctx.moveTo(0, 200 - revenueData[0])
    revenueData.forEach((val, i) => {
      ctx.lineTo(i * 100, 200 - val)
    })
    ctx.strokeStyle = "#00F0FF"
    ctx.lineWidth = 3
    ctx.stroke()

    // Platform Bars
    platformData.forEach((val, i) => {
      ctx.fillStyle = "#8A2BE2"
      ctx.fillRect(450 + i * 50, 200 - val / 2, 30, val / 2)
    })

  }, [])

  return (
    <div>
      <h3>Revenue & Platform Breakdown</h3>
      <canvas ref={canvasRef} />
    </div>
  )
}
