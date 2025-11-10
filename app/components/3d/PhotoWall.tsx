"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MapControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

/** === CONFIG EDITABLE === */
const IMAGE_URLS = Array.from({ length: 7 }, (_, i) => `/images/sflower${i + 1}.jpg`);
const COLS = 6;            // nb de colonnes sur le mur
const TILE_W = 1.2;        // largeur d'une photo (unités 3D)
const GAP = 0.25;          // espace entre photos
const PADDING = 0.6;       // marge autour de la grille
const WALL_COLOR = "#efefef";
const WALL_ROUGHNESS = 1;
/** ======================= */

function useGridLayout(urls: string[], cols = 5) {
  // Calcule positions en grille (row-major)
  return React.useMemo(() => {
    const positions: [number, number, number][] = [];
    const rows = Math.ceil(urls.length / cols);

    const gridW = cols * TILE_W + (cols - 1) * GAP;
    const gridH = rows * TILE_W + (rows - 1) * GAP;

    // Décalage pour centrer la grille
    const x0 = -gridW / 2 + TILE_W / 2;
    const y0 = gridH / 2 - TILE_W / 2;

    for (let i = 0; i < urls.length; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const x = x0 + c * (TILE_W + GAP);
      const y = y0 - r * (TILE_W + GAP);
      positions.push([x, y, 0.02]); // léger décalage du mur
    }
    // dimensions utiles pour bornes et mur
    return { positions, gridW, gridH, rows };
  }, [urls, cols]);
}

function PhotoTile({ url, fit = "cover" as "cover" | "contain" }) {
  // On charge la texture et on adapte la hauteur selon le ratio
  const tex = useTexture(url) as THREE.Texture & { source?: { data?: HTMLImageElement } };
  // Désactive la gestion de couleur sRGB côté mat basique
  React.useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
  }, [tex]);

  // Taille du tile (on fixe la largeur, on déduit la hauteur)
  const w = TILE_W;
  const imageW = tex.source?.data?.naturalWidth ?? 1;
  const imageH = tex.source?.data?.naturalHeight ?? 1;
  const ratio = imageH / imageW;

  let h = w * ratio;

  // Option "contain" pour garder toute l'image dans un cadre carré
  let scaleX = w;
  let scaleY = h;

  if (fit === "contain") {
    const target = TILE_W; // côté cible
    const scale = Math.min(target / w, target / h);
    scaleX = w * scale;
    scaleY = h * scale;
  } else {
    // "cover" : on remplit le carré, on masque via un cadre (frame) optionnel
    const target = TILE_W;
    const scale = Math.max(target / w, target / h);
    scaleX = w * scale;
    scaleY = h * scale;
  }

  return (
    <group>
      {/* cadre subtil */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[TILE_W + 0.06, TILE_W + 0.06]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} metalness={0} />
      </mesh>

      {/* photo */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[scaleX, scaleY]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Wall({ width, height }: { width: number; height: number }) {
  // Grand mur derrière la grille
  const w = width + PADDING * 2;
  const h = height + PADDING * 2;
  return (
    <mesh receiveShadow position={[0, 0, 0]}>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial color={WALL_COLOR} roughness={WALL_ROUGHNESS} />
    </mesh>
  );
}

function SceneContent() {
  const { positions, gridW, gridH } = useGridLayout(IMAGE_URLS, COLS);

  // Petites lumières douces
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[3, 5, 4]} intensity={0.4} />
      <Wall width={gridW} height={gridH} />
      {IMAGE_URLS.map((url, i) => (
        <group key={url} position={positions[i]}>
          <PhotoTile url={url} />
        </group>
      ))}
    </>
  );
}

function PannableControls({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  // On borne le pan pour éviter de "sortir" du mur
  // On limite la cible (target) de la caméra.
  const controlsRef = React.useRef<any>(null);

  // bornes (marges)
  const halfW = (width + PADDING * 2) / 2;
  const halfH = (height + PADDING * 2) / 2;

  useFrame(() => {
    const c = controlsRef.current;
    if (!c) return;
    // clamp du target
    c.target.x = THREE.MathUtils.clamp(c.target.x, -halfW, halfW);
    c.target.y = THREE.MathUtils.clamp(c.target.y, -halfH, halfH);

    // fait suivre la caméra au même décalage que target, en gardant la distance z
    const cam = c.object as THREE.PerspectiveCamera;
    const dz = cam.position.z - c.target.z; // distance actuelle
    cam.position.x = c.target.x;
    cam.position.y = c.target.y;
    cam.position.z = dz;
  });

  return (
    <MapControls
      ref={controlsRef}
      enableRotate={false}
      enableDamping
      dampingFactor={0.08}
      zoomToCursor
      mouseButtons={{ LEFT: 1, MIDDLE: 0, RIGHT: 0 }} // clic-gauche = pan
      touches={{ ONE: 32, TWO: 512 }} // doigt = pan, pinch = zoom
      minDistance={2}
      maxDistance={12}
      // Pan en "écran" pour une sensation 2D
      screenSpacePanning
    />
  );
}

export default function PhotoWallScene() {
  // On recalcule la grille ici pour passer les bornes aux contrôles
  const { gridW, gridH } = useGridLayout(IMAGE_URLS, COLS);
  return (
    <div className="w-full h-[80vh]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <SceneContent />
        <PannableControls width={gridW} height={gridH} />
      </Canvas>
    </div>
  );
}
