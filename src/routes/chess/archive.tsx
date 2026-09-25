import { createFileRoute, Link } from '@tanstack/react-router'
import { byDate, puzzles, totalSolverMoves } from '@/lib/puzzles-meta'
import { useSolved } from '@/lib/progress'
import { Check } from 'lucide-react'
import { SiteNav } from '@/components/SiteNav'

export const Route = createFileRoute('/chess/archive')({
  component: Index,
})

function Index() {
  const solved = useSolved()
  const solvedCount = puzzles.filter((p) => solved[p.slug]).length
  return (
    <main className="min-h-dvh flex flex-col">
      <SiteNav section="chess" archive />

      <section className="px-4 sm:px-6 py-10 max-w-[72ch]">
        <pre className="text-ink-2 text-sm whitespace-pre-wrap">{`$ ls -t chess/`}</pre>
        <ul className="mt-4 divide-y divide-rule border-y border-rule">
          {byDate(puzzles).map((p) => {
            const done = Boolean(solved[p.slug])
            const n = puzzles.indexOf(p) + 1
            return (
              <li key={p.slug}>
                <Link
                  to="/chess/$slug"
                  params={{ slug: p.slug }}
                  aria-label={`${p.title}${done ? ', solved' : ''}`}
                  className="group grid grid-cols-[3ch_1fr_auto] gap-x-3 gap-y-1 py-3 hover:bg-ground-2 -mx-2 px-2 transition-colors duration-150"
                >
                  {done ? (
                    <span className="flex items-center justify-center h-[1lh] text-plus">
                      <Check className="size-4" strokeWidth={2.5} aria-hidden="true" />
                    </span>
                  ) : (
                    <span className="text-center text-ink-3 tabular-nums">{String(n).padStart(2, '0')}</span>
                  )}
                  <span
                    className={
                      done
                        ? 'text-ink-2 group-hover:text-rose-ink transition-colors duration-150'
                        : 'text-ink group-hover:text-rose-ink transition-colors duration-150'
                    }
                  >
                    {p.title}
                  </span>
                  <span className="text-ink-3 text-sm tabular-nums">
                    {p.side === 'w' ? 'white' : 'black'} · {totalSolverMoves(p)}{' '}
                    {totalSolverMoves(p) === 1 ? 'move' : 'moves'}
                  </span>
                  <span className="col-start-2 col-span-2 text-ink-3 text-xs tabular-nums">
                    <time dateTime={p.date}>{p.date}</time> · {p.author}
                    {done && <span className="text-plus"> · solved</span>}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
        <p className="mt-3 text-xs text-ink-3 tabular-nums">
          {solvedCount}/{puzzles.length} solved
        </p>
        <p className="mt-6 text-sm text-ink-3">
          Positional puzzles. Rather than searching for material advantages, you are tasked with finding long-term positional advantages.
        </p>
      </section>
    </main>
  )
}
