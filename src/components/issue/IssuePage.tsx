import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Paperclip } from 'lucide-react'
import { monthOf, versionOf, type Issue } from '@/lib/issues'
import type { Solver } from '@/server/issues.fn'
import { Markdown } from './Markdown'
import { ReplyLine } from './ReplyLine'
import { SolvedBy } from './SolvedBy'
import { SiteNav } from '@/components/SiteNav'
import { cn } from '@/lib/utils'

export interface IssuePageData {
  issue: Issue
  isCurrent: boolean
  previous?: Issue
  archive: Issue[]
  solvers: Record<string, Solver[]>
}

export function IssuePage({ data }: { data: IssuePageData }) {
  const { issue, previous, archive, solvers } = data
  const hasPublishedSolution = Boolean(issue.solution)

  const [me, setMe] = useState<string | undefined>(undefined)
  useEffect(() => {
    try {
      setMe(localStorage.getItem('puzzles.osm.sh:name') ?? undefined)
    } catch {}
  }, [solvers])

  const state = (entry: Issue) => (entry.solution ? 'solved' : 'open')

  return (
    <div className="min-h-dvh flex flex-col">
      <SiteNav section="monthly" />

      <main className="flex-1 px-4 sm:px-6 py-6 max-w-[104ch] w-full">
        {/* This issue */}
        <article aria-labelledby={`issue-${issue.id}`}>
          <VersionRule issue={issue} state={state(issue)} current={data.isCurrent} />

          <div className="max-w-[68ch] mt-5">
            <h1 id={`issue-${issue.id}`} className="text-[1.25rem] leading-snug font-medium text-ink">
              {issue.title}
            </h1>
            
            <Markdown source={issue.statement} className="mt-5" />

            {issue.figure && (
              <figure className="mt-5">
                <a href={issue.figure.src} title="View image at full size" className="block w-fit max-w-full cursor-zoom-in">
                  <img
                    src={issue.figure.src}
                    alt={issue.figure.alt}
                    className="block max-w-full border border-rule"
                    loading="lazy"
                  />
                </a>
                {issue.figure.caption && (
                  <figcaption className="mt-2 text-xs text-ink-3">{issue.figure.caption}</figcaption>
                )}
              </figure>
            )}

            {issue.files && issue.files.length > 0 && (
              <ul className="mt-5 text-sm" aria-label="Files">
                {issue.files.map((f) => (
                  <li key={f.href} className="flex items-center gap-2">
                    <Paperclip className="size-4 text-ink-3 shrink-0" aria-hidden="true" />
                    <a href={f.href} className="text-rose-ink hover:text-ink">
                      {f.label}
                    </a>
                    {f.note && <span className="text-ink-3">{f.note}</span>}
                  </li>
                ))}
              </ul>
            )}

            {hasPublishedSolution ? (
              <p className="mt-6 text-sm text-ink-3">
                <span className="select-none">#&nbsp;</span>
                submissions are closed. the solution is below.
              </p>
            ) : (
              <ReplyLine issueId={issue.id} />
            )}
          </div>

          <div className={cn('mt-8 grid gap-x-10 gap-y-6', hasPublishedSolution ? 'grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,68ch)_minmax(24ch,1fr)]' : '')}>
            {hasPublishedSolution && (
              <section aria-label="Solution">
                <p className="rule-line text-sm text-plus">
                  <span>solution</span>
                </p>
                <Markdown source={issue.solution} className="mt-4" />
              </section>
            )}
            <div className={cn('min-w-0', hasPublishedSolution ? '' : 'max-w-[68ch]')}>
              <SolvedBy solvers={solvers[issue.id] ?? []} highlight={me} />
            </div>
          </div>

        </article>

        {/* Previous issue, unfolded */}
        {previous && (
          <article className="mt-12" aria-labelledby={`issue-${previous.id}`}>
            <VersionRule issue={previous} state={state(previous)} />
            <div className="mt-5 grid gap-x-10 gap-y-6 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,68ch)_minmax(24ch,1fr)]">
              <div>
                <h2 id={`issue-${previous.id}`} className="text-base leading-snug font-medium text-ink">
                  <Link to="/issues/$id" params={{ id: previous.id }} className="hover:text-rose-ink no-underline">
                    {previous.title}
                  </Link>
                </h2>
                <Markdown source={previous.statement} className="mt-4 text-ink-2" />
                {previous.solution ? (
                  <section aria-label="Solution" className="mt-6">
                    <p className="rule-line text-sm text-plus">
                      <span>solution</span>
                    </p>
                    <Markdown source={previous.solution} className="mt-4" />
                  </section>
                ) : (
                  <p className="mt-6 text-sm text-ink-3">
                    <span className="select-none">#&nbsp;</span>
                    no solution has been posted.{' '}
                    <Link to="/issues/$id" params={{ id: previous.id }} className="text-rose-ink hover:text-ink">
                      submit an answer
                    </Link>
                  </p>
                )}
              </div>
              <div>
                <SolvedBy solvers={solvers[previous.id] ?? []} highlight={me} />
              </div>
            </div>
          </article>
        )}

        {archive.length > 0 && (
          <nav className="mt-12" aria-label="Archive">
            <p className="text-sm text-ink-3">
              <span className="select-none">#&nbsp;</span>other puzzles
            </p>
            <ul className="mt-2">
              {archive.map((a) => (
                <li key={a.id}>
                  <Link
                    to="/issues/$id"
                    params={{ id: a.id }}
                    className="rule-line text-sm text-ink-2 hover:text-rose-ink no-underline py-1 transition-colors duration-150 min-w-0"
                  >
                    <span className="tabular-nums shrink-0">{versionOf(a)}</span>
                    <span className="truncate min-w-0 shrink">{a.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </main>

      <footer className="sticky bottom-0 z-20 bg-ink text-ground text-sm leading-none" aria-label="Status">
        <div className="flex flex-wrap items-stretch">
          <span className="flex items-center min-h-9 bg-rose text-ink px-3 font-medium whitespace-nowrap tabular-nums">
            {versionOf(issue)}
          </span>
          <span className="flex items-center min-h-9 px-3 whitespace-nowrap border-r border-ground/20">
            {state(issue)}
          </span>
          <span className="flex items-center min-h-9 px-3 whitespace-nowrap tabular-nums">
            {(solvers[issue.id] ?? []).length} solved
          </span>
          <span className="ml-auto hidden sm:flex items-center px-3 text-ground/70 whitespace-nowrap">
            {data.isCurrent ? 'this month' : `back to `}
            {!data.isCurrent && (
              <Link to="/" className="text-ground ml-1 underline underline-offset-4">
                this month
              </Link>
            )}
          </span>
        </div>
      </footer>
    </div>
  )
}

function VersionRule({ issue, state, current = false }: { issue: Issue; state: string; current?: boolean }) {
  return (
    <p className="rule-line text-sm">
      <span className="text-ink font-medium tabular-nums">{versionOf(issue)}</span>
      <span className="text-ink-2">{monthOf(issue)}</span>
      {state !== 'solved' && <span className="text-ink-3">{state}</span>}
      {current && <span className="text-rose-ink">this month</span>}
    </p>
  )
}
