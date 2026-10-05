---
version: 1
slug: "src-routes-chess-slug-tsx"
primary_target: "src/routes/chess/$slug.tsx"
related_targets: []
---

# Chess puzzle solving view

Scope: one route, `/chess/$slug`, the solving view for a positional-transformation chess puzzle. Visitor mode: Operate.

Audience and job: a friend of the author arrives by link to solve one puzzle. They play a move sequence; the site auto-plays the opponent's replies. Prompt before (side to move plus optional nudge), written explanation after. Wrong moves snap back, unlimited retries, no penalty. Alternative solving moves are accepted silently as correct.

Constraints: TanStack Start, Tailwind, shadcn/ui, Cloudflare. Board is text on a monospace grid, keyboard-operable, color never the only carrier of state. Light theme of the osm.sh terminal world. No modals, no image-based board, no dark theme here. Theme name and line stay hidden until solved.

Content ranges: 1 to ~6 solver moves (1 to 12 plies). Ledger must hold that on a laptop without scrolling.

States: unsolved, piece selected, move rejected, opponent reply, solved, replay after solve.

Unresolved (user's, not the builder's): puzzle data format beyond this route's needs; per-move versus per-puzzle explanations.

## Direction contract

THESIS: A positional transformation is a diff. The ledger beside the board records the line in SAN, move and reply on one row with figurines in place of piece letters (changed 2026-10-05 at the owner's request from minus and plus square lines); the solved puzzle shows before and after side by side with changed squares tinted, and that split carries the diff. It refuses the category default: a chessboard image with a move list and a green "correct" toast.

OWN-WORLD: osm.sh's terminal grammar rendered light. One monospace character grid in Fira Code; box-drawing rules draw every frame; the ink is osm.sh navy on a warm light ground; rose is the single accent for selection and the active state; diff green and diff red carry plus and minus only. With all content removed the page is a light terminal window with a bottom status bar.

STORY: The solver reads the prompt as a comment line, moves a piece, and watches the ledger record the transformation. A wrong move is struck through and fades. When the line completes, the board splits into before | after and the explanation sets beneath it. They understand the positional idea by seeing what changed.

FIRST VIEWPORT: Desktop 1440: board on the left, 8 ranks by 8 files of glyph cells at full column height with file and rank labels in the grid; right column with `# prompt` comment line at top and the ledger beneath, empty ledger rows designed as faint dotted placeholders for the expected plies; status bar across the bottom: puzzle id, `move 0/3`, key hints. Primary action is the board itself. Mobile 390: board first, ledger second, status bar pinned bottom.

FORM: Transformation ledger, candidate 5 on the ordered list, dealt as the lead. Seed key 5fde85d2. Code-led. Signature interaction: the before | after split on solve. Motion grammar: state changes only, 150 to 250 ms, ledger lines type in, struck lines fade.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
