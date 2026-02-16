import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

/* -----------------------------
   ASTERANK (VISIBLE PREVIEW)
------------------------------ */
function AsterankPanel() {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('Loading live data…')

  useEffect(() => {
    fetch('https://api.asterank.com/api/asterank')
      .then(r => r.json())
      .then(d => {
        setData(d.slice(0, 5))
        setStatus('Live data')
      })
      .catch(() => {
        setData([
          { name: '16 Psyche', value: '$10T est.' },
          { name: 'Ryugu', value: '$95B est.' },
          { name: 'Bennu', value: '$670M est.' },
        ])
        setStatus('Preview data (live feed coming)')
      })
  }, [])

  return (
    <div className="panel">
      <div className="panel-header">
        ASTERANK · {status}
      </div>

      {data &&
        data.map((a, i) => (
          <div key={i} style={{ fontSize: 12, marginBottom: 6 }}>
            {a.name || a.full_name} · {a.value || ''}
          </div>
        ))}

      <div style={{ fontSize: 10, opacity: 0.5, marginTop: 8 }}>
        Data sourced from Asterank. Live integration will be proxied server-side.
      </div>
    </div>
  )
}

/* -----------------------------
   BASIC 3D VIEWER
------------------------------ */
function Viewer3D() {
  const mount = useRef(null)

  useEffect(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(200, 200)
    mount.current.appendChild(renderer.domElement)

    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x9b59ff })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    camera.position.z = 2

    let frame
    const animate = () => {
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      renderer.render(scene, camera)
      frame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(frame)
      renderer.dispose()
      mount.current.innerHTML = ''
    }
  }, [])

  return (
    <div className="panel">
      <div className="panel-header">3D VIEW</div>
      <div ref={mount} />
    </div>
  )
}

/* -----------------------------
   DYAD (SAFE SCAFFOLD)
------------------------------ */
function DyadPanel() {
  return (
    <div className="panel">
      <div className="panel-header">DYAD MINTING</div>
      <button
        type="button"
        disabled
        style={{
          padding: 10,
          background: '#121826',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 8,
          opacity: 0.4,
          cursor: 'not-allowed',
        }}
      >
        Mint with Dyad (Coming Soon)
      </button>
    </div>
  )
}

/* -----------------------------
   PUBLIC VIEWS
------------------------------ */
export function ArrangeView() {
  return (
    <div className="panel mode-enter">
      <div className="panel-header">ARRANGEMENT</div>
      <div>Intro · Verse · Drop · Outro</div>
    </div>
  )
}

export function AutomationView() {
  return (
    <div className="panel mode-enter">
      <div className="panel-header">AUTOMATION</div>
      <AsterankPanel />
      <Viewer3D />
      <DyadPanel />
    </div>
  )
}

export function SamplesView() {
  return (
    <div className="panel mode-enter">
      <div className="panel-header">SAMPLES</div>
      <input type="file" multiple className="touch" />
      <div style={{ opacity: 0.6 }}>Import sounds</div>
    </div>
  )
}
