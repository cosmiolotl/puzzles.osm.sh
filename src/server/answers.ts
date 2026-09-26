// Answer matching for the reviewer's hint. The accepted spellings live in each
// issue's solution.md. Imported only inside server function handlers; never
// import this from anything a route renders.
import { acceptedAnswers } from './issues'

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.\s]+$/, '')
    .replace(/^\$|\$$/g, '')
    .trim()
}

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
