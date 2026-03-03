const WebSocket = require("ws")

const wss = new WebSocket.Server({ port: 8080 })

let sharedState = null

wss.on("connection", (ws) => {
  if (sharedState) {
    ws.send(JSON.stringify({ type: "sync", state: sharedState }))
  }

  ws.on("message", (message) => {
    const data = JSON.parse(message)

    if (data.type === "update") {
      sharedState = data.state

      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "sync", state: sharedState }))
        }
      })
    }
  })
})

console.log("Realtime server running on ws://localhost:8080")
