import Image from "next/image"
import Link from "next/link"

import Separator from "./components/ui/Separator/Separator"

export default function Home() {
  return (
    <>
      <div className="mx-auto flex flex-col items-center justify-center font-sans">
        {/* HEADER */}
        <div className="w-full p-10 flex flex-row justify-between ">
          <span className="text-white font-mono"> melly4rt presents</span>
          <div className="flex flex-col items-center justify-center">
            <Link className="text-white" href="./artists">
              ARTISTS.
            </Link>
            <Link className="text-white" href="./contact">
              CONTACT.
            </Link>
          </div>
        </div>
        {/* HERO SECTION */}
        <section className="relative mx-auto w-4/5 h-dvh flex flex-col items-center justify-center">
          <div className="w-full flex flex-row justify-around">
            <span> [SHOW] </span>
            <span> [YOUR] </span>
            <span> [ART] </span>
          </div>
          <video className="opacity-45 h-dvh" muted autoPlay loop playsInline>
            <source src="/images/heromp.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas la vidéo HTML5.
          </video>
          {/* hero title */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-1">
            <h1 className="italic text-white text-5xl font-sans text-center">
              4rt digital{" "}
              <span className="italic text-white text-5xl font-mono ">
                gallery
              </span>
            </h1>
          </div>
          <p className="w-full flex justify-start">
            DISCOVER EMERGENT ARTIST <br /> THROUGH MONTHLY CHANGES
          </p>
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
        <section></section>
      </div>
    </>
  )
}
