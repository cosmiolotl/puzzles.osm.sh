import type { ReactNode } from 'react'
import type { PieceSymbol, Ply, Rejected, Status } from '@/lib/solve'
import type { Color, Puzzle } from '@/lib/puzzles'
import { pieceSrc, PIECE_NAME } from '@/lib/glyphs'
import { cn } from '@/lib/utils'

interface LedgerProps {
  puzzle: Puzzle
  plies: Ply[]
  rejected: Rejected[]
  step: number
  status: Status
  replayIndex: number
  onReplay: (index: number) => void
}

// Move number, white's move, black's move, note. Every cell pads 4px so washes
// bleed past the text; the row pulls back by the same amount.
const ROW = 'grid grid-cols-[4ch_12ch_12ch_auto] justify-start gap-x-2 -mx-1 tabular-nums whitespace-nowrap'

export function Ledger({ puzzle, plies, rejected, step, status, replayIndex, onReplay }: LedgerProps) {
  const solved = status === 'solved'
  // Black to move leaves white's half of the first row empty: 1. … a5.
  const offset = puzzle.side === 'b' ? 1 : 0
  const rowCount = Math.ceil((puzzle.line.length + offset) / 2)
  const activeRow = Math.floor((step * 2 + offset) / 2)
  const cursorAt = solved ? -1 : plies.length
  const rows: ReactNode[] = []

  for (let r = 0; r < rowCount; r++) {
    const cells = [0, 1].map((c) => {
      const k = r * 2 + c - offset
      if (k < 0) {
        return (
          <span key="skip" aria-hidden="true" className="px-1 text-ink-3">
            …
          </span>
        )
      }
      if (k >= puzzle.line.length) return <span key="end" />
      const reply = k % 2 === 1
      const ply = plies[k]
      if (ply) {
        return (
          <MoveCell
            key={ply.id}
            ply={ply}
            reply={reply}
            shown={!solved || k < replayIndex}
            active={solved && k + 1 === replayIndex}
            onClick={solved ? () => onReplay(k + 1) : undefined}
          />
        )
      }
      return <OpenCell key={`open-${k}`} cursor={k === cursorAt} reply={reply} />
    })

    rows.push(
      <div key={`row-${r}`} role="listitem" className={ROW}>
        <span className="px-1 text-ink-3">{r + 1}.</span>
        {cells}
        <span />
      </div>,
    )

    // A rejected try sits under the row it was meant for, in the solver's column.
    if (!solved && r === activeRow) {
      for (const rej of rejected.filter((x) => x.step === step)) {
        rows.push(<StruckRow key={rej.id} rejected={rej} column={offset} />)
      }
    }
  }

  return (
    <section aria-label="Move ledger" className="text-base leading-[1.7]">
      <div className="text-ink-2" aria-label="Prompt">
        {puzzle.prompt.map((line, i) => (
          <p key={i} className="whitespace-pre-wrap">
            <span className="text-ink-3 select-none">#&nbsp;</span>
            {line}
          </p>
        ))}
      </div>

      <div
        className={cn('mt-4 border-t border-rule pt-3', solved && 'border-b pb-3')}
        role="list"
        aria-live="polite"
      >
        {rows}
      </div>
    </section>
  )
}

function Figurine({ color, piece }: { color: Color; piece: PieceSymbol }) {
  return (
    <img
      src={pieceSrc(color, piece)}
      alt=""
      draggable={false}
      className="inline-block w-[1.35em] h-[1.35em] align-[-0.3em]"
    />
  )
}

/** SAN with a figurine for every piece letter, pawns included: Nbxd7, d8=Q. */
function San({ san, color }: { san: string; color: Color }) {
  if (san.startsWith('O-O')) return <>{san}</>
  // Splitting on a capture group puts the piece letters at the odd indices.
  const parts = (/^[KQRBN]/.test(san) ? san : `P${san}`).split(/([KQRBNP])/)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 ? <Figurine key={i} color={color} piece={part.toLowerCase() as PieceSymbol} /> : part,
      )}
    </>
  )
}

/** SAN as a screen reader should say it: Nbxd7+ is "knight b takes d7, check". */
function spoken(san: string): string {
  const piece = (letter: string) => PIECE_NAME[letter.toLowerCase() as PieceSymbol]
  return san
    .replace(/^O-O-O/, 'castles queenside')
    .replace(/^O-O/, 'castles kingside')
    .replace(/^([KQRBN])/, (_, p: string) => `${piece(p)} `)
    .replace('x', ' takes ')
    .replace(/=([QRBN])/, (_, p: string) => ` promotes to ${piece(p)}`)
    .replace(/\+$/, ', check')
    .replace(/#$/, ', mate')
}

function MoveCell({
  ply,
  reply,
  shown,
  active,
  onClick,
}: {
  ply: Ply
  reply: boolean
  shown: boolean
  active: boolean
  onClick?: () => void
}) {
  const Cell = onClick ? 'button' : 'span'
  return (
    <Cell
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      aria-current={active ? 'step' : undefined}
      className={cn(
        'ledger-in px-1 text-left',
        reply ? 'text-ink-3' : 'text-ink',
        !shown && 'opacity-35',
        active && 'bg-rose-wash',
        onClick && 'hover:bg-ground-2 transition-colors duration-150 cursor-pointer',
      )}
    >
      <span aria-hidden="true">
        <San san={ply.san} color={ply.color} />
      </span>
      <span className="sr-only">{spoken(ply.san)}</span>
    </Cell>
  )
}

function OpenCell({ cursor, reply }: { cursor: boolean; reply: boolean }) {
  if (cursor) {
    return (
      <span className="px-1">
        <span aria-hidden="true" className="cursor-blink inline-block w-[0.6ch] h-[1em] align-[-0.15em] bg-rose" />
        <span className="sr-only">{reply ? 'reply coming' : 'your move'}</span>
      </span>
    )
  }
  return (
    <span className="px-1 text-ink-3">
      <span aria-hidden="true" className="tracking-[0.1em]">
        ····
      </span>
      <span className="sr-only">not yet played</span>
    </span>
  )
}

function StruckRow({ rejected, column }: { rejected: Rejected; column: number }) {
  const move = (
    <span className="px-1">
      <span className="relative inline-block after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-minus/80">
        <San san={rejected.san} color={rejected.color} />
      </span>
    </span>
  )
  return (
    <div
      role="listitem"
      aria-label={`${rejected.san}, not it`}
      className={cn(ROW, 'ledger-struck text-minus')}
    >
      <span className="px-1">&times;</span>
      {column === 0 ? move : <span />}
      {column === 1 ? move : <span />}
      <span className="px-1 text-ink-2">not it</span>
    </div>
  )
}
