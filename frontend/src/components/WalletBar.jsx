import { useState } from "react"

export default function WalletBar() {
  const [connected, setConnected] = useState(false)

  return (
    <div>
      {connected ? (
        <button onClick={() => setConnected(false)} style={btn}>
          Disconnect ⨯
        </button>
      ) : (
        <button onClick={() => setConnected(true)} style={btn}>
          Connect Wallet
        </button>
      )}
    </div>
  )
}

const btn = {
  padding: "8px 16px",
  background: "white",
  color: "black",
  border: "none",
  cursor: "pointer"
}
