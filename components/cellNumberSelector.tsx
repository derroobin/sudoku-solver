import { useState, useEffect } from 'react'

const all = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const useTextOpacity = (n: number) => {
  const [opacity, setOpacity] = useState('text-opacity-5 dark:text-opacity-5')

  useEffect(() => {
    let opacity = 'text-opacity-5 dark:text-opacity-5'
    if (n < 4) {
      opacity = 'text-opacity-40 dark:text-opacity-40'
    } else if (n < 6) {
      opacity = ''
    }
    setOpacity(opacity)
  }, [n])

  return opacity
}

interface Props {
  nums: number[]
  col: number
  row: number
  callback: (row: number, col: number, num: number) => void
}

const CellNumberSelector: React.FC<Props> = ({ nums, row, col, callback }) => {
  const textOpacity = useTextOpacity(nums.length)

  return (
    <div className="col-start-1 row-start-1 grid grid-cols-3 place-items-center p-0 w-full gap-2 h-full relative text-black dark:text-white  opacity-0  group-hover:opacity-100  transition-opacity ease-in">
      {all.map((x) => (
        <button
          key={`r${row}c${col}${x}`}
          disabled={nums.indexOf(x) < 0}
          className="text-xs px-2 py-1 bg-emerald-700 hover:bg-emerald-600 rounded disabled:bg-opacity-10 w-full"
          onClick={() => callback(row, col, x)}>
          {x}
        </button>
      ))}
    </div>
  )
}

export default CellNumberSelector
