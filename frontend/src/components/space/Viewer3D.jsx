import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Viewer3D() {
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

    let anim
    const animate = () => {
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      renderer.render(scene, camera)
      anim = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(anim)
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
