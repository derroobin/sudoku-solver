import {
  Board,
  createOptions,
  clone,
  getSquare,
  generateInitialGuesses,
  findSelection,
  random,
  getCellInSquare,
  removeGuess,
  generateGuesses
} from './sudoku'

const board = [
  [0, 0, 4, 2, 8, 7, 6, 1, 3],
  [8, 1, 3, 4, 6, 9, 2, 5, 7],
  [6, 2, 7, 3, 5, 1, 9, 8, 4],
  [4, 5, 1, 6, 9, 2, 3, 7, 8],
  [7, 3, 6, 8, 1, 5, 4, 2, 9],
  [9, 8, 2, 7, 3, 4, 5, 6, 1],
  [3, 6, 9, 1, 2, 8, 7, 4, 5],
  [2, 4, 8, 5, 7, 3, 1, 9, 6],
  [1, 7, 5, 9, 4, 6, 8, 3, 2]
] as Board

const b2 = [
  [0, 0, 4, 2, 8, 7, 6, 1, 3],
  [0, 1, 3, 4, 6, 9, 2, 0, 7],
  [6, 2, 7, 3, 5, 1, 9, 8, 4],
  [4, 5, 1, 6, 9, 2, 3, 7, 8],
  [7, 3, 6, 8, 1, 5, 4, 2, 9],
  [9, 8, 2, 7, 3, 4, 5, 6, 1],
  [3, 6, 9, 1, 2, 8, 7, 4, 5],
  [2, 4, 8, 5, 7, 3, 1, 9, 6],
  [1, 7, 5, 9, 4, 6, 8, 3, 2]
] as Board

test('random function', () => {
  expect(random(99, -1)).toBeGreaterThanOrEqual(0)
  expect(random(99, 1)).toBeLessThan(99)
  expect(random(99, 0.99999)).toStrictEqual(98)
  expect(random(99, 2)).toBeLessThan(99)
})

test('clone should clone anything', () => {
  expect(clone([1, 2])).toStrictEqual([1, 2])
  expect(clone([1, 2, [1, 2]])).toStrictEqual([1, 2, [1, 2]])
})

test('test get square', () => {
  expect(getSquare(0, 0)).toBe(0)
  expect(getSquare(1, 0)).toBe(0)
  expect(getSquare(0, 2)).toBe(0)
  expect(getSquare(0, 3)).toBe(1)
  expect(getSquare(8, 7)).toBe(8)
  expect(getSquare(8, 8)).toBe(8)
  expect(getSquare(5, 7)).toBe(5)
  expect(getSquare(5, 0)).toBe(3)
  expect(getSquare(7, 0)).toBe(6)
  expect(getSquare(4, 4)).toBe(4)
})

test('get first index of square', () => {
  expect(getCellInSquare(0, 0)).toStrictEqual({ row: 0, col: 0 })
  expect(getCellInSquare(0, 2)).toStrictEqual({ row: 0, col: 2 })
  expect(getCellInSquare(0, 3)).toStrictEqual({ row: 1, col: 0 })
  expect(getCellInSquare(0, 3)).toStrictEqual({ row: 1, col: 0 })
  expect(getCellInSquare(2, 3)).toStrictEqual({ row: 1, col: 6 })
  expect(getCellInSquare(7, 5)).toStrictEqual({ row: 7, col: 5 })
  expect(getCellInSquare(8, 8)).toStrictEqual({ row: 8, col: 8 })
  expect(getCellInSquare(4, 4)).toStrictEqual({ row: 4, col: 4 })
})

test('create options', () => {
  const options = createOptions(clone(board))
  expect(options[0][0]).toStrictEqual([0])
  expect(options[0][1]).toStrictEqual([0])
})

test('test initial guesses', () => {
  const guessed = generateInitialGuesses(createOptions(clone(board)))
  expect(guessed.board).toBeDefined()
  const b = guessed.board as (number | number[])[][]
  expect(b[0][0]).toStrictEqual([5])
  expect(b[0][1]).toStrictEqual([9])
  for (let i = 0; i < b.length; i++) {
    for (let o = 0; o < b[i].length; o++) {
      if (i === 0 && o < 2) {
        continue
      }
      expect(b[i][o]).toStrictEqual(board[i][o])
    }
  }
})

test('next move selection', () => {
  const guessed = generateInitialGuesses(createOptions(clone(board)))
  expect(guessed.board).toBeDefined()
  const b = guessed.board as (number | number[])[][]

  expect(findSelection(b)).toStrictEqual({
    selection: [
      { row: 0, col: 0 },
      { row: 0, col: 1 }
    ]
  })
})

test('remove element from guesses', () => {
  const guessed = generateInitialGuesses(createOptions(clone(board)))
  expect(guessed.board).toBeDefined()
  const b = removeGuess(guessed.board as (number | number[])[][], 0, 0, 5)

  expect(b[0][0]).toStrictEqual([])
  expect(b[0][1]).toStrictEqual([9])
})

test('test all', () => {
  const guessed = generateInitialGuesses(createOptions(clone(board)))
  expect(guessed.board).toBeDefined()
  const b = generateGuesses(guessed.board as (number | number[])[][])
  if (b.error) {
    console.error(b.error)
  }
  expect(b.error).toBeUndefined()
  expect(b.board).toBeDefined()

  const c = b.board as (number | number[])[][]

  expect(c[0][0]).toBe(5)
  expect(c[0][1]).toBe(9)
})
