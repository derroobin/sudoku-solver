import type { NextPage } from 'next'
import React, {
  useState,
  useCallback,
  PropsWithChildren,
  useEffect
} from 'react'
import styles from '../styles/Home.module.css'
import {
  clone,
  createOptions,
  generateEmpty,
  generateGuesses,
  generateInitialGuesses,
  removeGuess,
  Sudoku
} from '../lib/sudoku'
import { text } from 'stream/consumers'

const Button: React.FC<PropsWithChildren<{ onClick: () => void }>> = ({
  children,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className="text-white mt-8 mx-auto mr-4 bg-emerald-500 border-0 py-2 px-8 focus:outline-none hover:bg-emerald-600 rounded text-lg">
      {children}
    </button>
  )
}

const all = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const useTextOpacity = (n: number) => {
  const [opacity, setOpacity] = useState('text-opacity-5 dark:text-opacity-5')

  useEffect(() => {
    let opacity = 'text-opacity-5 dark:text-opacity-5'
    if (n < 4) {
      opacity = 'text-opacity-40 dark:text-opacity-40'
    } else if (n < 6) {
      opacity = 'text-opacity-20 dark:text-opacity-20'
    }
    setOpacity(opacity)
  }, [n])

  return opacity
}

const RenderButtons: React.FC<{
  nums: number[]
  col: number
  row: number
  callback: (row: number, col: number, num: number) => void
}> = ({ nums, row, col, callback }) => {
  const textOpacity = useTextOpacity(nums.length)
  return (
    <div className="grid grid-cols-3 place-items-center p-0 w-full h-full group relative text-black dark:text-white">
      {all.map((x) => (
        <div
          key={`r${row}c${col}${x}`}
          className="opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity ease-in ">
          <button
            disabled={nums.indexOf(x) < 0}
            className="text-xs px-2 py-1 bg-emerald-500 hover:bg-opacity-50 rounded disabled:bg-opacity-10"
            onClick={() => callback(row, col, x)}>
            {x}
          </button>
        </div>
      ))}
      {nums.map((x) => {
        return (
          <span
            key={`r${row}c${col}${x}`}
            className={`${textOpacity} dark-${textOpacity} text-black dark:text-slate-400 transition-colors group-hover:opacity-0 pointer-events-none absolute text-4xl`}>
            {x}
          </span>
        )
      })}
    </div>
  )
}

const Num: React.FC<{ num: number; callback: () => void }> = ({
  num,
  callback
}) => {
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

const Home: NextPage = () => {
  const [board, setBoard] = useState(generateEmpty())
  const [time, setTime] = useState(-1)
  const startOver = useCallback(() => {
    setBoard(generateEmpty())
    setTime(-1)
  }, [])
  const callback = useCallback(
    (row: number, col: number, selection: number) => {
      const start = performance.now()
      let b = clone(board)
      const c = b[row][col]
      if (typeof c === 'number') {
        return
      }
      if (c.indexOf(selection) === -1) {
        return
      }

      b[row][col] = selection

      b = removeGuess(b, row, col, selection)

      const res = generateGuesses(b)

      if (res.board) {
        setBoard(b)
      } else if (res.error) {
        const b = clone(board)
        b[row][col] = (b[row][col] as number[]).filter((x) => x !== selection)
        setBoard(b)
      }
      const end = performance.now()
      setTime(end - start)
    },
    [board]
  )

  const clearCell = useCallback(
    (row: number, col: number) => {
      const start = performance.now()
      let b = clone(board)

      b[row][col] = [0]

      const calc = generateInitialGuesses(b)

      if (calc.board) {
        setBoard(calc.board)
      }
      const end = performance.now()
      setTime(end - start)
    },
    [board]
  )

  const solve = useCallback(() => {
    const start = performance.now()
    const init = clone(board)
    console.log(init)

    if (init) {
      const x = generateGuesses(init)
      if (x.error) {
        console.error(x.error)
      } else if (x?.board) {
        setBoard(x.board)
      }
    }
    const end = performance.now()
    setTime(end - start)
  }, [board])
  return (
    <div className="dark:bg-slate-900 dark:text-slate-300 pt-6 min-h-screen">
      <div className="mx-auto w-max font-oxygen ">
        <h1 className="text-5xl mb-4">Easiest Sudoku Online</h1>
        <table className="border-2 border-black">
          <tbody>
            {board.map((row, i) => {
              return (
                <tr
                  key={`r${i}`}
                  className={`${i % 3 === 0 ? 'border-t-2 border-black' : ''}`}>
                  {row.map((v, idx) => {
                    return (
                      <td
                        className={`border border-black w-24 h-24 ${
                          idx % 3 === 0 ? 'border-l-2' : ''
                        } `}
                        key={`r${i}${idx}`}>
                        {typeof v === 'number' ? (
                          <Num num={v} callback={() => clearCell(i, idx)} />
                        ) : v[0] !== 0 ? (
                          <RenderButtons
                            nums={v}
                            row={i}
                            col={idx}
                            callback={callback}
                          />
                        ) : (
                          ''
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        <Button onClick={solve}>Just solve already 🤓</Button>
        <Button onClick={startOver}>start over 👶</Button>
        <div className="mt-3">
          <span>
            Time for last action: {time >= 0 ? Math.round(time) : '-'}ms
          </span>
        </div>
      </div>
    </div>
  )
}

export default Home
