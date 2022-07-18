type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift'

type FixedLengthArray<T, L extends number, TObj = [T, ...Array<T>]> = Pick<
  TObj,
  Exclude<keyof TObj, ArrayLengthMutationKeys>
> & {
  readonly length: L
  [I: number]: T
  [Symbol.iterator]: () => IterableIterator<T>
}

export type Board = FixedLengthArray<FixedLengthArray<number, 9>, 9>

export const generateEmpty = () => {
  const x: Board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ]

  const b = createOptions(x)
  const t = generateInitialGuesses(b) as { board: (number | number[])[][] }
  return t.board
}

export const createOptions = (board: Board) => {
  return board.map((row) =>
    row.map((v) => {
      return v === 0 ? [0] : v
    })
  )
}

type OptionBoard = ReturnType<typeof createOptions>
enum Reason {
  ILLEGAL = 1,
  EXHAUSTED
}

const guessStart = () =>
  new Array(9).fill(0).map(() => {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9]
  })

export const getSquare = (i: number, o: number) =>
  Math.floor(i / 3) * 3 + Math.floor(o / 3)

const filterElementFromGuess = (
  element: number,
  row: number[],
  column: number[],
  square: number[]
) => {
  const removeElementFilter = (x: number) => x !== element
  return {
    row: row.filter(removeElementFilter),
    column: column.filter(removeElementFilter),
    square: square.filter(removeElementFilter)
  }
}

export const generateInitialGuesses = (board: OptionBoard) => {
  const rows = guessStart()
  const columns = guessStart()
  const squares = guessStart()
  for (let i = 0; i < board.length; i++) {
    const row = board[i]
    for (let o = 0; o < row.length; o++) {
      const element = row[o]
      const s = getSquare(i, o)
      if (typeof element === 'number') {
        const { row, column, square } = filterElementFromGuess(
          element,
          rows[i],
          columns[o],
          squares[s]
        )
        rows[i] = row
        columns[o] = column
        squares[s] = square
      }
    }
  }

  for (let i = 0; i < board.length; i++) {
    const row = board[i]
    for (let o = 0; o < row.length; o++) {
      if (typeof board[i][o] === 'number') continue

      const s = getSquare(i, o)
      const guess = rows[i].filter(
        (x) => columns[o].indexOf(x) > -1 && squares[s].indexOf(x) > -1
      )
      if (guess.length === 0) {
        return { error: Reason.ILLEGAL }
      }

      board[i][o] = guess
    }
  }
  return { board }
}

export const clone = <T extends unknown>(x: T) => {
  return JSON.parse(JSON.stringify(x)) as T
}

export const findSelection = (board: OptionBoard) => {
  let min = 99
  let selection: { row: number; col: number }[] = []
  for (let i = 0; i < 9; i++) {
    for (let o = 0; o < 9; o++) {
      const cell = board[i][o]
      if (typeof cell === 'number') continue
      // if array is length 0 then it's we have an illegal board
      if (cell.length === 0) {
        return { error: Reason.ILLEGAL }
      }
      // found cell with shorter
      if (min > cell.length) {
        min = cell.length
        selection = []
      }

      if (min === cell.length) {
        selection.push({ row: i, col: o })
      }
    }
  }
  // maybe this is finished?
  if (min > 9) {
    return { error: Reason.EXHAUSTED }
  }
  return { selection }
}

// given a square index (0..8) and a cell index (0..8) return row and col
export const getCellInSquare = (squareIdx: number, cell: number) => {
  const row = Math.floor(squareIdx / 3) * 3 + Math.floor(cell / 3)
  const col = (squareIdx % 3) * 3 + (cell % 3)

  return { row, col }
}

export const removeGuess = (
  board: OptionBoard,
  row: number,
  col: number,
  element: number
) => {
  const sq = getSquare(row, col)
  const filter = (x: number) => x !== element
  for (let i = 0; i < 9; i++) {
    if (typeof board[row][i] !== 'number') {
      board[row][i] = (board[row][i] as number[]).filter(filter)
    }

    if (typeof board[i][col] !== 'number') {
      board[i][col] = (board[i][col] as number[]).filter(filter)
    }

    const { row: r, col: c } = getCellInSquare(sq, i)
    if (typeof board[r][c] !== 'number') {
      board[r][c] = (board[r][c] as number[]).filter(filter)
    }
  }

  return board
}

export const random = (len: number, rand = Math.random()) =>
  Math.round(Math.min(1, Math.max(rand, 0)) * (len - 1))

type ReturnGuessed =
  | {
      board: (number | number[])[][]
      error?: undefined
    }
  | {
      error: Reason
      board?: undefined
    }

export const generateGuesses = (initialBoard: OptionBoard): ReturnGuessed => {
  //console.time("generate");

  const { selection, error } = findSelection(initialBoard)
  if (error === Reason.ILLEGAL) {
    return { error }
  }
  if (error === Reason.EXHAUSTED) {
    console.log('exhausted')
    //return {error}

    return { board: initialBoard }
  }
  if (!selection) {
    return { error: Reason.ILLEGAL }
  }
  const { row, col } = selection[random(selection.length)]

  const possible = clone(initialBoard[row][col] as number[])
  for (let i = 0; i < possible.length; i++) {
    const board = clone(initialBoard)
    board[row][col] = possible[i]

    const guessedBoard = generateGuesses(
      removeGuess(board, row, col, possible[i])
    )
    if (guessedBoard.error) {
      continue
    }
    if (guessedBoard.board) {
      return { board: guessedBoard.board }
    }
  }

  return { error: Reason.EXHAUSTED }
}
