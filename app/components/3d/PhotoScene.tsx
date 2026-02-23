"use client"

import * as React from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import {
  OrbitControls,
  Image as DreiImage,
  Environment,
} from "@react-three/drei"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import { HandControls } from "./HandControl/HandControls"

type PhotoSpec = {
  url: string
  position: [number, number, number]
  scale: number
  rotationY?: number
}

const photos: PhotoSpec[] = [
  { url: "/images/sflower1.jpg", position: [-1.8, 0.6, 0], scale: 1 },
  { url: "/images/sflower2.jpg", position: [3.5, -0.4, 0], scale: 1 },
  { url: "/images/sflower3.jpg", position: [1.5, 0, 0], scale: 1 },
  { url: "/images/sflower4.jpg", position: [-1, -1, 0], scale: 1 },
  { url: "/images/sflower5.jpg", position: [2.5, -1.7, 0], scale: 1 },
  { url: "/images/sflower6.jpg", position: [-3.5, -1, 0], scale: 1 },
  { url: "/images/sflower7.jpg", position: [0.7, 1.8, 0], scale: 1 },
]

function Photo({
  url,
  position,
  scale = 1.5,
  rotationY = 0,
  targetPosition,
}: PhotoSpec & { targetPosition: [number, number, number] }) {
  const imgRef = useRef<THREE.Mesh>(null!)
  const groupRef = useRef<THREE.Group>(null!)
  const base = useRef<number>(scale)
  const [hovered, setHovered] = React.useState(false)

  useFrame((_, dt) => {
    // 1) hover scale (sur l'image)
    if (imgRef.current) {
      const s = imgRef.current.scale
      const goal = base.current * (hovered ? 1.06 : 1.0)
      const next = s.x + (goal - s.x) * Math.min(1, dt * 6)
      s.set(next, next, 1)
    }

    // 2) déplacement doux vers targetPosition (sur le group)
    if (groupRef.current) {
      const cur = groupRef.current.position
      const goal = new THREE.Vector3(...targetPosition)
      // lerp exponentiel stable
      const t = 1 - Math.exp(-dt * 6)
      cur.lerp(goal, t)

      // petit flottement léger (optionnel) basé sur la position d'origine
      groupRef.current.position.y +=
        Math.sin(Date.now() * 0.001 + position[0]) * 0.0008
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]}>
      <DreiImage
        ref={imgRef as never}
        url={url}
        transparent
        toneMapped
        scale={scale}
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
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const [handEnabled, setHandEnabled] = useState(false)
  const [layoutMode, setLayoutMode] = useState<"scatter" | "slider">("scatter")
  const [sliderOffsetX, setSliderOffsetX] = useState(0)
  const handleFistChange = React.useCallback((isFist: boolean) => {
    setLayoutMode(isFist ? "slider" : "scatter")
  }, [])

  const handleSlider = React.useCallback((x: number) => {
    setSliderOffsetX(x)
  }, [])
  // positions slider: mêmes Y/Z, X répartis
  const sliderPositions = useMemo(() => {
    const y = 0
    const z = 0
    const spacing = 1.35
    const n = photos.length
    const startX = -((n - 1) * spacing) / 2
    return photos.map(
      (_, i) => [startX + i * spacing, 0, z] as [number, number, number],
    )
  }, [])

  console.log(layoutMode)
  return (
    <div className="w-full h-[90vh] flex flex-col  items-center ">
      {/* <button
        className=" w-50 z-10  mb-6 btn-liquid-apple-dark text-white text-sm font-bold "
        onClick={() => setHandEnabled((v) => !v)}
      >
        {handEnabled ? "hands controls off" : "hands controls on"}
      </button>

      <div className="absolute bottom-4 right-4 z-20 rounded-lg overflow-hidden shadow-lg border border-white/20">
        <video
          id="hand-preview"
          className="w-70 h-40 object-cover opacity-90"
          autoPlay
          muted
          playsInline
        />
      </div> */}

      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 3, 3]} intensity={0.6} />

        {photos.map((p, i) => {
          const base = layoutMode === "slider" ? sliderPositions[i] : p.position
          const target: [number, number, number] =
            layoutMode === "slider"
              ? [base[0] + sliderOffsetX, base[1], base[2]]
              : base

          return <Photo key={p.url} {...p} targetPosition={target} />
        })}

        <OrbitControls
          ref={controlsRef}
          enableDamping
          enableZoom={false}
          dampingFactor={0.08}
          mouseButtons={{
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE,
          }}
          touches={{ ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN }}
          enableRotate={false}
          screenSpacePanning
          minDistance={2}
          maxDistance={9}
          target={[0, 0, 0]}
        />

        <HandControls
          enabled={handEnabled}
          controlsRef={controlsRef}
          onFistChange={handleFistChange}
          onSliderOffset={handleSlider}
        />

        <ZoomOnDrag zoomFactor={0.92} />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
