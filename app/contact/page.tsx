import Image from "next/image"
import Link from "next/link"

export default function Contact() {
  return (
    <>
      <section className="mx-auto flex flex-col items-center jusitfy-center">
        <video muted autoPlay loop playsInline>
          <source src="/images/contactMobile.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la vidéo HTML5.
        </video>

        <h3 className="text-white text-2xl flex flex-row items-center justify-center font-sans italic font-semibold">
          {" "}
          [WANT TO BE PART OF IT ?]
        </h3>

        <div className="flex flex-col justify-center p-10 text-white">
          <p>01 PRESENT YOURSELF</p>
          <p>02 TELL ME MORE ABOUT YOUR ART STYLE</p>
          <p>03 SHARE YOUR ARTWORK</p>
          <Link className="underline " href="mailto:ngy.amelie@gmail.com"><p>CONTACT ME AT NGY.AMELIE@GMAIL.COM</p></Link>
          
        </div>
      </section>
    </>
  )
}
