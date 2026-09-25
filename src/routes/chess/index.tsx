import { createFileRoute } from '@tanstack/react-router'
import { latestPuzzle } from '@/lib/puzzles'
import { Solve } from '@/components/chess/Solve'

// /chess serves the newest puzzle in place, so the URL can be shared as
// "whatever is new". Its permanent home stays /chess/$slug.
export const Route = createFileRoute('/chess/')({
  loader: () => ({ puzzle: latestPuzzle() }),
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.puzzle.title} · puzzles.osm.sh` : 'puzzles.osm.sh' }],
    links: loaderData ? [{ rel: 'canonical', href: `/chess/${loaderData.puzzle.slug}` }] : [],
  }),
  component: Page,
})

function Page() {
  const { puzzle } = Route.useLoaderData()
  return <Solve key={puzzle.slug} puzzle={puzzle} />
}
