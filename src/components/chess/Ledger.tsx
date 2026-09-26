import type { ReactNode } from 'react'
import type { Ply, Rejected, Status } from '@/lib/solve'
import type { Puzzle } from '@/lib/puzzles'
import { pieceSrc } from '@/lib/glyphs'
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

const total = (p: Puzzle) => Math.ceil(p.line.length / 2)

export function Ledger({ puzzle, plies, rejected, step, status, replayIndex, onReplay }: LedgerProps) {
  const solved = status === 'solved'
  const rows: ReactNode[] = []

  for (let i = 0; i < total(puzzle); i++) {
    const solverPly = plies.find((p) => p.step === i && p.by === 'solver')
    const replyPly = plies.find((p) => p.step === i && p.by === 'reply')
    const hasReply = puzzle.line.length > i * 2 + 1
    const isActive = !solved && i === step

    for (const r of rejected.filter((r) => r.step === i)) {
      rows.push(<StruckRow key={r.id} rejected={r} />)
    }

    if (solverPly) {
      const idx = plies.indexOf(solverPly) + 1
      rows.push(
        <PlyRow
          key={solverPly.id}
          ply={solverPly}
          number={`${i + 1}.`}
          shown={!solved || idx <= replayIndex}
          active={solved && idx === replayIndex}
          onClick={solved ? () => onReplay(idx) : undefined}
        />,
      )
    } else if (!solved) {
      rows.push(<OpenRow key={`open-${i}`} number={`${i + 1}.`} active={isActive} />)
    }

    if (hasReply) {
      if (replyPly) {
        const idx = plies.indexOf(replyPly) + 1
        rows.push(
          <PlyRow
            key={replyPly.id}
            ply={replyPly}
            number="…"
            reply
            shown={!solved || idx <= replayIndex}
            active={solved && idx === replayIndex}
            onClick={solved ? () => onReplay(idx) : undefined}
          />,
        )
      } else if (!solved) {
        rows.push(<OpenRow key={`open-reply-${i}`} number="…" reply />)
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

function Figurine({ color, piece }: { color: Ply['color']; piece: Ply['piece'] }) {
  return (
    <img
      src={pieceSrc(color, piece)}
      alt=""
      draggable={false}
      className="inline-block w-[1.35em] h-[1.35em] align-[-0.3em]"
    />
  )
}

function PlyRow({
  ply,
  number,
  reply = false,
  shown,
  active,
  onClick,
}: {
  ply: Ply
  number: string
  reply?: boolean
  shown: boolean
  active: boolean
  onClick?: () => void
}) {
  const Row = onClick ? 'button' : 'div'
  return (
    <Row
      type={onClick ? 'button' : undefined}
      role="listitem"
      onClick={onClick}
      aria-current={active ? 'step' : undefined}
      className={cn(
        'ledger-in grid grid-cols-[3ch_11ch_11ch_auto] justify-start gap-x-2 w-full text-left tabular-nums whitespace-nowrap px-1 -mx-1',
        reply ? 'text-ink-3' : 'text-ink',
        !shown && 'opacity-35',
        active && 'bg-rose-wash',
        onClick && 'hover:bg-ground-2 transition-colors duration-150 cursor-pointer',
      )}
    >
      <span className="text-ink-3">{number}</span>
      <span>
        <span className={cn(reply ? 'text-ink-3' : 'text-minus')}>&minus;</span>{' '}
        <Figurine color={ply.color} piece={ply.piece} />
        {ply.from}
      </span>
      <span>
        <span className={cn(reply ? 'text-ink-3' : 'text-plus')}>+</span>{' '}
        <Figurine color={ply.color} piece={ply.promotion ?? ply.piece} />
        {ply.to}
      </span>
      <span className="text-ink-3">
        {ply.captured && (
          <>
            &times; <Figurine color={ply.color === 'w' ? 'b' : 'w'} piece={ply.captured} />
          </>
        )}
        {ply.rook && (
          <>
            &nbsp;<span className="text-minus">&minus;</span> <Figurine color={ply.color} piece="r" />
            {ply.rook.from} <span className="text-plus">+</span> <Figurine color={ply.color} piece="r" />
            {ply.rook.to}
          </>
        )}
        <span className="sr-only">{ply.san}</span>
      </span>
    </Row>
  )
}

function OpenRow({ number, active = false, reply = false }: { number: string; active?: boolean; reply?: boolean }) {
  return (
    <div
      role="listitem"
      aria-label={active ? 'your move' : reply ? 'reply, not yet played' : 'not yet played'}
      className="grid grid-cols-[3ch_11ch_11ch_auto] justify-start gap-x-2 tabular-nums whitespace-nowrap text-ink-3 px-1 -mx-1"
    >
      <span>{number}</span>
      <span aria-hidden="true">
        &minus; <span className="tracking-[0.1em]">····</span>
        {active && <span className="cursor-blink inline-block w-[0.6ch] h-[1em] align-[-0.15em] bg-rose ml-1" />}
      </span>
      <span aria-hidden="true">
        + <span className="tracking-[0.1em]">····</span>
      </span>
      <span />
    </div>
  )
}

function StruckRow({ rejected }: { rejected: Rejected }) {
  return (
    <div
      role="listitem"
      aria-label={`${rejected.san}, not it`}
      className="ledger-struck grid grid-cols-[3ch_11ch_11ch_auto] justify-start gap-x-2 tabular-nums whitespace-nowrap text-minus px-1 -mx-1"
    >
      <span>&times;</span>
      <span>
        &minus; <Figurine color={rejected.color} piece={rejected.piece} />
        <span className="line-through decoration-minus/80">{rejected.from}</span>
      </span>
      <span>
        + <Figurine color={rejected.color} piece={rejected.piece} />
        <span className="line-through decoration-minus/80">{rejected.to}</span>
      </span>
      <span className="text-ink-2">not it</span>
    </div>
  )
}
