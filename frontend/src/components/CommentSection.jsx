import { useState, useEffect } from "react"

export default function CommentSection({ sessionId }) {
  const storageKey = "comments_" + (sessionId || "default")

  const [comments, setComments] = useState([])
  const [input, setInput] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      setComments(JSON.parse(stored))
    }
  }, [storageKey])

  function addComment() {
    if (!input.trim()) return

    const newComments = [
      { text: input, time: Date.now() },
      ...comments
    ].slice(0, 5)

    setComments(newComments)
    localStorage.setItem(storageKey, JSON.stringify(newComments))
    setInput("")
  }

  return (
    <div style={{
      marginTop: "40px",
      padding: "20px",
      borderTop: "1px solid rgba(0,255,255,0.3)"
    }}>
      <h3 style={{ marginBottom: "10px" }}>Comments</h3>

      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Leave feedback..."
          style={{
            flex: 1,
            padding: "8px",
            background: "#111",
            color: "#0ff",
            border: "1px solid #0ff"
          }}
        />
        <button onClick={addComment}>
          Post
        </button>
      </div>

      {comments.map((c, i) => (
        <div key={i} style={{
          fontSize: "14px",
          opacity: 0.8,
          marginBottom: "6px"
        }}>
          {c.text}
        </div>
      ))}
    </div>
  )
}
