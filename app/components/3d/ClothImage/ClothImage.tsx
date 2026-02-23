"use client"

import * as THREE from "three"
import { useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"

function ClothPlane({ url }: { url: string }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  const texture = useTexture(url)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping

  // Valeurs "ciblées" (où est la souris maintenant) et "courantes" (lissées)
  const mouseTarget = useRef(new THREE.Vector2(0.5, 0.5))
  const mouseSmooth = useRef(new THREE.Vector2(0.5, 0.5))

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) }, // UV
      uMouseStrength: { value: 0.0 },
      uWindAmp: { value: 0.1 }, // tissu global
      uWindFreq: { value: 3.5 },
      uMouseRadius: { value: 0.18 }, // rayon local en UV
    }),
    [texture],
  )

  useFrame((_, dt) => {
    const mat = materialRef.current
    if (!mat) return

    uniforms.uTime.value += dt

    // Lissage pour un ressenti "tissu" (inertie)
    mouseSmooth.current.lerp(mouseTarget.current, 1 - Math.pow(0.001, dt * 60))
    uniforms.uMouse.value.copy(mouseSmooth.current)

    // Décroissance douce de l'effet au fil du temps
    uniforms.uMouseStrength.value = THREE.MathUtils.lerp(
      uniforms.uMouseStrength.value,
      0.0,
      1 - Math.pow(0.0005, dt * 60),
    )
  })

  return (
    <mesh
      ref={meshRef}
      // Important: assez de segments pour que le déplacement soit fluide
      geometry={useMemo(() => new THREE.PlaneGeometry(3, 2, 220, 220), [])}
      onPointerMove={(e) => {
        // R3F donne e.uv directement si l’objet est intersecté
        if (e.uv) {
          mouseTarget.current.copy(e.uv)
          // On "charge" l'effet quand on bouge la souris
          uniforms.uMouseStrength.value = Math.min(
            1.0,
            uniforms.uMouseStrength.value + 0.35,
          )
        }
      }}
      onPointerOut={() => {
        // laisse la décroissance faire le boulot
      }}
    >
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
      />
    </mesh>
  )
}

export default function ClothImage({
  url,
  className,
}: {
  url: string
  className?: string
}) {
  return (
    <div className={className} style={{ width: "100%", height: "50%" }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.0} />
        <ClothPlane url={url} />
      </Canvas>
    </div>
  )
}

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;          // UV 0..1
  uniform float uMouseStrength; // 0..1
  uniform float uWindAmp;
  uniform float uWindFreq;
  uniform float uMouseRadius;

  varying vec2 vUv;

  void main() {
    vUv = uv;

    vec3 pos = position;

    // --- Vent global (subtil) ---
    float wind =
      sin(pos.x * uWindFreq + uTime * 1.6) * (uWindAmp * 0.65) +
      sin(pos.y * (uWindFreq * 0.8) + uTime * 1.2) * (uWindAmp * 0.85);

    // --- Interaction souris: déformation locale radiale ---
    float d = distance(uv, uMouse);
    // falloff doux, 1 au centre -> 0 au bord
    float falloff = smoothstep(uMouseRadius, 0.5, d);

    // petite onde locale "tissu" (évite l’effet bosse rigide)
    float ripple = sin((d * 24.0) - uTime * 6.0) * 0.115;

    float mouseDisp = (falloff * uMouseStrength) * (0.50 + ripple);

    // cumul sur Z
    pos.z += wind + mouseDisp;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform sampler2D uTexture;
  varying vec2 vUv;

  void main() {
    vec4 tex = texture2D(uTexture, vUv);
    gl_FragColor = tex;
  }
`
