// Build-time SEO for the single-page app.
//
// The app renders in the browser, so without this every URL returned the same
// index.html: one title, one description, and an empty <div id="app"> for any
// crawler that does not run JavaScript (Bing, WhatsApp/Facebook link previews,
// AI search crawlers). This plugin:
//   - fills index.html's <!--seo-head--> and <!--seo-body--> for the home page;
//   - writes <path>.html for every other page in src/seo/site.ts, with that
//     page's head and a static, readable version of its content inside #app
//     (public/web.config serves /about from about.html);
//   - writes sitemap.xml and robots.txt.
// React replaces the static content when it mounts (see src/main.tsx).
//
// Staging builds (DEPLOY_ENV=staging, set by the deploy workflow) are marked
// noindex everywhere and robots.txt disallows all crawling.

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import type { Plugin } from 'vite'
import {
  DEFAULT_OG_IMAGE,
  INDEXABLE_PAGES,
  ROBOTS_INDEX,
  SEO_PAGES,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  type PageSeo,
} from '../src/seo/site'
import { jsonLdFor } from '../src/seo/structured-data'
import {
  guideHeadline,
  splitLinks,
  type ContentBlock,
  type ContentSection,
  type FaqEntry,
  type GuideContent,
} from '../src/content/types'
import { FAQ_DATA } from '../src/constants/faq'
import { HOME_ABOUT_HEADING, HOME_ABOUT_POINTS, HOME_ABOUT_TEXT } from '../src/content/home'
import { LOTTO_GUIDE } from '../src/content/lotto-in-nigeria'
import { TWO_SURE_GUIDE } from '../src/content/two-sure'
import { APK_URL, DOWNLOAD_APP_GUIDE } from '../src/content/download-app'
import { PROMOTIONS_GUIDE } from '../src/content/promotions'
import { RESULTS_SECTIONS } from '../src/content/results'
import { AGENT_FAQ, AGENT_GUIDE_INTRO, AGENT_GUIDE_SECTIONS, AGENT_GUIDE_TITLE } from '../src/content/become-an-agent'

const HEAD_MARKER = '<!--seo-head-->'
const BODY_MARKER = '<!--seo-body-->'

// Logged-in areas: nothing to index, and crawling them only wastes crawl budget.
// Rules match by prefix, so "/withdrawal$" ends there to keep /withdrawal-policy crawlable.
const PRIVATE_PREFIXES = [
  '/deposit',
  '/favourite-balls',
  '/payouts',
  '/profile',
  '/referrals',
  '/settings',
  '/tickets',
  '/transactions',
  '/wallet',
  '/withdrawal$',
]

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const rich = (text: string) =>
  splitLinks(text)
    .map((p) => (p.href ? `<a href="${esc(p.href)}">${esc(p.text)}</a>` : esc(p.text)))
    .join('')

/** Path of the HTML file written for a page, relative to the build output. */
export const pageFile = (path: string) => (path === '/' ? 'index.html' : `${path.slice(1)}.html`)

/** Generated page files, for the PWA to leave out of its precache. */
export const generatedPageFiles = () =>
  Object.keys(SEO_PAGES)
    .filter((p) => p !== '/')
    .map(pageFile)

function renderHead(page: PageSeo, noindexAll: boolean) {
  const url = absoluteUrl(page.path)
  const image = page.ogImage ?? DEFAULT_OG_IMAGE
  const robots = noindexAll ? 'noindex, nofollow' : page.noindex ? 'noindex, follow' : ROBOTS_INDEX
  const json = jsonLdFor(page).replace(/</g, '\\u003c')
  return [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}"/>`,
    `<meta name="robots" content="${robots}"/>`,
    `<link rel="canonical" href="${url}"/>`,
    `<meta property="og:type" content="website"/>`,
    `<meta property="og:site_name" content="${SITE_NAME}"/>`,
    `<meta property="og:locale" content="en_NG"/>`,
    `<meta property="og:url" content="${url}"/>`,
    `<meta property="og:title" content="${esc(page.title)}"/>`,
    `<meta property="og:description" content="${esc(page.description)}"/>`,
    `<meta property="og:image" content="${image}"/>`,
    `<meta property="og:image:width" content="1200"/>`,
    `<meta property="og:image:height" content="630"/>`,
    `<meta property="og:image:alt" content="MaxiLotto — play 5/90 lotto online in Nigeria"/>`,
    `<meta name="twitter:card" content="summary_large_image"/>`,
    `<meta name="twitter:site" content="@maxilottong"/>`,
    `<meta name="twitter:title" content="${esc(page.title)}"/>`,
    `<meta name="twitter:description" content="${esc(page.description)}"/>`,
    `<meta name="twitter:image" content="${image}"/>`,
    json && `<script type="application/ld+json" id="seo-jsonld">${json}</script>`,
    // First hero slide (components/hero-carousel.tsx): the largest thing on the home page.
    page.path === '/' && `<link rel="preload" as="image" href="/new-bg.jpg" fetchpriority="high"/>`,
  ]
    .filter(Boolean)
    .join('\n    ')
}

function renderBlock(block: ContentBlock): string {
  switch (block.type) {
    case 'p':
      return `<p>${rich(block.text)}</p>`
    case 'note':
      return `<p class="pr-note">${rich(block.text)}</p>`
    case 'list':
      return `<ul>${block.items.map((i) => `<li>${rich(i)}</li>`).join('')}</ul>`
    case 'steps':
      return `<ol>${block.items.map((i) => `<li>${rich(i)}</li>`).join('')}</ol>`
    case 'terms':
      return `<dl>${block.items.map((i) => `<dt${i.id ? ` id="${i.id}"` : ''}>${esc(i.term)}</dt><dd>${rich(i.text)}</dd>`).join('')}</dl>`
    case 'table':
      return (
        `<div class="pr-table"><table><thead><tr>${block.head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead>` +
        `<tbody>${block.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`
      )
  }
}

const renderSections = (sections: ContentSection[]) =>
  sections
    .map((s) => `<section id="${s.id}"><h2>${esc(s.heading)}</h2>${s.blocks.map(renderBlock).join('')}</section>`)
    .join('')

const renderFaq = (heading: string, items: FaqEntry[]) =>
  `<section><h2>${esc(heading)}</h2>${items
    .map((i) => `<h3>${esc(i.question)}</h3><p>${rich(i.answer)}</p>`)
    .join('')}</section>`

const betTypes = LOTTO_GUIDE.sections.find((s) => s.id === 'lotto-bet-types')!

/** A guide page (src/content), in the same order as components/content/guide-page.tsx. */
const renderGuide = (guide: GuideContent, extra = '') =>
  `<h1>${esc(guideHeadline(guide))}</h1><p>${rich(guide.intro)}</p>` +
  extra +
  renderSections(guide.sections) +
  `<p><a href="/play">Play 5/90 now</a> or <a href="/auth/signup">create a free account</a>. 18+ only.</p>` +
  (guide.faq ? renderFaq('Frequently asked questions', guide.faq) : '') +
  (guide.disclaimer ? `<p class="pr-small">${esc(guide.disclaimer)}</p>` : '')

// Main content per page. Each one summarises what the real page shows; pages
// not listed get their name and description.
const pageContent: Record<string, () => string> = {
  '/': () =>
    `<h1>MaxiLotto · Play 5/90 lotto online in Nigeria</h1>` +
    `<p>${esc(SEO_PAGES['/'].description)}</p>` +
    `<section><h2>${esc(HOME_ABOUT_HEADING)}</h2><p>${rich(HOME_ABOUT_TEXT)}</p>` +
    HOME_ABOUT_POINTS.map((p) => `<h3>${esc(p.title)}</h3><p>${rich(p.text)}</p>`).join('') +
    `</section>` +
    `<section><h2>Become a MaxiLotto agent</h2><p>Turn your shop into a lotto outlet and earn attractive commission on every ticket sold. <a href="/become-an-agent">Apply online</a>.</p></section>`,
  '/how-to-play': () =>
    `<h1>Maxi Drive — How to Play 5/90 lotto</h1>` +
    `<p>${esc(SEO_PAGES['/how-to-play'].description)}</p>` +
    `<section><h2>How to start</h2><ol><li>Create an account and fund your wallet by bank transfer, card or USSD.</li><li>Choose a game and pick your numbers.</li><li>Choose a bet type and set your stake per line.</li><li>Your winnings are paid into your wallet when the draw completes.</li></ol></section>` +
    `<section><h2>${esc(betTypes.heading)}</h2>${betTypes.blocks.map(renderBlock).join('')}</section>` +
    `<section><h2>Normal, Machine and Double Chance</h2><p>A Normal bet is checked against the 5 winning numbers, a Machine bet against the 5 machine numbers, and Double Chance plays half the stake on each set.</p></section>`,
  '/lotto-in-nigeria': () => renderGuide(LOTTO_GUIDE),
  '/2-sure-lotto': () => renderGuide(TWO_SURE_GUIDE),
  '/download-app': () => renderGuide(DOWNLOAD_APP_GUIDE, `<p><a href="${APK_URL}" download>Download the MaxiLotto app for Android</a></p>`),
  '/promotions': () => renderGuide(PROMOTIONS_GUIDE),
  '/become-an-agent': () =>
    `<h1>Become a MaxiLotto Agent</h1>` +
    `<p>Sell 5/90 lotto from your shop and earn attractive commission on every ticket. Apply online in about five minutes. Terms and conditions apply.</p>` +
    `<h2>${esc(AGENT_GUIDE_TITLE)}</h2><p>${esc(AGENT_GUIDE_INTRO)}</p>` +
    renderSections(AGENT_GUIDE_SECTIONS) +
    renderFaq('Agent questions', AGENT_FAQ),
  '/faq': () => `<h1>Frequently asked questions</h1>` + renderFaq('About MaxiLotto', FAQ_DATA),
  '/results': () =>
    `<h1>Lotto Results: MaxiLotto 5/90 winning and machine numbers for every draw</h1><p>${esc(SEO_PAGES['/results'].description)}</p>` +
    renderSections(RESULTS_SECTIONS),
  '/games': () =>
    `<h1>Daily Games</h1><p>${esc(SEO_PAGES['/games'].description)}</p>` +
    `<p>New to 5/90? Read <a href="/how-to-play">how to play</a> first, then check the <a href="/results">latest results</a>.</p>`,
  '/play': () =>
    `<h1>Play 5/90 lotto</h1><p>${esc(SEO_PAGES['/play'].description)}</p>` +
    `<p>Five winning numbers are drawn from 1 to 90. A 2 Direct line pays 240 times the stake and a 3 Direct line 2,100 times. <a href="/how-to-play">See every bet type and its odds</a>.</p>`,
}

function renderBody(page: PageSeo, year: number) {
  const main = pageContent[page.path]?.() ?? `<h1>${esc(page.name)}</h1><p>${esc(page.description)}</p>`
  return `<div data-prerender class="pr">
<style>
.pr{font-family:Poppins,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#334155;background:#f8fffe;min-height:100vh;line-height:1.6}
.pr a{color:#0185b6}
.pr-head{background:linear-gradient(135deg,#0a4b7f,#0185b6 60%,#01b1a8);padding:16px}
.pr-head nav{display:flex;flex-wrap:wrap;gap:6px 16px;margin-top:12px}
.pr-head nav a{color:#fff;font-size:14px;font-weight:600;text-decoration:none}
.pr-main{max-width:56rem;margin:0 auto;padding:32px 16px}
.pr-main h1{color:#0a4b7f;font-size:1.9rem;line-height:1.25;margin:0 0 12px}
.pr-main p,.pr-main ul,.pr-main ol{margin:0 0 12px}
.pr-main h2{color:#0a4b7f;font-size:1.3rem;margin:28px 0 8px}
.pr-main h3{color:#0f172a;font-size:1rem;margin:18px 0 4px}
.pr-main dt{font-weight:700;color:#0f172a;margin-top:12px}
.pr-main dd{margin:0}
.pr-note{background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:12px}
.pr-small{font-size:12px;color:#94a3b8}
.pr-table{overflow-x:auto}
.pr table{border-collapse:collapse;width:100%;font-size:14px}
.pr th{background:#0a4b7f;color:#fff;text-align:left}
.pr th,.pr td{padding:8px;border:1px solid #e2e8f0;vertical-align:top}
.pr-foot{background:#0f172a;color:#cbd5e1;padding:24px 16px;font-size:13px}
.pr-foot a{color:#fff;margin-right:14px}
</style>
<header class="pr-head">
<a href="/"><img src="/footer-logo.png" alt="${SITE_NAME}" width="238" height="36"/></a>
<nav aria-label="Main"><a href="/play">Play 5/90</a><a href="/games">Today's Games</a><a href="/results">Results</a><a href="/how-to-play">How to Play</a><a href="/2-sure-lotto">2 Sure</a><a href="/lotto-in-nigeria">Lotto in Nigeria</a><a href="/promotions">Promotions</a><a href="/download-app">App</a><a href="/become-an-agent">Become an Agent</a><a href="/auth/signup">Sign Up</a></nav>
</header>
<main class="pr-main">${main}</main>
<footer class="pr-foot">
<p><a href="/about">About Us</a><a href="/contact">Contact</a><a href="/faq">FAQ</a><a href="/leaderboard">Leaderboard</a><a href="/responsible-gambling">Responsible Gaming</a><a href="/terms-and-condition">Terms</a><a href="/privacy-policy">Privacy</a><a href="/withdrawal-policy">Withdrawal Policy</a></p>
<p>© ${year} MaxiLotto, a brand of LukzerNet Nigeria Limited. 18+ only. Please play responsibly.</p>
</footer>
</div>`
}

function robotsTxt(noindexAll: boolean) {
  if (noindexAll) return 'User-agent: *\nDisallow: /\n'
  return [
    'User-agent: *',
    ...PRIVATE_PREFIXES.map((p) => `Disallow: ${p}`),
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n')
}

const sitemapXml = () =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  INDEXABLE_PAGES.map((p) => `  <url><loc>${absoluteUrl(p.path)}</loc></url>`).join('\n') +
  `\n</urlset>\n`

export function seoPlugin(): Plugin {
  const noindexAll = process.env.DEPLOY_ENV === 'staging'
  const year = new Date().getFullYear()
  const fill = (template: string, page: PageSeo) =>
    template.replace(HEAD_MARKER, renderHead(page, noindexAll)).replace(BODY_MARKER, renderBody(page, year))

  let template = ''
  let outDir = 'dist'

  return {
    name: 'maxilotto-seo',
    // After vite-plugin-pwa (also "post", listed before this plugin), so the page
    // template already carries its service-worker registration script.
    enforce: 'post',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        if (!html.includes(HEAD_MARKER) || !html.includes(BODY_MARKER)) {
          throw new Error(`index.html must contain ${HEAD_MARKER} and ${BODY_MARKER}`)
        }
        template = html
        return fill(html, SEO_PAGES['/'])
      },
    },
    writeBundle() {
      // Only the client build sees index.html; skip any other build environment.
      if (!template) return
      for (const page of Object.values(SEO_PAGES)) {
        if (page.path === '/') continue
        const file = join(outDir, pageFile(page.path))
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, fill(template, page))
      }
      writeFileSync(join(outDir, 'sitemap.xml'), sitemapXml())
      writeFileSync(join(outDir, 'robots.txt'), robotsTxt(noindexAll))
    },
  }
}
