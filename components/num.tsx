interface Props {
  num: number
  callback: () => void
}
const Num: React.FC<Props> = ({ num, callback }) => {
  return (
    <div className="h-full p-2">
      <button
        className="font-bold text-4xl w-full h-full relative group"
        onClick={callback}>
        {num}
        <span className="pointer-events-none group-hover:opacity-100 ease-in-out transition-opacity opacity-0 absolute bg-red-600 h-0.5 w-16 block top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[47deg]" />
      </button>
    </div>
  )
}

export default Num
