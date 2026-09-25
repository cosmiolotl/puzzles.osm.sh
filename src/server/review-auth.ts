import { createHash, timingSafeEqual } from 'node:crypto'
import { env } from 'cloudflare:workers'
import { setResponseHeader } from '@tanstack/react-start/server'

export function hasReviewAccess(key: string): boolean {
  setResponseHeader('Cache-Control', 'no-store')
  const secret = (env as unknown as { REVIEW_KEY?: string }).REVIEW_KEY
  if (!secret || secret.length < 32 || key.length > 512) return false
  const digest = (value: string) => createHash('sha256').update(value).digest()
  return timingSafeEqual(digest(key), digest(secret))
}
