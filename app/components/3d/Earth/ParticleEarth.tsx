"use client"

import React, { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"

export default function ParticleEarth() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Paramètres faciles à tuner
  const params = useMemo(
    () => ({
      radius: 0.8,
      points: 20000, // augmente si ton GPU suit
      size: 0.012,
      rotateSpeed: 0.12, // rad/s
      bg: 0x05060a,
    }),
    [],
  )

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Scene / Camera / Renderer
    const scene = new THREE.Scene()
    // scene.background = new THREE.Color(params.bg)

    const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100)
    camera.position.set(0, -0.2 , 3)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(el.clientWidth, el.clientHeight, false)
    el.appendChild(renderer.domElement)

    // Gestion resize
    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }
    resize()

    // Lights (discrets, surtout utile si tu ajoutes d’autres meshes)
    const ambient = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambient)

    const dir = new THREE.DirectionalLight(0xffffff, 0.8)
    dir.position.set(2, 2, 3)
    scene.add(dir)

    /**
     * Génération points sur une sphère :
     * - distribution uniforme via cos(phi)
     * - petite jitter pour rendre organique
     */
    const positions = new Float32Array(params.points * 3)
    const colors = new Float32Array(params.points * 3)

    const colorA = new THREE.Color("#8bd3ff") // cyan clair
    const colorB = new THREE.Color("#2a66ff") // bleu

    for (let i = 0; i < params.points; i++) {
      // uniforme sur sphère
      const u = Math.random()
      const v = Math.random()
      const theta = 2 * Math.PI * u
      const phi = Math.acos(2 * v - 1)

      const r = params.radius + (Math.random() - 0.5) * 0.01 // jitter léger

      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.cos(phi)
      const z = r * Math.sin(phi) * Math.sin(theta)

      const idx = i * 3
      positions[idx] = x
      positions[idx + 1] = y
      positions[idx + 2] = z

      // gradient de couleur selon latitude (y)
      const t = (y / params.radius + 1) * 0.5
      const c = colorA.clone().lerp(colorB, t)
      colors[idx] = c.r
      colors[idx + 1] = c.g
      colors[idx + 2] = c.b
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    // Matériau Points (additive + transparence)
    const material = new THREE.PointsMaterial({
      size: params.size,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // Un léger halo (optionnel) via second cloud plus grand
    const haloMat = new THREE.PointsMaterial({
      size: params.size * 1.4,
      color: new THREE.Color("#7df0ff"),
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const haloGeo = geometry.clone()
    const halo = new THREE.Points(haloGeo, haloMat)
    halo.scale.setScalar(1.02)
    scene.add(halo)

    // Animation loop
    const clock = new THREE.Clock()
    let raf = 0

    const animate = () => {
      const dt = clock.getDelta()
      points.rotation.y += params.rotateSpeed * dt
      halo.rotation.y += params.rotateSpeed * dt * 0.8

      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    // listeners
    window.addEventListener("resize", resize)

    // cleanup (Next / React strict mode safe)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)

      geometry.dispose()
      material.dispose()
      haloGeo.dispose()
      haloMat.dispose()
      renderer.dispose()

      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [params])

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        borderRadius: "24px",
      }}
    />
  )
}
