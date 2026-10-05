---
name: puzzles.osm.sh
description: The osm.sh terminal in daylight. One monospace grid, hairline rules, navy ink, rose accent.
colors:
  ink: "#121b35"
  ink-2: "#4a5170"
  ink-3: "#676d8a"
  rose: "#c67b8b"
  rose-ink: "#9a4d62"
  rose-wash: "#f0d9df"
  plus: "#2f6b3d"
  plus-wash: "#d9e8d6"
  minus: "#a63a3a"
  minus-wash: "#f1d6d2"
  ground: "#f4f2ec"
  ground-2: "#ebe8df"
  ground-3: "#e1ded3"
  rule: "#c9c6ba"
  square-dark: "#dad7ca"
  square-light: "#fbfaf6"
typography:
  headline:
    fontFamily: "Fira Code, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "normal"
  title:
    fontFamily: "Fira Code, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.375
    letterSpacing: "normal"
  body:
    fontFamily: "Fira Code, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  ledger:
    fontFamily: "Fira Code, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  prose:
    fontFamily: "Fira Code, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Fira Code, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "normal"
  caption:
    fontFamily: "Fira Code, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  none: "0px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    typography: "{typography.headline}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "32px"
  button-primary-hover:
    backgroundColor: "{colors.ink-2}"
    textColor: "{colors.ground}"
  button-primary-sm:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    typography: "{typography.caption}"
    rounded: "{rounded.none}"
    padding: "0 8px"
    height: "28px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "32px"
  button-outline-hover:
    backgroundColor: "{colors.ground-2}"
    textColor: "{colors.ink}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    typography: "{typography.headline}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "32px"
  button-ghost-hover:
    backgroundColor: "{colors.ground-2}"
    textColor: "{colors.ink}"
  button-icon:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    size: "32px"
  input-command:
    backgroundColor: "transparent"
    textColor: "{colors.ground}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0"
    width: "16ch"
  input-reply:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "8px 4px"
  status-bar:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "36px"
  status-bar-badge:
    backgroundColor: "{colors.rose}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    padding: "0 12px"
    height: "36px"
  ledger-row-active:
    backgroundColor: "{colors.rose-wash}"
    textColor: "{colors.ink}"
    typography: "{typography.ledger}"
    padding: "0 4px"
  solver-row-mine:
    backgroundColor: "{colors.rose-wash}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    padding: "0 4px"
  list-row-hover:
    backgroundColor: "{colors.ground-2}"
    textColor: "{colors.rose-ink}"
    padding: "12px 8px"
---

# Design System: puzzles.osm.sh

## Overview

**Creative North Star: "The Terminal in Daylight"**

This is osm.sh's terminal identity, a TUI served over SSH, rendered as a light theme in the browser. Everything sits on one monospace character grid set in Fira Code; there is no second typeface, no display face, no icon font. The page reads like a terminal window with the lights on: warm paper ground, deep navy ink, and hairline rules in place of boxes, cards, or shadows. Empty the page of content and what remains is a light terminal with an inverted status bar pinned to the bottom edge.

Density is that of a well-laid-out terminal: text sits at 16px on a 1.5 line, columns are measured in `ch`, and structure comes from rules and whitespace rather than containers. Color is used sparingly and semantically. Navy carries all text and the primary action; rose is the single accent and marks the cursor, the selection, the active row, and the identity badge; diff green and diff red exist only to carry plus and minus. Nothing is decorated; every color on screen means something.

The build is code-led and stateful. Motion is reserved for state changes: a ledger move types in, a rejected move is struck and settles, a wrong reply flashes and settles, the board splits into before and after on solve. Pieces are SVG line drawings recolored to the palette so the board reads as ink on paper, not as an image embedded in the page. The monthly issue reads as release notes on the same grid: dated version rules head each issue, the statement and solution are prose set in the terminal's own measure with math in KaTeX, and the answer form is a command prompt.

**Key Characteristics:**
- One font, three weights in use (400, 500, and 700; 700 only as bold inside prose), no ligatures, 16px base.
- Hairline 1px rules draw every frame; the `.rule-line` labelled rule is the recurring structural device, and it carries state as a word.
- Warm light ground with navy ink; rose as the only accent; green and red only as diff marks.
- Zero border radius everywhere; the only circles are the legal-move dot and capture ring on the board.
- No shadows. Depth is tonal (ground, ground-2, rule) and the inverted status bar.
- Motion only on state change, 150 to 360 ms, expo ease-out; reduced-motion collapses to 1 ms.
- Browser chrome themed to the world: rose selection, rose caret, rose-ink focus ring, rule-colored scrollbar.
- Prose and math are set in the terminal too: `.prose-mono` at 15.2px on a 68ch measure, KaTeX inline at 1.08em.

## Colors

A warm paper ground under deep navy ink, with dusty rose as the lone accent and a muted diff pair reserved for the split view and the verdict.

### Primary
- **Navy Ink** (`ink`): All body text, headings, the issue title, the primary button fill, and the status bar ground. This is osm.sh's terminal background, inverted for daylight.
- **Dusty Rose** (`rose`): The accent. Text selection, the blinking cursor in the ledger, the selected-square ring, the `:` prompt, and the identity badge in the status bar (the puzzle slug on chess, the version number on an issue). Inherited from osm.sh's selection color.
- **Rose Ink** (`rose-ink`): Rose deepened for text on the light ground: links, hovered breadcrumb and archive rules, focus rings, the input caret, the `>` prompts of the reply line, and the words `this month` in the current version rule. Rose itself does not meet contrast as text on ground; rose-ink does.
- **Rose Wash** (`rose-wash`): Rose at paper strength. The current replay move in the ledger, the selected square, the last-move highlight (at 70% opacity over the square), and the visitor's own row in the solved-by list.

### Secondary
- **Diff Plus** (`plus`) and **Plus Wash** (`plus-wash`): The words `solved` and `solution` in rules, the `solution unlocked` note, a correct reply's verdict, the solved check in the chess archive, and the tint on squares a solver's piece arrived at in the after board.
- **Diff Minus** (`minus`) and **Minus Wash** (`minus-wash`): The struck rejected move (text and strike-through), a wrong reply's verdict, the reject and reply-wrong flash backgrounds, and the tint on squares a solver's piece left in the before board.

### Neutral
- **Paper Ground** (`ground`): Page background and text on the inverted status bar and primary button.
- **Favicon**: Four equal squares in a rotational windmill pattern, three Ink Navy and one Dusty Rose, inside a pure white squircle with a transparent exterior. The enclosure is an icon-specific exception to the square-corner rule.
- **Ground 2** (`ground-2`): Hover fill for rows and outline/ghost buttons; scrollbar track; the muted surface; inline `code`, `pre`, and table-header fills inside prose.
- **Ground 3** (`ground-3`): A third tonal step, defined for depth beyond hover; unused in the current surfaces.
- **Ink 2** (`ink-2`): Secondary text: the prompt comment lines, explanation prose, the previous issue's statement, blockquotes, the month name in a version rule, breadcrumb, primary-button hover fill.
- **Ink 3** (`ink-3`): Tertiary text: rank and file labels, move and solver numbers, opponent reply rows, dotted placeholders, captions, placeholders, the signature, archive rules, and the `open` state word; hovered scrollbar thumb.
- **Hairline** (`rule`): Every 1px border, divider, `.rule-line` stroke, the reply line's top and bottom rules, the figure border, table cell borders; scrollbar thumb.
- **Dark Square** (`square-dark`) and **Light Square** (`square-light`): The board's two square tones; also the fills used inside the recolored piece SVGs (navy strokes, light-square fills for white pieces).

### Named Rules
**The One Accent Rule.** Rose is the only accent color. It marks selection, cursor, active state, and identity. It never decorates and never fills a large area larger than a badge or a row.

**The Diff-Only Rule.** Green and red mean plus and minus, nothing else. They appear on square tints in the split view, the reject strike, the reply verdict, the `solved` state word, and status-bar tone. They are never used for buttons, badges, or generic success and error styling.

**The Ink-On-Paper Rule.** Text is always `ink`, `ink-2`, or `ink-3` on `ground`, or `ground` on `ink`. No other text and background pairs exist except rose-ink links and the diff marks.

**The State Word Rule.** State is a word set in a rule (`open`, `solved`, `this month`), colored by the Diff-Only and One Accent rules, never a colored badge, pill, or chip. The only badge in the system is the identity badge at the left of the status bar.

## Typography

**Display Font:** none (there is no display face; headings are the body face at 500)
**Body Font:** Fira Code (with `ui-monospace, SFMono-Regular, Menlo, monospace`)
**Label/Mono Font:** same
**Math:** KaTeX (its own math faces, loaded with `katex.min.css`), only inside prose

**Character:** One monospace voice at every size, ligatures off, antialiased. Hierarchy comes from weight (400 and 500, with 700 reserved for bold inside prose), tone (ink, ink-2, ink-3), and size steps of 12, 14, 15.2, 16, and 20px, never from a change of family. Type reads like terminal output: comment lines start with `#`, commands with `$`, prompts with `:` or `>`. Math is the one foreign material, and it is set inside the prose column only.

### Hierarchy
- **Title** (500, 1.25rem/20px, 1.375): The issue title, an `h1` under the version rule. The largest text in the system and the only step above the 16px base; the previous issue's title steps down to 16px at 500.
- **Headline** (500, 0.875rem/14px, 1.5): The chess puzzle title in the breadcrumb rule; the version number in a version rule; the status-bar badge.
- **Body** (400, 1rem/16px, 1.5): The html base. Lists, comment lines, general text, the reply line's inputs.
- **Ledger** (400, 1rem/16px, 1.7): Move ledger rows in SAN, tabular numerals, `nowrap`, on a `4ch 12ch 12ch auto` column grid.
- **Prose** (400, 0.95rem/15.2px, 1.65): `.prose-mono`, the statement and solution markdown, and the explanation after a chess solve. Paragraphs are capped at 68ch; blocks are separated by 1em. Statement and solution markdown preserve single newlines as line breaks; blank lines separate paragraphs. Inside it: `strong` at 700, `em` italic, links `rose-ink` to `ink` on hover, `code` on `ground-2` with 0.3ch side padding, `pre` on `ground-2` with 12px by 16px padding and horizontal scroll, lists indented 3ch with `- ` as the bullet, blockquotes with a 1px `rule` left edge, 1.5ch inset, in `ink-2`, tables with 1px `rule` cell borders and 500-weight headers on `ground-2`, and `h1` to `h3` at 500 with 1.5em above.
- **Math** (KaTeX, 1.08em of the prose size): Inline math sits in the line at 1.08em so its serifs match the monospace x-height. Display math is left-aligned with a 2ch indent, 1.25em above and below, and scrolls horizontally rather than wrapping; below `sm` it drops to 0.9em with no indent.
- **Label** (400, 0.875rem/14px, 1): Status bar segments, buttons, breadcrumb, key hints, list metadata. Status-bar badge and `kbd` keys go to 500.
- **Caption** (400, 0.75rem/12px, 1.5): `.rule-line` labels (`before`, `after`, `one line · 3 moves`), the issue signature, figure captions, the `sm` button size.
- **Board labels** (400, 0.8em of the board's font size, 1): Rank and file coordinates in `ink-3`.

### Named Rules
**The One Face Rule.** Fira Code is the only family. There is no display face, no serif, no system-UI fallback for controls; inputs and buttons inherit the font. KaTeX's math faces are the single exception, and they appear only inside `.prose-mono`.

**The Weight Ceiling Rule.** Chrome stops at 500: headings, titles, rules, buttons, badges, and keys are 400 or 500. Bold 700 is spent only where the terminal would spend it, as markdown `strong` inside prose (the author's emphasis in a statement or the `Answer:` in a solution). It never sets a heading, a title, or any part of the chrome.

**The Terminal Prefix Rule.** Meta text carries its terminal prefix: `#` for prompts and comments, `$` for listed commands, `:` for the command field, `>` for the reply prompts, `…` for white's empty half of the first row when black starts, `×` for a rejected line.

## Layout

The page is a column: a header rule, a main area, and a sticky status bar at the bottom. Horizontal padding is 16px on small screens and 24px from `sm` (640px). The header sits 16px from the top; main has 20px of vertical padding on chess and 24px on an issue.

The solving view is a two-column grid from `lg` (1024px): the board column is `auto` width and the ledger pane fills `minmax(30ch, 1fr)`, capped at 68ch, with a 40px gutter. Below `lg` it stacks: board centered first, ledger second, with 24px between them. The ledger pane is framed with a hairline border and 20px by 16px inner padding only on desktop, where it is stretched to the board's height (`calc(var(--cell) * 8 + 1.6em)`) so its footer rule aligns with the board's file labels.

The board is sized by one custom property, `--cell`, computed from the viewport: `min((100dvh − 16rem) / 8, (100vw − 3.25rem) / 8, 84px)` on small screens and `min((100dvh − 11rem) / 8, (100vw − 6rem) × 0.5 / 8, 92px)` at `lg`. The split view halves it (52px and 56px caps). Rank labels take a `2ch` column; file labels take a `1.6em` row. Everything on the board is a multiple of `--cell`.

The issue page is a single column capped at 104ch, laid out as release notes. Each issue is an `article` headed by a version rule; the current issue's title, statement, figure, files, and reply line sit in a 68ch column with 20px steps between blocks. Once a solution is unlocked, the solution and the solved-by list share a grid: one column below `lg`, and `minmax(0, 68ch) minmax(24ch, 1fr)` with a 40px gutter from `lg`, so the solvers sit beside the solution. The previous issue follows 48px below, unfolded into the same grid; older issues run on as a list of archive rules under an `# earlier` comment, 48px further down. Each issue closes with a signature rule 32px below its content.

Text measures are in `ch`: 68ch for prose paragraphs and the ledger pane, 62ch for the chess explanation, 72ch for the chess archive, 104ch for the issue page. Ledger columns are `4ch 12ch 12ch auto` (number, white, black, note) with an 8px gap. The chess archive list is `3ch 1fr auto` with a 12px gap and 12px row padding; the solved-by list is `3ch 1fr auto` with an 8px gap and no row padding.

Spacing follows Tailwind's 4px scale; the steps actually used are 4, 8, 12, 16, 20, 24, 32, 40, and 48px. Rules and hairlines are always 1px.

Breakpoints: `sm` 640px (breadcrumb wraps below, slug badge and hints hide, the reply prompts stack, wrapping rules switch to block form, display math shrinks), `lg` 1024px (two columns, framed ledger, one-row status bar, key hints visible, solution beside solvers).

## Elevation & Depth

There are no drop shadows. The system is flat and tonal: `ground` is the page, `ground-2` is hover and the scrollbar track, and the status bar inverts to `ink` to sit "in front" the way a terminal's status line does. Frames are 1px `rule` hairlines. The only `box-shadow` in the build is an inset ring, `inset 0 0 0 2px var(--rose)` on the selected square and `inset 0 0 0 2px var(--rose-ink)` for keyboard focus on a square; it is a border drawn inside the cell, not an elevation.

### Named Rules
**The No-Shadow Rule.** Nothing floats. State is shown with tone (a wash), a hairline, or an inset ring, never with a shadow or blur.

**The Inverted Bar Rule.** The status bar is the one inverted surface: `ink` ground, `ground` text, segments divided by `ground` at 20% opacity, a rose badge at the left. It is sticky to the bottom, above content (`z-index` 20).

## Shapes

Radius is zero everywhere: `--radius: 0px` and every Tailwind radius token is set to 0. Buttons, inputs, badges, rows, boards, squares, figures, and tables are hard rectangles. The two exceptions are marks, not containers: the legal-move dot (a filled circle at 28% of the cell, `ink` at 25%) and the capture ring (a 3px `ink` ring at 30% inset 6% from the cell edge).

Borders are 1px `rule` hairlines. The recurring structural device is the labelled rule, `.rule-line`: a flex row whose `::before` and `::after` draw 1px lines around inline labels with a `0.75ch` gap; the leading stub is `1.5ch`, the trailing line fills, and labels never wrap. `.rule-line-center` balances both sides. `.rule-line-wrap` is the variant for labels that may run long (the issue signature): the label wraps with a 0.35em row gap and the trailing line follows the last row with a 3ch minimum; below `sm` it becomes a block, the stub stays inline with the first words, and the trailing line runs full width beneath the last row. Rules frame the header breadcrumb, split-view captions, the solved label, the ledger pane's footer, every version rule, the `solution` and `solved by` labels, the signature, and each archive entry.

The reply line is drawn the same way: a row between a top and bottom hairline, its two prompts divided by a vertical hairline from `sm` and stacked with a hairline between them below.

Pieces are cburnett SVG line drawings recolored to the palette: `ink` strokes, `square-light`-toned fills for white pieces, `ink` fills for black, with `square-dark` detail strokes. They read as glyphs on the grid rather than as pictures. Figures inside prose sit in a 1px `rule` frame at their natural width, capped at the column.

## Components

### Buttons
Shadcn's button restyled to the terminal: square, hairline, ink-and-ground.
- **Shape:** Hard rectangle (0px). Height 32px default, 28px `sm`, 32px square `icon`. Horizontal padding 12px (8px for `sm`). Label 14px at 500 (12px for `sm`); icons 16px.
- **Primary:** `ink` fill with `ground` text; hover to `ink-2`. The reply line's submit key is the primary at `sm`, with a 16px return-arrow icon before the word `submit` (`checking` while pending).
- **Outline:** Transparent with a 1px `rule` border and `ink` text; hover fills `ground-2` and darkens the border to `ink-3`. Used for the replay step buttons.
- **Ghost:** Transparent, `ink-2` text; hover to `ink` text on `ground-2`. Used for "solve again".
- **Link:** `rose-ink`, underlined at 4px offset; hover to `ink`.
- **Focus:** 2px `rose-ink` outline, 1px offset. Color transitions in 150ms. Disabled drops to 40% opacity.

### Inputs / Fields
Two inputs exist, both borderless and transparent, each announced by a rose prompt character.
- **Command field:** In the status bar. No border, no background, no outline; it lives inside the inverted bar with `ground` text and `ground` at 60% placeholder. A rose `:` label precedes it. 12ch wide, 16ch from `sm`. The caret is `rose-ink` (globally); disabled sits at 60% opacity with the placeholder `solved`.
- **Reply prompts:** In the reply line, on the ground. 16px `ink` text, `ink-3` placeholder (`name`, `answer`), 8px vertical and 4px horizontal padding, no outline of their own (the row's hairlines and the caret carry focus). A rose-ink `>` precedes each. The name field is 18ch from `sm`; the answer field fills.
- **Error:** The bar's message segment reports a parse error in place; the reply line types its verdict on the line beneath. The field itself never changes border or color.

### Navigation
- **Header breadcrumb:** A `.rule-line` at 14px in `ink-2`: `puzzles.osm.sh / chess / Title` on a chess puzzle, `puzzles.osm.sh / chess` on an issue (the `chess` link in `ink-3`). Separators in `ink-3`, the title in `ink` at 500. Links have no underline until hover, when they turn `rose-ink` and underline (150ms). Below `sm` the title wraps to its own line.
- **Chess archive list:** `$ ls -t chess/` in `ink-2`, then a hairline-divided list (`border-y` and `divide-y` in `rule`). Each row is a `3ch 1fr auto` grid: zero-padded number in `ink-3` (a 16px `plus` check once solved), title in `ink` (`ink-2` once solved), metadata in `ink-3` at 14px, date and author in `ink-3` at 12px on a second row with `· solved` in `plus`. Hover fills `ground-2` and turns the title `rose-ink`, with the row bleeding 8px past the text column.
- **Issue archive rules:** Under an `# earlier` comment in `ink-3`, each older issue is a `.rule-line` link at 14px in `ink-2` with 4px vertical padding: the version number in tabular numerals, the title (truncated). Hover turns the whole rule `rose-ink`.
- **Links in prose:** `rose-ink`, hover `ink`; global underline offset 0.2em, 1px thick.

### Status Bar (signature)
The terminal's bottom line, inverted and sticky. 14px, line-height 1, segments 36px tall with 12px horizontal padding, divided by 1px `ground`/20% rules. On a chess puzzle, left to right: the puzzle slug as a rose badge with `ink` text at 500 (hidden below `sm`), side to move, progress in tabular numerals, then a flexible message segment (`role="status"`, live), the `:` command field, and key hints (`kbd` at 500 in `ground`, labels at `ground`/70%; `lg` only). Below `lg` the message row wraps onto a second line under a hairline. On an issue: the version number as the rose badge (shown at every width), the state word, `N solved` in tabular numerals, and at the right `this month` in `ground`/70%, or `back to this month` with an underlined `ground` link when viewing an older issue. Message tone tints the text toward the diff pair on ink.

### Ledger (signature)
A `role="list"` under the prompt, separated by a hairline above (and below once solved), 16px/1.7, tabular, `nowrap`. Moves are written in SAN, one full move per row on a `4ch 12ch 12ch auto` grid: the move number in `ink-3`, white's move, black's move, and a note column. Numbering starts at 1 from the puzzle position, not from the game's move number, so the ledger and the explanation prose count the same way; when black starts, white's half of the first row is `…` in `ink-3`. Every piece letter, pawns included, is a 1.35em inline figurine in the mover's color (`Nbxd7` reads as a knight then `bxd7`; `d8=Q` as a pawn, `d8=`, a queen). Castling stays text, and `+` and `#` keep their SAN meaning in the move's own tone, never `plus` or `minus`. Screen readers hear the move spoken (`knight b takes d7, check`). Solver moves are `ink`; replies are `ink-3`. Unplayed moves are `····` placeholders (0.1em tracking) in `ink-3`; the next move to be written, the solver's or the pending reply, holds a blinking `rose` cursor (0.6ch by 1em, 1s two-step). A rejected move gets its own row directly under the row it was meant for: `×` in the number column, the SAN in the solver's column under a 1px `minus` strike drawn across text and figurines alike, and `not it` in `ink-2` in the note column. The row is `minus`, flashes `minus-wash`, and settles to 78% opacity over 900ms. Each move types in on its own as it is played. After solve, every move is a button: hover `ground-2`, the current replay step `rose-wash`, later moves at 35% opacity.

### Board (signature)
An `inline-grid` of `2ch` rank labels and a `1.6em` file row around an 8 by 8 grid of `--cell` squares inside a 1px `rule` border. Squares alternate `square-dark` and `square-light`. The last move tints `rose-wash` at 70%; the selected square fills `rose-wash` with a 2px inset `rose` ring; legal targets show the dot or capture ring. In the split view, `minus-wash` tints vacated squares on the before board, `plus-wash` tints reached squares on the after board, and `ink` at 10% marks the opponent's squares. Pieces are absolutely positioned and translate between squares in 200ms with the expo ease; a rejected move shakes the board 3px each way over 240ms. Squares are focusable buttons with arrow-key movement.

### Version Rule (signature)
Every issue is headed by a `.rule-line` at 14px that reads like a dated release: the version in `ink` at 500 and tabular numerals (`2026.09`, year dot month, never semver), the month name in `ink-2`, the state word (`open` in `ink-3`, `solved` in `plus`), and `this month` in `rose-ink` on the current issue. Beneath it the title sits at 20px. Once unlocked, a `#` comment line reads `solution unlocked <date>` in `plus`. Each issue closes with a signature: a `.rule-line-wrap` at 12px in `ink-3` reading `author · published <date> · solution unlocked <date>`.

### Reply Line (signature)
The answer form as a command prompt. A `#` comment line in `ink-3` states what to reply with (and changes its wording once the visitor has solved, or once the solution is public). Beneath it, one row between two hairlines: `> name` and `> answer` with rose-ink prompts, divided by a vertical hairline from `sm` and stacked with a hairline between them below, the primary `sm` submit key at the row's right end. The verdict types onto the next line as a `role="status"` at 14px: `plus` for a correct answer, `minus` for a wrong one, `ink-3` otherwise, with a reserved 1.5em so the page does not jump. A wrong answer flashes the whole row `minus-wash` and settles over 900ms while the answer text is reselected for another try; a correct one records the name and types the solver into the solved-by list in place.

### Solved-By List (signature)
A `.rule-line` labelled `solved by` with the count in `ink-2` tabular numerals, then an ordered list at 14px on a `3ch 1fr auto` grid with an 8px gap: zero-padded rank in `ink-3`, name in `ink` (truncated), date in `ink-3`. Rows bleed 4px past the column. Rows present at first paint sit still; only a row earned on this page types in with the ledger's `ledger-in`. The visitor's own row (matched by the name saved in this browser) is washed `rose-wash`, the same tone as the current replay move in the ledger. Empty state is a single `ink-3` line: `no one yet. be the first.` It is never a table, a leaderboard page, or a badge count.

### Motion
State changes only, all on `--ease-out-expo` (`cubic-bezier(0.16, 1, 0.3, 1)`): color hovers 150ms, piece travel 200ms, ledger line type-in 220ms (clip-path from the left; reused by newly earned solved-by rows), board shake 240ms, split and explanation entrance 360ms (6px rise and fade). The struck row and the wrong reply are the two long beats: 900ms each, holding `minus-wash` for the first 40%; the struck row settles to 78% opacity, the reply row settles to transparent. The opponent replies after a 420ms pause. `prefers-reduced-motion` collapses every animation to 1ms and removes piece transitions.

## Do's and Don'ts

### Do:
- **Do** set everything in Fira Code, ligatures off, 16px base; measure columns and widths in `ch`.
- **Do** draw structure with 1px `rule` hairlines and `.rule-line` labels; frame with a border only where a pane must align to something (the desktop ledger pane) or where content is foreign to the grid (a figure, a table cell).
- **Do** keep rose for selection, cursor, active state, and identity, and use `rose-ink` whenever rose must be read as text on the ground.
- **Do** keep green and red as diff marks: vacated and reached, rejected and solved, wrong and correct.
- **Do** pair every color state with a second carrier: a mark, a ring, a strike, a label, or text.
- **Do** animate only on state change, 150 to 360ms with `--ease-out-expo` (900ms for a rejection settling), and honor `prefers-reduced-motion`.
- **Do** theme the browser: rose selection, rose-ink caret and focus ring, rule-colored thin scrollbar, `color-scheme: light`, `theme-color` set to the ground.
- **Do** prefix meta text as a terminal would (`#`, `$`, `:`, `>`, `…`, `×`).
- **Do** state status as a word in a rule (`open`, `solved`) and date releases as `YYYY.MM`.
- **Do** set long-form text in `.prose-mono` at 15.2px on 68ch, and set math in KaTeX inside it: inline at 1.08em, display left-aligned at a 2ch indent and scrolling rather than wrapping.

### Don't:
- **Don't** introduce a second typeface, a display size, or weight above 500 for headings; 700 belongs only to `strong` inside prose.
- **Don't** round a corner; `--radius` is 0 and only the board's move marks are circles.
- **Don't** add a shadow, blur, or gradient; depth is tonal and hairline.
- **Don't** use green or red for buttons, badges, or generic success and error chrome.
- **Don't** render state as a colored badge, pill, or chip; the rose identity badge in the status bar is the only badge.
- **Don't** ship a dark theme on these surfaces; this is the terminal in daylight.
- **Don't** replace SVG pieces or icons with Unicode chess glyphs or icon fonts; pieces are recolored line SVGs and icons are inline SVG at 16px.
- **Don't** open modals or toasts; state is reported in the status bar's message segment, the ledger, and the reply line's verdict.
- **Don't** box the answer form or the solvers in a card, or move the solvers to a separate leaderboard page; both live in the issue's column under a labelled rule.
