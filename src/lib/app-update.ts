// Gets people onto a new deploy without a hard refresh.
//
// The page's built scripts have content hashes in their names (index-Dh3be6F.js,
// main.4f3a…js), so a new deploy is visible as a different list of script names
// in a freshly fetched index.html. Checked shortly after load, every 10 minutes
// and whenever the tab comes back into view. When the list differs:
//   - straight after opening the page, before the user has clicked or typed
//     (the browser started us from a stale cached copy): reload at once;
//   - otherwise: show a small "Refresh" banner, and turn the user's next
//     navigation into a full page load, unless `isBusy` says that would lose work.
// For apps with a service worker, the worker is updated first so the reload
// does not come straight back from its cache.
//
// The same file is used by every MaxiLotto web app; keep the copies in step.

export interface AppUpdateOptions {
  /** Colour of the banner's Refresh button. */
  accent?: string
  /** Distance of the banner from the bottom of the window, e.g. to clear a bottom nav bar. */
  bottomOffset?: () => number
  /** True while a reload would lose the user's work (an unsent bet slip, a half-filled form). */
  isBusy?: () => boolean
}

const CHECK_EVERY_MS = 10 * 60 * 1000
const STARTUP_WINDOW_MS = 20 * 1000
const RELOADED_FOR = 'app-update:reloaded-for'

// A built script: same origin, and a hash of 8+ characters after a "." or "-" in its file name.
const isHashedScript = (url: URL) => url.origin === location.origin && /[.-][A-Za-z0-9_-]{8,}\.js$/.test(url.pathname)

const signature = (srcs: string[]) =>
  [...new Set(srcs.map((s) => new URL(s, location.origin + '/')).filter(isHashedScript).map((u) => u.pathname))]
    .sort()
    .join('|')

const runningSignature = signature(Array.from(document.scripts, (s) => s.getAttribute('src') ?? '').filter(Boolean))

let options: AppUpdateOptions = {}
let updateReady = false
let interacted = false
let started = false

async function latestSignature(): Promise<string> {
  // The query string keeps the request out of the browser cache and the service worker's cache.
  const res = await fetch(`/?app-update=${Date.now()}`, { cache: 'no-store', credentials: 'same-origin' })
  if (!res.ok) return ''
  const html = await res.text()
  // A plain exec loop rather than matchAll, which older TypeScript library settings lack.
  const srcs: string[] = []
  const tag = /<script\b[^>]*\bsrc="([^"]+)"/gi
  for (let m = tag.exec(html); m; m = tag.exec(html)) srcs.push(m[1])
  return signature(srcs)
}

/** Updates the service worker, if any, so that a reload is served the new build. */
async function updateServiceWorker() {
  try {
    const reg = await navigator.serviceWorker?.getRegistration()
    if (!reg) return
    await reg.update()
    if (reg.installing || reg.waiting) {
      await new Promise<void>((resolve) => {
        navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true })
        setTimeout(resolve, 4000)
      })
    }
  } catch {
    // Reload anyway; at worst the next load updates the worker.
  }
}

export async function reloadToLatest(href?: string) {
  await updateServiceWorker()
  if (href) location.assign(href)
  else location.reload()
}

/** Call from the router before a navigation: true means "do a full page load to the new address instead". */
export function shouldReloadOnNavigation() {
  return updateReady && !(options.isBusy?.() ?? false)
}

function showBanner() {
  if (document.getElementById('app-update-banner')) return
  const bar = document.createElement('div')
  bar.id = 'app-update-banner'
  bar.setAttribute('role', 'status')
  bar.style.cssText = [
    'position:fixed',
    'left:50%',
    `bottom:${options.bottomOffset?.() ?? 16}px`,
    'transform:translateX(-50%)',
    'z-index:2147483000',
    'display:flex',
    'align-items:center',
    'gap:12px',
    'width:max-content',
    'max-width:calc(100% - 32px)',
    'padding:8px 8px 8px 16px',
    'border-radius:9999px',
    'background:#0f172a',
    'color:#fff',
    'font:500 14px/1.3 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif',
    'box-shadow:0 10px 30px rgba(15,23,42,.35)',
  ].join(';')

  const text = document.createElement('span')
  text.textContent = 'A new version is available.'

  const refresh = document.createElement('button')
  refresh.type = 'button'
  refresh.textContent = 'Refresh'
  refresh.style.cssText = `border:0;border-radius:9999px;padding:6px 14px;background:${options.accent ?? '#0185b6'};color:#fff;font:inherit;font-weight:700;cursor:pointer`
  refresh.addEventListener('click', () => {
    refresh.disabled = true
    refresh.textContent = 'Refreshing…'
    void reloadToLatest()
  })

  const close = document.createElement('button')
  close.type = 'button'
  close.setAttribute('aria-label', 'Dismiss')
  close.textContent = '×'
  close.style.cssText = 'border:0;background:transparent;color:rgba(255,255,255,.7);font:400 20px/1 system-ui,sans-serif;padding:2px 6px;cursor:pointer'
  close.addEventListener('click', () => bar.remove())

  bar.append(text, refresh, close)
  document.body.appendChild(bar)
}

function markReady(latest: string) {
  const startup = performance.now() < STARTUP_WINDOW_MS && !interacted
  let alreadyTried = false
  try {
    alreadyTried = sessionStorage.getItem(RELOADED_FOR) === latest
  } catch {
    // Storage blocked: just never auto-reload twice in a row.
  }
  if (startup && !alreadyTried && !(options.isBusy?.() ?? false)) {
    try {
      sessionStorage.setItem(RELOADED_FOR, latest)
    } catch {
      // ignore
    }
    void reloadToLatest()
    return
  }
  updateReady = true
  showBanner()
}

async function check() {
  if (updateReady) return
  try {
    const latest = await latestSignature()
    if (latest && latest !== runningSignature) markReady(latest)
  } catch {
    // Offline or the server is mid-deploy: try again later.
  }
}

/** Development builds have no hashed scripts, so this does nothing there. */
export function startAppUpdateWatcher(opts: AppUpdateOptions = {}) {
  if (started || !runningSignature) return
  started = true
  options = opts
  const touched = () => {
    interacted = true
  }
  window.addEventListener('pointerdown', touched, { once: true, capture: true })
  window.addEventListener('keydown', touched, { once: true, capture: true })

  // A service worker replacing an earlier one means a new deploy has taken over: check now.
  if (navigator.serviceWorker?.controller) {
    navigator.serviceWorker.addEventListener('controllerchange', () => void check())
  }

  setTimeout(check, 3000)
  setInterval(check, CHECK_EVERY_MS)
  let lastVisibleCheck = 0
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && Date.now() - lastVisibleCheck > 60_000) {
      lastVisibleCheck = Date.now()
      void check()
    }
  })
}
