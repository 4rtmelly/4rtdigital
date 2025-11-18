export default function Separator({ label = "[about]" }) {
  return (
    <>
      <div className=" w-full items-center">
        <div className="flex flex-row items-center">
          <div className="flex w-full h-px bg-white" />
          <span className="text-white pl-2">{label}</span>
        </div>
      </div>
    </>
  )
}
