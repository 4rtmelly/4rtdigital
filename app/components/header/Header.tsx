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
            <Link
              className="relative px-4 py-2 text-white overflow-hidden 
            transition-colors duration-500
            before:absolute before:inset-0 before:bg-white 
            before:scale-y-0  before:transition-transform before:duration-500 
            hover:before:scale-y-100 hover:text-black active:text-black
            active::before:scale-y-100 active:text-black 
            before:-z-10"
              href="./artists"
            >
              ARTISTS.
            </Link>
            <Link
              className="relative px-4 py-2 text-white overflow-hidden 
            transition-colors duration-500
            before:absolute before:inset-0 before:bg-white 
            before:scale-y-0  before:transition-transform before:duration-500 
            hover:before:scale-y-100 hover:text-black 
            active::before:scale-y-100 active:text-black 
            before:-z-10"
              href="./contact"
            >
              CONTACT.
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
