import { basename } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { parsePuzzle } from './src/lib/puzzle-source.ts'

/** `public/puzzles/<slug>.md?puzzle` → the parsed Puzzle, so no YAML parser ships to the browser. */
function chessPuzzles(): Plugin {
  return {
    name: 'chess-puzzles',
    transform(code, id) {
      const [file, query] = id.split('?')
      if (query !== 'puzzle') return
      const puzzle = parsePuzzle(basename(file, '.md'), code)
      return { code: `export default ${JSON.stringify(puzzle)}`, map: null }
    },
  }
}

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    chessPuzzles(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})
