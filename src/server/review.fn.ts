import { createServerFn } from '@tanstack/react-start'
import { isReviewStatus, type ReviewStatus } from '@/lib/review'

const denied = { ok: false as const, message: 'access denied. check your review key.' }

function validateKey(key: unknown): string {
  return typeof key === 'string' ? key : ''
}

export const loadReview = createServerFn({ method: 'POST' })
  .validator((data: { key: string; status: ReviewStatus; offset: number }) => {
    if (!isReviewStatus(data.status) || !Number.isSafeInteger(data.offset) || data.offset < 0) {
      throw new Error('Invalid review filter')
    }
    return { ...data, key: validateKey(data.key) }
  })
  .handler(async ({ data }) => {
    const { hasReviewAccess } = await import('./review-auth')
    if (!hasReviewAccess(data.key)) return denied
    const { readSubmissions } = await import('./review-db')
    return { ok: true as const, page: await readSubmissions(data.status, data.offset) }
  })

export const decideSubmission = createServerFn({ method: 'POST' })
  .validator((data: { key: string; id: number; from: ReviewStatus; status: ReviewStatus }) => {
    if (!Number.isSafeInteger(data.id) || data.id < 1 || !isReviewStatus(data.from) || !isReviewStatus(data.status)) {
      throw new Error('Invalid review decision')
    }
    return { ...data, key: validateKey(data.key) }
  })
  .handler(async ({ data }) => {
    const { hasReviewAccess } = await import('./review-auth')
    if (!hasReviewAccess(data.key)) return denied
    const { reviewSubmission } = await import('./review-db')
    const updated = await reviewSubmission(data.id, data.from, data.status)
    return {
      ok: true as const,
      message: updated ? `submission ${data.status}.` : 'this submission changed. the queue has been refreshed.',
    }
  })

export const deleteSubmission = createServerFn({ method: 'POST' })
  .validator((data: { key: string; id: number; from: ReviewStatus }) => {
    if (!Number.isSafeInteger(data.id) || data.id < 1 || !isReviewStatus(data.from)) {
      throw new Error('Invalid submission deletion')
    }
    return { ...data, key: validateKey(data.key) }
  })
  .handler(async ({ data }) => {
    const { hasReviewAccess } = await import('./review-auth')
    if (!hasReviewAccess(data.key)) return denied
    const { removeSubmission } = await import('./review-db')
    const deleted = await removeSubmission(data.id, data.from)
    return {
      ok: true as const,
      message: deleted ? 'submission deleted.' : 'this submission changed or was deleted. the queue has been refreshed.',
    }
  })
