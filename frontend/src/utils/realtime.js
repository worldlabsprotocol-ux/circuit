let socket = null

export function initRealtime(onSync) {
  if (!socket) {
    socket = new WebSocket("ws://localhost:8080")

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "sync") {
        onSync(data.state)
      }
    }
  }
}

export function broadcastState(state) {
  if (socket && socket.readyState === 1) {
    socket.send(JSON.stringify({
      type: "update",
      state
    }))
  }
}
