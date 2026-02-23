import Image from "next/image"
import Link from "next/link"
import ClothImage from "../components/3d/ClothImage/ClothImage"

export default function Contact() {
  return (
    <>
      <section className="w-4/5 min-h-screen mx-auto flex flex-col items-center justify-center">
        <div className="w-full flex flex-col items-center ">
          <ClothImage url="/images/sflower6.jpg" />
        </div>
        <h3 className="text-white text-2xl flex flex-row items-center justify-center font-sans italic font-semibold">
          {" "}
          [WANT TO BE PART OF IT ?]
        </h3>
        <div className="flex flex-col justify-center p-10 text-white">
          <p>01 PRESENT YOURSELF</p>
          <p>02 TELL ME MORE ABOUT YOUR ART STYLE</p>
          <p>03 SHARE YOUR ARTWORK</p>
          <Link className="underline " href="mailto:ngy.amelie@gmail.com">
            <p>CONTACT ME AT NGY.AMELIE@GMAIL.COM</p>
          </Link>
        </div>
      </section>
    </>
  )
}
