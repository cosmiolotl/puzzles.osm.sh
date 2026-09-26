import { useRef } from 'react'
import type { Solver } from '@/server/issues.fn'

export function SolvedBy({ solvers, highlight }: { solvers: Solver[]; highlight?: string }) {
  // Rows present at first paint sit still; only a row earned on this page types in.
  const initial = useRef<Set<string> | null>(null)
  if (initial.current === null) initial.current = new Set(solvers.map((s) => `${s.name}-${s.solvedAt}`))
  return (
    <section aria-label="Solved by" className="text-sm">
      <p className="rule-line text-ink-3">
        <span>solved by</span>
        <span className="tabular-nums text-ink-2">{solvers.length}</span>
      </p>
      {solvers.length === 0 ? (
        <p className="mt-2 text-ink-3">no solves yet! be first 🩸?</p>
      ) : (
        <ol className="mt-2 tabular-nums">
          {solvers.map((s, i) => {
            const mine = highlight && s.name.toLowerCase() === highlight.toLowerCase()
            const key = `${s.name}-${s.solvedAt}`
            const fresh = !initial.current?.has(key)
            return (
              <li
                key={key}
                className={`grid grid-cols-[3ch_1fr_auto] gap-x-2 px-1 -mx-1 ${fresh ? 'ledger-in' : ''} ${mine ? 'bg-rose-wash' : ''}`}
              >
                <span className="text-ink-3">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-ink truncate">{s.name}</span>
                <time dateTime={s.solvedAt} className="text-ink-3">
                  {s.solvedAt.slice(0, 10)}
                </time>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
