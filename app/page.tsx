"use client"

import Link from "next/link"

import { useEffect, useState } from "react"

import ParticleEarth from "./components/3d/Earth/ParticleEarth"
import PhotoScene from "./components/3d/PhotoScene"
import ClothImage from "./components/3d/ClothImage/ClothImage"
import BlurText from "./components/ui/Blurry/BlurText"
import { SplitText } from "./components/ui/SplitText/SplitText"

export default function Home() {
  const [scrollY, setScrollY] = useState(0)

  // écoute du scroll de la page
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll() // init

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <div className="mx-auto  flex flex-col items-center justify-center font-sans">
        {/* HERO SECTION */}
        <section className="w-4/5 h-screen  flex flex-col items-center justify-center">
          <div className="w-full flex flex-row justify-around">
            <span className="text-white font-bold italic"> [SHOW] </span>
            <span className="text-white font-bold italic"> [YOUR] </span>
            <span className="text-white font-bold italic"> [ART] </span>
          </div>

          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute -bottom-40 left-1/2 -translate-x-1/2 
                    h-[70vh] w-[90vw] 
                    rounded-full 
                    bg-[#95A3FF] 
                    opacity-60 
                    blur-[160px]"
            />
          </div>

          <div className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay grain" />

          <div className="flex flex-col mt-10 items-center justify-center ">
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
        </section>

        {/* INTRO SECTION */}
        <section className="w-full min-h-screen flex flex-col items-center justify-between  md:flex-row">
          <div className="flex flex-col items-center justify-between ">
            <SplitText
              as="h2"
              text="The world is full of artists who need to be seen."
              className="m-8 text-white font-bold tracking-tight text-6xl"
            />
            {/* Content + CTA */}
            <div className="w-4/5 flex flex-col items-center justify-center font-sans mt-10 md:w-4/5">
              <p className="mt-10 font-sans text-xl text-white">
                {" "}
                4rt digital&apos;s aim is to give{" "}
                <span className="font-bold italic text-xl ">
                  visibility
                </span>{" "}
                for artists. Allowing them to share their artworks about a same
                topic in a collective 3D canvas that mixes different styles.{" "}
                <br /> A rotation of artists, artworks and topics is made
                monthly.
              </p>
              <span className="mt-2 text-white left-0 text-xl">
                {" "}
                [ discover new styles, new artworks ] <br /> [ from talented
                artist all around the world ]
              </span>

              <div
                className="transition-transform duration-300 ease-out
    hover:scale-[1.07] bg-stone-50  mt-4 p-2 flex flex-row items-center justify-center rounded-full "
              >
                <Link href="#artworks">
                  <BlurText
                    text="discover artworks"
                    delay={150}
                    animateBy="words"
                    direction="top"
                    className="text-black text-lg text-center font-sans "
                  />
                </Link>
              </div>
            </div>
          </div>
          {/* Gradient here */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute -bottom-250 left-1/2 -translate-x-1/2 
                    h-[70vh] w-[90vw] 
                    rounded-full 
                    bg-[#95A3FF] 
                    opacity-40 
                    blur-[160px]"
            />
          </div>

          <div className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay grain" />
          <div className="w-full h-screen md:w-3/5 ">
            <ParticleEarth />
          </div>

          
        </section>

        {/* EARTH SECTION */}
        {/* <section className="w-full min-h-screen ">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute -bottom-380 left-1/2 -translate-x-1/2 
                    h-[70vh] w-[90vw] 
                    rounded-full 
                    bg-[#95A3FF] 
                    opacity-60 
                    blur-[160px]"
            />
          </div>

          <div className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay grain" />
          <div className="w-full h-screen">
            <ParticleEarth />
          </div>
        </section> */}

        {/* cube */}
        {/* <div className="w-4/5 h-screen flex flex-col items-center justify-center">
         
          <Canvas className="w-full h-screen" camera={{ position: [2, 2, 2] }}>
            <ambientLight intensity={1} />
            <directionalLight position={[5, 5, 5]} />
            <PhotoCube />
            <OrbitControls enableZoom={false} />
          </Canvas>
        </div> */}

        {/* EXPLORE 3D */}
        <section
          id="artworks"
          className="mx-auto mt-16 w-full min-h-screen flex flex-col items-center justify-center "
        >
          <div className="flex flex-row items-center m-2 justify-center z-1 pb-10">
            <BlurText
              text="explore "
              delay={150}
              animateBy="words"
              direction="top"
              className="italic text-white text-5xl font-sans text-center"
            />
            <BlurText
              text="artworks "
              delay={150}
              animateBy="words"
              direction="top"
              className="italic text-white text-5xl font-mono "
            />
          </div>

          <PhotoScene />
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className="w-full min-h-screen mx-auto flex flex-col items-left justify-center"
        >
          <SplitText
            as="h2"
            text=" Want to be part of it ?"
            className="m-8 text-white font-bold tracking-tight text-6xl"
          />
          <div className="w-full flex flex-col items-center ">
            <ClothImage url="/images/sflower6.jpg" />
          </div>

          <div className="flex flex-col justify-center p-10 text-white">
            <p>01 PRESENT YOURSELF</p>
            <p>02 TELL ME MORE ABOUT YOUR ART STYLE</p>
            <p>03 SHARE YOUR ARTWORK</p>
            <Link className="underline " href="mailto:ngy.amelie@gmail.com">
              <p>CONTACT ME AT NGY.AMELIE@GMAIL.COM</p>
            </Link>
          </div>

          {/* CTA CONTACT */}
          <div className="w-full flex flex-row justify-center mt-10 ">
            <div
              className=" transition-transform duration-300 ease-out
    hover:scale-[1.07] bg-stone-50  flex flex-row items-center justify-center rounded-full p-2 "
            >
              <Link href="mailto:ngy.amelie@gmail.com">
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
        </section>
      </div>
    </>
  )
}
