import type { ContentSection } from './types'

// Text under the results table. People searching for "lotto result today" or another
// brand's results land here, so it says plainly what this page shows and what it does not.

export const RESULTS_SECTIONS: ContentSection[] = [
  {
    id: 'about-maxilotto-results',
    heading: 'About MaxiLotto results',
    blocks: [
      {
        type: 'p',
        text: 'Every MaxiLotto draw publishes five winning numbers from 1 to 90 and, on games that have them, five machine numbers. Results appear here as soon as each draw is published, and you can look up past draws by game and date.',
      },
      {
        type: 'p',
        text: "Wins on online tickets are checked and credited to your wallet automatically. Bought your ticket at a MaxiLotto shop? Take it back to the shop to be paid. The next draws are on [Today's Games](/games).",
      },
    ],
  },
  {
    id: 'winning-vs-machine-numbers',
    heading: 'Winning numbers and machine numbers',
    blocks: [
      {
        type: 'p',
        text: 'Normal bets are checked against the winning numbers, Machine bets against the machine numbers, and Double Chance against both, with half the stake on each. [How to Play](/how-to-play) explains every bet type and its odds, and the [2 Sure guide](/2-sure-lotto) covers 2 Sure, Perm and Banker.',
      },
    ],
  },
  {
    id: 'other-brands-results',
    heading: 'Looking for Baba Ijebu, Golden Chance or Green Lotto results?',
    blocks: [
      {
        type: 'p',
        text: 'Premier Lotto (Baba Ijebu), Golden Chance and Green Lotto publish their results on their own official channels, and their results only decide their own tickets. This page shows MaxiLotto draws only. See [how MaxiLotto compares](/lotto-in-nigeria#maxilotto-vs-baba-ijebu-golden-chance-green-lotto) with those brands.',
      },
    ],
  },
]
