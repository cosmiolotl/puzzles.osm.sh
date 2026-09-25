# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

TanStack Start with Tailwind CSS and shadcn/ui, deployed to Cloudflare Pages/Workers (user-chosen, 2026-09-21). Served at the `puzzles` subdomain of `x.osm.sh` (inferred from the folder path `x.osm.sh/puzzles`; exact hostname unconfirmed).

## Users

Primary users are the owner's friends: people they know personally, invited to solve logic and grid puzzles the owner has made. They arrive with a link, in a browser, expecting to solve in place rather than print or transcribe. No public or anonymous audience is confirmed; no accounts or roles are confirmed.

The owner (handle `cosmiolotl`) is the sole author and publisher of puzzles.

## Product Purpose

A personal puzzle collection: a place to publish hand-made puzzles and let friends solve them in the browser. Two kinds exist (confirmed 2026-09-21):

- Positional chess puzzles, solved on an interactive board at `/chess`.
- Monthly general puzzles in the manner of Jane Street's monthly puzzle: logic, probability, number theory, combinatorics, wordplay. One issue per month is the front page. A solver submits a single answer with a display name; approved names appear in a public solved-by list. Setting nonempty solution text publishes the solution for a live issue and closes submissions. Issues without a solution remain open regardless of newer issues. Chess puzzles are a separate puzzle type with their own data and routes; monthly issues cannot feature chess puzzles.

Success is a friend opening a puzzle, solving it without friction, and knowing when they got it right.

## Positioning

Not a puzzle platform or a daily game. It is one person's collection, sharing that person's identity: the same authored, terminal-native world as the portfolio at osm.sh, extended to puzzles. A generic puzzle site could not truthfully claim the authorship or the shared identity.

## Operating Context

- Puzzles are authored by the owner; the authoring workflow (files in the repo, a data format, an editor) is undecided.
- Solvers interact directly with a grid in the browser; each puzzle type defines its own input behavior (pencil marks, cell fills, region marks, etc.).
- Hosting runs on Cloudflare Pages/Workers, so any server logic must fit the Workers runtime.

## Capabilities and Constraints

Confirmed:
- Publish a collection of logic/grid puzzles, solvable in-browser.
- Stack fixed as TanStack Start + Tailwind + shadcn/ui; deploy fixed as Cloudflare. Correct issue submissions are stored in Cloudflare D1; no accounts, no email, display names only.
- Issue statements are markdown with LaTeX, optionally a figure and downloadable files.
- Solve progress for the visitor is kept in the browser (localStorage), not on the server.

Undecided (do not invent):
- Which specific puzzle types ship first.
- Whether solutions are checked client-side, server-side, or self-verified by the solver.
- Whether progress persists (local storage, accounts) or resets per visit.
- Whether puzzles are dated or numbered, and whether an archive/index exists beyond a list.
- Whether the site works without JavaScript (not selected as a constraint; interactive solving implies JS).
- Terminology for puzzle types and difficulty.

## Brand Commitments

Must match osm.sh branding (user-declared binding). Facts read from the live site on 2026-09-21:

- osm.sh is "A software engineering portfolio served as a TUI over SSH and compiled 1:1 to the web." The page title is `ssh osm.sh`. The web version is a Rust/WASM (Trunk) render of the terminal UI; the whole page is a monospace grid.
- Typeface: Fira Code (Regular 400 and Bold 700), self-hosted woff2, 16px, monospace fallback `ui-monospace, monospace`.
- Colors visible in the shell: background `#121b35` (deep navy); text selection `#c67b8b` (dusty rose) on `#121b35`. The full in-app palette lives inside the WASM bundle and was not extracted.
- Voice: dry, terse, self-aware engineer humor (source comment: "Sorry, view-source users! ... when it's sunny I don't need to and when it rains GitHub is down.").
- Identity is terminal-native: the brand *is* the TUI. Future visual work must inherit this world, not merely borrow the font.
- Owner handle: `cosmiolotl`; intended source home `https://github.com/cosmiolotl/osm.sh` (stated as future, not yet published).

No logo or wordmark beyond the text `osm.sh` / `ssh osm.sh` was found.

## Evidence on Hand

- Live brand reference: https://osm.sh (fetch it again for the current state; the palette beyond the two colors above must be read from the running TUI, not assumed).
- No puzzle content exists yet in this repo. No testimonials, usage numbers, or press exist; do not fabricate any.

## Product Principles

1. **Solve in place.** Every puzzle is fully playable in the browser; the grid is the product, and nothing should compete with it.
2. **One author, one world.** The site reads as cosmiolotl's, continuous with the osm.sh terminal identity, not as a generic puzzle app.
3. **Friends first.** Optimize for a known, invited audience: low ceremony, no sign-up walls, shareable links.
4. **Each puzzle type owns its interaction.** Input conventions follow the puzzle genre's established norms rather than a one-size grid.
5. **Honest completion.** Solvers should reliably know when they are done; never fake or obscure the check.

## Accessibility & Inclusion

No product-specific requirement was established. Grid puzzles are keyboard-heavy by convention; keyboard operability of the grid should be treated as baseline, and color must never be the only carrier of puzzle state. Confirm any further standard with the owner.
