import { Metaplex } from "@metaplex-foundation/js"
import { Connection, clusterApiUrl } from "@solana/web3.js"

export async function mintNFT(walletAdapter, metadataUrl, name) {
  if (!walletAdapter?.publicKey) {
    throw new Error("Wallet not connected")
  }

  const connection = new Connection(clusterApiUrl("devnet"))
  const metaplex = Metaplex.make(connection).use({
    publicKey: walletAdapter.publicKey,
    signTransaction: walletAdapter.signTransaction,
    signAllTransactions: walletAdapter.signAllTransactions,
  })

  const { nft } = await metaplex.nfts().create({
    uri: metadataUrl,
    name,
    sellerFeeBasisPoints: 500,
  })

  return nft.address.toBase58()
}
