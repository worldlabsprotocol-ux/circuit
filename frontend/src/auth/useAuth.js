import { useState } from 'react'

export function useAuth() {
  const [user] = useState({
    id: 'user_001',
    email: 'user@example.com',
    walletId: 'embedded_wallet_001'
  })
  return { user }
}
