import { useState } from "react"

export default function InfoIcon({ text }) {
  const [show, setShow] = useState(false)

  return (
    <span
      style={{ position: "relative", marginLeft: 6, cursor: "pointer" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      ⓘ
      {show && (
        <div style={{
          position: "absolute",
          bottom: "120%",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#00F0FF",
          color: "#000",
          padding: 6,
          borderRadius: 6,
          fontSize: 12,
          whiteSpace: "nowrap",
          boxShadow: "0 0 10px #00F0FF"
        }}>
          {text}
        </div>
      )}
    </span>
  )
}
