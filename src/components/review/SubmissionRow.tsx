import { useId, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { ReviewStatus, Submission } from '@/lib/review'

interface SubmissionRowProps {
  submission: Submission
  busy: boolean
  onDecide: (submission: Submission, status: ReviewStatus) => void
  onDelete: (submission: Submission) => void
}

export function SubmissionRow({ submission, busy, onDecide, onDelete }: SubmissionRowProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const deleteButton = useRef<HTMLButtonElement>(null)
  const confirmationId = useId()
  const { name, answer, issue, title, submittedAt, status, matchesKey } = submission
  function cancelDelete() {
    setConfirmingDelete(false)
    deleteButton.current?.focus()
  }
  let hint = 'does not match the answer key'
  if (matchesKey) hint = 'matches the answer key'
  if (answer === null) hint = 'published before manual review; answer was not stored'

  return (
    <li className="py-5" aria-label={`Submission from ${name}`}>
      <p className="text-sm text-ink-3 break-words">{issue.replace('-', '.')} · {title}</p>
      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-medium break-all">{name}</h2>
        <time dateTime={submittedAt} className="text-xs text-ink-3 tabular-nums">
          {submittedAt.slice(0, 16).replace('T', ' ')} UTC
        </time>
      </div>
      {answer !== null && <p className="mt-3 whitespace-pre-wrap break-all">{answer}</p>}
      <p className="mt-2 text-xs text-ink-3"># {hint}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {status !== 'approved' && (
          <Button className="min-h-11" disabled={busy} onClick={() => onDecide(submission, 'approved')}>
            approve
          </Button>
        )}
        {status !== 'rejected' && (
          <Button className="min-h-11" variant="outline" disabled={busy} onClick={() => onDecide(submission, 'rejected')}>
            {status === 'approved' ? 'reject & unpublish' : 'reject'}
          </Button>
        )}
        {status !== 'pending' && (
          <Button className="min-h-11" variant="outline" disabled={busy} onClick={() => onDecide(submission, 'pending')}>
            return to pending
          </Button>
        )}
        <Button ref={deleteButton} className="min-h-11 text-minus hover:text-minus" variant="ghost"
          disabled={busy} aria-expanded={confirmingDelete} aria-controls={confirmationId}
          onClick={() => setConfirmingDelete(!confirmingDelete)}>
          delete
        </Button>
      </div>
      {confirmingDelete && (
        <div id={confirmationId} role="group" aria-label={`Delete submission from ${name}`}
          className="mt-4 border-t border-rule pt-4"
          onKeyDown={(event) => {
            if (event.key === 'Escape' && !busy) { event.stopPropagation(); cancelDelete() }
          }}>
          <p className="text-sm break-words">delete the submission from {name}? this cannot be undone.</p>
          {status === 'approved' && (
            <p className="mt-1 text-sm text-ink-2">this also removes its approval from the public solved-by list.</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button autoFocus variant="outline" className="min-h-11" disabled={busy} onClick={cancelDelete}>cancel</Button>
            <Button className="min-h-11 bg-minus hover:bg-minus/90" disabled={busy} onClick={() => onDelete(submission)}>
              delete permanently
            </Button>
          </div>
        </div>
      )}
    </li>
  )
}
