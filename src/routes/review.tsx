import { createFileRoute } from '@tanstack/react-router'
import { ReviewScreen } from '@/components/review/ReviewScreen'

export const Route = createFileRoute('/review')({
  head: () => ({
    meta: [
      { title: 'review · puzzles.osm.sh' },
      { name: 'robots', content: 'noindex, nofollow, noarchive' },
      { name: 'referrer', content: 'no-referrer' },
    ],
  }),
  component: ReviewScreen,
})
