import { useEffect, useRef } from 'react'
import { createTipQR } from './pay/solanaPay'

const DISTORTION_TIP_WALLET = 'REPLACE_WITH_YOUR_SOLANA_WALLET'

export default function DistortionPayTip() {
  const qrRef = useRef(null)

  useEffect(() => {
    if (!qrRef.current) return
    qrRef.current.innerHTML = ''

    const qr = createTipQR({
      recipient: DISTORTION_TIP_WALLET,
      amount: 0.1,
      label: 'Distortion Tip',
    })

    qr.append(qrRef.current)
  }, [])

  return (
    <div style={{ marginTop: 32 }}>
      <h3>Distortion Pay — Tip</h3>
      <div ref={qrRef} />
    </div>
  )
}
