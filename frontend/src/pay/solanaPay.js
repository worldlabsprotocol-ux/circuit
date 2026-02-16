import { encodeURL, createQR } from '@solana/pay'
import { PublicKey } from '@solana/web3.js'

export function createTipQR({ recipient, amount, label }) {
  const url = encodeURL({
    recipient: new PublicKey(recipient),
    amount,
    label,
    message: 'Distortion Pay Tip',
    memo: 'DISTORTION_PAY_V1',
  })

  return createQR(url, 256)
}
