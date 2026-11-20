// Draws the ready-made bonus pictures the online admin offers on a bonus's Promote page
// (public/bonus-pictures/<key>.jpg, 1200 x 600). Each is HTML and SVG, drawn with the site's own font
// (Poppins) and logo, then photographed by Chrome.
//
//   npm i --no-save puppeteer-core            (once; or set PUPPETEER_FROM to a folder that has it)
//   node scripts/bonus-pictures/render.mjs              all of them
//   node scripts/bonus-pictures/render.mjs vip festive  just these
//   node scripts/bonus-pictures/render.mjs --out C:/tmp/pictures
//
// Chrome is found at CHROME_PATH, else the usual Windows install. A new picture also needs a line in the
// admin's READY_PICTURES (maxi-lotto.onlineadmin-web src/services/bonusPromotion.js), and the website deployed
// before the admin. Redrawing an existing file? Bump PICTURES_VERSION there too, so caches fetch it again.
// The first eight pictures (free-tickets, welcome-gift, weekend, payday, deposit, accumulator, lotto-balls,
// celebration) were drawn before this script and are not in it.

import { createRequire } from 'node:module'
import { pathToFileURL, fileURLToPath } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const site = path.resolve(here, '../..')

// ---------- drawing helpers ----------

const BALLS = {
  red: ['#FF8A80', '#C62828'],
  orange: ['#FFCC80', '#E65100'],
  yellow: ['#FFF59D', '#F9A825'],
  green: ['#A5D6A7', '#2E7D32'],
  blue: ['#90CAF9', '#1565C0'],
  purple: ['#E1BEE7', '#6A1B9A'],
  pink: ['#F8BBD0', '#C2185B'],
  gold: ['#FFF4C2', '#C98A00']
}

let ids = 0
const id = (name) => `${name}${++ids}`

/** A lotto ball: shadow, shaded sphere, white disc with the number, shine */
function ball(cx, cy, r, color, number, { shadow = true } = {}) {
  const g = id('ball')
  const [light, dark] = BALLS[color]
  const text = String(number)
  const size = r * (text.length > 2 ? 0.36 : text.length > 1 ? 0.5 : 0.6)
  return `
  ${shadow ? `<ellipse cx="${cx}" cy="${cy + r * 1.08}" rx="${r * 0.78}" ry="${r * 0.15}" fill="rgba(0,0,0,.22)"/>` : ''}
  <defs><radialGradient id="${g}" cx="34%" cy="28%" r="78%"><stop offset="0" stop-color="${light}"/><stop offset=".55" stop-color="${dark}"/><stop offset="1" stop-color="${dark}" stop-opacity=".92"/></radialGradient></defs>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${g})"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 0.54}" fill="#fff"/>
  <text x="${cx}" y="${cy}" dy=".36em" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="${size}" fill="#10294A">${text}</text>
  <ellipse cx="${cx - r * 0.42}" cy="${cy - r * 0.52}" rx="${r * 0.26}" ry="${r * 0.14}" fill="rgba(255,255,255,.6)" transform="rotate(-32 ${cx - r * 0.42} ${cy - r * 0.52})"/>`
}

/** Four-pointed sparkle */
const sparkle = (x, y, s, fill = '#FFF6C7', opacity = 0.95) =>
  `<path d="M${x} ${y - s} C${x + s * 0.14} ${y - s * 0.14} ${x + s * 0.14} ${y - s * 0.14} ${x + s} ${y} C${x + s * 0.14} ${y + s * 0.14} ${x + s * 0.14} ${y + s * 0.14} ${x} ${y + s} C${x - s * 0.14} ${y + s * 0.14} ${x - s * 0.14} ${y + s * 0.14} ${x - s} ${y} C${x - s * 0.14} ${y - s * 0.14} ${x - s * 0.14} ${y - s * 0.14} ${x} ${y - s}Z" fill="${fill}" opacity="${opacity}"/>`

/** The same confetti every time (seeded), kept clear of a central box */
function confetti(seed, count, colors, { avoid = [150, 140, 410, 420], size = 1 } = {}) {
  let s = seed
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  const out = []
  for (let i = 0; i < count; i++) {
    const x = rand() * 560
    const y = rand() * 560
    if (x > avoid[0] && x < avoid[2] && y > avoid[1] && y < avoid[3]) continue
    const c = colors[Math.floor(rand() * colors.length)]
    const rot = Math.round(rand() * 180)
    const kind = rand()
    if (kind < 0.45) out.push(`<rect x="${x}" y="${y}" width="${10 * size}" height="${5 * size}" rx="1.5" fill="${c}" transform="rotate(${rot} ${x} ${y})" opacity=".9"/>`)
    else if (kind < 0.8) out.push(`<circle cx="${x}" cy="${y}" r="${3.5 * size}" fill="${c}" opacity=".9"/>`)
    else out.push(`<path d="M${x} ${y} q5 -6 10 0 t10 0" stroke="${c}" stroke-width="${2.5 * size}" fill="none" stroke-linecap="round" transform="rotate(${rot} ${x} ${y})" opacity=".85"/>`)
  }
  return out.join('')
}

/** Soft sunburst behind the art */
function rays(cx, cy, count, length, opacity = 0.09, color = '#fff') {
  const out = []
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2
    const b = a + Math.PI / count / 1.6
    out.push(`<path d="M${cx} ${cy} L${cx + Math.cos(a) * length} ${cy + Math.sin(a) * length} L${cx + Math.cos(b) * length} ${cy + Math.sin(b) * length}Z" fill="${color}" opacity="${opacity}"/>`)
  }
  return out.join('')
}

/** A paper ticket with a yellow FREE stub */
function ticket(x, y, w, h, angle, { stub = 'FREE', stubColor = '#FFD84D' } = {}) {
  const stubW = w * 0.24
  return `<g transform="rotate(${angle} ${x + w / 2} ${y + h / 2})">
    <rect x="${x + 6}" y="${y + 10}" width="${w}" height="${h}" rx="14" fill="rgba(0,0,0,.18)"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="#fff"/>
    <rect x="${x + w - stubW}" y="${y}" width="${stubW}" height="${h}" rx="14" fill="${stubColor}"/>
    <rect x="${x + w - stubW}" y="${y}" width="16" height="${h}" fill="${stubColor}"/>
    <line x1="${x + w - stubW}" y1="${y + 10}" x2="${x + w - stubW}" y2="${y + h - 10}" stroke="#C9A227" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>
    <circle cx="${x + w - stubW}" cy="${y}" r="11" fill="var(--notch)"/>
    <circle cx="${x + w - stubW}" cy="${y + h}" r="11" fill="var(--notch)"/>
    <rect x="${x + 26}" y="${y + 28}" width="${w * 0.42}" height="13" rx="6.5" fill="#2A5C8F"/>
    <rect x="${x + 26}" y="${y + 52}" width="${w * 0.28}" height="10" rx="5" fill="#BFD0E3"/>
    ${[0, 1, 2, 3, 4].map((i) => `<circle cx="${x + 38 + i * 30}" cy="${y + h - 34}" r="11" fill="none" stroke="#BFD0E3" stroke-width="3"/>`).join('')}
    <text x="${x + w - stubW / 2}" y="${y + h / 2}" dy=".36em" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="${Math.min(30, stubW * 0.36)}" fill="#10294A" transform="rotate(-90 ${x + w - stubW / 2} ${y + h / 2})">${stub}</text>
  </g>`
}

const heartPath = (cx, cy, s) =>
  `M${cx} ${cy + s * 0.9} C${cx - s * 1.5} ${cy - s * 0.1} ${cx - s * 0.9} ${cy - s * 1.25} ${cx} ${cy - s * 0.55} C${cx + s * 0.9} ${cy - s * 1.25} ${cx + s * 1.5} ${cy - s * 0.1} ${cx} ${cy + s * 0.9}Z`

function star(cx, cy, outer, inner, points = 5, rotate = -90) {
  const pts = []
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 ? inner : outer
    const a = ((rotate + (i * 180) / points) * Math.PI) / 180
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`)
  }
  return pts.join(' ')
}

function firework(cx, cy, r, color, spokes = 14) {
  const out = []
  for (let i = 0; i < spokes; i++) {
    const a = (i / spokes) * Math.PI * 2
    const x1 = cx + Math.cos(a) * r * 0.35
    const y1 = cy + Math.sin(a) * r * 0.35
    const x2 = cx + Math.cos(a) * r
    const y2 = cy + Math.sin(a) * r
    out.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="4" stroke-linecap="round"/>`)
    out.push(`<circle cx="${cx + Math.cos(a) * (r + 12)}" cy="${cy + Math.sin(a) * (r + 12)}" r="4" fill="${color}"/>`)
  }
  return `<g opacity=".95">${out.join('')}</g>`
}

function snowflake(x, y, s, opacity = 0.85) {
  const arms = [0, 60, 120].map((a) => `<g transform="rotate(${a} ${x} ${y})"><line x1="${x}" y1="${y - s}" x2="${x}" y2="${y + s}"/><line x1="${x - s * 0.3}" y1="${y - s * 0.75}" x2="${x}" y2="${y - s * 0.5}"/><line x1="${x + s * 0.3}" y1="${y - s * 0.75}" x2="${x}" y2="${y - s * 0.5}"/><line x1="${x - s * 0.3}" y1="${y + s * 0.75}" x2="${x}" y2="${y + s * 0.5}"/><line x1="${x + s * 0.3}" y1="${y + s * 0.75}" x2="${x}" y2="${y + s * 0.5}"/></g>`)
  return `<g stroke="#fff" stroke-width="${Math.max(2, s * 0.12)}" stroke-linecap="round" opacity="${opacity}">${arms.join('')}</g>`
}

function person(cx, cy, r, ring, skin, shirt) {
  const clip = id('face')
  return `<circle cx="${cx}" cy="${cy + 10}" r="${r}" fill="rgba(0,0,0,.2)"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${ring}"/>
    <defs><clipPath id="${clip}"><circle cx="${cx}" cy="${cy}" r="${r - 9}"/></clipPath></defs>
    <circle cx="${cx}" cy="${cy}" r="${r - 9}" fill="#fff"/>
    <g clip-path="url(#${clip})">
      <circle cx="${cx}" cy="${cy - r * 0.18}" r="${r * 0.3}" fill="${skin}"/>
      <ellipse cx="${cx}" cy="${cy + r * 0.62}" rx="${r * 0.58}" ry="${r * 0.42}" fill="${shirt}"/>
    </g>`
}

// ---------- the pictures ----------
// headline: two lines (white, then gold); sub: one short line; bg: gradient; glow: light behind the art

const pictures = [
  {
    key: 'better-luck',
    headline: ['BETTER LUCK', 'NEXT TIME'],
    sub: 'Here’s a free ticket. Try again on us.',
    bg: ['#0B4F3C', '#0F766E'],
    glow: 'rgba(253, 224, 71, .35)',
    art: () => {
      const g = id('gold')
      const holes = []
      for (let i = 0; i <= 6; i++) {
        const a = Math.PI - (i / 6) * Math.PI
        holes.push(`<circle cx="${280 + Math.cos(a) * 96}" cy="${300 + Math.sin(a) * 96}" r="6.5" fill="#8A5A00"/>`)
      }
      const leaf = (a) => `<path d="${heartPath(0, 0, 30)}" fill="#4ADE80" stroke="#E7FBEF" stroke-width="3" transform="translate(150 410) rotate(${a}) translate(0 -26) rotate(180)"/>`
      return `
      ${rays(280, 280, 18, 420, 0.08)}
      <defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF1A8"/><stop offset=".5" stop-color="#F6C000"/><stop offset="1" stop-color="#B07800"/></linearGradient></defs>
      <path d="M184 150 L184 300 A96 96 0 0 0 376 300 L376 150" fill="none" stroke="rgba(0,0,0,.22)" stroke-width="62" transform="translate(8 12)"/>
      <path d="M184 150 L184 300 A96 96 0 0 0 376 300 L376 150" fill="none" stroke="url(#${g})" stroke-width="62"/>
      <rect x="150" y="124" width="68" height="34" rx="8" fill="url(#${g})"/>
      <rect x="342" y="124" width="68" height="34" rx="8" fill="url(#${g})"/>
      ${holes.join('')}
      <circle cx="184" cy="200" r="6.5" fill="#8A5A00"/><circle cx="376" cy="200" r="6.5" fill="#8A5A00"/>
      <circle cx="184" cy="250" r="6.5" fill="#8A5A00"/><circle cx="376" cy="250" r="6.5" fill="#8A5A00"/>
      <path d="M150 410 q-14 60 -50 92" stroke="#2BB673" stroke-width="9" fill="none" stroke-linecap="round"/>
      ${[0, 90, 180, 270].map(leaf).join('')}
      <circle cx="150" cy="410" r="8" fill="#22A55A"/>
      ${ball(430, 420, 62, 'red', 7)}
      ${ball(280, 300, 48, 'blue', 21)}
      ${ball(470, 120, 38, 'yellow', 3)}
      ${sparkle(110, 140, 22)}${sparkle(500, 260, 16)}${sparkle(330, 470, 14)}${sparkle(240, 90, 12)}`
    },
    alt: 'Better luck next time, with a golden horseshoe, a four-leaf clover and lotto balls',
    label: 'Better luck'
  },
  {
    key: 'on-us',
    headline: ['A TICKET', 'ON US'],
    sub: 'A tough run? Have a free ticket from us.',
    bg: ['#272A7A', '#1D4ED8'],
    glow: 'rgba(125, 211, 252, .35)',
    art: () => {
      const canopy = id('canopy')
      const drops = []
      let s = 7
      const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
      for (let i = 0; i < 34; i++) {
        const x = rand() * 560
        const y = rand() * 560
        if (x > 70 && x < 490 && y > 120) continue
        drops.push(`<line x1="${x}" y1="${y}" x2="${x - 7}" y2="${y + 22}" stroke="#BAE6FD" stroke-width="4" stroke-linecap="round" opacity=".75"/>`)
      }
      return `
      ${drops.join('')}
      <defs><linearGradient id="${canopy}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF7A7A"/><stop offset="1" stop-color="#D62839"/></linearGradient></defs>
      <path d="M280 104 L280 420 q0 38 -32 38 q-24 0 -28 -24" stroke="#F8FAFC" stroke-width="14" fill="none" stroke-linecap="round"/>
      <path d="M80 250 A200 160 0 0 1 480 250 A50 32 0 0 0 380 250 A50 32 0 0 0 280 250 A50 32 0 0 0 180 250 A50 32 0 0 0 80 250Z" fill="rgba(0,0,0,.2)" transform="translate(6 10)"/>
      <path d="M80 250 A200 160 0 0 1 480 250 A50 32 0 0 0 380 250 A50 32 0 0 0 280 250 A50 32 0 0 0 180 250 A50 32 0 0 0 80 250Z" fill="url(#${canopy})"/>
      <path d="M280 90 Q228 160 180 250 M280 90 Q332 160 380 250" stroke="#fff" stroke-width="5" fill="none" opacity=".75"/>
      <path d="M280 90 Q160 130 80 250 M280 90 Q400 130 480 250" stroke="#fff" stroke-width="3" fill="none" opacity=".45"/>
      <circle cx="280" cy="86" r="11" fill="#F8FAFC"/>
      ${ball(170, 332, 54, 'yellow', 9)}
      ${ball(392, 340, 50, 'green', 44)}
      ${ball(362, 448, 38, 'orange', 18)}
      ${sparkle(460, 450, 16)}${sparkle(110, 470, 12)}`
    },
    alt: 'A ticket on us, with an umbrella keeping lotto balls dry in the rain',
    label: 'On us'
  },
  {
    key: 'winning-streak',
    headline: ['WINNING', 'STREAK'],
    sub: 'Wins in a row deserve a reward.',
    bg: ['#C2410C', '#9F1239'],
    glow: 'rgba(254, 215, 170, .4)',
    art: () => {
      const flame = id('flame')
      const tick = (x, y) => `<circle cx="${x}" cy="${y}" r="24" fill="#22C55E" stroke="#fff" stroke-width="5"/><path d="M${x - 11} ${y} l7 8 l14 -15" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
      return `
      ${rays(420, 200, 16, 460, 0.08)}
      <defs><linearGradient id="${flame}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FF3D00"/><stop offset=".55" stop-color="#FF9100"/><stop offset="1" stop-color="#FFE57F"/></linearGradient></defs>
      <path d="M420 300 C340 300 330 220 372 170 C370 210 392 222 404 214 C384 160 420 100 470 74 C452 130 500 150 506 206 C512 262 476 300 420 300Z" fill="url(#${flame})" opacity=".95"/>
      <path d="M60 470 L470 210" stroke="rgba(255,255,255,.25)" stroke-width="18" stroke-linecap="round"/>
      <path d="M40 430 L300 266" stroke="rgba(255,255,255,.18)" stroke-width="8" stroke-linecap="round"/>
      ${ball(130, 420, 54, 'blue', 12)}${tick(170, 374)}
      ${ball(270, 336, 60, 'yellow', 27)}${tick(314, 284)}
      ${ball(420, 240, 68, 'green', 64)}${tick(470, 182)}
      ${confetti(11, 40, ['#FFE57F', '#fff', '#FDBA74'], { avoid: [80, 150, 520, 500] })}
      ${sparkle(90, 140, 20)}${sparkle(520, 420, 16)}`
    },
    alt: 'Winning streak, with three lotto balls in a row, each ticked, and a flame',
    label: 'Winning streak'
  },
  {
    key: 'friday',
    headline: ['FREE TICKET', 'FRIDAY'],
    sub: 'Play today. Your next ticket is on us.',
    bg: ['#9D174D', '#6D28D9'],
    glow: 'rgba(251, 207, 232, .35)',
    notch: '#7E22CE',
    art: () => `
      ${rays(280, 280, 16, 420, 0.07)}
      <g transform="rotate(-7 250 250)">
        <rect x="128" y="112" width="250" height="270" rx="26" fill="rgba(0,0,0,.2)" transform="translate(8 12)"/>
        <rect x="128" y="112" width="250" height="270" rx="26" fill="#fff"/>
        <path d="M128 138 a26 26 0 0 1 26 -26 h198 a26 26 0 0 1 26 26 v52 h-250Z" fill="#EF4444"/>
        <text x="253" y="160" dy=".36em" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="30" fill="#fff" letter-spacing="3">FRIDAY</text>
        <rect x="178" y="94" width="14" height="40" rx="7" fill="#334155"/><rect x="314" y="94" width="14" height="40" rx="7" fill="#334155"/>
        <text x="253" y="290" dy=".36em" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="108" fill="#10294A">FRI</text>
      </g>
      ${ticket(270, 330, 250, 130, 9)}
      ${ball(110, 430, 50, 'yellow', 5)}
      ${ball(460, 140, 52, 'blue', 32)}
      ${confetti(5, 46, ['#FDE68A', '#fff', '#F9A8D4', '#A5F3FC'], { avoid: [100, 90, 520, 480] })}`,
    alt: 'Free ticket Friday, with a calendar showing Friday, a free ticket and lotto balls',
    label: 'Friday'
  },
  {
    key: 'giveaway',
    headline: ['FREE TICKET', 'GIVEAWAY'],
    sub: 'Claim yours today.',
    bg: ['#5B21B6', '#BE185D'],
    glow: 'rgba(253, 230, 138, .4)',
    notch: '#86198F',
    art: () => {
      const box = id('box')
      return `
      ${rays(280, 300, 20, 440, 0.08)}
      ${ticket(170, 110, 240, 125, -12)}
      <defs><linearGradient id="${box}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F472B6"/><stop offset="1" stop-color="#BE185D"/></linearGradient></defs>
      <rect x="150" y="300" width="260" height="190" rx="18" fill="rgba(0,0,0,.22)" transform="translate(8 12)"/>
      <rect x="150" y="300" width="260" height="190" rx="18" fill="url(#${box})"/>
      <rect x="262" y="300" width="36" height="190" fill="#FDE047"/>
      <g transform="rotate(-14 280 260)">
        <rect x="128" y="250" width="304" height="58" rx="14" fill="#F9A8D4"/>
        <rect x="262" y="250" width="36" height="58" fill="#FACC15"/>
        <path d="M280 250 C240 200 196 222 224 246 C238 258 262 254 280 250 C298 254 322 258 336 246 C364 222 320 200 280 250Z" fill="#FDE047" stroke="#EAB308" stroke-width="3"/>
      </g>
      <rect x="196" y="508" width="168" height="44" rx="22" fill="#fff"/>
      <text x="280" y="530" dy=".36em" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="22" fill="#6D28D9" letter-spacing="2">CLAIM</text>
      ${ball(90, 250, 46, 'green', 11)}
      ${ball(480, 380, 52, 'orange', 50)}
      ${confetti(21, 60, ['#FDE68A', '#fff', '#A7F3D0', '#BFDBFE'], { avoid: [130, 90, 440, 500] })}
      ${sparkle(470, 110, 20)}${sparkle(80, 420, 14)}`
    },
    alt: 'Free ticket giveaway, with a gift box opening and a free ticket flying out',
    label: 'Giveaway'
  },
  {
    key: 'loyalty',
    headline: ['LOYALTY', 'REWARD'],
    sub: 'Every ticket brings your free one closer.',
    bg: ['#0B3B6F', '#0E7490'],
    glow: 'rgba(165, 243, 252, .35)',
    art: () => {
      const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red', 'blue']
      const slots = []
      for (let i = 0; i < 10; i++) {
        const x = 124 + (i % 5) * 78
        const y = 262 + Math.floor(i / 5) * 86
        if (i < 9) slots.push(ball(x, y, 30, colors[i], i + 1, { shadow: false }))
        else slots.push(`<circle cx="${x}" cy="${y}" r="32" fill="#FEF3C7" stroke="#F59E0B" stroke-width="4" stroke-dasharray="7 6"/><rect x="${x - 15}" y="${y - 6}" width="30" height="22" rx="3" fill="#F59E0B"/><rect x="${x - 18}" y="${y - 14}" width="36" height="10" rx="3" fill="#FBBF24"/><rect x="${x - 3}" y="${y - 14}" width="6" height="30" fill="#DC2626"/>`)
      }
      return `
      ${rays(280, 300, 16, 420, 0.07)}
      <g transform="rotate(-5 280 300)">
        <rect x="70" y="160" width="420" height="246" rx="26" fill="rgba(0,0,0,.22)" transform="translate(8 12)"/>
        <rect x="70" y="160" width="420" height="246" rx="26" fill="#fff"/>
        <text x="104" y="198" dy=".36em" font-family="Poppins" font-weight="800" font-size="22" fill="#0B3B6F" letter-spacing="1.5">EVERY TICKET COUNTS</text>
        <text x="456" y="198" dy=".36em" text-anchor="end" font-family="Poppins" font-weight="700" font-size="18" fill="#0E7490">9 / 10</text>
        ${slots.join('')}
      </g>
      ${ball(500, 92, 44, 'yellow', 20)}
      ${ball(96, 486, 36, 'green', 8)}
      ${sparkle(110, 110, 20)}${sparkle(520, 480, 14)}${sparkle(380, 80, 12)}`
    },
    alt: 'Loyalty reward, with a stamp card nearly full of lotto balls and a gift on the last space',
    label: 'Loyalty'
  },
  {
    key: 'vip',
    headline: ['VIP', 'REWARD'],
    sub: 'A thank-you for our regular players.',
    bg: ['#0B0F1A', '#3A2606'],
    glow: 'rgba(250, 204, 21, .32)',
    art: () => {
      const crown = id('crown')
      return `
      ${rays(280, 300, 22, 460, 0.07, '#FDE68A')}
      <defs><linearGradient id="${crown}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1A8"/><stop offset=".5" stop-color="#F6C000"/><stop offset="1" stop-color="#A86F00"/></linearGradient></defs>
      ${ball(280, 350, 128, 'gold', 'VIP')}
      <g transform="rotate(-8 280 170)">
        <path d="M170 210 L150 110 L218 158 L280 80 L342 158 L410 110 L390 210Z" fill="rgba(0,0,0,.3)" transform="translate(6 10)"/>
        <path d="M170 210 L150 110 L218 158 L280 80 L342 158 L410 110 L390 210Z" fill="url(#${crown})" stroke="#FFF1A8" stroke-width="3" stroke-linejoin="round"/>
        <rect x="164" y="200" width="232" height="30" rx="8" fill="url(#${crown})" stroke="#FFF1A8" stroke-width="3"/>
        <circle cx="150" cy="106" r="12" fill="#F6C000"/><circle cx="280" cy="76" r="13" fill="#F6C000"/><circle cx="410" cy="106" r="12" fill="#F6C000"/>
        <circle cx="280" cy="168" r="14" fill="#E11D48"/><circle cx="214" cy="182" r="10" fill="#2563EB"/><circle cx="346" cy="182" r="10" fill="#16A34A"/>
      </g>
      ${sparkle(96, 150, 24, '#FDE68A')}${sparkle(478, 230, 18, '#FDE68A')}${sparkle(470, 470, 14, '#FDE68A')}${sparkle(110, 440, 12, '#FDE68A')}${sparkle(410, 60, 10, '#FDE68A')}`
    },
    alt: 'VIP reward, with a gold crown on a gold lotto ball',
    label: 'VIP'
  },
  {
    key: 'new-game',
    headline: ['TRY OUR', 'NEW GAME'],
    sub: 'Your free ticket is waiting.',
    bg: ['#1E3A8A', '#0369A1'],
    glow: 'rgba(186, 230, 253, .45)',
    art: () => `
      <path d="M20 -40 L90 -40 L330 466 L150 466Z" fill="#fff" opacity=".1"/>
      <path d="M470 -40 L540 -40 L410 466 L230 466Z" fill="#fff" opacity=".1"/>
      <ellipse cx="280" cy="466" rx="170" ry="30" fill="#fff" opacity=".16"/>
      ${ball(280, 330, 120, 'purple', 90)}
      <g transform="rotate(14 420 170)">
        <polygon points="${star(420, 170, 78, 58, 14)}" fill="#FACC15" stroke="#fff" stroke-width="4"/>
        <text x="420" y="170" dy=".36em" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="34" fill="#B91C1C">NEW</text>
      </g>
      ${ball(96, 210, 40, 'orange', 6)}
      ${ball(480, 420, 44, 'green', 33)}
      ${sparkle(150, 100, 22)}${sparkle(520, 280, 14)}${sparkle(80, 380, 14)}${sparkle(300, 150, 12)}`,
    alt: 'Try our new game, with a lotto ball in a spotlight and a NEW badge',
    label: 'New game'
  },
  {
    key: 'thank-you',
    headline: ['THANK', 'YOU'],
    sub: 'For playing with MaxiLotto. This one is on us.',
    bg: ['#9F1239', '#581C87'],
    glow: 'rgba(253, 164, 175, .4)',
    art: () => {
      const heart = id('heart')
      const ribbon = id('ribbon')
      const hearts = [[90, 130, 16], [480, 120, 20], [500, 430, 14], [70, 400, 12], [400, 500, 10]]
        .map(([x, y, s]) => `<path d="${heartPath(x, y, s)}" fill="#FDA4AF" opacity=".8"/>`).join('')
      return `
      ${rays(280, 300, 18, 440, 0.07)}
      ${hearts}
      <defs>
        <linearGradient id="${heart}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF6B8B"/><stop offset="1" stop-color="#E11D48"/></linearGradient>
        <linearGradient id="${ribbon}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1A8"/><stop offset="1" stop-color="#E0A800"/></linearGradient>
      </defs>
      <path d="${heartPath(280, 300, 150)}" fill="rgba(0,0,0,.22)" transform="translate(8 12)"/>
      <path d="${heartPath(280, 300, 150)}" fill="url(#${heart})" stroke="#fff" stroke-width="6"/>
      <rect x="264" y="185" width="32" height="250" fill="url(#${ribbon})"/>
      <path d="M280 190 C236 132 176 158 210 188 C228 204 258 198 280 190 C302 198 332 204 350 188 C384 158 324 132 280 190Z" fill="url(#${ribbon})" stroke="#C99700" stroke-width="3"/>
      <circle cx="280" cy="190" r="15" fill="#E0A800"/>
      ${ball(120, 470, 46, 'yellow', 14)}
      ${ball(450, 470, 40, 'blue', 72)}
      ${sparkle(380, 110, 18)}${sparkle(170, 110, 12)}`
    },
    alt: 'Thank you, with a heart tied with a gold ribbon and lotto balls',
    label: 'Thank you'
  },
  {
    key: 'refer-friend',
    headline: ['INVITED BY', 'A FRIEND?'],
    sub: 'Join with their code and play on us.',
    bg: ['#047857', '#0E7490'],
    glow: 'rgba(167, 243, 208, .35)',
    notch: '#0B7A6F',
    art: () => `
      ${rays(280, 280, 16, 420, 0.07)}
      <path d="M150 210 C220 90 340 90 410 210" stroke="#fff" stroke-width="6" stroke-dasharray="4 14" stroke-linecap="round" fill="none" opacity=".85"/>
      <path d="M396 186 l18 28 l-32 6" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>
      ${person(130, 280, 92, '#FACC15', '#8D5524', '#2563EB')}
      ${person(430, 280, 92, '#F472B6', '#C68642', '#16A34A')}
      ${ticket(170, 380, 230, 120, -6)}
      <circle cx="430" cy="196" r="24" fill="#22C55E" stroke="#fff" stroke-width="5"/>
      <path d="M430 184 v24 M418 196 h24" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
      ${ball(280, 140, 40, 'orange', 2)}
      ${ball(500, 470, 38, 'purple', 45)}
      ${sparkle(60, 120, 18)}${sparkle(520, 110, 14)}${sparkle(60, 470, 12)}`,
    alt: 'Invited by a friend? Two friends linked by a dotted arrow, with a free ticket',
    label: 'Invited by a friend'
  },
  {
    key: 'promo-code',
    headline: ['GOT A', 'PROMO CODE?'],
    sub: 'Enter it when you sign up.',
    bg: ['#B45309', '#C2410C'],
    glow: 'rgba(254, 240, 138, .4)',
    art: () => `
      ${rays(280, 300, 18, 440, 0.08)}
      <g transform="rotate(-8 280 290)">
        <path d="M80 190 h400 v54 a36 36 0 0 0 0 72 v54 h-400 v-54 a36 36 0 0 0 0 -72Z" fill="rgba(0,0,0,.22)" transform="translate(8 12)"/>
        <path d="M80 190 h400 v54 a36 36 0 0 0 0 72 v54 h-400 v-54 a36 36 0 0 0 0 -72Z" fill="#fff"/>
        <path d="M96 206 h368 v38 a52 52 0 0 0 0 104 v38 h-368 v-38 a52 52 0 0 0 0 -104Z" fill="none" stroke="#FDBA74" stroke-width="3" stroke-dasharray="10 8"/>
        <text x="280" y="246" dy=".36em" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="22" fill="#C2410C" letter-spacing="4">YOUR CODE</text>
        <rect x="150" y="276" width="260" height="70" rx="14" fill="#FFF7ED" stroke="#FB923C" stroke-width="3" stroke-dasharray="8 6"/>
        <text x="280" y="311" dy=".36em" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="40" fill="#10294A" letter-spacing="6">M A X I</text>
      </g>
      <g transform="translate(70 450) rotate(-30)">
        <circle cx="0" cy="0" r="16" fill="none" stroke="#fff" stroke-width="6"/><circle cx="0" cy="44" r="16" fill="none" stroke="#fff" stroke-width="6"/>
        <path d="M12 10 L70 34 M12 34 L70 10" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
      </g>
      ${ball(470, 120, 50, 'blue', 4)}
      ${ball(470, 460, 44, 'green', 81)}
      ${ball(110, 120, 36, 'purple', 29)}
      ${sparkle(300, 90, 18)}${sparkle(300, 500, 14)}`,
    alt: 'Got a promo code? A coupon with a code to cut out',
    label: 'Promo code'
  },
  {
    key: 'festive',
    headline: ['FESTIVE', 'BONUS'],
    sub: 'Free tickets to celebrate the season.',
    bg: ['#991B1B', '#5B0F1F'],
    glow: 'rgba(253, 224, 71, .28)',
    art: () => {
      const bauble = (x, len, r, color, n) => `
        <line x1="${x}" y1="-40" x2="${x}" y2="${len - r - 14}" stroke="#FDE68A" stroke-width="3" opacity=".9"/>
        <rect x="${x - r * 0.28}" y="${len - r - 18}" width="${r * 0.56}" height="${r * 0.3}" rx="3" fill="#E5C158"/>
        ${ball(x, len, r, color, n, { shadow: false })}`
      return `
      ${bauble(130, 250, 62, 'red', 24)}
      ${bauble(290, 360, 78, 'gold', 25)}
      ${bauble(450, 220, 56, 'green', 12)}
      ${bauble(520, 400, 40, 'blue', 31)}
      <polygon points="${star(120, 440, 46, 20)}" fill="#FACC15" stroke="#fff" stroke-width="3"/>
      ${snowflake(60, 150, 22)}${snowflake(400, 90, 16)}${snowflake(470, 500, 20)}${snowflake(200, 500, 14)}${snowflake(380, 250, 12, 0.6)}
      ${sparkle(220, 160, 16)}${sparkle(510, 300, 12)}`
    },
    alt: 'Festive bonus, with lotto balls hanging like baubles, snowflakes and a gold star',
    label: 'Festive'
  },
  {
    key: 'new-year',
    headline: ['NEW YEAR', 'BONUS'],
    sub: 'Start the year with a free ticket.',
    bg: ['#0F172A', '#3B0764'],
    glow: 'rgba(196, 181, 253, .35)',
    art: () => `
      ${firework(140, 140, 70, '#FACC15')}
      ${firework(430, 110, 56, '#F472B6', 12)}
      ${firework(480, 330, 44, '#34D399', 10)}
      ${firework(110, 380, 40, '#60A5FA', 10)}
      <path d="M140 560 q-10 -200 0 -340" stroke="#FACC15" stroke-width="3" stroke-dasharray="2 10" opacity=".6" fill="none"/>
      <path d="M430 560 q20 -240 0 -380" stroke="#F472B6" stroke-width="3" stroke-dasharray="2 10" opacity=".6" fill="none"/>
      ${ball(290, 330, 100, 'yellow', 1)}
      ${ball(190, 470, 50, 'pink', 20)}
      ${ball(400, 470, 46, 'blue', 27)}
      ${confetti(31, 50, ['#FDE68A', '#fff', '#F9A8D4', '#A7F3D0'], { avoid: [170, 200, 420, 520] })}
      ${sparkle(290, 160, 20)}${sparkle(60, 250, 12)}${sparkle(530, 210, 14)}`,
    alt: 'New year bonus, with fireworks and lotto balls',
    label: 'New year'
  }
]

// ---------- the page ----------

const fontFile = (weight) => path.join(site, 'node_modules/@fontsource/poppins/files', `poppins-latin-${weight}-normal.woff2`)
const dataUrl = (file, type) => `data:${type};base64,${fs.readFileSync(file).toString('base64')}`

function page(pic, fonts, logo) {
  ids = 0
  const [from, to] = pic.bg
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    ${fonts}
    * { margin: 0; box-sizing: border-box; }
    body { width: 1200px; height: 600px; overflow: hidden; font-family: Poppins, sans-serif; }
    .card { --notch: ${pic.notch || to}; position: relative; width: 1200px; height: 600px; overflow: hidden;
      background: radial-gradient(circle at 74% 50%, ${pic.glow}, transparent 46%), linear-gradient(120deg, ${from}, ${to}); }
    .dots { position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,.08) 1.6px, transparent 1.7px); background-size: 24px 24px; }
    .words { position: absolute; left: 92px; top: 0; bottom: 0; width: 540px; display: flex; flex-direction: column; justify-content: center; }
    .logo { width: 190px; filter: brightness(0) invert(1); margin-bottom: 30px; }
    h1 { font-weight: 800; line-height: 1.02; letter-spacing: -1px; text-shadow: 0 4px 18px rgba(0,0,0,.18); }
    h1 span { display: block; width: max-content; white-space: nowrap; color: #fff; }
    h1 span + span { color: #FFD84D; }
    p { margin-top: 26px; font-weight: 500; font-size: 28px; line-height: 1.35; color: rgba(255,255,255,.94); max-width: 520px; }
    svg { position: absolute; left: 610px; top: 20px; width: 560px; height: 560px; overflow: visible; }
  </style></head><body><div class="card"><div class="dots"></div>
    <div class="words"><img class="logo" src="${logo}" alt=""><h1>${pic.headline.map((l) => `<span>${l}</span>`).join('')}</h1><p>${pic.sub}</p></div>
    <svg viewBox="0 0 560 560" xmlns="http://www.w3.org/2000/svg">${pic.art()}</svg>
  </div></body></html>`
}

// Both headline lines at one size, as large as fits the 540px column (at most 104px). Run once the font has
// loaded: measured in the fallback font, the lines come out the wrong size.
function fitHeadline() {
  const h1 = document.querySelector('h1')
  for (let size = 104; size >= 40; size -= 2) {
    h1.style.fontSize = `${size}px`
    if ([...h1.children].every((line) => line.getBoundingClientRect().width <= 540)) break
  }
}

async function main() {
  const args = process.argv.slice(2)
  const outAt = args.indexOf('--out')
  const out = outAt >= 0 ? path.resolve(args[outAt + 1]) : path.join(site, 'public/bonus-pictures')
  const wanted = args.filter((a, i) => a !== '--out' && i !== outAt + 1)
  const chosen = wanted.length ? pictures.filter((p) => wanted.includes(p.key)) : pictures
  const unknown = wanted.filter((k) => !pictures.some((p) => p.key === k))
  if (unknown.length) throw new Error(`No picture called ${unknown.join(', ')}. Known: ${pictures.map((p) => p.key).join(', ')}`)

  let puppeteer
  for (const from of [import.meta.url, process.env.PUPPETEER_FROM && pathToFileURL(path.join(process.env.PUPPETEER_FROM, 'x.js')).href].filter(Boolean)) {
    try { puppeteer = createRequire(from)('puppeteer-core'); break } catch { /* try the next place */ }
  }
  if (!puppeteer) throw new Error('puppeteer-core is needed: run "npm i --no-save puppeteer-core", or set PUPPETEER_FROM to a folder that has it.')

  const fonts = [500, 700, 800].map((w) => `@font-face { font-family: Poppins; font-weight: ${w}; src: url(${dataUrl(fontFile(w), 'font/woff2')}) format('woff2'); }`).join('\n')
  const logo = dataUrl(path.join(site, 'public/maxilotto.png'), 'image/png')

  fs.mkdirSync(out, { recursive: true })
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' })
  try {
    const tab = await browser.newPage()
    await tab.setViewport({ width: 1200, height: 600, deviceScaleFactor: 1 })
    for (const pic of chosen) {
      await tab.setContent(page(pic, fonts, logo), { waitUntil: 'load' })
      await tab.evaluate(() => document.fonts.ready)
      await tab.evaluate(fitHeadline)
      const file = path.join(out, `${pic.key}.jpg`)
      await tab.screenshot({ path: file, type: 'jpeg', quality: 86, clip: { x: 0, y: 0, width: 1200, height: 600 } })
      console.log(`${pic.key}.jpg  ${Math.round(fs.statSync(file).size / 1024)} KB  "${pic.label}": ${pic.alt}`)
    }
  } finally {
    await browser.close()
  }
}

export { pictures }

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error(e.message); process.exit(1) })
}
