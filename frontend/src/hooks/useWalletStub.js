import { useState } from 'react'

export function useWalletStub() {
  const [connected, setConnected] = useState(true)
  const publicKey = connected ? 'WALLET_STUB_001' : null
  return { connected, publicKey }
}
