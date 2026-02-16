import { useState } from 'react'
import { tribeRespond } from '../../tribe/engine'
import { TRIBE_MODE } from '../../tribe/config'

export default function TribeAI({ view }) {
  const [messages, setMessages] = useState([
    { from: 'tribe', text: 'What’s good, tribe? Ready to execute?' },
  ])
  const [input, setInput] = useState('')

  const send = () => {
    if (!input) return
    const reply = tribeRespond({ view, input })
    setMessages(m => [
      ...m,
      { from: 'user', text: input },
      { from: 'tribe', text: reply },
    ])
    setInput('')
  }

  return (
    <div style={wrap}>
      <div style={header}>
        <span>TRIBE</span>
        {TRIBE_MODE === 'enhanced' && (
          <span style={locked}>ENHANCED (COMING SOON)</span>
        )}
      </div>

      <div style={log}>
        {messages.map((m, i) => (
          <div key={i} style={msg(m.from)}>
            {m.text}
          </div>
        ))}
      </div>

      <input
        style={inputStyle}
        placeholder="Talk to your tribe…"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && send()}
      />

      <div style={actions}>
        <Action label="Suggest Patterns" />
        <Action label="Coach Takes" />
      </div>

      <div style={unlock}>
        Unlock Enhanced Tribe with $SKR staking (VIP)
      </div>
    </div>
  )
}

function Action({ label }) {
  return (
    <button disabled style={actionBtn}>
      {label}
      <span style={soon}>COMING SOON</span>
    </button>
  )
}

const wrap = {
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8,
  padding: 14,
  marginTop: 24,
}

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 11,
  letterSpacing: 1.2,
  opacity: 0.7,
  marginBottom: 8,
}

const locked = {
  opacity: 0.4,
}

const log = {
  maxHeight: 160,
  overflowY: 'auto',
  marginBottom: 10,
}

const msg = from => ({
  fontSize: 12,
  opacity: from === 'tribe' ? 0.75 : 1,
  marginBottom: 6,
})

const inputStyle = {
  width: '100%',
  background: '#0b0f14',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#fff',
  padding: 8,
  marginBottom: 10,
}

const actions = {
  display: 'flex',
  gap: 8,
  marginBottom: 8,
}

const actionBtn = {
  flex: 1,
  background: '#121826',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#fff',
  opacity: 0.4,
  padding: 8,
  fontSize: 11,
  cursor: 'not-allowed',
}

const soon = {
  display: 'block',
  fontSize: 9,
  opacity: 0.5,
}

const unlock = {
  fontSize: 10,
  opacity: 0.5,
  textAlign: 'center',
}
