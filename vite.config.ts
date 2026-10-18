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
import { generatedPageFiles, seoPlugin } from './scripts/vite-plugin-seo'

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
        // Only the app shell. Precaching every route's code (about 90 files, 2.2 MB) would
        // make each visitor download all of it in the background on mobile data; the
        // browser's HTTP cache already keeps the hashed assets they actually use.
        globPatterns: ['index.html'],
        // One HTML file per page for crawlers; the app shell is index.html.
        globIgnores: generatedPageFiles(),
        // Navigations to real files (the Android APK, sitemap.xml, robots.txt, images) and to
        // the socket.io proxy must reach the server, not get the app shell back.
        navigateFallbackDenylist: [/^\/downloads\//, /^\/socket\.io/, /\/[^/?]+\.[a-z0-9]+$/i],
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
