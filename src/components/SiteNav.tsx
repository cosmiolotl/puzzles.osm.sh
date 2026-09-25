import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

export type Section = 'monthly' | 'chess'

const item = 'no-underline hover:underline transition-colors duration-150'
const idle = 'text-ink-2 hover:text-rose-ink'
// Color is not the only carrier: the current item is also weighted and underlined.
const current = 'text-ink font-medium underline decoration-rose decoration-2 underline-offset-[0.4em]'

/*
  One header for every page. The two sections sit together on the left,
  split by a box-drawing bar; the chess archive holds the far end of the
  rule while you are in chess. "chess" always opens this month's position.
*/
export function SiteNav({ section, archive = false }: { section?: Section; archive?: boolean }) {
  return (
    <header className="px-4 sm:px-6 pt-4">
      <nav aria-label="Site" className={cn('rule-line text-sm', section === 'chess' && 'rule-line-split')}>
        <span className="text-ink-3 hidden sm:inline">puzzles.osm.sh</span>
        <span aria-hidden="true" className="text-rule hidden sm:inline">
          │
        </span>
        <Link
          to="/"
          aria-current={section === 'monthly' ? 'page' : undefined}
          className={cn(item, section === 'monthly' ? current : idle)}
        >
          monthly
        </Link>
        <span aria-hidden="true" className="text-rule">
          │
        </span>
        <Link
          to="/chess"
          aria-current={section === 'chess' && !archive ? 'page' : undefined}
          className={cn(item, section !== 'chess' ? idle : archive ? 'text-ink hover:text-rose-ink' : current)}
        >
          chess
        </Link>
        {section === 'chess' && (
          <>
            <span aria-hidden="true" className="rule-fill" />
            <Link
              to="/chess/archive"
              aria-current={archive ? 'page' : undefined}
              className={cn(item, archive ? current : idle)}
            >
              archive
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}
