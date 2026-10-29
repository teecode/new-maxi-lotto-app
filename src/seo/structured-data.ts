// JSON-LD (schema.org) for each page, written into the page's HTML at build
// time by scripts/vite-plugin-seo.ts. Build-only: it quotes the FAQ and guide
// text, which would otherwise end up in the app's main bundle.

import { FAQ_DATA } from '../constants/faq'
import { LOTTO_GUIDE } from '../content/lotto-in-nigeria'
import { TWO_SURE_GUIDE } from '../content/two-sure'
import { APK_URL, DOWNLOAD_APP_GUIDE } from '../content/download-app'
import { PROMOTIONS_GUIDE } from '../content/promotions'
import { AGENT_FAQ } from '../content/become-an-agent'
import { guideHeadline, plainText, type FaqEntry, type GuideContent } from '../content/types'
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, absoluteUrl, type PageSeo } from './site'

type JsonLd = Record<string, unknown>

const ORG_ID = `${SITE_URL}/#organization`
// How people actually type the brand; tells search engines these are all MaxiLotto.
const ALTERNATE_NAMES = ['Maxi Lotto', 'Maxilotto', 'MaxiLotto Nigeria', 'maxilotto.ng']

const organization: JsonLd = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE_NAME,
  alternateName: ALTERNATE_NAMES,
  legalName: 'LukzerNet Nigeria Limited',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/maxilotto-icon.png`,
  email: 'care@maxilotto.ng',
  telephone: '+234 902 428 4147',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'B13 Behind City Park, Express Junction, Udu Road',
    addressRegion: 'Delta',
    addressCountry: 'NG',
  },
  sameAs: [
    'https://x.com/maxilottong',
    'https://instagram.com/maxilottong',
    'https://facebook.com/maxilottong',
    'https://tiktok.com/@maxilottong',
    'https://linkedin.com/company/maxilottong',
  ],
}

const website: JsonLd = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  alternateName: ALTERNATE_NAMES,
  url: `${SITE_URL}/`,
  inLanguage: 'en-NG',
  publisher: { '@id': ORG_ID },
}

const breadcrumb = (page: PageSeo): JsonLd => ({
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: page.name, item: absoluteUrl(page.path) },
  ],
})

const faqPage = (items: FaqEntry[]): JsonLd => ({
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: plainText(item.answer) },
  })),
})

const article = (path: string, guide: GuideContent, published: string): JsonLd => ({
  '@type': 'Article',
  headline: guideHeadline(guide),
  description: plainText(guide.intro),
  inLanguage: 'en-NG',
  datePublished: published,
  dateModified: published,
  author: { '@id': ORG_ID },
  publisher: { '@id': ORG_ID },
  image: DEFAULT_OG_IMAGE,
  mainEntityOfPage: absoluteUrl(path),
})

const perPage: Record<string, JsonLd[]> = {
  '/faq': [faqPage(FAQ_DATA)],
  '/lotto-in-nigeria': [article('/lotto-in-nigeria', LOTTO_GUIDE, '2026-10-17'), faqPage(LOTTO_GUIDE.faq ?? [])],
  '/2-sure-lotto': [article('/2-sure-lotto', TWO_SURE_GUIDE, '2026-10-17'), faqPage(TWO_SURE_GUIDE.faq ?? [])],
  '/download-app': [
    {
      '@type': 'SoftwareApplication',
      name: SITE_NAME,
      alternateName: 'MaxiLotto app',
      operatingSystem: 'Android',
      applicationCategory: 'GameApplication',
      downloadUrl: `${SITE_URL}${APK_URL}`,
      installUrl: absoluteUrl('/download-app'),
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'NGN' },
      publisher: { '@id': ORG_ID },
    },
    faqPage(DOWNLOAD_APP_GUIDE.faq ?? []),
  ],
  '/promotions': [faqPage(PROMOTIONS_GUIDE.faq ?? [])],
  '/become-an-agent': [faqPage(AGENT_FAQ)],
}

/** The page's JSON-LD graph as a string, or '' for pages that should have none. */
export function jsonLdFor(page: PageSeo): string {
  if (page.noindex) return ''
  const graph =
    page.path === '/'
      ? [organization, website]
      : // Every page names the publisher it refers to, so the @id references resolve.
        [breadcrumb(page), ...(perPage[page.path] ?? []), organization]
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
}
