export type Color = 'w' | 'b'

export interface Puzzle {
  slug: string
  title: string
  side: Color
  fen: string
  prompt: string[]
  line: string[]
  alternatives?: Record<number, string[]>
  explanation: string[]
  theme: string
  date: string
  author: string
}

// One file per puzzle in public/puzzles/<slug>.md, parsed at build time by the
// chess-puzzles plugin in vite.config.ts. The format is in the README.
const files = import.meta.glob<Puzzle>('/public/puzzles/*.md', { query: '?puzzle', import: 'default', eager: true })

export const puzzles: Puzzle[] = Object.values(files)

export const byDate = (list: Puzzle[]) =>
  list
    .map((p, i) => ({ p, i }))
    .sort((a, b) => b.p.date.localeCompare(a.p.date) || b.i - a.i)
    .map(({ p }) => p)

export const latestPuzzle = (): Puzzle => byDate(puzzles)[0]

export function findPuzzle(slug: string): Puzzle | undefined {
  return puzzles.find((p) => p.slug === slug)
}
