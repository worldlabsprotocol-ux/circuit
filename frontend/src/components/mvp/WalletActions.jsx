export default function WalletActions() {
  return (
    <div style={{ maxWidth: 560 }}>
      <Section
        title="SOLANA PAY"
        status="LIVE"
        description="Tip creators or purchase merch using Solana Pay. Designed for fast, composable payments with wallet-native QR flows."
      >
        <QR
          value="solana:WLSTUDIO_WALLET?amount=0.01"
          hint="Scan with any Solana wallet. DYAD support coming for ultra-low fees."
        />
      </Section>

      <Section
        title="DISTORTION NFT"
        status="OPEN"
        description="Distortion NFTs represent recorded moments of performance. Minting is instant and handled by WL Studio backend."
      >
        <QR
          value="wlstudio://mint"
          hint="Scanning triggers a backend mint tied to this clip."
        />
      </Section>

      <Section
        title="$SKR STAKING"
        status="COMING SOON"
        description="Stake $SKR to unlock VIP tools, yield participation, and protocol-level influence."
        locked
      />
    </div>
  )
}

function Section({ title, status, description, children, locked }) {
  return (
    <div style={section}>
      <div style={header}>
        <div>{title}</div>
        <div style={statusTag(locked)}>{status}</div>
      </div>
      <div style={desc}>{description}</div>
      {children}
      {locked && (
        <div style={lockedNote}>
          Requires wallet verification and minimum stake.
        </div>
      )}
    </div>
  )
}

function QR({ value, hint }) {
  return (
    <div style={qrWrap}>
      <code style={qr}>{value}</code>
      <div style={hintStyle}>{hint}</div>
    </div>
  )
}

const section = {
  padding: 18,
  marginBottom: 20,
  background: '#121826',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8,
}

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 13,
  letterSpacing: 1.2,
  marginBottom: 8,
}

const statusTag = locked => ({
  fontSize: 10,
  opacity: locked ? 0.4 : 0.8,
})

const desc = {
  fontSize: 12,
  opacity: 0.7,
  marginBottom: 12,
}

const qrWrap = {
  background: '#0b0f14',
  padding: 12,
  borderRadius: 6,
}

const qr = {
  fontSize: 11,
  wordBreak: 'break-all',
}

const hintStyle = {
  fontSize: 11,
  opacity: 0.5,
  marginTop: 6,
}

const lockedNote = {
  marginTop: 10,
  fontSize: 11,
  opacity: 0.4,
}
