// The only Vite config; test settings are in vitest.config.ts. There used to be a
// vite.config.js next to this file. Vite loads .js first, so this file (with the PWA
// and push setup) was never used, and it could not build anyway: nitroV2Plugin is
// for TanStack Start server rendering, which this single-page app does not use.
import { defineConfig } from 'vite'
// @ts-ignore
import viteReact from '@vitejs/plugin-react'
// @ts-ignore
import tailwindcss from '@tailwindcss/vite'
// @ts-ignore
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { fileURLToPath, URL } from 'node:url'
// @ts-ignore
import { VitePWA } from 'vite-plugin-pwa'
import { seoPlugin } from './scripts/vite-plugin-seo'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    viteReact(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // public/manifest.json (linked from index.html) is the app manifest.
      manifest: false,
      workbox: {
        // Push notifications (src/services/AuthService.ts, components/PushNotificationManager.tsx)
        // wait for this service worker; push-sw.js handles the push and click events.
        importScripts: ['/push-sw.js'],
        // Nothing precached: precaching every route's code (about 90 files, 2.2 MB) would make
        // each visitor download all of it in the background on mobile data, and the browser's
        // HTTP cache already keeps the hashed scripts they use (for a year, see web.config).
        globPatterns: [],
        // Pages come from the network first, so a deploy shows on the very next load; the
        // stored copy is only for when the network is down or takes over 4 seconds. Serving
        // pages from the precache meant the first load after a deploy showed the old build.
        navigateFallback: null,
        runtimeCaching: [
          {
            // Page loads only, not links to files (the APK, sitemap.xml, images) or socket.io.
            urlPattern: ({ request, url }) =>
              request.mode === 'navigate' && !url.pathname.startsWith('/socket.io') && !/\/[^/]+\.[a-z0-9]+$/i.test(url.pathname),
            handler: 'NetworkFirst',
            options: { cacheName: 'pages', networkTimeoutSeconds: 4, expiration: { maxEntries: 30 } },
          },
        ],
      },
    }),
    seoPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
