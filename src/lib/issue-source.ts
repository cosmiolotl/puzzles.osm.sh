import { splitFrontMatter, text } from './front-matter.ts'
import type { Issue, IssueFigure, IssueFile } from './issues.ts'

// Parses one issue folder: issues/<id>-<slug>/issue.md and solution.md.
// Kept free of Vite APIs so scripts can use it with plain file reads.

export interface IssueSource {
  issue: Issue
  /** Full solution markdown, published once nonempty and the issue is live. */
  solution: string
  /** Optional YYYY-MM-DD (UTC) before which the solution stays hidden. */
  solutionPublished?: string
  /** Accepted answer spellings, a hint for manual review. */
  answers: string[]
}

const FOLDER = /^(\d{4}-(?:0[1-9]|1[0-2]))(?:-[a-z0-9-]+)?$/
const DATE = /^\d{4}-\d{2}-\d{2}$/

function figureOf(value: unknown, file: string): IssueFigure | undefined {
  if (value === undefined || value === null) return undefined
  const f = value as Record<string, unknown>
  return {
    src: text(f.src, 'figure.src', file)!,
    alt: text(f.alt, 'figure.alt', file)!,
    caption: text(f.caption, 'figure.caption', file, false),
  }
}

function filesOf(value: unknown, file: string): IssueFile[] | undefined {
  if (value === undefined || value === null) return undefined
  if (!Array.isArray(value)) throw new Error(`${file}: \`files\` must be a list`)
  if (value.length === 0) return undefined
  return value.map((entry, i) => ({
    href: text(entry?.href, `files[${i}].href`, file)!,
    label: text(entry?.label, `files[${i}].label`, file)!,
    note: text(entry?.note, `files[${i}].note`, file, false),
  }))
}

/**
 * @param folder the folder name, e.g. `2026-09-minedknight`; its `YYYY-MM`
 *   prefix is the issue's permanent id.
 */
export function parseIssueSource(folder: string, issueMd: string, solutionMd = ''): IssueSource {
  const id = FOLDER.exec(folder)?.[1]
  if (!id) throw new Error(`issues/${folder}: folder names look like 2026-09 or 2026-09-some-slug`)

  const issueFile = `issues/${folder}/issue.md`
  const { data, body: statement } = splitFrontMatter(issueMd, issueFile)
  const published = text(data.published, 'published', issueFile)!
  if (!DATE.test(published)) throw new Error(`${issueFile}: \`published\` must be YYYY-MM-DD`)
  if (!statement) throw new Error(`${issueFile}: the statement (below the front matter) is empty`)

  const solutionFile = `issues/${folder}/solution.md`
  const { data: solutionData, body: solution } = splitFrontMatter(solutionMd, solutionFile)
  const answers = solutionData.answers ?? []
  if (!Array.isArray(answers)) throw new Error(`${solutionFile}: \`answers\` must be a list`)
  const solutionPublished = text(solutionData.published, 'published', solutionFile, false)
  if (solutionPublished && !DATE.test(solutionPublished)) {
    throw new Error(`${solutionFile}: \`published\` must be YYYY-MM-DD`)
  }

  return {
    issue: {
      id,
      title: text(data.title, 'title', issueFile)!,
      published,
      author: text(data.author, 'author', issueFile)!,
      statement,
      figure: figureOf(data.figure, issueFile),
      files: filesOf(data.files, issueFile),
      solution: '',
    },
    solution,
    solutionPublished,
    answers: answers.map((a, i) => text(a, `answers[${i}]`, solutionFile)!),
  }
}
