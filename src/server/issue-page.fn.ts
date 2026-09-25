import { createServerFn } from '@tanstack/react-start'
import { notFound } from '@tanstack/react-router'
import type { IssuePageData } from '@/components/issue/IssuePage'

/**
 * Everything one issue page needs, decided on the server so the
 * publication check uses the server's clock.
 */
export const loadIssuePage = createServerFn({ method: 'GET' })
  .validator((d: { id?: string }) => ({ id: d.id ? String(d.id) : undefined }))
  .handler(async ({ data }): Promise<IssuePageData> => {
    const { todayISO } = await import('@/lib/issues')
    const { currentIssue, findIssue, previousIssue, publishedIssues, publishedSolution } =
      await import('@/server/issues')
    const { readSolvers } = await import('@/server/db')

    const today = todayISO()
    const current = currentIssue(today)
    const issue = data.id ? findIssue(data.id) : current
    if (!issue || issue.published > today) throw notFound()

    const previous = previousIssue(issue, today)
    const archive = publishedIssues(today).filter((i) => i.id !== issue.id && i.id !== previous?.id)

    const solvers: IssuePageData['solvers'] = {}
    for (const i of [issue, previous].filter((x): x is NonNullable<typeof x> => Boolean(x))) {
      solvers[i.id] = await readSolvers(i.id)
    }

    return {
      issue: { ...issue, solution: publishedSolution(issue, today) },
      isCurrent: current?.id === issue.id,
      previous: previous
        ? { ...previous, solution: publishedSolution(previous, today) }
        : undefined,
      archive: archive.map((entry) => ({ ...entry, solution: '' })),
      solvers,
    }
  })
