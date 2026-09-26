import { useSyncExternalStore } from 'react'

const KEY = 'puzzles.osm.sh:solved'

export type Solved = Record<string, string>

const EMPTY: Solved = {}
const listeners = new Set<() => void>()
let cache: { raw: string | null; value: Solved } | null = null

function read(): Solved {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(KEY)
  } catch {
    // Storage blocked (private mode, sandboxed iframe): behave as unsolved.
  }
  if (cache?.raw === raw) return cache.value
  let value: Solved = EMPTY
  try {
    const parsed = raw ? JSON.parse(raw) : null
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) value = parsed
  } catch {
    // Corrupt entry: ignore it rather than break the page.
  }
  cache = { raw, value }
  return value
}

export function markSolved(slug: string) {
  const current = read()
  if (current[slug]) return
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...current, [slug]: new Date().toISOString() }))
  } catch {
    return
  }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  // Other tabs solving a puzzle update this one too.
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function useSolved(): Solved {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}
