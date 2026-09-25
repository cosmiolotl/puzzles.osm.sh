---
version: 1
slug: "src-routes-index-tsx"
primary_target: "src/routes/index.tsx"
related_targets: ["src/routes/issues/$id.tsx"]
---

# Monthly issue page

Scope: the home route `/` (this month's issue) and `/issues/$id` (any issue at its permanent address). Visitor mode: Read, with one Operate moment (the answer form).

Audience and job: a friend arrives to read this month's general puzzle (logic, probability, number theory, wordplay, and so on), thinks about it offline, and comes back to submit one answer with a display name. Correct answers are checked on the server and recorded in Cloudflare D1; correct names appear publicly in solve order. The solution to an issue unlocks for everyone when the next issue is published. Chess puzzles are a separate puzzle type with their own data and routes; monthly issues cannot feature chess puzzles.

Constraints: TanStack Start on Cloudflare Workers with D1. Statements are markdown with preserved single line breaks, inline and display LaTeX, an optional figure, and optional downloadable files. No accounts, no email. Answers never ship to the client. Same world as the chess view: osm.sh terminal in daylight, DESIGN.md governs tokens.

Content ranges: statements 80 to 600 words plus up to one figure and a few files. Solutions 100 to 800 words with math. Solvers 0 to ~60 names. Archive 1 to ~36 issues.

States: open issue with no solvers yet; open issue with solvers; correct submission (first time and repeat); wrong submission; validation errors; solution locked; solution unlocked; no issue published yet; unknown issue id.

Unresolved (user's): rate limiting beyond basic validation; moderation of display names; whether to show attempt counts.

## Direction contract

THESIS: Each month is a release. The current version heads the page with the puzzle as its notes and a single reply line; the previous version sits directly beneath, unfolded into its solution and the people who solved it; older versions run on as version rules. It refuses the category default: a blog post per puzzle with a comments box and a separate leaderboard page.

OWN-WORLD: DESIGN.md's terminal in daylight: one Fira Code grid, hairline `rule-line` rules carrying labels, navy ink on warm paper, rose as the only accent, plus-green for the solved word. Version rules read as dates, never semver. State is a word in the rule (open, solved, unlocked), never a colored badge. Math sets in KaTeX inside the prose column. The reply line is a command prompt: `> name` and `> answer`.

STORY: The visitor reads the statement, thinks, returns, types a name and an answer at the prompt, and learns at once whether it was right. Scrolling down they read last month's answer and who got it, and see the archive as a list of dated rules they can open.

FIRST VIEWPORT: Desktop 1440: header rule with the site name and a `chess` link. The version rule `── 2026.09 ── September ── open ──` spans the column. Beneath, a 68ch prose column: title, the statement with math, figure if any. Under the statement, the reply line with both prompts and a submit key, the response message inline. The previous version's rule begins near the fold. Mobile 390: same order, single column, prompts stack.

FORM: Release notes, candidate 6 on the ordered list, dealt as the lead. Seed key bcc44b0a. Code-led. Raised by the sampler challenger: every issue is signed and dated at its foot (author, published date, and when its solution unlocked). Signature interaction: a correct answer types the solver's name into the solved-by column in place. Motion grammar: state changes only, 150 to 250 ms, the same ledger type-in as the chess view.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
