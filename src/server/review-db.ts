import { database } from './db'
import { findIssue } from './issues'
import { isCorrect } from './answers'
import { REVIEW_PAGE_SIZE, type ReviewPage, type ReviewStatus, type Submission } from '@/lib/review'

export async function readSubmissions(status: ReviewStatus, offset: number): Promise<ReviewPage> {
  const rows = await database()
    .prepare(`
      SELECT id, issue, name, answer, status, submitted_at AS submittedAt, reviewed_at AS reviewedAt
      FROM submissions WHERE status = ? ORDER BY id ASC LIMIT ? OFFSET ?
    `)
    .bind(status, REVIEW_PAGE_SIZE + 1, offset)
    .all<Omit<Submission, 'title' | 'matchesKey'>>()
  return {
    hasMore: rows.results.length > REVIEW_PAGE_SIZE,
    submissions: rows.results.slice(0, REVIEW_PAGE_SIZE).map((row) => ({
      ...row,
      title: findIssue(row.issue)?.title ?? 'unknown issue',
      matchesKey: row.answer === null ? null : isCorrect(row.issue, row.answer),
    })),
  }
}

export async function reviewSubmission(id: number, from: ReviewStatus, status: ReviewStatus): Promise<boolean> {
  const result = await database()
    .prepare('UPDATE submissions SET status = ?, reviewed_at = ? WHERE id = ? AND status = ?')
    .bind(status, new Date().toISOString(), id, from)
    .run()
  return result.meta.changes === 1
}

export async function removeSubmission(id: number, from: ReviewStatus): Promise<boolean> {
  const result = await database()
    .prepare('DELETE FROM submissions WHERE id = ? AND status = ?')
    .bind(id, from)
    .run()
  return result.meta.changes === 1
}
