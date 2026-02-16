import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

export default function TopWallet(){
  const { publicKey } = useWallet()

  return(
    <div style={{
      position:"fixed",
      top:20,
      right:20,
      zIndex:20
    }}>
      <WalletMultiButton/>
      {publicKey && (
        <div style={{
          marginTop:6,
          fontSize:12,
          color:"#00F0FF"
        }}>
          {publicKey.toBase58().slice(0,4)}...
        </div>
      )}
    </div>
  )
}
