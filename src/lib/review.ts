export const reviewStatuses = ['pending', 'approved', 'rejected'] as const
export type ReviewStatus = (typeof reviewStatuses)[number]

export interface Submission {
  id: number
  issue: string
  title: string
  name: string
  answer: string | null
  submittedAt: string
  reviewedAt: string | null
  status: ReviewStatus
  matchesKey: boolean | null
}

export interface ReviewPage {
  submissions: Submission[]
  hasMore: boolean
}

export const REVIEW_PAGE_SIZE = 30

export function isReviewStatus(value: unknown): value is ReviewStatus {
  return reviewStatuses.some((status) => status === value)
}
