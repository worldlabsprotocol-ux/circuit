import { useEffect, useState } from "react"

export default function MasterMeter() {
  const [level, setLevel] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setLevel(Math.random() * 100)
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      width: 20,
      height: 120,
      background: "#111",
      borderRadius: 10,
      display: "flex",
      alignItems: "flex-end"
    }}>
      <div style={{
        width: "100%",
        height: level + "%",
        background: "linear-gradient(red, yellow, #00F0FF)"
      }} />
    </div>
  )
}
