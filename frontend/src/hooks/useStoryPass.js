import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { useState } from 'react'

const BURN_ADDRESS = new PublicKey('11111111111111111111111111111111')
const DEVNET = 'https://api.devnet.solana.com'

export function useStoryPass(episodeId) {
  const { publicKey, sendTransaction } = useWallet()
  const [ownsPass, setOwnsPass] = useState(
    localStorage.getItem('pass-' + episodeId) === 'true'
  )

  const mint = async () => {
    if (!publicKey) throw new Error('Wallet not connected')

    const connection = new Connection(DEVNET, 'confirmed')

    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: BURN_ADDRESS,
        lamports: 0.001 * 1e9
      })
    )

    const signature = await sendTransaction(tx, connection)
    await connection.confirmTransaction(signature, 'confirmed')

    localStorage.setItem('pass-' + episodeId, 'true')
    setOwnsPass(true)
  }

  return { ownsPass, mint }
}
