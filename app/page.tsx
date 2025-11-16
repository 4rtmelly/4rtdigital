import Image from "next/image"

import Separator from "./components/ui/Separator/Separator"
import BlurText from "./components/ui/Blurry/BlurText"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <div className="mx-auto flex flex-col items-center justify-center font-sans">
        {/* HERO SECTION */}
        <section className="relative mx-auto w-4/5 h-dvh flex flex-col items-center justify-center">
          <div className="w-full flex flex-row justify-around">
            <span className="text-white"> [SHOW] </span>
            <span className="text-white"> [YOUR] </span>
            <span className="text-white"> [ART] </span>
          </div>
          <video className="opacity-45 h-dvh" muted autoPlay loop playsInline>
            <source src="/images/heromp.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas la vidéo HTML5.
          </video>
          {/* hero title */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-1">
            {/* <h1 className="italic text-white text-5xl font-sans text-center">
              4rt digital{" "}
              <span className="italic text-white text-5xl font-mono ">
                gallery
              </span>
            </h1> */}
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
          <div className="w-full flex justify-start">
            <Link
              href="./artists"
              className="text-white p-3 border-1 border-white rounded-xl "
            >
              DISCOVER EMERGENT ARTIST <br /> THROUGH MONTHLY CHANGES
            </Link>
          </div>
        </section>
        {/* INTRO SECTION */}
        <section className=" mx-auto w-4/5 min-h-screen flex flex-col items-center justify-between">
          <div className="items-center justify-start pt-10">
            <Separator label="ABLE TO DISPLAY YOUR ART EVERY MONTH" />
          </div>
          <Image
            className="items-center justify-center"
            src="/images/bwflower.jpg"
            width={350}
            height={600}
            alt="orchid"
          />
          <div className="items-center justify-end">
            <Separator label="SHOW YOUR POTENTIAL TO THE WORLD" />
          </div>
        </section>
        {/* EXPLORE 3D */}
      </div>
    </>
  )
}
