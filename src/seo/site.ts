// Single source of truth for page titles and descriptions. Read at build time
// (scripts/vite-plugin-seo.ts writes one HTML file per page so crawlers that do
// not run JavaScript still get the right head) and at run time
// (components/seo-manager.tsx keeps the head in step with client routing).
// Structured data lives in structured-data.ts, which only the build reads, so
// the page text it quotes stays out of the app bundle.
// Keep this file free of browser and React imports, and use relative imports:
// the Vite config loads it, and the "@/" alias does not exist there.

export const SITE_URL = 'https://maxilotto.ng'
export const PRODUCTION_HOST = 'maxilotto.ng'
export const SITE_NAME = 'MaxiLotto'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`
export const ROBOTS_INDEX = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
export const DEFAULT_DESCRIPTION =
  'Play 5/90 lotto online in Nigeria with MaxiLotto. Daily draws, live results, Direct, Perm, Banker and Machine bets, and winnings paid straight to your wallet. 18+.'

export interface PageSeo {
  path: string
  title: string
  description: string
  /** Short name used in breadcrumbs and the static fallback page. */
  name: string
  noindex?: boolean
  ogImage?: string
}

export const absoluteUrl = (path: string) => (path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`)

const pages: PageSeo[] = [
  {
    path: '/',
    name: 'Home',
    title: 'MaxiLotto — Play 5/90 Lotto Online in Nigeria',
    description: DEFAULT_DESCRIPTION,
  },
  {
    path: '/play',
    name: 'Play 5/90',
    title: 'Play 5/90 Lotto Online — Pick Your Numbers | MaxiLotto',
    description:
      "Pick your 5/90 numbers and place Direct, Perm, Banker, Against, Machine or Double Chance bets on today's MaxiLotto draws, from your phone or PC.",
  },
  {
    path: '/games',
    name: "Today's Games",
    title: "Today's Lotto Games & Draw Times | MaxiLotto",
    description:
      "See every MaxiLotto 5/90 game on today's schedule with its draw time and countdown, then pick a game and play online before it closes.",
  },
  {
    path: '/results',
    name: 'Lotto Results',
    title: 'MaxiLotto Results Today — Winning & Machine Numbers',
    description:
      "Today's MaxiLotto 5/90 lotto results: the winning numbers and machine numbers for every draw, plus past results by game and date.",
  },
  {
    path: '/accumulator',
    name: 'Accumulator',
    title: 'Lotto Accumulator — Combine Draws, Multiply the Odds | MaxiLotto',
    description:
      'Combine selections from several MaxiLotto draws into one accumulator ticket. The odds of every leg multiply together for a bigger potential return.',
  },
  {
    path: '/how-to-play',
    name: 'How to Play',
    title: 'How to Play 5/90 Lotto: 2 Sure, Perm, Banker & Odds | MaxiLotto',
    description:
      'Learn how 5/90 lotto works: Direct (2 Sure, 3 Direct), Perm, Banker, Against, Machine and Double Chance bets, with the full odds table and payout examples.',
  },
  {
    path: '/lotto-in-nigeria',
    name: 'Lotto in Nigeria',
    title: 'Lotto in Nigeria: How 5/90 Works, Bet Names & Playing Online | MaxiLotto',
    description:
      'A plain guide to lotto in Nigeria: how 5/90 works, what 2 Sure, NAP, Perm and Banker mean, how results work, and how playing online compares with a lotto shop.',
  },
  {
    path: '/2-sure-lotto',
    name: '2 Sure Lotto',
    title: '2 Sure Lotto: How to Play 2 Sure (NAP 2), Perm & Banker | MaxiLotto',
    description:
      'What 2 sure means in lotto, how to play it, what it pays (240x at MaxiLotto), how to cover more pairs with a perm or banker, and your real chances.',
  },
  {
    path: '/become-an-agent',
    name: 'Become an Agent',
    title: 'Become a Lotto Agent in Nigeria — Apply Online | MaxiLotto',
    description:
      'Turn your shop into a MaxiLotto lotto outlet. Apply online in minutes, choose a bet shop or lotto terminal setup, and earn up to 35% commission on tickets sold.',
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    title: 'Lotto Winners Leaderboard | MaxiLotto',
    description: "See MaxiLotto's top players and biggest recent wins, and how players climb the ranks.",
  },
  {
    path: '/faq',
    name: 'FAQ',
    title: 'Lotto FAQ — Bets, Results, Payouts & Accounts | MaxiLotto',
    description:
      'Answers to common questions about playing 5/90 lotto with MaxiLotto: bet types, machine numbers, Double Chance, payouts, withdrawals, age limits and more.',
  },
  {
    path: '/about',
    name: 'About Us',
    title: 'About MaxiLotto — 5/90 Lotto by LukzerNet Nigeria Limited',
    description:
      'MaxiLotto is a 5/90 lotto brand of LukzerNet Nigeria Limited, built for fast, transparent play online, on the MaxiLotto app and in MaxiLotto shops.',
  },
  {
    path: '/contact',
    name: 'Contact Us',
    title: 'MaxiLotto Customer Care — Contact Support',
    description:
      'Questions about tickets, deposits or withdrawals? Email care@maxilotto.ng, call +234 902 428 4147 or send the MaxiLotto support team a message.',
  },
  {
    path: '/download-app',
    name: 'MaxiLotto App',
    title: 'Download the MaxiLotto App for Android (Official APK)',
    description:
      'Download the official MaxiLotto Android app from maxilotto.ng to play 5/90 lotto, check results and manage your wallet. Free, with install steps.',
  },
  {
    path: '/promotions',
    name: 'Promotions',
    title: 'MaxiLotto Bonus & Promotions — First Deposit Bonus, Referrals',
    description:
      'Current MaxiLotto offers: the first deposit bonus, bonuses on later deposits, the Ambassador referral programme and agent commission. Terms apply.',
  },
  {
    path: '/responsible-gambling',
    name: 'Responsible Gaming',
    title: 'Responsible Gaming | MaxiLotto',
    description:
      'MaxiLotto is for adults 18+ only. How to keep lotto fun, set limits, spot problem gambling, exclude yourself and find support.',
  },
  {
    path: '/privacy-policy',
    name: 'Privacy Policy',
    title: 'Privacy Policy | MaxiLotto',
    description: 'How MaxiLotto, operated by LukzerNet Nigeria Limited, collects, uses and protects your personal information.',
  },
  {
    path: '/terms-and-condition',
    name: 'Terms and Conditions',
    title: 'Terms and Conditions | MaxiLotto',
    description: 'The terms that apply when you open a MaxiLotto account, place bets and withdraw winnings.',
  },
  {
    path: '/withdrawal-policy',
    name: 'Withdrawal Policy',
    title: 'Withdrawal Policy | MaxiLotto',
    description: 'How withdrawals from your MaxiLotto wallet work: eligibility, identity verification (KYC) and processing.',
  },
  {
    path: '/auth/signup',
    name: 'Sign Up',
    title: 'Create a Free MaxiLotto Account | Sign Up',
    description: 'Register with your phone number and email to play 5/90 lotto online with MaxiLotto. It takes a minute. 18+ only.',
  },
  {
    path: '/auth/login',
    name: 'Log In',
    title: 'Log In | MaxiLotto',
    description: 'Log in to your MaxiLotto account to play 5/90 lotto, check your tickets and withdraw your winnings.',
  },
  {
    path: '/auth/forgot-password',
    name: 'Reset Password',
    title: 'Reset Your Password | MaxiLotto',
    description: 'Reset the password for your MaxiLotto account.',
    noindex: true,
  },
]

export const SEO_PAGES: Record<string, PageSeo> = Object.fromEntries(pages.map((p) => [p.path, p]))

/** Pages listed in sitemap.xml: everything public that is not noindex. */
export const INDEXABLE_PAGES = pages.filter((p) => !p.noindex)

export const normalizePath = (pathname: string) => {
  const trimmed = pathname.replace(/\/+$/, '')
  return trimmed === '' ? '/' : trimmed.toLowerCase()
}

