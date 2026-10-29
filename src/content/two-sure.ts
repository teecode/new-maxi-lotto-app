import type { GuideContent } from './types'

// Odds and examples match the How to Play page (routes/_layout/how-to-play.tsx).
// The chance of a 2 Direct line winning is exact for a 5/90 draw:
// (5/90) × (4/89) = 1 in 400.5.

/** 2 Direct (2 Sure) and Perm 2 pay this many times the stake per winning line. */
export const TWO_DIRECT_ODDS = 240

export const TWO_SURE_GUIDE: GuideContent = {
  title: '2 Sure Lotto',
  subtitle: 'How to play 2 Sure (NAP 2), with Perm and Banker',
  toc: true,
  intro:
    '"2 sure" is one of the most played lotto bets in Nigeria: you pick two numbers you believe will both come out in the next draw. At MaxiLotto it is called 2 Direct (also known as NAP 2), and every winning line pays 240 times your stake. This guide covers how 2 Sure works, how to cover more pairs with a Perm or a Banker, and what your real chances are.',
  sections: [
    {
      id: 'what-is-2-sure',
      heading: 'What is 2 Sure?',
      blocks: [
        {
          type: 'p',
          text: 'In a 5/90 draw, five winning numbers come out of 1 to 90. A 2 Sure line wins when both of the numbers you picked are among those five. Their order and position do not matter.',
        },
        {
          type: 'terms',
          items: [
            { term: 'You pick', text: '12 and 88, with ₦100 on the line.' },
            { term: 'The draw', text: '05, 12, 34, 88, 71. Both 12 and 88 are there.' },
            { term: 'You win', text: '₦100 × 240 = ₦24,000, paid into your MaxiLotto wallet.' },
            { term: 'If only one drops', text: 'The line loses. Both numbers must come out.' },
          ],
        },
      ],
    },
    {
      id: 'how-to-play-2-sure',
      heading: 'How to play 2 Sure on MaxiLotto',
      blocks: [
        {
          type: 'steps',
          items: [
            '[Log in](/auth/login) or [create a free account](/auth/signup), and fund your wallet.',
            "Open [Play 5/90](/play) and choose one of today's draws.",
            'Pick your two numbers and choose the 2 Direct bet type.',
            'Choose Normal (winning numbers), Machine (machine numbers) or Double Chance where the game offers them.',
            'Enter your stake per line and confirm the ticket.',
          ],
        },
      ],
    },
    {
      id: 'perm-2',
      heading: 'Cover more pairs with a Perm',
      blocks: [
        {
          type: 'p',
          text: 'A Perm 2 takes a pool of numbers and plays every pair in it as its own 2 Direct line. More numbers means more lines, and more lines cost more, because you pay your stake on each one. The number of lines is n × (n − 1) ÷ 2 for a pool of n numbers.',
        },
        {
          type: 'table',
          head: ['Numbers in your perm', 'Lines', 'Cost at ₦100 per line'],
          rows: [
            ['3', '3', '₦300'],
            ['4', '6', '₦600'],
            ['5', '10', '₦1,000'],
            ['6', '15', '₦1,500'],
            ['8', '28', '₦2,800'],
            ['10', '45', '₦4,500'],
          ],
        },
        {
          type: 'p',
          text: 'Every pair from your pool that drops pays 240 times the stake. With 10, 20, 30 and 40 in a perm (6 lines) and 10, 30 and 40 in the draw, three pairs win: 10-30, 10-40 and 30-40, so ₦100 per line returns ₦72,000.',
        },
      ],
    },
    {
      id: 'banker',
      heading: 'Banker: one strong number against the rest',
      blocks: [
        {
          type: 'p',
          text: 'If you feel sure about one number, make it your banker and play it against others. Each banker-and-number pair is a line, and you win on every line where the banker drops together with that number.',
        },
        {
          type: 'p',
          text: 'Banker 7 against 15, 23 and 42 is three lines. If 7 and 23 both drop, one line wins: ₦100 × 240 = ₦24,000. If 7 does not drop, none of the lines can win.',
        },
      ],
    },
    {
      id: 'machine-and-double-chance',
      heading: '2 Sure on machine numbers, or both',
      blocks: [
        {
          type: 'p',
          text: 'On games that allow it, a Machine bet checks your 2 Sure against the five machine numbers instead of the winning numbers. Double Chance plays the same pair both ways: half your stake on the winning numbers and half on the machine numbers, each settled on its own.',
        },
      ],
    },
    {
      id: 'chances',
      heading: 'Your real chances: there is no "sure" 2 Sure',
      blocks: [
        {
          type: 'p',
          text: 'Whatever the name says, no pair is ever certain. In a fair 5/90 draw the chance that any two numbers you choose are both among the five winners is about 1 in 400 per line. Past results do not change the next draw.',
        },
        {
          type: 'note',
          text: 'Anyone selling "sure 2 sure", "banker of the week" or "fixed" numbers is selling something they cannot know. Set a budget, play for fun, and never stake money you need.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'What does 2 sure mean in lotto?',
      answer:
        'It means two numbers that must both come out among the five winning numbers. At MaxiLotto it is the 2 Direct bet type, also called NAP 2.',
    },
    {
      question: 'How much does 2 sure pay at MaxiLotto?',
      answer: 'A winning 2 Direct line pays 240 times your stake per line, so ₦100 wins ₦24,000 and ₦1,000 wins ₦240,000.',
    },
    {
      question: 'Is 2 sure the same as NAP 2?',
      answer: 'Yes. 2 Sure, NAP 2 and 2 Direct are names for the same bet: two numbers, both must drop.',
    },
    {
      question: 'How many lines are in a perm of 5 numbers?',
      answer: 'Ten. A Perm 2 of n numbers has n × (n − 1) ÷ 2 lines, so 5 numbers give 10 pairs.',
    },
    {
      question: 'What are the chances of winning a 2 sure?',
      answer: 'About 1 in 400 per line in a fair 5/90 draw. Covering more pairs with a perm raises your chances, but every extra line costs another stake.',
    },
    {
      question: 'Can I play 2 sure on machine numbers?',
      answer: 'Yes, on games that allow Machine bets. You can also play Double Chance to cover the winning and machine numbers with one bet.',
    },
  ],
}
