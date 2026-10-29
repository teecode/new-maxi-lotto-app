import type { GuideContent } from './types'

// Deliberately names no other lotto brand: the legal position on naming competitors
// is still being confirmed. Talk about "other operators" or "a lotto shop" instead.
// (A version that named and compared brands is in git history, commit 2984564.)

export const LOTTO_GUIDE: GuideContent = {
  title: 'Lotto in Nigeria',
  subtitle: 'How 5/90 works, what the bet names mean, and playing online',
  toc: true,
  intro:
    'Lotto is one of the most popular games of chance in Nigeria, and almost every brand you will see at a lotto shop runs the same game underneath: 5/90 lotto. This guide explains how 5/90 works, what the common bet names mean, how results work, how playing online compares with buying from a lotto shop, and how to play 5/90 online with MaxiLotto.',
  sections: [
    {
      id: 'what-is-5-90-lotto',
      heading: 'What is 5/90 lotto?',
      blocks: [
        {
          type: 'p',
          text: 'In 5/90 lotto, five winning numbers are drawn from the numbers 1 to 90. You choose your own numbers, a bet type and a stake, and you win when your numbers match the draw the way your bet type requires.',
        },
        {
          type: 'p',
          text: 'Many draws also publish five machine numbers next to the five winning numbers. Some players bet on those instead. At MaxiLotto that is a Machine bet, and Double Chance plays the same selection on both sets at once.',
        },
        {
          type: 'p',
          text: 'Your return is your stake per line multiplied by the odds for the bet type. At MaxiLotto, for example, a 2 Direct line pays 240 times the stake, so ₦100 returns ₦24,000 if both of your numbers drop.',
        },
      ],
    },
    {
      id: 'one-game-many-brands',
      heading: 'One game, many brands',
      blocks: [
        {
          type: 'p',
          text: 'Nigeria has several lotto brands, each a separate company with its own draws, results, odds and agents. Most are built on the same 5/90 format, so if you can play one, you can play the others: the numbers, the draw and most bet names are the same.',
        },
        {
          type: 'p',
          text: 'What changes from brand to brand is the draw schedule, the odds each operator pays, and how you buy a ticket and collect a win. MaxiLotto is a 5/90 lotto brand of LukzerNet Nigeria Limited that you can play online at maxilotto.ng, on the [MaxiLotto Android app](/download-app) or at MaxiLotto shops, and the odds for every bet type are published on [How to Play](/how-to-play).',
        },
      ],
    },
    {
      id: 'lotto-shop-or-online',
      heading: 'Lotto shop or MaxiLotto online: what changes',
      blocks: [
        {
          type: 'table',
          head: ['', 'Buying at a lotto shop', 'Playing on MaxiLotto'],
          rows: [
            ['The game', '5/90: five winning numbers from 1 to 90', 'The same 5/90 game'],
            ['Bet types', 'Direct (2 Sure, NAP 3), Perm, Banker and Against', 'All of these, plus Machine bets, Double Chance and accumulators'],
            ['Where you play', 'At the shop, while it is open', 'Online at maxilotto.ng or on the Android app, and at MaxiLotto shops'],
            ['Your ticket', 'A paper slip you have to keep safe', 'Stored in your account'],
            ['Odds', 'Set by each operator', 'Published for every bet type: 2 Direct 240x, 3 Direct 2,100x, 5 Direct 44,000x'],
            ['Results', "On the operator's own channels", 'On the Results page after every draw, with winning and machine numbers'],
            ['Getting paid', 'Collected from the agent who sold the ticket', 'Online wins go to your wallet automatically, and you withdraw to your bank'],
          ],
        },
        {
          type: 'p',
          text: 'Prefer cash? MaxiLotto also sells tickets through MaxiLotto shops, and shop owners who want to sell MaxiLotto can [become an agent](/become-an-agent).',
        },
      ],
    },
    {
      id: 'lotto-bet-types',
      heading: '2 Sure, NAP, Perm, Banker and Against: what the bet names mean',
      blocks: [
        {
          type: 'p',
          text: 'Nigerian players use their own names for bets. This is how the common ones map to MaxiLotto bet types, with what each pays at MaxiLotto on a ₦100 stake per line.',
        },
        {
          type: 'table',
          head: ['What players call it', 'How it works', 'MaxiLotto odds', 'Win on ₦100'],
          rows: [
            ['1 Direct (first ball)', 'Pick 1 number. It must be the very first ball drawn.', '40x', '₦4,000'],
            ['2 Sure / NAP 2 / 2 Direct', 'Pick 2 numbers. Both must be among the 5 winning numbers.', '240x', '₦24,000'],
            ['NAP 3 / 3 Direct', 'Pick 3 numbers. All 3 must be among the 5 winning numbers.', '2,100x', '₦210,000'],
            ['4 Direct', 'Pick 4 numbers. All 4 must drop.', '4,000x', '₦400,000'],
            ['5 Direct', 'Pick 5 numbers. All 5 must drop.', '44,000x', '₦4,400,000'],
            ['Perm (Perm 2)', 'Pick a pool of numbers. Every pair in the pool is played as its own line.', '240x per winning pair', '₦24,000 per pair'],
            ['Banker', 'One "banker" number paired against other numbers. You win when the banker drops with any of them.', '240x per match', '₦24,000 per match'],
            ['Against', 'Group A against Group B. Each number from A that drops with a number from B is a win.', '240x per pair', '₦24,000 per pair'],
          ],
        },
        {
          type: 'p',
          text: 'On games that allow it, you can play against the machine numbers instead of the winning numbers (a Machine bet), and single bets can be played as Double Chance, which splits the stake evenly between the two sets. See the full rules on [How to Play](/how-to-play), or the [2 Sure guide](/2-sure-lotto) for 2 Sure, Perm and Banker in detail.',
        },
      ],
    },
    {
      id: 'lotto-results',
      heading: 'Checking lotto results',
      blocks: [
        {
          type: 'p',
          text: "Every lotto operator draws and publishes its own results, and a result only decides tickets bought from that operator. Another brand's draw does not decide a MaxiLotto ticket, and a MaxiLotto draw does not decide anyone else's.",
        },
        {
          type: 'p',
          text: "MaxiLotto results, with the winning numbers and any machine numbers, are on the [Results](/results) page as soon as each draw is published, and the times of today's draws are on [Today's Games](/games).",
        },
        {
          type: 'note',
          text: 'Be careful with anyone selling "sure banker" numbers or "fixed" results. Lotto draws are random; nobody can sell you a guaranteed number.',
        },
      ],
    },
    {
      id: 'how-to-start',
      heading: 'How to play 5/90 online with MaxiLotto',
      blocks: [
        {
          type: 'steps',
          items: [
            '[Create a free account](/auth/signup) with your phone number and email. You must be 18 or older.',
            'Fund your wallet by bank transfer, card or USSD.',
            "Open [Play 5/90](/play), choose one of today's draws and pick your numbers.",
            'Choose a bet type such as 2 Direct, Perm or Banker, choose Normal, Machine or Double Chance where the game offers them, and set your stake per line.',
            'Confirm your ticket, then follow the draw and check [Results](/results).',
          ],
        },
      ],
    },
    {
      id: 'play-responsibly',
      heading: 'Play responsibly',
      blocks: [
        {
          type: 'list',
          items: [
            'Lotto is for adults 18 and over only.',
            'Set a budget before you play and never stake money you need for rent, food or school fees.',
            'Do not chase losses. Every draw is independent of the last one.',
            'Take a break if lotto stops being fun. Our [Responsible Gaming](/responsible-gambling) page explains the tools and support available.',
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Is MaxiLotto connected to other lotto brands?',
      answer:
        'No. MaxiLotto is a separate lotto brand operated by LukzerNet Nigeria Limited, and it is not affiliated with any other lotto operator.',
    },
    {
      question: "Can I check other lotto brands' results on MaxiLotto?",
      answer:
        'No. MaxiLotto publishes only the results of its own draws. Other operators publish their results through their own official channels.',
    },
    {
      question: 'Can I play my usual numbers on MaxiLotto?',
      answer:
        'Yes. Any numbers from 1 to 90 can be played with the bet types you already know, such as 2 Direct, Perm, Banker and Against. Your ticket is decided by the MaxiLotto draw you choose.',
    },
    {
      question: 'Is it better to play lotto online or at a shop?',
      answer:
        'It is the same 5/90 game either way. Online, your tickets are stored in your account and wins go to your wallet automatically; at a shop you pay cash and keep a paper slip. Choose whichever suits you, and only play with money you can afford to lose.',
    },
    {
      question: 'What is 2 sure in lotto?',
      answer:
        '"2 sure" is the street name for a 2 Direct bet, also called NAP 2: you pick two numbers and both must be among the five winning numbers. At MaxiLotto a 2 Direct line pays 240 times your stake. The [2 Sure guide](/2-sure-lotto) explains it in full.',
    },
    {
      question: 'What are machine numbers in lotto?',
      answer:
        'Machine numbers are a second set of five numbers published with a draw. On MaxiLotto games that allow it, you can bet on them with a Machine bet, or on both sets at once with Double Chance.',
    },
    {
      question: 'How do I become a lotto agent in Nigeria?',
      answer:
        'Each operator recruits its own agents. To sell MaxiLotto, apply online on the MaxiLotto [Become an Agent](/become-an-agent) page with your personal, identity, business and bank details.',
    },
  ],
}
