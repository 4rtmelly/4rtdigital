import Image from "next/image"

export default function Contact() {
  return (
    <>
      <section className="mx-auto h-screen flex flex-col items-center jusitfy-center">
        {/* <Image
          className="opacity-40 pt-10"
          src="/images/sflower6.jpg"
          width={500}
          height={400}
          alt="bouquet de lys"
        /> */}
        {/* <video muted autoPlay loop playsInline>
          <source src="/images/contact.webm" type="video/webm" />
          Votre navigateur ne supporte pas la vidéo HTML5.
        </video> */}
         <video muted autoPlay loop playsInline>
          <source src="/images/contactMobile.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la vidéo HTML5.
        </video>
        {/* <div className="absolute inset-0 flex flex-col items-center justify-center"> */}{" "}
        <h3 className="text-white text-2xl flex flex-row items-center justify-center font-sans italic font-semibold">
          {" "}
          [WANT TO BE PART OF IT ?]
        </h3>
        {/* </div> */}
        <div className="flex flex-col justify-center p-10 text-white">
          <p>01 PRESENT YOURSELF</p>
          <p>02 TELL ME MORE ABOUT YOUR ART STYLE</p>
          <p>03 SHARE YOUR ARTWORK</p>
          <p>CONTACT ME AT NGY.AMELIE@GMAIL.COM</p>
        </div>
      </section>
    </>
  )
}
