import { createFileRoute } from '@tanstack/react-router'
import { loadIssuePage } from '@/server/issue-page.fn'
import { IssuePage } from '@/components/issue/IssuePage'

export const Route = createFileRoute('/issues/$id')({
  loader: ({ params }) => loadIssuePage({ data: { id: params.id } }),
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.issue.title} · puzzles.osm.sh` : 'puzzles.osm.sh' }],
  }),
  component: Page,
})

function Page() {
  const data = Route.useLoaderData()
  return <IssuePage key={data.issue.id} data={data} />
}
