import { splitFrontMatter, text } from './front-matter.ts'
import type { Color, Puzzle } from './puzzles.ts'

// Parses one chess puzzle file, public/puzzles/<slug>.md. Runs at build time
// (the `?puzzle` import in vite.config.ts) and in scripts, never in the browser.

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DATE = /^\d{4}-\d{2}-\d{2}$/
const EXPLANATION = /^##\s+Explanation\s*$/im

/** `a5 Qf3 c3` or a YAML list, as SAN moves. */
function moves(value: unknown, field: string, file: string): string[] {
  const list = Array.isArray(value) ? value.map((m) => text(m, field, file)!) : (text(value, field, file) ?? '').split(/\s+/)
  return list.filter(Boolean)
}

export function parsePuzzle(slug: string, source: string): Puzzle {
  const file = `public/puzzles/${slug}.md`
  if (!SLUG.test(slug)) throw new Error(`${file}: file names are lowercase words joined by hyphens`)

  const { data, body } = splitFrontMatter(source, file)
  const fen = text(data.fen, 'fen', file)!
  const side = fen.split(/\s+/)[1] as Color
  if (side !== 'w' && side !== 'b') throw new Error(`${file}: \`fen\` has no side to move`)
  const date = text(data.date, 'date', file)!
  if (!DATE.test(date)) throw new Error(`${file}: \`date\` must be YYYY-MM-DD`)

  const line = moves(data.line, 'line', file)
  if (line.length === 0) throw new Error(`${file}: missing \`line\``)

  // Keyed by solver move number from 1 in the file; the solver counts from 0.
  let alternatives: Record<number, string[]> | undefined
  if (data.alternatives !== undefined && data.alternatives !== null) {
    if (typeof data.alternatives !== 'object' || Array.isArray(data.alternatives)) {
      throw new Error(`${file}: \`alternatives\` maps a solver move number to moves, e.g. \`2: [Qc5]\``)
    }
    alternatives = {}
    for (const [n, alts] of Object.entries(data.alternatives)) {
      const move = Number(n)
      if (!Number.isInteger(move) || move < 1) throw new Error(`${file}: alternatives key \`${n}\` must be a solver move number from 1`)
      alternatives[move - 1] = moves(alts, `alternatives.${n}`, file)
    }
  }

  // Above `## Explanation`: prompt lines. Below: explanation paragraphs.
  const split = EXPLANATION.exec(body)
  const promptText = split ? body.slice(0, split.index) : body
  const explanationText = split ? body.slice(split.index + split[0].length) : ''
  const prompt = promptText.split('\n').map((l) => l.trim()).filter(Boolean)
  if (prompt.length === 0) throw new Error(`${file}: the prompt (below the front matter) is empty`)
  const explanation = explanationText
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean)

  return {
    slug,
    title: text(data.title, 'title', file)!,
    side,
    fen,
    prompt,
    line,
    alternatives,
    explanation,
    theme: text(data.theme, 'theme', file, false) ?? '',
    date,
    author: text(data.author, 'author', file)!,
  }
}
