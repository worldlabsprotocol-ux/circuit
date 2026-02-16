import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  Keypair,
} from '@solana/web3.js'
import { Buffer } from 'buffer'
import sha256 from 'js-sha256'

export const PROGRAM_ID = new PublicKey(
  'EXTMC1JzQHfmL4dpvt4dsmj9HhxyKPxfZZgTmca2nip9'
)

export const connection = new Connection(
  'https://api.devnet.solana.com',
  'confirmed'
)

function getDiscriminator(name) {
  const hash = sha256.digest(`global:${name}`)
  return Buffer.from(hash).slice(0, 8)
}

function u64ToBuffer(value) {
  const buf = Buffer.alloc(8)
  buf.writeBigUInt64LE(BigInt(value))
  return buf
}

export async function initializeAccount(wallet) {
  const data = Keypair.generate()

  const instruction = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: data.publicKey, isSigner: true, isWritable: true },
      { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data: getDiscriminator('initialize'),
  })

  const tx = new Transaction().add(instruction)
  tx.feePayer = wallet.publicKey
  tx.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash

  tx.partialSign(data)

  const signed = await wallet.signTransaction(tx)
  const sig = await connection.sendRawTransaction(signed.serialize())
  await connection.confirmTransaction(sig, 'confirmed')

  return data.publicKey.toBase58()
}

export async function readAccount(pubkey) {
  const info = await connection.getAccountInfo(new PublicKey(pubkey))
  const valueBytes = info.data.slice(8, 16)
  return Number(valueBytes.readBigUInt64LE())
}

export async function setValue(wallet, pubkey, newValue) {
  const instruction = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: new PublicKey(pubkey), isSigner: false, isWritable: true },
    ],
    data: Buffer.concat([
      getDiscriminator('set_value'),
      u64ToBuffer(newValue),
    ]),
  })

  const tx = new Transaction().add(instruction)
  tx.feePayer = wallet.publicKey
  tx.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash

  const signed = await wallet.signTransaction(tx)
  const sig = await connection.sendRawTransaction(signed.serialize())
  await connection.confirmTransaction(sig, 'confirmed')
}

