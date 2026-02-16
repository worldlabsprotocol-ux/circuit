import { useEffect, useState } from 'react'

export default function AsterankPanel() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('https://api.asterank.com/api/asterank')
      .then(r => r.json())
      .then(d => setData(d.slice(0, 5)))
      .catch(() => setError(true))
  }, [])

  return (
    <div className="panel">
      <div className="panel-header">ASTERANK (LIVE DATA)</div>

      {error && <div style={{ opacity: 0.5 }}>Unavailable</div>}

      {data &&
        data.map(a => (
          <div key={a.full_name} style={{ fontSize: 12, marginBottom: 6 }}>
            {a.full_name} · ${Math.round(a.price || 0)}
          </div>
        ))}
    </div>
  )
}
