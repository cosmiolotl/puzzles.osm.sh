import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { SubmissionRow } from './SubmissionRow'
import { decideSubmission, deleteSubmission, loadReview } from '@/server/review.fn'
import { REVIEW_PAGE_SIZE, reviewStatuses, type ReviewPage, type ReviewStatus, type Submission } from '@/lib/review'

export function ReviewScreen() {
  const [key, setKey] = useState('')
  const [page, setPage] = useState<ReviewPage | null>(null)
  const [status, setStatus] = useState<ReviewStatus>('pending')
  const [offset, setOffset] = useState(0)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  function lock() {
    setKey('')
    setPage(null)
    setStatus('pending')
    setOffset(0)
  }

  async function refresh(nextStatus = status, nextOffset = offset) {
    const result = await loadReview({ data: { key, status: nextStatus, offset: nextOffset } })
    if (!result.ok) {
      lock()
      setMessage(result.message)
      return
    }
    setPage(result.page)
    setStatus(nextStatus)
    setOffset(nextOffset)
  }

  async function load(nextStatus = status, nextOffset = offset) {
    if (busy) return
    setBusy(true)
    setMessage('')
    try {
      await refresh(nextStatus, nextOffset)
    } catch {
      setMessage('could not load submissions. try again.')
    } finally {
      setBusy(false)
    }
  }

  function unlock(event: FormEvent) {
    event.preventDefault()
    void load('pending', 0)
  }

  async function act(submission: Submission, nextStatus?: ReviewStatus) {
    if (busy) return
    setBusy(true)
    setMessage('')
    try {
      const data = { key, id: submission.id, from: submission.status }
      const result = nextStatus
        ? await decideSubmission({ data: { ...data, status: nextStatus } })
        : await deleteSubmission({ data })
      if (!result.ok) {
        lock()
        setMessage(result.message)
        return
      }
      setMessage(result.message)
      // Stay on this page unless removing its last row would leave it empty.
      const nextOffset = page?.submissions.length === 1 ? Math.max(0, offset - REVIEW_PAGE_SIZE) : offset
      await refresh(status, nextOffset)
    } catch {
      setMessage(nextStatus
        ? 'could not confirm the decision. refresh before trying again.'
        : 'could not confirm deletion. refresh before trying again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-dvh max-w-[80ch] px-4 py-6 sm:px-6">
      <div className="rule-line text-sm text-ink-3"><span>puzzles.osm.sh</span></div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-medium">submission review</h1>
        {page && <Button variant="outline" className="min-h-11" disabled={busy} onClick={() => { lock(); setMessage('locked.'); }}>lock</Button>}
      </div>
      <p className="mt-2 text-sm text-ink-2">
        approve an answer to publish its name in the solved-by list.
      </p>

      {!page ? (
        <form onSubmit={unlock} className="mt-8 max-w-[52ch]">
          <label htmlFor="review-key" className="text-sm">secret key</label>
          <div className="mt-2 flex flex-wrap gap-3">
            <input
              id="review-key"
              name="review-key"
              type="password"
              value={key}
              onChange={(event) => setKey(event.target.value)}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              required
              maxLength={512}
              className="min-h-11 min-w-0 flex-1 border border-rule bg-transparent px-3"
            />
            <Button type="submit" className="min-h-11" disabled={busy}>{busy ? 'opening…' : 'open review'}</Button>
          </div>
          <p className="mt-2 text-xs text-ink-3">refreshing or locking this page clears the key.</p>
        </form>
      ) : (
        <section className="mt-8" aria-label="Submissions" aria-busy={busy}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Submission status">
              {reviewStatuses.map((filter) => (
                <Button key={filter} variant={filter === status ? 'default' : 'ghost'} className="min-h-11" aria-pressed={filter === status} disabled={busy} onClick={() => void load(filter, 0)}>
                  {filter}
                </Button>
              ))}
            </div>
            <Button variant="outline" className="min-h-11" disabled={busy} onClick={() => void load()}>refresh</Button>
          </div>
          {page.submissions.length === 0 ? (
            <p className="py-8 text-ink-3">{status === 'pending' ? 'all caught up. no answers waiting for review.' : `no ${status} submissions.`}</p>
          ) : (
            <ul className="divide-y divide-rule">
              {page.submissions.map((submission) => (
                <SubmissionRow key={submission.id} submission={submission} busy={busy}
                  onDecide={(entry, nextStatus) => void act(entry, nextStatus)}
                  onDelete={(entry) => void act(entry)} />
              ))}
            </ul>
          )}
          {(offset > 0 || page.hasMore) && (
            <div className="flex items-center justify-between gap-3 border-t border-rule pt-4">
              <Button variant="outline" className="min-h-11" disabled={busy || offset === 0} onClick={() => void load(status, Math.max(0, offset - REVIEW_PAGE_SIZE))}>previous</Button>
              <span className="text-xs text-ink-3 tabular-nums">page {offset / REVIEW_PAGE_SIZE + 1}</span>
              <Button variant="outline" className="min-h-11" disabled={busy || !page.hasMore} onClick={() => void load(status, offset + REVIEW_PAGE_SIZE)}>next</Button>
            </div>
          )}
        </section>
      )}
      <p role="status" aria-live="polite" className="mt-4 min-h-6 text-sm text-ink-2">{message || (busy ? 'working…' : '')}</p>
    </main>
  )
}
