// Issue types and display helpers, safe for the browser. The issues themselves
// are written in issues/<id>-<slug>/ and loaded only on the server by
// src/server/issues.ts, so statements of unpublished issues, solutions and
// answer keys never reach the client bundle.

export interface IssueFigure {
  src: string
  alt: string
  caption?: string
}

export interface IssueFile {
  href: string
  label: string
  note?: string
}

export interface Issue {
  id: string
  title: string
  published: string
  author: string
  statement: string
  figure?: IssueFigure
  files?: IssueFile[]
  /** Empty until the solution is published. Filled in by the server. */
  solution: string
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/** `2026-09` → `2026.09` for the version rule. */
export const versionOf = (issue: Issue) => issue.id.replace('-', '.')

export const monthOf = (issue: Issue) => {
  const m = Number(issue.id.slice(5, 7))
  return `${MONTHS[m - 1]} ${issue.id.slice(0, 4)}`
}

export const todayISO = () => new Date().toISOString().slice(0, 10)
