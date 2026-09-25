import { createFileRoute } from '@tanstack/react-router'
import { loadIssuePage } from '@/server/issue-page.fn'
import { IssuePage } from '@/components/issue/IssuePage'

// The front page is this month's issue. Each issue also has a permanent
// address at /issues/$id.
export const Route = createFileRoute('/')({
  loader: () => loadIssuePage({ data: {} }),
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.issue.title} · puzzles.osm.sh` : 'puzzles.osm.sh' }],
    links: loaderData ? [{ rel: 'canonical', href: `/issues/${loaderData.issue.id}` }] : [],
  }),
  component: Page,
})

function Page() {
  const data = Route.useLoaderData()
  return <IssuePage key={data.issue.id} data={data} />
}
