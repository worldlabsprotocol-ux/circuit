import * as anchor from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import rawIdl from './idl/anchor.json'

const PROGRAM_ID = new PublicKey(
  'EXTMC1JzQHfmL4dpvt4dsmj9HhxyKPxfZZgTmca2nip9'
)

/**
 * IMPORTANT:
 * Anchor JS tries to auto-build AccountClient from idl.accounts.
 * Our IDL (correctly) does not include account layouts,
 * so we MUST strip accounts to prevent `.size` crashes.
 */
const idl = {
  ...rawIdl,
  accounts: [],
}

export function getProgram(wallet) {
  const connection = new anchor.web3.Connection(
    'https://api.devnet.solana.com',
    'confirmed'
  )

  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    { commitment: 'confirmed' }
  )

  return new anchor.Program(idl, PROGRAM_ID, provider)
}

