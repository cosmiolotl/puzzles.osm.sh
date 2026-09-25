---
version: 1
slug: "src-routes-review-tsx"
primary_target: "src/routes/review.tsx"
related_targets: ["src/components/review/ReviewScreen.tsx", "src/components/review/SubmissionRow.tsx"]
---

# Submission review

Scope: the unlinked `/review` route. Visitor mode: Operate. The owner opens the route directly, enters a secret key, reads submitted answers, and decides which names appear in the public solved-by list. Public navigation does not expose this route; its metadata requests no indexing, following, archiving, or referrer disclosure.

## Direction contract

An ordinary extension of DESIGN.md's Terminal in Daylight, with a simpler operational layout. One left-aligned column capped at 80ch holds the site rule, title, short instruction, authentication form or submission list, and inline feedback. The review surface introduces no global visual-system changes.

Fira Code, paper ground, navy ink, secondary ink tones, square buttons, and hairline separators come from the incumbent system. Shared primary, outline, and ghost buttons retain their existing hover, disabled, and rose-ink focus treatments. Delete is a local destructive exception: the ghost action uses existing `minus` ink, and its permanent-deletion confirmation uses a `minus` fill with ground text. This does not change the global button palette. Review controls and the key input have a local minimum height of 44px. These local dimensions and the bordered password input do not redefine global component defaults.

Desktop 1440: the compact column leaves open paper to its right; answer content leads each decision. Mobile 390: the same order remains, with wrapping controls and metadata, 16px side padding, and long names and answers breaking within the column. Side padding becomes 24px from 640px. No cards, dashboard sidebar, decorative imagery, or additional status colors are introduced.

## Content and states

- Locked: labelled password input, open-review action, and explanation that refresh or lock clears the key. The key remains in component memory.
- Open: pending, approved, and rejected filters; refresh and lock controls; paginated submissions.
- Each row: issue and title, display name, UTC submission date, submitted answer, and a textual answer-key match hint. Legacy entries explain when an answer was not stored.
- Decisions: approve; reject; reject and unpublish an approved name; or return a decided submission to pending. Approved and rejected views support reversals.
- Delete: every status offers a ghost delete action that expands an inline, hairline-separated confirmation naming the submitter and stating that deletion cannot be undone. An approved entry also explains that deletion removes its approval from the public solved-by list. The confirmation offers cancel and delete permanently; cancel receives initial focus, and cancel or Escape restores focus to the delete action when idle.
- Empty: a specific pending-queue message or a status-specific empty message.
- Busy: controls disabled, submissions marked busy, and inline working/opening feedback.
- Errors and results: a polite live status line reports authentication failures, load failures, decisions, deletions, and uncertain decision or deletion outcomes with refresh guidance. Authentication failures return to the locked state. Completed actions refresh the queue, moving back a page when its last row is removed.

Status selection uses labelled buttons with pressed state. Submission rows use list semantics and named headings; dates use time elements. The delete trigger exposes its expanded state and identifies the named confirmation group. Confirmation and feedback stay in document flow, without modals or toasts.

Deletion requires the review key on the server and matches both the submission ID and the status the owner reviewed. A changed or already-deleted entry produces inline refresh feedback instead of deleting an entry whose status has changed.

## Review evidence

Finish reviewer disposition: **ship** at desktop 1440 and mobile 390; detector findings: `[]` (handoff evidence for the deletion extension). Source inspection of SubmissionRow, ReviewScreen, review.fn, and review-db confirms the 80ch measure, inherited font and palette, shared square controls, hairline rows, 44px minimum controls, wrapped content, inline confirmation and live feedback, cancel focus behavior, and authenticated deletion guarded by the reviewed status. No raster assets require provenance.

Validation handoff: build and existing review regression script passed. Runtime E2E passed for cancel, Escape and focus restoration, deletion from all three statuses, wrong-key denial, stale-status protection, repeated deletion, public unpublishing, and desktop/mobile layout. Checks used disposable local D1 data; no production data was touched, and the temporary server was stopped.

Documentation boundary: preserve root DESIGN.md and `.impeccable/design.json`. Existing PRODUCT.md and monthly-issue surface prose still describe immediate automatic publication and contain older unresolved product facts; that preexisting drift is outside this extension's documentation scope.
