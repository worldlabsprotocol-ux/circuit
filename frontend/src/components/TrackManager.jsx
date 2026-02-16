import { useState } from "react"

export default function TrackManager() {
  const [tracks] = useState([
    { name: "Beat Alpha", revenue: 210 },
    { name: "Beat Omega", revenue: 165 }
  ])

  return (
    <div>
      <h3>Tracks</h3>
      {tracks.map((track, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <strong>{track.name}</strong>
          <p>Revenue: ${track.revenue}</p>
        </div>
      ))}
    </div>
  )
}
