export default function Transport({ playing, start, stop }) {
  return (
    <div style={wrap}>
      <button
        type="button"
        onClick={playing ? stop : start}
        style={btn(playing)}
      >
        {playing ? 'STOP' : 'PLAY'}
      </button>
    </div>
  )
}

const wrap = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: 24,
}

const btn = playing => ({
  background: playing ? '#ff7675' : '#9b59ff',
  color: '#fff',
  border: 'none',
  borderRadius: 24,
  padding: '12px 32px',
  fontSize: 14,
  letterSpacing: 1.4,
  cursor: 'pointer',
})
