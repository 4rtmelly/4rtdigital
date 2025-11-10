"use client"

import * as React from "react"
import { Canvas, useFrame } from "@react-three/fiber"
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
  scale?: number // largeur en unités (hauteur auto via ratio)
  rotationY?: number
}

const photos: PhotoSpec[] = [
  { url: "/images/sflower1.jpg", position: [-1.8, 0.6, 0], scale: 1.4 },
  { url: "/images/sflower2.jpg", position: [2, -0.4, 0], scale: 1.6 },
  {
    url: "/images/sflower3.jpg",
    position: [1.9, 0.3, 0],
    scale: 1.2,
    rotationY: -0.25,
  },
  { url: "/images/sflower4.jpg", position: [-1, -1, 0], scale:1.5 },
  { url: "/images/sflower5.jpg", position: [-1, -1.5, 0], scale: 2 },
  {
    url: "/images/sflower6.jpg",
    position: [3, -2.3, 0],
    scale: 1.5,
    rotationY: -0.25,
  },
  { url: "/images/sflower7.jpg", position: [3, 2.6, 0], scale: 2 },
]

function Photo({ url, position, scale = 1.5, rotationY = 0 }: PhotoSpec) {
  const ref = React.useRef<THREE.Mesh>(null!)
  const target = React.useRef(new Vector3(...position))

  // petit effet de “breathing” et hover
  const [hovered, setHovered] = React.useState(false)
  useFrame((_, dt) => {
    if (!ref.current) return
    // scale doux au survol
    const s = ref.current.scale
    const goal = hovered ? 1.06 : 1.0
    s.setScalar(s.x + (goal - s.x) * Math.min(1, dt * 6))

    // légère flottaison
    ref.current.position.y =
      position[1] + Math.sin(Date.now() * 0.001 + position[0]) * 0.02
  })

  return (
    <group
      position={target.current.toArray() as [number, number, number]}
      rotation={[0, rotationY, 0]}
    >
      <DreiImage
        ref={ref as any}
        url={url}
        transparent
        toneMapped
        scale={[scale, scale, 1]}
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

export default function PhotoScene() {
  return (
    <div className="w-full h-[70vh]">
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
          maxDistance={9}
          minDistance={2}
        />

        {/* environnement léger (HDRI de base) */}
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
