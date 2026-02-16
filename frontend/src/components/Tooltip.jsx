import { useState } from "react"

export default function Tooltip({ text, children }) {
  const [show, setShow] = useState(false)

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}

      {show && (
        <div style={{
          position: "absolute",
          bottom: "120%",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#00F0FF",
          color: "#000",
          padding: "6px 10px",
          borderRadius: 6,
          fontSize: 12,
          whiteSpace: "nowrap",
          boxShadow: "0 0 10px #00F0FF"
        }}>
          {text}
        </div>
      )}
    </div>
  )
}
