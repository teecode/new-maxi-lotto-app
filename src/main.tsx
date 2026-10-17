import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'
import './embla.css'
import reportWebVitals from './reportWebVitals.ts'
import { ThemeProvider } from './components/theme-provider.tsx'
import { Provider } from './utils/Provider.tsx'
import { Toaster } from './components/ui/sonner.tsx'
import useAuthStore from './store/authStore.ts'
import { PWAInstallPrompt } from './components/PWAInstallPrompt.tsx'
import { reloadToLatest, shouldReloadOnNavigation, startAppUpdateWatcher } from './lib/app-update.ts'

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// New deploys: see lib/app-update.ts. The bet slip is kept in sessionStorage, so a reload loses nothing.
startAppUpdateWatcher({
  accent: '#0185B6',
  // Clear the mobile bottom navigation bar (69px, hidden from the sm breakpoint up).
  bottomOffset: () => (window.innerWidth < 640 ? 85 : 16),
})
router.subscribe('onBeforeNavigate', (e) => {
  if (e.fromLocation && e.pathChanged && shouldReloadOnNavigation()) void reloadToLatest(e.toLocation.href)
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const auth = useAuthStore()
  return (
    <>
      <RouterProvider router={router} context={{ auth }} />
      <PWAInstallPrompt />
    </>
  )
}

// Render the app. The server sends #app holding a static, crawlable version
// of the page ([data-prerender], from scripts/vite-plugin-seo.ts); React
// replaces it on first render. Any other content means the app is already
// mounted (hot reload), so leave it alone.
const rootElement = document.getElementById('app')
if (rootElement && (!rootElement.firstElementChild || rootElement.firstElementChild.hasAttribute('data-prerender'))) {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <Provider>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <InnerApp />
          <Toaster richColors position='top-right' />
        </ThemeProvider>
      </Provider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
