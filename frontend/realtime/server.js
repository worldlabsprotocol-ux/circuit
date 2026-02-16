const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString())
      }
    })
  })
})

console.log("Realtime server running on ws://localhost:8080")
