import { useState } from 'react'

const COLORS = {
  kick: '#ff7675',
  snare: '#74b9ff',
  hat: '#55efc4',
}

export default function Sequencer({ clip, toggle, currentStep = 0, setPatternLength }) {
  const [dragging, setDragging] = useState(null)

  if (!clip) return <div style={{ opacity: 0.5 }}>Create a clip</div>

  const onDrag = (lane, i, e) => {
    const rect = e.target.getBoundingClientRect()
    const y = e.clientY - rect.top
    const v = Math.max(0, Math.min(3, 3 - Math.floor((y / rect.height) * 4)))
    toggle(lane, i, v)
  }

  return (
    <div>
      <div style={topBar}>
        <span>PATTERN</span>
        <select onChange={e => setPatternLength(Number(e.target.value))}>
          <option value={8}>8</option>
          <option value={16}>16</option>
          <option value={32}>32</option>
        </select>
      </div>

      {Object.entries(clip.pattern).map(([lane, steps]) => (
        <div key={lane} style={channel}>
          <div style={{ color: COLORS[lane], marginBottom: 6 }}>
            {lane.toUpperCase()}
          </div>

          <div style={grid}>
            {steps.map((v, i) => (
              <div
                key={i}
                onMouseDown={() => setDragging({ lane, i })}
                onMouseMove={e =>
                  dragging &&
                  dragging.lane === lane &&
                  dragging.i === i &&
                  onDrag(lane, i, e)
                }
                onMouseUp={() => setDragging(null)}
                style={{
                  ...pad,
                  background: v ? COLORS[lane] : 'rgba(255,255,255,0.08)',
                  opacity: v ? v / 3 : 0.2,
                  outline:
                    i === currentStep
                      ? '2px solid rgba(255,255,255,0.4)'
                      : 'none',
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const topBar = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: 16,
}

const channel = {
  marginBottom: 24,
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(16, 1fr)',
  gap: 8,
}

const pad = {
  width: '100%',
  paddingBottom: '100%',
  borderRadius: 8,
  cursor: 'ns-resize',
}
