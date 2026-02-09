"use client"

import { useEffect, useRef } from "react"
import { useThree } from "@react-three/fiber"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"

type Props = {
  enabled: boolean
  controlsRef: React.RefObject<OrbitControlsImpl | null>
  onFistChange?: (isFist: boolean) => void
  onSliderOffset?: (x: number) => void
}

export function HandControls({
  enabled,
  controlsRef,
  onFistChange,
  onSliderOffset,
}: Props) {
  const { camera } = useThree()

  const videoRef = useRef<HTMLVideoElement | null>(null) // offscreen video
  const rafRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const lastWristRef = useRef<{ x: number; y: number } | null>(null)
  const zoomRef = useRef(camera.position.z)
  const pinchRef = useRef({
    active: false,
    baseDist: 0,
    baseZ: camera.position.z,
  })

  const pinchFilteredRef = useRef<number | null>(null)

  // ✅ Option 1: hysteresis aux limites (anti-pompage)
  const limitRef = useRef<{ locked: "min" | "max" | null }>({ locked: null })

  // ✅ FIST smoothing (anti-jitter)
  const fistStableRef = useRef(false)
  const fistScoreRef = useRef(0)

  /////

  const fistOnFramesRef = useRef(0)
  const fistOffFramesRef = useRef(0)
  const sliderXRef = useRef(0)

  //
  const isExtended = (lm: any[], tip: number, pip: number) =>
    lm[tip].y < lm[pip].y
  const isFolded = (lm: any[], tip: number, pip: number) =>
    lm[tip].y > lm[pip].y

  const isFist = (lm: any[]) => {
    const foldedCount =
      (isFolded(lm, 8, 6) ? 1 : 0) +
      (isFolded(lm, 12, 10) ? 1 : 0) +
      (isFolded(lm, 16, 14) ? 1 : 0) +
      (isFolded(lm, 20, 18) ? 1 : 0)
    return foldedCount >= 4
  }

  const isIndexOnly = (lm: any[]) => {
    const indexUp = isExtended(lm, 8, 6)
    const middleDown = isFolded(lm, 12, 10)
    const ringDown = isFolded(lm, 16, 14)
    const pinkyDown = isFolded(lm, 20, 18)
    return indexUp && middleDown && ringDown && pinkyDown
  }
  //
  const clampWithHysteresis = (v: number, min: number, max: number) => {
    const LIMIT_EPS = 0.03
    const RELEASE_EPS = 0.06

    const s = limitRef.current

    if (s.locked === null) {
      if (v >= max - LIMIT_EPS) s.locked = "max"
      else if (v <= min + LIMIT_EPS) s.locked = "min"
    }

    if (s.locked === "max") {
      if (v < max - RELEASE_EPS) s.locked = null
      return max
    }
    if (s.locked === "min") {
      if (v > min + RELEASE_EPS) s.locked = null
      return min
    }

    return Math.max(min, Math.min(max, v))
  }

  const updateFist = (lm: any[] | undefined) => {
    if (!lm) return

    const folded = (tip: number, pip: number) => lm[tip].y > lm[pip].y

    const foldedCount =
      (folded(8, 6) ? 1 : 0) +
      (folded(12, 10) ? 1 : 0) +
      (folded(16, 14) ? 1 : 0) +
      (folded(20, 18) ? 1 : 0)

    // ✅ plus strict => plus stable
    const fistNow = foldedCount >= 4

    if (fistNow) {
      fistOnFramesRef.current++
      fistOffFramesRef.current = 0
    } else {
      fistOffFramesRef.current++
      fistOnFramesRef.current = 0
    }

    // ✅ asymétrique : on entre vite, on sort lentement
    const ENTER_FRAMES = 4
    const EXIT_FRAMES = 14

    if (!fistStableRef.current && fistOnFramesRef.current >= ENTER_FRAMES) {
      fistStableRef.current = true
      onFistChange?.(true)
      lastWristRef.current = null
    } else if (
      fistStableRef.current &&
      fistOffFramesRef.current >= EXIT_FRAMES
    ) {
      fistStableRef.current = false
      onFistChange?.(false)
      lastWristRef.current = null
    }
  }

  useEffect(() => {
    if (!enabled) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }

      const preview = document.getElementById(
        "hand-preview",
      ) as HTMLVideoElement | null
      if (preview) preview.srcObject = null

      if (videoRef.current) {
        try {
          document.body.removeChild(videoRef.current)
        } catch {}
        videoRef.current = null
      }

      lastWristRef.current = null
      pinchRef.current.active = false
      limitRef.current.locked = null

      // ✅ reset fist state
      onFistChange?.(false)
      fistStableRef.current = false
      fistOnFramesRef.current = 0
      fistOffFramesRef.current = 0

      return
    }

    let handLandmarker: any = null
    let FilesetResolver: any = null
    let HandLandmarker: any = null

    const start = async () => {
      const mp = await import("@mediapipe/tasks-vision")
      FilesetResolver = mp.FilesetResolver
      HandLandmarker = mp.HandLandmarker

      const video = document.createElement("video")
      video.autoplay = true
      video.playsInline = true
      video.muted = true
      video.style.position = "fixed"
      video.style.left = "-9999px"
      video.style.top = "-9999px"
      document.body.appendChild(video)
      videoRef.current = video

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      })
      streamRef.current = stream

      video.srcObject = stream
      await video.play()

      const preview = document.getElementById(
        "hand-preview",
      ) as HTMLVideoElement | null
      if (preview) {
        preview.srcObject = stream
        preview.play().catch(() => {})
      }

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
      )

      handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        },
        runningMode: "VIDEO",
        numHands: 2,
      })

      const loop = () => {
        const v = videoRef.current
        if (!v || !handLandmarker) {
          rafRef.current = requestAnimationFrame(loop)
          return
        }

        if (v.readyState < 2 || v.videoWidth === 0 || v.videoHeight === 0) {
          rafRef.current = requestAnimationFrame(loop)
          return
        }

        const now = performance.now()

        let res: any
        try {
          res = handLandmarker.detectForVideo(v, now)
        } catch {
          rafRef.current = requestAnimationFrame(loop)
          return
        }

        const lms: any[][] = res?.landmarks ?? []
        const lm0 = lms[0] // main 0 (si présente)

        // 1) Update fist stability: on le fait sur la première main détectée (simple)
        if (lm0) updateFist(lm0)

        // 2) Si slider actif: trouver une main "index only" (dans les 2 mains)
        if (fistStableRef.current) {
          let indexControlLm: any[] | null = null
          for (const lm of lms) {
            if (lm && isIndexOnly(lm)) {
              indexControlLm = lm
              break
            }
          }

          // 3) Si on a la main index-only -> sliderOffsetX
          if (indexControlLm) {
            const ix = indexControlLm[8].x // 0..1
            let val = ix - 0.5 // -0.5..+0.5

            const DEAD = 0.04
            if (Math.abs(val) < DEAD) val = 0
            else val = (val - Math.sign(val) * DEAD) / (0.5 - DEAD)

            const MAX_OFFSET = 3.5
            const target = val * (MAX_OFFSET * 2) // ~[-MAX..+MAX]

            sliderXRef.current += (target - sliderXRef.current) * 0.18
            onSliderOffset?.(sliderXRef.current)
          } else {
            // Pas de main index-only -> on garde l’offset (ou on revient doucement)
            sliderXRef.current += (0 - sliderXRef.current) * 0.06
            onSliderOffset?.(sliderXRef.current)
          }

          // ✅ on freeze pan/pinch pendant slider (mais APRES avoir bougé le slider)
          rafRef.current = requestAnimationFrame(loop)
          return
        }

        // ---- Sinon: ta logique pinch/pan normale (main 0) ----
        const lm = lm0
        if (lm) {
          const controls = controlsRef.current

          const wrist = lm[0]
          const thumbTip = lm[4]
          const indexTip = lm[8]

          const pinchDist = Math.hypot(
            thumbTip.x - indexTip.x,
            thumbTip.y - indexTip.y,
          )

          const alpha = 0.2
          if (pinchFilteredRef.current == null)
            pinchFilteredRef.current = pinchDist
          pinchFilteredRef.current =
            pinchFilteredRef.current +
            (pinchDist - pinchFilteredRef.current) * alpha

          const pd = pinchFilteredRef.current
          const PINCH_ON = 0.045
          const PINCH_OFF = 0.06

          if (!pinchRef.current.active && pd < PINCH_ON) {
            pinchRef.current.active = true
            pinchRef.current.baseDist = pd
            pinchRef.current.baseZ = camera.position.z
            zoomRef.current = camera.position.z
            limitRef.current.locked = null
            lastWristRef.current = null
          } else if (pinchRef.current.active && pd > PINCH_OFF) {
            pinchRef.current.active = false
            lastWristRef.current = null
            limitRef.current.locked = null
          }

          // ZOOM
          if (pinchRef.current.active) {
            const ratio = pd / Math.max(0.0001, pinchRef.current.baseDist)
            const clampedRatio = Math.max(0.6, Math.min(1.6, ratio))
            const targetZ = pinchRef.current.baseZ * clampedRatio

            const minZ = 3
            const maxZ = 5
            const tz = clampWithHysteresis(targetZ, minZ, maxZ)

            zoomRef.current += (tz - zoomRef.current) * 0.15
            camera.position.z = zoomRef.current

            controls?.update()
            rafRef.current = requestAnimationFrame(loop)
            return
          }

          // PAN
          const dead = 0.0025
          if (!lastWristRef.current) {
            lastWristRef.current = { x: wrist.x, y: wrist.y }
          } else {
            const dx = wrist.x - lastWristRef.current.x
            const dy = wrist.y - lastWristRef.current.y
            lastWristRef.current = { x: wrist.x, y: wrist.y }

            if (Math.abs(dx) > dead || Math.abs(dy) > dead) {
              const panSpeedX = 8.0
              const panSpeedY = 8.0
              const panX = dx * panSpeedX
              const panY = -dy * panSpeedY

              camera.position.x += panX
              camera.position.y += panY

              if (controls) {
                controls.target.x += panX
                controls.target.y += panY
                controls.update()
              }
            }
          }
        }

        rafRef.current = requestAnimationFrame(loop)
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    start().catch((err) => {
      console.error("Hand tracking start error:", err)
    })

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }

      const preview = document.getElementById(
        "hand-preview",
      ) as HTMLVideoElement | null
      if (preview) preview.srcObject = null

      if (videoRef.current) {
        try {
          document.body.removeChild(videoRef.current)
        } catch {}
        videoRef.current = null
      }

      limitRef.current.locked = null

      // ✅ reset fist state
      onFistChange?.(false)
      fistStableRef.current = false
      fistScoreRef.current = 0

      try {
        handLandmarker?.close?.()
      } catch {}
    }
  }, [enabled, camera, controlsRef])

  return null
}
