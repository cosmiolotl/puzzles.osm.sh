import type { PieceSymbol, Square } from 'chess.js'
import type { Color } from './puzzles'

/** Lichess's default "cburnett" set (Colin M.L. Burnett, CC BY-SA 3.0), served from /public. */
export const pieceSrc = (color: Color, type: PieceSymbol) =>
  `/pieces/cburnett/${color}${type.toUpperCase()}.svg`

export const PIECE_NAME: Record<PieceSymbol, string> = {
  k: 'king',
  q: 'queen',
  r: 'rook',
  b: 'bishop',
  n: 'knight',
  p: 'pawn',
}

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const
export const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'] as const

export function squareToXY(square: Square, orientation: Color): { x: number; y: number } {
  const file = square.charCodeAt(0) - 97
  const rank = Number(square[1]) - 1
  return orientation === 'w' ? { x: file, y: 7 - rank } : { x: 7 - file, y: rank }
}

export function xyToSquare(x: number, y: number, orientation: Color): Square {
  const file = orientation === 'w' ? x : 7 - x
  const rank = orientation === 'w' ? 7 - y : y
  return `${FILES[file]}${RANKS[rank]}` as Square
}

export function isDarkSquare(square: Square): boolean {
  const file = square.charCodeAt(0) - 97
  const rank = Number(square[1]) - 1
  return (file + rank) % 2 === 0
}

export const colorName = (c: Color) => (c === 'w' ? 'white' : 'black')
