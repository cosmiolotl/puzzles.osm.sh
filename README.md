<a href="https://puzzles.osm.sh"><img src=".github/banner.svg" alt="puzzles.osm.sh"></a>

An extensible repository that is currently used to host my puzzles website. Currently supports the creation of monthly issues and chess puzzles. Monthly issues were inspired by Jane Street's monthly puzzle. Chess puzzles are intended to contain positional ideas and key transformations that create winning advantages (ideally without material gain).

## Run

```sh
bun install
bun run dev          # http://localhost:3000
bun run build        # vite build + tsc
bun run deploy       # build + wrangler deploy (Cloudflare Workers)
```

## Production

Live at https://puzzles.osm.sh on a Cloudflare worker. This application was designed for Cloudflare Workers deployed using `wrangler`. Deploy Worker updates with `bun run deploy` and apply database migrations with `bun run db:migrate`.

The production `REVIEW_KEY` is stored as a Cloudflare secret. `/review` uses the same key in `.dev.vars` at initial deployment. Change it with `bunx wrangler secret put REVIEW_KEY`.

## Monthly issues

Each issue is a folder under `issues` (e.g. `issues/2026-08-tiny3x5`) and should have the following structure:

```md
# ./issue.md
---
title: string
published: yyyy-mm-dd
author: string
figure:
  src: /path/to/file.ext
  alt: string
---

Markdown description of the puzzle
```

```md
# ./solution.md
---
published: yyyy-mm-dd
answers:
  - any
---
```

Puzzles and solutions will become visible when their `published` date is reached, and submissions will be open for any puzzle that has no visible solution. You can set this up for yourself with:

```sh
bunx wrangler d1 create puzzles     # paste the id into wrangler.jsonc
bun run db:migrate:local            # local
bun run db:migrate                  # remote
```

## Reviewing submissions
You can review submissions at `/review` by entering the review key you set during setup. If you haven't done so, you can create one by copying `.dev.vars.example` into `.dev.vars` and running this to sync it to your worker:

```sh
bunx wrangler secret put REVIEW_KEY  # paste your key at the prompt
bun run db:migrate                 
bun run deploy
```

## Chess puzzles

Each puzzle is one file, `public/puzzles/<slug>.md`. The newest is served at `/chess`, each at `/chess/<slug>`, and the list at `/chess/archive`. The files are deployed as-is, so anyone can read a puzzle's line and explanation at `/puzzles/<slug>.md`. You can see example puzzles in the aforementioned puzzles directory.

## Credits

Piece images are the cburnett set by Colin M.L. Burnett (CC BY-SA 3.0), as shipped by Lichess, in `public/pieces/cburnett/`. Move legality by [chess.js](https://github.com/jhlywa/chess.js). Type is Fira Code.
