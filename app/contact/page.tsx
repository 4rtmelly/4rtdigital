import Image from "next/image"

export default function Contact() {
  return (
    <>
      <section className="mx-auto h-screen flex flex-col items-center jusitfy-center">
        <Image
          className="opacity-40 pt-10"
          src="/images/sflower6.jpg"
          width={500}
          height={400}
          alt="bouquet de lys"
        />
        {/* <div className="absolute inset-0 flex flex-col items-center justify-center"> */}
          {" "}
          <h3 className="text-white text-2xl flex flex-row items-center justify-center font-sans italic font-semibold">
            {" "}
            [WANT TO GET EXPOSED ?]
          </h3>
        {/* </div> */}
        <div className="flex flex-col justify-center p-10">
          <p>01 PRESENT YOURSELF</p>
          <p>02 TELL ME MORE ABOUT YOUR ART STYLE</p>
          <p>03 SHARE YOUR ARTWORK</p>
          <p>CONTACT ME AT NGY.AMELIE@GMAIL.COM</p>
        </div>
      </section>
    </>
  )
}
