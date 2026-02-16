let socket = null

export function connect() {
  socket = new WebSocket("ws://localhost:8080")
}

export function send(event) {
  if (socket && socket.readyState === 1) {
    socket.send(JSON.stringify(event))
  }
}

export function listen(handler) {
  if (!socket) return
  socket.onmessage = (msg) => {
    handler(JSON.parse(msg.data))
  }
}
