import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { EPISODE_1 } from '../stories/episode1'
import AstronautAvatar from './AstronautAvatar'

const STORAGE_KEY = 'wl_atlas_progress'

const THOUGHTS = {
  intro: 'Every system sounds calm at first.',
  offer: 'Nothing breaks when you stop asking questions.',
  source: 'Returns always come from someone.',
  real_assets: 'Real things add weight, not certainty.',
  ownership: 'Claims are not the same as control.',
  leverage: 'Speed feels good until it does not.',
  stress: 'Pressure reveals structure.',
  exit_test: 'Trust leaves quietly.',
  ending_sustainable: 'It will not impress anyone. It will last.',
  ending_extract: 'The system worked as designed.',
  ending_capture: 'Power reshapes outcomes.'
}

export default function AtlasView() {
  const mount = useRef(null)

  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved
      ? JSON.parse(saved)
      : { chapter: 'intro', credits: 5, endings: [] }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000)
    camera.position.z = 420

    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    mount.current.appendChild(renderer.domElement)

    const starGeo = new THREE.BufferGeometry()
    const starPos = new Float32Array(6000 * 3)
    for (let i = 0; i < starPos.length; i++) starPos[i] = (Math.random() - 0.5) * 1400
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color:0xffffff, size:1.2, opacity:0.9, transparent:true })
    )
    scene.add(stars)

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(120,64,64),
      new THREE.MeshBasicMaterial({ color:'#9b59ff', wireframe:true })
    )
    scene.add(core)

    let t = 0
    let frame
    const animate = () => {
      t += 0.002
      stars.rotation.y += 0.0003
      core.rotation.y += 0.002
      core.rotation.x = Math.sin(t) * 0.02
      core.scale.setScalar(1 + Math.sin(t * 2) * 0.015)
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

  const node = EPISODE_1.chapters[state.chapter]

  const choose = (choice) => {
    if (choice.cost > state.credits) return
    setState(s => ({
      ...s,
      credits: s.credits - choice.cost,
      chapter: choice.next
    }))
  }

  useEffect(() => {
    if (node?.ending && !state.endings.includes(node.ending)) {
      setState(s => ({
        ...s,
        endings: [...s.endings, node.ending]
      }))
    }
  }, [node])

  return (
    <div style={{ width:'100vw', height:'100vh', position:'relative', overflow:'hidden' }}>
      <div ref={mount} style={{ position:'absolute', inset:0 }} />

      <div style={panel}>
        <div style={{ fontSize:12, opacity:0.6 }}>
          Credits: {state.credits}
        </div>

        <div style={{ fontSize:14, marginTop:6 }}>
          {node.text}
        </div>

        {node.choices && (
          <div style={{ marginTop:12 }}>
            {node.choices.map((c,i)=>(
              <button key={i} style={choiceBtn} onClick={()=>choose(c)}>
                {c.label}{c.cost > 0 && ` · ${c.cost} credits`}
              </button>
            ))}
          </div>
        )}

        {node.ending && (
          <div style={{ marginTop:10, fontSize:12, opacity:0.7 }}>
            Ending reached: {node.ending}
          </div>
        )}
      </div>

      <AstronautAvatar thought={THOUGHTS[state.chapter]} />
    </div>
  )
}

const panel = {
  position:'absolute',
  top:90,
  left:20,
  maxWidth:420,
  background:'rgba(15,20,30,0.85)',
  backdropFilter:'blur(12px)',
  borderRadius:16,
  padding:16,
  color:'#fff',
  border:'1px solid rgba(255,255,255,0.1)',
  zIndex:20
}

const choiceBtn = {
  display:'block',
  width:'100%',
  marginTop:8,
  background:'rgba(255,255,255,0.08)',
  border:'1px solid rgba(255,255,255,0.15)',
  padding:'8px 10px',
  borderRadius:8,
  color:'#fff',
  cursor:'pointer'
}
