# puzzles.osm.sh

Hand-made positional chess puzzles, solved in the browser. The osm.sh terminal, in daylight.

## Run

```sh
bun install
bun run dev          # http://localhost:3000
bun run build        # vite build + tsc
bun run deploy       # build + wrangler deploy (Cloudflare Workers)
```

## Production

Live at https://puzzles.osm.sh on the `puzzles-osm-sh` Cloudflare Worker. `wrangler.jsonc` contains the account, custom domain, and production D1 database binding. Deploy updates with `bun run deploy`; apply new database migrations first with `bun run db:migrate`.

The production `REVIEW_KEY` is stored as a Cloudflare secret. `/review` uses the same key configured in the local, Git-ignored `.dev.vars` at initial deployment. Change it with `bunx wrangler secret put REVIEW_KEY`.

## Monthly issues

The front page is this month's issue: one general puzzle (logic, probability, number theory, and so on), a reply line for a name and an answer, then last month's issue unfolded with its solution and the people who solved it. Each issue also lives at `/issues/YYYY-MM`. A live issue's solution is published as soon as nonempty solution text is set, closing submissions on both the page and the server. Issues without a solution remain open, even after a newer issue is published.

- Each issue is a folder under [`issues/`](issues/README.md): `issue.md` holds the front matter and the statement, and `solution.md` holds the accepted answers and the solution. Both files are Markdown with `$inline$` and `$$display$$` math. Figures and downloads live under `public/`.
- The accepted answers in `solution.md` give the reviewer a private hint. They never approve a submission automatically.
- All submitted answers are stored in Cloudflare D1 (`migrations/`) with a pending, approved, or rejected status. Only approved names appear publicly. Set up once:

```sh
bunx wrangler d1 create puzzles     # paste the id into wrangler.jsonc
bun run db:migrate:local            # local dev database
bun run db:migrate                  # remote, before the first deploy
```

`bun scripts/capture-issue.ts` captures submissions and issue pages at desktop and mobile.

### Edit and publish an issue

Monthly issues and chess puzzles are separate types. Issues live in `issues/`, and chess puzzles live in `public/puzzles/`. Issues do not have a chess option. The full format is in [`issues/README.md`](issues/README.md).

1. Run `bun run new-issue 2026-11 some-slug "Title"`, or edit an existing `issues/YYYY-MM-*/issue.md`. The `YYYY-MM` folder prefix is the permanent ID used by submissions and links, so keep it stable.
2. Set `published` (`YYYY-MM-DD`, UTC), `title`, and `author` in the front matter, then write the statement below it. Put figures and downloads in `public/issues/<slug>/`, named with 8 random hex characters plus the extension (e.g. `2b0de099.svg`), and reference them by absolute path.
3. When the solution is ready, write it in the same folder's `solution.md`. Once the issue is live, a nonempty body publishes it and closes submissions. To write it early, set `published: YYYY-MM-DD` in its front matter. The solution stays hidden and submissions stay open until that date. List the accepted spellings under `answers` for the reviewer's hint; an unmatched answer can still be approved manually.
4. Run `bun run build`, preview locally, then run `bun run deploy`.

The newest issue whose publication date has arrived becomes `/`. Older issues remain at `/issues/YYYY-MM`. Publishing another issue does not change an existing issue's solution or submission status. The issue folders are bundled only into the server, so unpublished statements, solutions, and answers never reach the browser. Files under `public/` are deployed as-is, however, and anyone can fetch them once they are deployed.

The Markdown files need no escaping. Write backticks and LaTeX backslashes as-is. Single newlines render as line breaks, and blank lines start new paragraphs.

Puzzle figures and Markdown images link to their original files for full-size viewing. Markdown images with an explicit link keep that destination. File attachments open directly in the browser when supported instead of forcing a download.

### Private submission review

Open `/review` directly; it is not linked from any public page and carries a `noindex` directive. Enter your secret key to see the queue. Approve publishes the solver's name, reject keeps it private, and the approved/rejected views let you reverse decisions. The answer itself is never published. The same normalized name appears once per issue, even if several answers are approved.

For local development, copy `.dev.vars.example` to `.dev.vars` and set `REVIEW_KEY` to a random value of 32–512 characters. Generate a key with:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

`.dev.vars` is ignored by Git. Restart the local server after changing it. The review screen holds the entered key in memory; refreshing or locking clears it. Every queue read and decision checks the key on the server. Missing or short server keys disable access.

For a fresh deployment in another account, create its D1 database and update the account, domain, and database ID in `wrangler.jsonc`, then run:

```sh
bunx wrangler secret put REVIEW_KEY  # paste your key at the prompt
bun run db:migrate                  # includes the manual-review migration
bun run deploy
```

The migration preserves existing published solvers as approved entries with no stored answer. New answers default to pending. Identical retries (same issue, name, and answer) reuse the existing entry; a different answer creates a new pending entry. Changing the production secret revokes the old key immediately.

Each submission has a **delete** action with an inline **delete permanently** confirmation. Pending, approved, and rejected entries can be deleted. Deleting an approved entry removes its approval from the public solved-by list; another approved entry from the same person can keep that name published. Deletion cannot be undone. If the entry's status changed in another review session, deletion is refused and the queue refreshes.

## Chess puzzles

Each puzzle is one file, `public/puzzles/<slug>.md`. The file name is the slug, so keep it stable. The newest is served at `/chess`, each at `/chess/<slug>`, and the list at `/chess/archive`. The files are deployed as-is, so anyone can read a puzzle's line and explanation at `/puzzles/<slug>.md`.

```md
---
title: Time Sensitivity I
date: 2026-09-20                  # sorts the collection; not a publication schedule
author: Nepomniachtchi vs Frolyanov
fen: 3r3k/1p3p1p/p4p2/3n1P2/1qp1Q3/6PP/1P2RPK1/1B6 b - - 7 30
line: a5 Qf3 c3 Qh5 Qc4           # SAN, solver move then reply, ending on a solver move
alternatives:                     # optional: solver move number (from 1) → also accepted
  3: [Qc5]
theme: Pawn majority              # optional, revealed on solve
---

Black to move.
Each line up here is one prompt line, shown before solving.

## Explanation

Shown after solving. Blank lines separate paragraphs.
```

The side to move comes from the FEN. The text is shown as plain text, not rendered as Markdown. Quote a front matter value if it contains `: `. A missing field or bad date fails `bun run dev` and `bun run build` with the file name in the error. To check that every line is legal, run:

```sh
bun run check:puzzles
```

Add or edit a file, validate it with the command above, then run `bun run deploy`. Every puzzle is live after deployment. Chess solves remain local to the browser and do not enter the monthly submission queue.

## Review captures

With the dev server running, `bun scripts/capture.ts` walks the solving view through every state at desktop and mobile widths using the locally installed Edge and writes PNGs to `.impeccable/review/`.

`node --test scripts/check-review-migration.test.ts` checks the review migration in memory. For browser checks, build the app, migrate a fresh disposable local D1 database using `--persist-to`, and serve it with `wrangler dev --config dist/server/wrangler.json --port 3011 --persist-to <same-directory>`. Set that server's `REVIEW_KEY` and the test process's `REVIEW_TEST_KEY` to the same test-only key, then run `bun scripts/check-review.ts`. This verifies submission privacy, duplicate retries, authentication, review decisions, and mobile layout; it leaves synthetic entries in that disposable database.

Run `node scripts/check-review-delete.ts http://127.0.0.1:3011` against the same disposable setup to check deletion, cancellation, keyboard focus, unauthorized and stale requests, and public-list removal.

Run `bun scripts/check-issue-submissions.ts http://127.0.0.1:3011` against that disposable setup to verify solution visibility, open and closed submission states at desktop/mobile widths, and rejection of direct submissions to a solved issue. It creates one pending submission for the open August issue. `bun scripts/check-knight-page.ts http://127.0.0.1:3011` checks the published knight solution, diagram, math, and downloads in the browser.

## Credits

Piece images are the cburnett set by Colin M.L. Burnett (CC BY-SA 3.0), as shipped by Lichess, in `public/pieces/cburnett/`. Move legality by [chess.js](https://github.com/jhlywa/chess.js). Type is Fira Code, self-hosted.
