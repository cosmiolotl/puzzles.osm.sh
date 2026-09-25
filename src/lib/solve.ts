import { Chess, type Move, type PieceSymbol, type Square } from 'chess.js'
import type { Color, Puzzle } from './puzzles'

export type { Square, PieceSymbol }

export interface TrackedPiece {
  id: string
  type: PieceSymbol
  color: Color
  square: Square
}

export interface Ply {
  id: string
  by: 'solver' | 'reply'
  /** Solver-move index this ply belongs to (0-based). */
  step: number
  san: string
  from: Square
  to: Square
  piece: PieceSymbol
  color: Color
  captured?: PieceSymbol
  promotion?: PieceSymbol
  /** Rook movement on castling. */
  rook?: { from: Square; to: Square }
  fenAfter: string
}

export interface Rejected {
  id: string
  step: number
  san: string
  from: Square
  to: Square
  piece: PieceSymbol
  color: Color
}

export type Status = 'playing' | 'replying' | 'solved'

export interface SolveState {
  puzzle: Puzzle
  fen: string
  status: Status
  /** Number of solver moves played correctly. */
  step: number
  plies: Ply[]
  rejected: Rejected[]
  selected: Square | null
  initialTracks: TrackedPiece[]
  tracks: TrackedPiece[]
  /** During replay after solving: how many plies are shown. */
  replayIndex: number
  /** Increments on every rejected attempt so the board can re-trigger its shake. */
  shake: number
}

export type SolveAction =
  | { type: 'select'; square: Square | null }
  | { type: 'attempt'; from: Square; to: Square; promotion?: PieceSymbol }
  | { type: 'reply' }
  | { type: 'reset' }
  | { type: 'replay'; index: number }

export const totalSolverMoves = (p: Puzzle) => Math.ceil(p.line.length / 2)

let counter = 0
const uid = (prefix: string) => `${prefix}${++counter}`

export function tracksFromFen(fen: string): TrackedPiece[] {
  const chess = new Chess(fen)
  const out: TrackedPiece[] = []
  for (const row of chess.board()) {
    for (const cell of row) {
      if (cell) {
        out.push({
          id: `${cell.color}${cell.type}-${cell.square}`,
          type: cell.type,
          color: cell.color,
          square: cell.square,
        })
      }
    }
  }
  return out
}

export function applyPlyToTracks(tracks: TrackedPiece[], ply: Ply): TrackedPiece[] {
  let next = tracks
  if (ply.captured) {
    // En passant captures a pawn that is not on the destination square.
    const capSquare: Square =
      ply.piece === 'p' && ply.from[0] !== ply.to[0] && !tracks.some((t) => t.square === ply.to)
        ? ((ply.to[0] + ply.from[1]) as Square)
        : ply.to
    next = next.filter((t) => t.square !== capSquare)
  }
  next = next.map((t) => {
    if (t.square === ply.from) {
      return { ...t, square: ply.to, type: ply.promotion ?? t.type }
    }
    if (ply.rook && t.square === ply.rook.from) {
      return { ...t, square: ply.rook.to }
    }
    return t
  })
  return next
}

export function tracksAfter(initial: TrackedPiece[], plies: Ply[]): TrackedPiece[] {
  return plies.reduce(applyPlyToTracks, initial)
}

export function createSolveState(puzzle: Puzzle): SolveState {
  const initialTracks = tracksFromFen(puzzle.fen)
  return {
    puzzle,
    fen: puzzle.fen,
    status: 'playing',
    step: 0,
    plies: [],
    rejected: [],
    selected: null,
    initialTracks,
    tracks: initialTracks,
    replayIndex: 0,
    shake: 0,
  }
}

function castleRook(move: Move): Ply['rook'] | undefined {
  if (move.isKingsideCastle()) {
    return move.color === 'w' ? { from: 'h1', to: 'f1' } : { from: 'h8', to: 'f8' }
  }
  if (move.isQueensideCastle()) {
    return move.color === 'w' ? { from: 'a1', to: 'd1' } : { from: 'a8', to: 'd8' }
  }
  return undefined
}

function plyFromMove(move: Move, by: Ply['by'], step: number, fenAfter: string): Ply {
  return {
    id: uid('ply'),
    by,
    step,
    san: move.san,
    from: move.from,
    to: move.to,
    piece: move.piece,
    color: move.color,
    captured: move.captured,
    promotion: move.promotion,
    rook: castleRook(move),
    fenAfter,
  }
}

/** Legal destination squares for the piece on `square`, in the current position. */
export function legalTargets(fen: string, square: Square): { to: Square; capture: boolean }[] {
  const chess = new Chess(fen)
  return chess
    .moves({ square, verbose: true })
    .map((m) => ({ to: m.to, capture: m.isCapture() || m.isEnPassant() }))
}

/**
 * Normalise text typed at the status line into a from/to pair.
 * Accepts SAN ("Nf1", "O-O", "exd5", "e8=Q") and coordinates ("d2f1", "e7e8q").
 */
export function parseCommand(
  fen: string,
  text: string,
): { from: Square; to: Square; promotion?: PieceSymbol } | { error: string } {
  const raw = text.trim()
  if (!raw) return { error: 'type a move' }
  const chess = new Chess(fen)
  const coord = raw.toLowerCase().match(/^([a-h][1-8])-?([a-h][1-8])=?([qrbn])?$/)
  try {
    const move = coord
      ? chess.move({ from: coord[1], to: coord[2], promotion: coord[3] as PieceSymbol | undefined })
      : chess.move(raw.replace(/^0-0-0$/i, 'O-O-O').replace(/^0-0$/i, 'O-O'))
    return { from: move.from, to: move.to, promotion: move.promotion }
  } catch {
    return { error: `${raw} is not a legal move here` }
  }
}

export function reduceSolve(state: SolveState, action: SolveAction): SolveState {
  switch (action.type) {
    case 'select': {
      if (state.status !== 'playing') return state
      return { ...state, selected: action.square }
    }

    case 'attempt': {
      if (state.status !== 'playing') return state
      const chess = new Chess(state.fen)
      let move: Move
      try {
        move = chess.move({ from: action.from, to: action.to, promotion: action.promotion })
      } catch {
        // Not a legal move: keep the selection, nothing else happens.
        return { ...state, selected: null }
      }
      const { puzzle, step } = state
      const expected = puzzle.line[step * 2]
      const alternatives = puzzle.alternatives?.[step] ?? []
      const isCorrect = move.san === expected || alternatives.includes(move.san)

      if (!isCorrect) {
        const rejected: Rejected = {
          id: uid('rej'),
          step,
          san: move.san,
          from: move.from,
          to: move.to,
          piece: move.piece,
          color: move.color,
        }
        const keep = state.rejected.filter((r) => r.step === step).slice(-2)
        return {
          ...state,
          selected: null,
          rejected: [...state.rejected.filter((r) => r.step !== step), ...keep, rejected],
          shake: state.shake + 1,
        }
      }

      // Correct: if an alternative was played, the main line continues from the
      // main-line position so the authored replies still apply.
      const mainChess = new Chess(state.fen)
      const mainMove = mainChess.move(expected)
      const played = move.san === expected ? move : mainMove
      const fenAfter = mainChess.fen()
      const ply = plyFromMove(played, 'solver', step, fenAfter)
      const plies = [...state.plies, ply]
      const nextStep = step + 1
      const hasReply = puzzle.line.length > step * 2 + 1
      const solved = !hasReply
      return {
        ...state,
        fen: fenAfter,
        plies,
        tracks: applyPlyToTracks(state.tracks, ply),
        step: nextStep,
        selected: null,
        status: solved ? 'solved' : 'replying',
        replayIndex: solved ? plies.length : state.replayIndex,
        rejected: state.rejected.filter((r) => r.step !== step),
      }
    }

    case 'reply': {
      if (state.status !== 'replying') return state
      const { puzzle, step } = state
      const san = puzzle.line[(step - 1) * 2 + 1]
      if (!san) return { ...state, status: 'solved', replayIndex: state.plies.length }
      const chess = new Chess(state.fen)
      const move = chess.move(san)
      const fenAfter = chess.fen()
      const ply = plyFromMove(move, 'reply', step - 1, fenAfter)
      const plies = [...state.plies, ply]
      return {
        ...state,
        fen: fenAfter,
        plies,
        tracks: applyPlyToTracks(state.tracks, ply),
        status: 'playing',
      }
    }

    case 'reset':
      return createSolveState(state.puzzle)

    case 'replay': {
      if (state.status !== 'solved') return state
      const index = Math.max(0, Math.min(state.plies.length, action.index))
      return { ...state, replayIndex: index }
    }
  }
}
