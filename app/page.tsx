"use client"
import Image from "next/image"

import Separator from "./components/ui/Separator/Separator"
import BlurText from "./components/ui/Blurry/BlurText"
import Link from "next/link"
import { Canvas } from "@react-three/fiber"
import { useTexture, OrbitControls } from "@react-three/drei"
import { PhotoCube } from "./components/3d/PhotoCube/PhotoCube"
import { useEffect, useState } from "react"
import useIsMobile from "./components/helper/isMobile"
export default function Home() {
  const [scrollY, setScrollY] = useState(0)

  const isMobile = useIsMobile()
  // écoute du scroll de la page
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll() // init

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // helpers : visibilité selon les plages de scroll

  const showP2 = scrollY >= 500 || scrollY < 900
  const showP3 = scrollY >= 900 && scrollY < 1300

  return (
    <>
      <div className="mx-auto flex flex-col items-center justify-center font-sans">
        {/* HERO SECTION */}
        <section className="relative mx-auto w-4/5 h-dvh flex flex-col items-center justify-center">
          <div className="w-full flex flex-row justify-around">
            <span className="text-white font-bold italic"> [SHOW] </span>
            <span className="text-white font-bold italic"> [YOUR] </span>
            <span className="text-white font-bold italic"> [ART] </span>
          </div>
          <video className=" h-dvh" muted autoPlay loop playsInline>
            <source src="/images/aurora.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas la vidéo HTML5.
          </video>
          {/* hero title */}
          <div className="absolute inset-0 flex flex-col items-center justify-center ">
            <BlurText
              text="4rt digital "
              delay={150}
              animateBy="words"
              direction="top"
              className="italic text-white text-5xl font-sans text-center"
            />
            <BlurText
              text="gallery "
              delay={150}
              animateBy="words"
              direction="top"
              className="italic text-white text-5xl font-mono "
            />
          </div>
          {/* <div className="w-full flex justify-start"> */}

          {/* </div> */}
        </section>
        {/* INTRO SECTION */}
        <div className="w-3/5 flex flex-col items-center justify-center font-sans mt-10">
          <p className="italic text-white text-5xl uppercase font-bold">
            {" "}
            The world is full of artists who need to be seen.
          </p>
        </div>
        <div className="w-4/5 h-screen flex flex-col items-center justify-center">
          {showP2 && (
            <>
              <div className="w-full flex flex-col justify-center mt-10 ">
                <span className="text-white left-0 text-lg">
                  {" "}
                  [ discover new styles, new artworks ] <br /> [ from talented
                  artist all around the world ]
                </span>
                {isMobile ? (
                  <></>
                ) : (
                  <div className="w-full bg-stone-50 w-1/5 flex flex-row items-center justify-center rounded-full md:w-1/5 ">
                    <BlurText
                      text="artists rotation every months"
                      delay={150}
                      animateBy="words"
                      direction="top"
                      className="text-black text-lg text-center font-sans "
                    />
                  </div>
                )}
              </div>
            </>
          )}
          <Canvas
            className="w-full h-screen"
            style={{ pointerEvents: "none" }}
            camera={{ position: [2, 2, 2] }}
          >
            {/* <OrbitControls enableZoom={false} /> */}
            <ambientLight intensity={1} />
            <directionalLight position={[5, 5, 5]} />
            <PhotoCube />
          </Canvas>
        </div>

        <div className="w-full flex flex-row justify-center mt-10 ">
          <div className=" bg-stone-50  flex flex-row items-center justify-center rounded-full p-2 ">
            <Link href="./contact">
              <BlurText
                text="apply to join the digital gallery"
                delay={150}
                animateBy="words"
                direction="top"
                className="text-black text-lg text-center font-sans "
              />
            </Link>
          </div>
        </div>

        {/* EXPLORE 3D */}
      </div>
    </>
  )
}
