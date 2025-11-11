"use client"

import * as React from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import {
  OrbitControls,
  Image as DreiImage,
  Environment,
  Html,
} from "@react-three/drei"
import { Vector3 } from "three"

type PhotoSpec = {
  url: string
  position: [number, number, number]
  scale: number // largeur en unités (hauteur auto via ratio)
  rotationY?: number
}

const photos: PhotoSpec[] = [
  { url: "/images/sflower1.jpg", position: [-1.8, 0.6, 0], scale: 1.3 },
  { url: "/images/sflower2.jpg", position: [3.5, -0.4, 0], scale: 1.3 },
  {
    url: "/images/sflower3.jpg",
    position: [1.5, 0, 0],
    scale: 1.8,
  },
  { url: "/images/sflower4.jpg", position: [-1, -1, 0], scale: 2.4 },
  { url: "/images/sflower5.jpg", position: [2.5, -1.7, 0], scale: 1.5 },
  {
    url: "/images/sflower6.jpg",
    position: [-3.5, -1, 0],
    scale: 1.2,
  },
  { url: "/images/sflower7.jpg", position: [0.7, 1.8, 0], scale: 1 },
]

function Photo({ url, position, scale = 1.5, rotationY = 0 }: PhotoSpec) {
  const ref = useRef<THREE.Mesh>(null!)
  const base = useRef<number>(scale) // <-- mémorise la taille d’origine
  const [hovered, setHovered] = React.useState(false)

  useFrame((_, dt) => {
    if (!ref.current) return
    const s = ref.current.scale
    const goal = base.current * (hovered ? 1.06 : 1.0) // <-- relatif à la base
    const next = s.x + (goal - s.x) * Math.min(1, dt * 6)
    s.set(next, next, 1)
    ref.current.position.y =
      position[1] + Math.sin(Date.now() * 0.001 + position[0]) * 0.02
  })

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <DreiImage
        ref={ref as never}
        url={url}
        transparent
        toneMapped
        scale={scale} // <-- conserve des tailles différentes
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = "auto"
        }}
      />
    </group>
  )
}

// function Photo({ url, position, scale, rotationY = 0 }: PhotoSpec) {
//   const ref = useRef<THREE.Mesh>(null!)
//   const target = useRef(new Vector3(...position))

//   // petit effet de “breathing” et hover
//   const [hovered, setHovered] = React.useState(false)
//   useFrame((_, dt) => {
//     if (!ref.current) return
//     // scale doux au survol
//     const s = ref.current.scale
//     const goal = hovered ? 1.06 : 1.0
//     s.setScalar(s.x + (goal - s.x) * Math.min(1, dt * 6))

//     // légère flottaison
//     ref.current.position.y =
//       position[1] + Math.sin(Date.now() * 0.001 + position[0]) * 0.02
//   })

//   return (
//     <group position={position} rotation={[0, rotationY, 0]}>
//       <DreiImage
//         ref={ref as never}
//         url={url}
//         transparent
//         toneMapped
//         scale={scale}
//         onPointerOver={(e) => {
//           e.stopPropagation()
//           setHovered(true)
//           document.body.style.cursor = "pointer"
//         }}
//         onPointerOut={() => {
//           setHovered(false)
//           document.body.style.cursor = "auto"
//         }}
//       />
//     </group>
//   )
// }
// --- 🎯 composant de zoom temporaire
function ZoomOnDrag({ zoomFactor = 0.92 }: { zoomFactor?: number }) {
  const { camera } = useThree()
  const baseZ = useRef(camera.position.z)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const onDown = () => setActive(true)
    const onUp = () => setActive(false)
    window.addEventListener("pointerdown", onDown)
    window.addEventListener("pointerup", onUp)
    return () => {
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
    }
  }, [])

  useFrame((_, dt) => {
    const goalZ = active ? baseZ.current * zoomFactor : baseZ.current
    camera.position.z += (goalZ - camera.position.z) * Math.min(1, dt * 5)
  })

  return null
}

export default function PhotoScene() {
  return (
    <div className="w-full h-[80vh]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]} // DPR adaptatif
      >
        {/* Lumières douces */}
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 3, 3]} intensity={0.6} />

        {/* Images */}
        {photos.map((p) => (
          <Photo key={p.url} {...p} />
        ))}

        {/* Contrôles caméra */}
        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          // ← le drag GAUCHE devient PAN (click & drag 2D)
          mouseButtons={{
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE,
          }}
          // gestes tactiles
          touches={{ ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN }}
          // pas de rotation pour rester en "2D"
          enableRotate={false}
          // pan dans l'espace écran → donne un feeling 2D propre
          screenSpacePanning
          // limites de zoom (distance caméra-cible)
          minDistance={2}
          maxDistance={9}
          // toujours regarder le plan z=0
          target={[0, 0, 0]}
        />
        <ZoomOnDrag zoomFactor={0.92} />
        {/* environnement léger (HDRI de base) */}
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
