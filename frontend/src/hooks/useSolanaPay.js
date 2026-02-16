import { Connection, SystemProgram, Transaction, PublicKey } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'

const DEST = new PublicKey('11111111111111111111111111111111')

export function useSolanaPay() {
  const wallet = useWallet()

  const pay = async () => {
    if (!wallet.publicKey) return alert('Connect wallet')
    const conn = new Connection('https://api.devnet.solana.com')
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: DEST,
        lamports: 0.01 * 1e9,
      })
    )
    const sig = await wallet.sendTransaction(tx, conn)
    await conn.confirmTransaction(sig)
    localStorage.setItem('wl_paid', 'true')
    alert('Unlocked')
  }

  return { pay }
}
