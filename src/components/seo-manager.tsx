import { useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  PRODUCTION_HOST,
  ROBOTS_INDEX,
  SEO_PAGES,
  SITE_NAME,
  absoluteUrl,
  normalizePath,
} from '@/seo/site'

// The server sends each public page with its own head already filled in
// (scripts/vite-plugin-seo.ts). This keeps the head right as the user moves
// around the app, and marks every page that is not in src/seo/site.ts
// (account pages, unknown URLs) as noindex.

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

// The JSON-LD in the server's HTML describes the page that HTML was written
// for: its canonical URL, read before the app touches the head. Crawlers load
// every URL fresh, so on any other page (after in-app navigation, or a URL the
// server answered with the home page's HTML) the block is dropped, not rebuilt.
const serverCanonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href

function applyPageSeo(pathname: string) {
  const path = normalizePath(pathname)
  const page = SEO_PAGES[path]
  // Staging, localhost and www (which redirects) must never be indexed.
  const indexable = !!page && !page.noindex && window.location.hostname === PRODUCTION_HOST
  const title = page?.title ?? SITE_NAME
  const description = page?.description ?? DEFAULT_DESCRIPTION
  const url = absoluteUrl(page?.path ?? path)
  const image = page?.ogImage ?? DEFAULT_OG_IMAGE

  if (url !== serverCanonical) document.getElementById('seo-jsonld')?.remove()

  document.title = title
  setMeta('name', 'description', description)
  setMeta('name', 'robots', indexable ? ROBOTS_INDEX : 'noindex, follow')
  setCanonical(url)
  setMeta('property', 'og:url', url)
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:image', image)
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', description)
  setMeta('name', 'twitter:image', image)
}

export function SeoManager() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  useEffect(() => {
    applyPageSeo(pathname)
  }, [pathname])
  return null
}
