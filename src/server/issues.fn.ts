import { createServerFn } from '@tanstack/react-start'

export type { Solver } from './db'

export interface SubmitResult {
  ok: boolean
  message: string
}

export const submitAnswer = createServerFn({ method: 'POST' })
  .validator((data: { issueId: string; name: string; answer: string }) => ({
    issueId: String(data.issueId ?? ''),
    name: String(data.name ?? ''),
    answer: String(data.answer ?? ''),
  }))
  .handler(async ({ data }): Promise<SubmitResult> => {
    const name = data.name.replace(/\s+/g, ' ').trim()
    const answer = data.answer.trim()
    if (!name) return { ok: false, message: 'a name is needed for the solved-by list' }
    if (name.length > 32) return { ok: false, message: 'names stop at 32 characters' }
    if (!answer) return { ok: false, message: 'type an answer first' }
    if (answer.length > 64) return { ok: false, message: 'answers stop at 64 characters' }

    const { todayISO } = await import('@/lib/issues')
    const { findIssue, publishedSolution } = await import('@/server/issues')
    const issue = findIssue(data.issueId)
    if (!issue || issue.published > todayISO()) return { ok: false, message: 'no such issue' }

    if (publishedSolution(issue)) {
      return { ok: false, message: 'submissions are closed because the solution has been published.' }
    }

    const { recordSubmission } = await import('@/server/db')
    await recordSubmission(issue.id, name, answer)
    return { ok: true, message: 'answer received! please wait for your submission to be reviewed.' }
  })
