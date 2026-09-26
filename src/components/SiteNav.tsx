import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

export type Section = 'monthly' | 'chess'

const item = 'no-underline hover:underline transition-colors duration-150'
const idle = 'text-ink-2 hover:text-rose-ink'
const current = 'text-ink font-medium underline decoration-rose decoration-2 underline-offset-[0.4em]'

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
