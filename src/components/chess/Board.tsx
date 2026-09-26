import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import type { Square } from 'chess.js'
import type { Color } from '@/lib/puzzles'
import type { TrackedPiece } from '@/lib/solve'
import { pieceSrc, PIECE_NAME, FILES, RANKS, colorName, isDarkSquare, squareToXY, xyToSquare } from '@/lib/glyphs'
import { cn } from '@/lib/utils'

export type Tint = 'minus' | 'plus' | 'reply'

export interface BoardProps {
  tracks: TrackedPiece[]
  orientation: Color
  /** Which side may be picked up. Null: the board is display only. */
  movable: Color | null
  selected?: Square | null
  targets?: { to: Square; capture: boolean }[]
  lastMove?: { from: Square; to: Square } | null
  tint?: Partial<Record<Square, Tint>>
  shake?: number
  label: string
  onSquare?: (square: Square) => void
  onMove?: (from: Square, to: Square) => void
  className?: string
}

interface Drag {
  from: Square
  piece: TrackedPiece
  x: number
  y: number
  moved: boolean
}

export function Board({
  tracks,
  orientation,
  movable,
  selected = null,
  targets = [],
  lastMove = null,
  tint = {},
  shake = 0,
  label,
  onSquare,
  onMove,
  className,
}: BoardProps) {
  const areaRef = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState<Drag | null>(null)
  const [shaking, setShaking] = useState(false)

  useEffect(() => {
    if (!shake) return
    setShaking(true)
    const t = setTimeout(() => setShaking(false), 260)
    return () => clearTimeout(t)
  }, [shake])

  const pieceAt = useCallback(
    (square: Square) => tracks.find((t) => t.square === square) ?? null,
    [tracks],
  )

  const squareFromPoint = (clientX: number, clientY: number): Square | null => {
    const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null
    const sq = el?.closest<HTMLElement>('[data-square]')?.dataset.square
    return (sq as Square | undefined) ?? null
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!movable || e.button !== 0) return
    const square = squareFromPoint(e.clientX, e.clientY)
    if (!square) return
    const piece = pieceAt(square)
    if (!piece || piece.color !== movable) {
      onSquare?.(square)
      return
    }
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag({ from: square, piece, x: e.clientX, y: e.clientY, moved: false })
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag) return
    const moved = drag.moved || Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 4
    if (moved && !drag.moved && selected !== drag.from) onSquare?.(drag.from)
    setDrag({ ...drag, x: e.clientX, y: e.clientY, moved })
  }

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag) return
    const target = squareFromPoint(e.clientX, e.clientY)
    if (drag.moved && target && target !== drag.from) onMove?.(drag.from, target)
    else onSquare?.(drag.from)
    setDrag(null)
  }

  const onPointerCancel = () => setDrag(null)

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const sq = target.dataset.square as Square | undefined
    if (!sq) return
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    }
    const d = delta[e.key]
    if (!d) return
    e.preventDefault()
    const { x, y } = squareToXY(sq, orientation)
    const nx = Math.max(0, Math.min(7, x + d[0]))
    const ny = Math.max(0, Math.min(7, y + d[1]))
    const next = xyToSquare(nx, ny, orientation)
    areaRef.current?.querySelector<HTMLElement>(`[data-square="${next}"]`)?.focus()
  }

  const ranks = orientation === 'w' ? [...RANKS].reverse() : [...RANKS]
  const files = orientation === 'w' ? [...FILES] : [...FILES].reverse()
  const targetMap = new Map(targets.map((t) => [t.to, t.capture]))

  return (
    <div
      className={cn('board inline-grid grid-cols-[2ch_auto] grid-rows-[auto_1.6em] select-none', className)}
      role="group"
      aria-label={label}
    >
      {/* rank labels */}
      <div className="grid grid-rows-8 text-ink-3 text-[0.8em] leading-none" aria-hidden="true">
        {ranks.map((r) => (
          <span key={r} className="flex items-center h-[var(--cell)]">
            {r}
          </span>
        ))}
      </div>

      {/* squares and pieces */}
      <div
        ref={areaRef}
        className={cn(
          'relative w-[calc(var(--cell)*8)] h-[calc(var(--cell)*8)] border border-rule touch-none',
          shaking && 'board-shake',
          drag?.moved && 'cursor-grabbing',
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onKeyDown={onKeyDown}
      >
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
          {ranks.map((r) =>
            files.map((f) => {
              const square = `${f}${r}` as Square
              const piece = pieceAt(square)
              const isSelected = selected === square
              const isTarget = targetMap.has(square)
              const isCaptureTarget = targetMap.get(square) === true
              const isLast = lastMove?.from === square || lastMove?.to === square
              const t = tint[square]
              const description = piece
                ? `${square}, ${colorName(piece.color)} ${PIECE_NAME[piece.type]}`
                : `${square}, empty`
              const cellClass = cn(
                    'relative block w-full h-full p-0 m-0 border-0 outline-none',
                    isDarkSquare(square) ? 'bg-square-dark' : 'bg-square-light',
                    isLast && !t && 'bg-rose-wash/70',
                    t === 'minus' && 'bg-minus-wash',
                    t === 'plus' && 'bg-plus-wash',
                    t === 'reply' && 'bg-ink/10',
                    isSelected && 'bg-rose-wash shadow-[inset_0_0_0_2px_var(--rose)]',
                    movable && piece?.color === movable && !drag?.moved && 'cursor-grab',
                    movable && 'focus-visible:shadow-[inset_0_0_0_2px_var(--rose-ink)]',
                  )
              const marks = (
                <>
                  {isTarget && !isCaptureTarget && (
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/25 w-[calc(var(--cell)*0.28)] h-[calc(var(--cell)*0.28)]"
                    />
                  )}
                  {isTarget && isCaptureTarget && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-[6%] rounded-full border-[3px] border-ink/30"
                    />
                  )}
                </>
              )
              if (!movable) {
                return (
                  <div key={square} data-square={square} className={cellClass}>
                    {marks}
                  </div>
                )
              }
              return (
                <button
                  key={square}
                  type="button"
                  data-square={square}
                  aria-label={description}
                  aria-pressed={isSelected}
                  tabIndex={square === (selected ?? 'a1') ? 0 : -1}
                  onClick={(e) => {
                    if (e.detail === 0) onSquare?.(square)
                  }}
                  className={cellClass}
                >
                  {marks}
                </button>
              )
            }),
          )}
        </div>

        {/* pieces: absolutely placed, animate between squares */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {tracks.map((p) => {
            const { x, y } = squareToXY(p.square, orientation)
            const hidden = drag?.moved && drag.piece.id === p.id
            return (
              <span
                key={p.id}
                className={cn(
                  'piece-track absolute left-0 top-0 w-[var(--cell)] h-[var(--cell)] transition-transform duration-200 ease-out-expo',
                  hidden && 'opacity-0',
                )}
                style={{ transform: `translate(calc(var(--cell) * ${x}), calc(var(--cell) * ${y}))` }}
              >
                <img src={pieceSrc(p.color, p.type)} alt="" draggable={false} className="block w-full h-full" />
              </span>
            )
          })}
        </div>
      </div>

      <div />
      {/* file labels */}
      <div className="grid grid-cols-8 text-ink-3 text-[0.8em] leading-none pt-[0.45em]" aria-hidden="true">
        {files.map((f) => (
          <span key={f} className="text-center">
            {f}
          </span>
        ))}
      </div>

      {/* drag ghost */}
      {drag?.moved && (
        <img
          src={pieceSrc(drag.piece.color, drag.piece.type)}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="fixed z-50 pointer-events-none w-[calc(var(--cell)*1.08)] h-[calc(var(--cell)*1.08)] -translate-x-1/2 -translate-y-1/2"
          style={{ left: drag.x, top: drag.y }}
        />
      )}
    </div>
  )
}
