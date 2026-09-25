import { createFileRoute, notFound } from '@tanstack/react-router'
import { findPuzzle } from '@/lib/puzzles'
import { Solve } from '@/components/chess/Solve'

export const Route = createFileRoute('/chess/$slug')({
  loader: ({ params }) => {
    const puzzle = findPuzzle(params.slug)
    if (!puzzle) throw notFound()
    return { puzzle }
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.puzzle.title} · puzzles.osm.sh` : 'puzzles.osm.sh' }],
  }),
  component: Page,
})

function Page() {
  const { puzzle } = Route.useLoaderData()
  return <Solve key={puzzle.slug} puzzle={puzzle} />
}
