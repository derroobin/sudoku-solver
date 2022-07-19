import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useState, useCallback, PropsWithChildren } from 'react'
import CellNumberSelector from '../components/cellNumberSelector'
import Num from '../components/num'

import {
  clone,
  generateEmpty,
  generateGuesses,
  generateInitialGuesses,
  removeGuess
} from '../lib/sudoku'

const Button: React.FC<PropsWithChildren<{ onClick: () => void }>> = ({
  children,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className="text-white mt-8 mx-auto mr-4 bg-emerald-700 border-0 py-2 px-8 focus:outline-none hover:bg-emerald-600 rounded text-lg">
      {children}
    </button>
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
      <Head>
        <title>Sudoku Solver</title>
        <meta
          name="description"
          content="Wave Function Collapse Sudoku Solver"
        />
      </Head>
      <div className="mx-auto w-max font-oxygen ">
        <h1 className="text-5xl mb-4">Easiest Sudoku Online</h1>
        <table className="border-4 border-black dark:border-sky-800">
          <tbody>
            {board.map((row, rowIdx) => {
              return (
                <tr
                  key={`r${rowIdx}`}
                  className={`${
                    rowIdx % 3 === 0
                      ? 'border-t-4 border-black dark:border-sky-800'
                      : ''
                  }`}>
                  {row.map((v, colIdx) => {
                    return (
                      <td
                        className={`border border-black dark:border-sky-800 w-24 h-24 ${
                          colIdx % 3 === 0 ? 'border-l-4' : ''
                        } group`}
                        key={`r${rowIdx}${colIdx}`}>
                        {typeof v === 'number' ? (
                          <Num
                            num={v}
                            callback={() => clearCell(rowIdx, colIdx)}
                          />
                        ) : v[0] !== 0 ? (
                          <CellNumberSelector
                            nums={v}
                            row={rowIdx}
                            col={colIdx}
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
