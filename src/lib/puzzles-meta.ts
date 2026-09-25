// Re-exports that the index route needs without pulling chess.js into it.
export { puzzles, findPuzzle, byDate, latestPuzzle } from './puzzles'
export type { Puzzle } from './puzzles'
import type { Puzzle } from './puzzles'

export const totalSolverMoves = (p: Puzzle) => Math.ceil(p.line.length / 2)
