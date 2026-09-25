// Server only. Import this module dynamically from inside a server function
// handler; never from a file the client bundle can reach.
import { env } from 'cloudflare:workers'

export interface Solver {
  name: string
  solvedAt: string
}

export const database = () => (env as unknown as { DB: D1Database }).DB

export async function readSolvers(issueId: string): Promise<Solver[]> {
  const rows = await database()
    .prepare(`
      SELECT name, submitted_at AS solvedAt FROM (
        SELECT name, submitted_at, id,
          ROW_NUMBER() OVER (PARTITION BY name_key ORDER BY submitted_at, id) AS rank
        FROM submissions WHERE issue = ? AND status = 'approved'
      ) WHERE rank = 1 ORDER BY submitted_at, id
    `)
    .bind(issueId)
    .all<Solver>()
  return rows.results
}

export async function recordSubmission(issueId: string, name: string, answer: string): Promise<void> {
  await database()
    .prepare(`
      INSERT OR IGNORE INTO submissions (issue, name, name_key, answer, submitted_at, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `)
    .bind(issueId, name, name.toLowerCase(), answer, new Date().toISOString())
    .run()
}
