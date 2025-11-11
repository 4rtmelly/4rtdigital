import Link from "next/link"
export function Header() {
  return (
    <>
      <div className="mx-auto flex flex-col items-center justify-center font-sans">
        <div className="w-full p-10 flex flex-row justify-between ">
          <Link href="./" className="text-white font-mono">
            {" "}
            melly4rt presents
          </Link>
          <div className="flex flex-col items-center justify-center">
            <Link className="text-white" href="./artists">
              ARTISTS.
            </Link>
            <Link className="text-white" href="./contact">
              CONTACT.
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
