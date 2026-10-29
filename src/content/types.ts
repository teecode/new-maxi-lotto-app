// Plain-data page content, rendered by the React page and, at build time, into
// the static HTML that crawlers without JavaScript read (scripts/vite-plugin-seo.ts).
// Text may hold links written as [label](/path).

export type ContentBlock =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'steps'; items: string[] }
  | { type: 'terms'; items: { term: string; text: string; id?: string }[] }
  | { type: 'table'; head: string[]; rows: string[][] }
  | { type: 'note'; text: string }

export interface ContentSection {
  id: string
  heading: string
  blocks: ContentBlock[]
}

export interface FaqEntry {
  question: string
  answer: string
}

/** A long-form page: rendered by components/content/guide-page.tsx and by the build plugin. */
export interface GuideContent {
  /** Short page title (the big heading). */
  title: string
  /** Second line of the heading; title and subtitle together are the page's <h1>. */
  subtitle?: string
  intro: string
  sections: ContentSection[]
  faq?: FaqEntry[]
  disclaimer?: string
  /** Show the "On this page" list of section links. */
  toc?: boolean
}

export const guideHeadline = (g: GuideContent) => (g.subtitle ? `${g.title}: ${g.subtitle}` : g.title)

export type TextPart = { text: string; href?: string }

/** Splits "see [results](/results) today" into plain and link parts. */
export function splitLinks(text: string): TextPart[] {
  const parts: TextPart[] = []
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0
    if (index > last) parts.push({ text: text.slice(last, index) })
    parts.push({ text: match[1], href: match[2] })
    last = index + match[0].length
  }
  if (last < text.length) parts.push({ text: text.slice(last) })
  return parts
}

/** The same text without link markup, for JSON-LD and meta tags. */
export const plainText = (text: string) => splitLinks(text).map((p) => p.text).join('')
