import { parse } from 'yaml'

// `---` YAML front matter shared by issue and puzzle files. Build and server
// code only: keep the YAML parser out of the browser bundle.

/** Split `---` YAML front matter from the markdown body. */
export function splitFrontMatter(text: string, file: string): { data: Record<string, unknown>; body: string } {
  const src = text.replace(/^﻿/, '').replace(/\r\n/g, '\n')
  const match = /^---\n([\s\S]*?)\n?---(?:\n|$)/.exec(src)
  if (!match) return { data: {}, body: src.trim() }
  const data = parse(match[1]) ?? {}
  if (typeof data !== 'object' || Array.isArray(data)) throw new Error(`${file}: front matter must be key: value pairs`)
  return { data: data as Record<string, unknown>, body: src.slice(match[0].length).trim() }
}

/** A front matter value as trimmed text; YAML may read dates and numbers as other types. */
export function text(value: unknown, field: string, file: string, required = true): string | undefined {
  if (value === undefined || value === null || value === '') {
    if (required) throw new Error(`${file}: missing \`${field}\``)
    return undefined
  }
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === 'string' || typeof value === 'number') return String(value).trim()
  throw new Error(`${file}: \`${field}\` must be text`)
}
