// Answer matching for the reviewer's hint. The accepted spellings live in each
// issue's solution.md. Imported only inside server function handlers; never
// import this from anything a route renders.
import { acceptedAnswers } from './issues'

/** Lowercase, trim, collapse whitespace, drop a trailing period. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.\s]+$/, '')
    .replace(/^\$|\$$/g, '')
    .trim()
}

/** Also compare with all spaces and thousands separators removed. */
function loose(text: string): string {
  return normalize(text).replace(/[\s,]/g, '')
}

export function isCorrect(issueId: string, answer: string): boolean {
  const list = acceptedAnswers(issueId)
  if (!list) return false
  const a = normalize(answer)
  const l = loose(answer)
  return list.some((ok) => normalize(ok) === a || loose(ok) === l)
}
