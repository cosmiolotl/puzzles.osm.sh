import { useEffect, useMemo, useReducer, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import type { Square } from 'chess.js'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import type { Puzzle } from '@/lib/puzzles'
import {
  createSolveState,
  legalTargets,
  parseCommand,
  reduceSolve,
  totalSolverMoves,
  tracksAfter,
} from '@/lib/solve'
import { colorName } from '@/lib/glyphs'
import { markSolved, useSolved } from '@/lib/progress'
import { Board, type Tint } from './Board'
import { Ledger } from './Ledger'
import { StatusBar } from './StatusBar'
import { SiteNav } from '@/components/SiteNav'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const REPLY_DELAY = 420

export function Solve({ puzzle }: { puzzle: Puzzle }) {
  const [state, dispatch] = useReducer(reduceSolve, puzzle, createSolveState)
  const commandRef = useRef<HTMLInputElement>(null)
  const { status, step, plies, selected, tracks, initialTracks, replayIndex } = state
  const total = totalSolverMoves(puzzle)
  const solved = status === 'solved'
  const solvedBefore = Boolean(useSolved()[puzzle.slug])

  useEffect(() => {
    if (solved) markSolved(puzzle.slug)
  }, [solved, puzzle.slug])

  // Opponent reply, a beat after the solver's correct move.
  useEffect(() => {
    if (status !== 'replying') return
    const t = setTimeout(() => dispatch({ type: 'reply' }), REPLY_DELAY)
    return () => clearTimeout(t)
  }, [status, step])

  // Keys that work anywhere on the page except inside the command field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const inField = e.target === commandRef.current
      if (e.key === 'Escape') {
        if (inField) commandRef.current?.blur()
        else dispatch({ type: 'select', square: null })
        return
      }
      if (inField) return
      if (e.key === ':' || e.key === '/') {
        e.preventDefault()
        commandRef.current?.focus()
        return
      }
      if (e.key === 'r' && !e.metaKey && !e.ctrlKey) {
        dispatch({ type: 'reset' })
        return
      }
      if (solved && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        const target = e.target as HTMLElement
        if (target.closest('.board')) return
        e.preventDefault()
        dispatch({ type: 'replay', index: replayIndex + (e.key === 'ArrowLeft' ? -1 : 1) })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [solved, replayIndex])

  const targets = useMemo(
    () => (selected && status === 'playing' ? legalTargets(state.fen, selected) : []),
    [selected, status, state.fen],
  )

  const onSquare = (square: Square) => {
    if (status !== 'playing') return
    if (selected && targets.some((t) => t.to === square)) {
      dispatch({ type: 'attempt', from: selected, to: square })
      return
    }
    const piece = tracks.find((t) => t.square === square)
    if (piece && piece.color === puzzle.side && square !== selected) {
      dispatch({ type: 'select', square })
    } else {
      dispatch({ type: 'select', square: null })
    }
  }

  const onMove = (from: Square, to: Square) => {
    if (status !== 'playing') return
    dispatch({ type: 'attempt', from, to })
  }

  const onCommand = (text: string): string | null => {
    if (status !== 'playing') return 'nothing to play'
    const parsed = parseCommand(state.fen, text)
    if ('error' in parsed) return parsed.error
    const mover = tracks.find((t) => t.square === parsed.from)
    if (mover?.color !== puzzle.side) return `that is ${colorName(mover?.color ?? 'w')}'s piece`
    dispatch({ type: 'attempt', ...parsed })
    return null
  }

  const lastPly = plies[plies.length - 1] ?? null
  const rejectedNow = state.rejected.filter((r) => r.step === step)
  const message = solved
    ? `solved. ${puzzle.theme.toLowerCase()}`
    : status === 'replying'
      ? `${colorName(puzzle.side === 'w' ? 'b' : 'w')} replies…`
      : rejectedNow.length
        ? 'not that one. try again'
        : step === 0
          ? 'your move'
          : 'keep going'

  // Diff tints for the split view: squares vacated and squares occupied.
  const { beforeTint, afterTint } = useMemo(() => {
    const before: Partial<Record<Square, Tint>> = {}
    const after: Partial<Record<Square, Tint>> = {}
    // Replies first so the solver's own squares win where they overlap.
    for (const p of plies.filter((p) => p.by === 'reply')) {
      before[p.from] = 'reply'
      after[p.to] = 'reply'
      if (p.rook) {
        before[p.rook.from] = 'reply'
        after[p.rook.to] = 'reply'
      }
    }
    for (const p of plies.filter((p) => p.by === 'solver')) {
      before[p.from] = 'minus'
      after[p.to] = 'plus'
      if (p.rook) {
        before[p.rook.from] = 'minus'
        after[p.rook.to] = 'plus'
      }
    }
    return { beforeTint: before, afterTint: after }
  }, [plies])

  const replayTracks = useMemo(
    () => (solved ? tracksAfter(initialTracks, plies.slice(0, replayIndex)) : tracks),
    [solved, initialTracks, plies, replayIndex, tracks],
  )
  const replayLast = solved ? (plies[replayIndex - 1] ?? null) : lastPly

  return (
    <div className="min-h-dvh flex flex-col [--cell:min(calc((100dvh-17.75rem)/8),calc((100vw-3.25rem)/8),84px)] lg:[--cell:min(calc((100dvh-12.75rem)/8),calc((100vw-6rem)*0.5/8),92px)]">
      <SiteNav section="chess" />
      <div className="px-4 sm:px-6 pt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
        <h1 className="text-ink font-medium">{puzzle.title}</h1>
        <span className="text-ink-3 text-xs tabular-nums">
          <time dateTime={puzzle.date}>{puzzle.date}</time> · {puzzle.author}
          {solvedBefore && <span className="text-plus"> · solved</span>}
        </span>
      </div>

      <main
        className={cn(
          'flex-1 px-4 sm:px-6 py-5 grid gap-x-10 gap-y-6 items-start',
          'grid-cols-1 lg:grid-cols-[auto_minmax(30ch,1fr)]',
        )}
      >
        {/* Board column */}
        <div className="justify-self-center lg:justify-self-start">
          {!solved ? (
            <Board
              tracks={tracks}
              orientation={puzzle.side}
              movable={status === 'playing' ? puzzle.side : null}
              selected={selected}
              targets={targets}
              lastMove={lastPly ? { from: lastPly.from, to: lastPly.to } : null}
              shake={state.shake}
              label={`Board, ${colorName(puzzle.side)} to move`}
              onSquare={onSquare}
              onMove={onMove}
            />
          ) : (
            <div className="split-in grid grid-cols-2 gap-x-4 sm:gap-x-6 [--cell:min(calc((100dvh-15.75rem)/8),calc((100vw-6rem)/16),52px)] lg:[--cell:min(calc((100dvh-14.75rem)/8),calc((100vw-9rem)*0.5/16),56px)]">
              <div>
                <p className="rule-line text-xs text-ink-3 mb-2">
                  <span>before</span>
                </p>
                <Board
                  tracks={initialTracks}
                  orientation={puzzle.side}
                  movable={null}
                  tint={beforeTint}
                  label="Position before"
                />
              </div>
              <div>
                <p className="rule-line text-xs text-ink-3 mb-2">
                  <span>after</span>
                  <span className="text-ink-2 tabular-nums">
                    {replayIndex}/{plies.length}
                  </span>
                </p>
                <Board
                  tracks={replayTracks}
                  orientation={puzzle.side}
                  movable={null}
                  tint={replayIndex === plies.length ? afterTint : {}}
                  lastMove={replayLast ? { from: replayLast.from, to: replayLast.to } : null}
                  label={`Position after ${replayIndex} of ${plies.length} moves`}
                />
              </div>
              <div className="col-span-2 flex items-center gap-2 mt-1">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Previous move"
                  disabled={replayIndex === 0}
                  onClick={() => dispatch({ type: 'replay', index: replayIndex - 1 })}
                >
                  <ChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Next move"
                  disabled={replayIndex === plies.length}
                  onClick={() => dispatch({ type: 'replay', index: replayIndex + 1 })}
                >
                  <ChevronRight />
                </Button>
                <span className="text-sm text-ink-3 ml-1">step through</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() => dispatch({ type: 'reset' })}
                >
                  <RotateCcw /> solve again
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Ledger pane: on desktop a framed pane the height of the board */}
        <div className="min-w-0 max-w-[68ch] flex flex-col lg:min-h-[calc(var(--cell)*8+1.6em)] lg:border lg:border-rule lg:px-5 lg:py-4">
          <Ledger
            puzzle={puzzle}
            plies={plies}
            rejected={state.rejected}
            step={step}
            status={status}
            replayIndex={replayIndex}
            onReplay={(i) => dispatch({ type: 'replay', index: i })}
          />

          {solved && (
            <section className="split-in mt-5" aria-label="Explanation">
              <p className="rule-line text-sm text-plus">
                <span>solved</span>
                <span className="text-ink-2">{puzzle.theme}</span>
              </p>
              <div className="mt-3 space-y-3 text-ink-2 text-[0.95rem] leading-[1.65] max-w-[62ch]">
                {puzzle.explanation.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <p className="mt-5 text-sm">
                <Link to="/chess/archive" className="text-rose-ink hover:text-ink">
                  more in the archive
                </Link>
              </p>
            </section>
          )}

          <p className="rule-line mt-auto pt-6 text-xs text-ink-3 hidden lg:flex">
            <span>
              {total} {total === 1 ? 'move' : 'moves'}
              {solved ? ' · solved' : ''}
            </span>
          </p>
        </div>
      </main>

      <StatusBar
        ref={commandRef}
        slug={puzzle.slug}
        sideLabel={`${colorName(puzzle.side)} to move`}
        progress={`move ${Math.min(step, total)}/${total}`}
        message={message}
        messageTone={solved ? 'plus' : rejectedNow.length ? 'minus' : 'plain'}
        canType={status === 'playing'}
        onCommand={onCommand}
        hints={
          solved
            ? [
                { key: '← →', label: 'replay' },
                { key: 'r', label: 'reset' },
              ]
            : [
                { key: ':', label: 'move' },
                { key: 'esc', label: 'deselect' },
                { key: 'r', label: 'reset' },
              ]
        }
      />
    </div>
  )
}
