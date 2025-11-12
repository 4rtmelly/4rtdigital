
import PhotoScene from "../components/3d/PhotoScene"
import BlurText from "../components/ui/Blurry/BlurText"



export default function Artists() {

  return (
    <>
      <section className="mx-auto w-full min-h-screen flex flex-col items-center justify-center ">
        {/* <div  className="flex w-3/5 h-px bg-white" /> */}

        <div className="flex flex-row items-center  justify-center z-1">
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
          {/* <h1 className="italic text-white text-5xl font-sans text-center">
            explore{" "}
            <span className="italic text-white text-5xl font-mono ">
              artworks
            </span>
          </h1> */}
        </div>
        <PhotoScene />
      </section>
    </>
  )
}
