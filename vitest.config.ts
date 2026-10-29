// Test settings. Vitest reads this file instead of vite.config.ts.
// They used to sit in vite.config.ts, but bun.lock pins vitest 3.1.1, which brings
// its own copy of Vite 6; its types then extend that copy rather than the Vite 7
// that vite.config.ts uses, and `tsc` (part of `bun run build`) rejected the `test` key.
import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
