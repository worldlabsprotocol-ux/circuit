export default function QRPanel({ title, value }) {
  return (
    <div style={panel}>
      <div style={titleStyle}>{title}</div>
      <div style={qrBox}>
        <code style={qrText}>{value}</code>
      </div>
      <div style={hint}>Scan with wallet</div>
    </div>
  )
}

const panel = {
  padding: 16,
  background: '#121826',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8,
  marginBottom: 16,
}

const titleStyle = {
  fontSize: 13,
  opacity: 0.7,
  marginBottom: 8,
}

const qrBox = {
  background: '#0b0f14',
  padding: 12,
  borderRadius: 6,
}

const qrText = {
  fontSize: 11,
  wordBreak: 'break-all',
}

const hint = {
  marginTop: 6,
  fontSize: 11,
  opacity: 0.5,
}
