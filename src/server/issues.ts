import { todayISO, type Issue } from '@/lib/issues'
import { parseIssueSource, type IssueSource } from '@/lib/issue-source'

// Every issue folder under issues/, bundled into the server only. Import this
// module from server function handlers, never from anything a route renders:
// it holds unpublished statements, solutions, and answer keys.

const issueFiles = import.meta.glob<string>('/issues/*/issue.md', { query: '?raw', import: 'default', eager: true })
const solutionFiles = import.meta.glob<string>('/issues/*/solution.md', { query: '?raw', import: 'default', eager: true })

const folderOf = (path: string) => path.split('/').at(-2)!

const sources = new Map<string, IssueSource>()
for (const [path, issueMd] of Object.entries(issueFiles)) {
  const folder = folderOf(path)
  const source = parseIssueSource(folder, issueMd, solutionFiles[`/issues/${folder}/solution.md`])
  const clash = sources.get(source.issue.id)
  if (clash) throw new Error(`issues/${folder}: issue ${source.issue.id} already exists`)
  sources.set(source.issue.id, source)
}

const issues = [...sources.values()].map((s) => s.issue)

export const findIssue = (id: string): Issue | undefined => sources.get(id)?.issue

/** Issues live today, newest first. */
export function publishedIssues(today = todayISO()): Issue[] {
  return issues.filter((i) => i.published <= today).sort((a, b) => b.published.localeCompare(a.published))
}

export const currentIssue = (today = todayISO()) => publishedIssues(today)[0]

export function previousIssue(issue: Issue, today = todayISO()): Issue | undefined {
  return publishedIssues(today).find((i) => i.published < issue.published)
}

/**
 * The solution once the issue is live, its solution.md has a body, and the
 * solution's own `published` date (if any) has arrived; otherwise ''.
 */
export function publishedSolution(issue: Issue, today = todayISO()): string {
  const source = sources.get(issue.id)
  if (!source || issue.published > today) return ''
  if (source.solutionPublished && source.solutionPublished > today) return ''
  return source.solution
}

/** Accepted answer spellings from solution.md, for the reviewer's hint. */
export const acceptedAnswers = (id: string): string[] | undefined => sources.get(id)?.answers
