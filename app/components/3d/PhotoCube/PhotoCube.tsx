import { useFrame } from "@react-three/fiber"
import { useTexture, OrbitControls } from "@react-three/drei"
import { useRef, useEffect, useState } from "react"
import { Mesh } from "three"
import useIsMobile from "../../helper/isMobile"
export function PhotoCube() {
  const isMobile = useIsMobile()
  // 6 images, une par face
  const textures = useTexture([
    "/images/cube1.jpg",
    "/images/cube2.jpg",
    "/images/cube3.jpg",
    "/images/cube4.jpg",
    "/images/cube5.jpg",
    "/images/cube6.jpg",
  ])
  const meshRef = useRef<Mesh | null>(null)
  const [scroll, setScroll] = useState(0)

  // Écoute le scroll de la page
  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Animation R3F
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = scroll * 0.005 // vitesse ajustable
      meshRef.current.rotation.x = scroll * 0.002 // optionnel
    }
  })
  return (
    <mesh ref={meshRef}>
      {/* largeur, hauteur, profondeur */}
      <boxGeometry args={isMobile ? [1, 1, 1] : [2, 2, 2]} />
      {textures.map((tex, i) => (
        <meshStandardMaterial
          key={i}
          map={tex}
          attach={`material-${i}`} // important : assigne le matériau à chaque face
        />
      ))}
    </mesh>
  )
}
