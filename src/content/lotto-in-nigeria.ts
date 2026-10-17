import type { GuideContent } from './types'

// Competitor names are used only to describe and compare. Keep every statement
// about other operators neutral and verifiable: no claims about their odds,
// payouts or licences, and nothing that suggests MaxiLotto is connected to them.

export const LOTTO_GUIDE: GuideContent = {
  title: 'Lotto in Nigeria',
  subtitle: 'Baba Ijebu, Golden Chance, Green Lotto and playing 5/90 online',
  toc: true,
  intro:
    'Lotto is one of the most popular games of chance in Nigeria. Whether you grew up hearing about Baba Ijebu, check Golden Chance results after work or follow Green Lotto draws, the game underneath is almost always the same: 5/90 lotto. This guide explains how 5/90 works, the brands you will hear about, how they compare with MaxiLotto, what the common bet names mean, how results work, and how to play 5/90 online.',
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
      id: 'lotto-brands-in-nigeria',
      heading: 'The lotto names you hear in Nigeria',
      blocks: [
        {
          type: 'p',
          text: 'Several lotto brands are household names in Nigeria. They are separate companies, each with its own draws, results, odds and agents. Here is a short, neutral overview.',
        },
        {
          type: 'terms',
          items: [
            {
              id: 'premier-lotto-baba-ijebu',
              term: 'Premier Lotto (Baba Ijebu)',
              text: 'One of the oldest and best-known lotto brands in Nigeria, widely known by the nickname Baba Ijebu. Its 5/90 draws are sold through a large network of agents.',
            },
            {
              id: 'golden-chance-lotto',
              term: 'Golden Chance Lotto',
              text: 'A well-known Nigerian lotto brand that runs its own 5/90 draws, sold through agents and lotto shops.',
            },
            {
              id: 'green-lotto',
              term: 'Green Lotto',
              text: 'Another Nigerian lotto brand built on the 5/90 format, with its own draws and results.',
            },
            {
              id: 'maxilotto',
              term: 'MaxiLotto',
              text: 'A 5/90 lotto brand of LukzerNet Nigeria Limited. You can play online at maxilotto.ng, on the [MaxiLotto Android app](/download-app) or at MaxiLotto shops, and the odds for every bet type are published on the [How to Play](/how-to-play) page.',
            },
          ],
        },
        {
          type: 'p',
          text: 'If you can play one of these, you can play the others: the numbers, the 5/90 format and most bet types are the same. What changes from brand to brand is the draw schedule, the odds each operator pays, and how you buy a ticket and collect a win.',
        },
      ],
    },
    {
      id: 'maxilotto-vs-baba-ijebu-golden-chance-green-lotto',
      heading: 'MaxiLotto vs Baba Ijebu, Golden Chance and Green Lotto',
      blocks: [
        {
          type: 'p',
          text: 'All four are 5/90 lotto brands, so the game itself is the same. The differences are in how you play, what is published and which extra bets you can place. Here is what you get at MaxiLotto next to what most Nigerian lotto players are used to from the big retail brands.',
        },
        {
          type: 'table',
          head: ['', 'What players are used to', 'At MaxiLotto'],
          rows: [
            ['The game', '5/90: five winning numbers from 1 to 90', 'The same 5/90 game'],
            ['Bet types', 'Direct (2 Sure, NAP 3), Perm, Banker and Against', 'All of these, plus Machine bets, Double Chance and accumulators'],
            ['Where you play', 'At a lotto agent or shop', 'Online at maxilotto.ng, on the Android app, or at MaxiLotto shops'],
            ['Odds', 'Set by each operator', 'Published for every bet type: 2 Direct 240x, 3 Direct 2,100x, 5 Direct 44,000x'],
            ['Results', "On each operator's own channels", 'On the Results page after every draw, with winning and machine numbers'],
            ['Getting paid', 'Usually collected from the agent who sold the ticket', 'Online wins go to your wallet automatically, and you withdraw to your bank'],
          ],
        },
        {
          type: 'note',
          text: "This comparison describes MaxiLotto and common lotto practice in Nigeria. For another brand's exact odds, draw times and online options, check that operator's official channels.",
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
      heading: 'Checking results: Baba Ijebu, Golden Chance, Green Lotto and MaxiLotto',
      blocks: [
        {
          type: 'p',
          text: 'Each operator draws and publishes its own results. A Premier Lotto (Baba Ijebu), Golden Chance or Green Lotto result only decides tickets bought from that operator, and a MaxiLotto result only decides MaxiLotto tickets.',
        },
        {
          type: 'p',
          text: "For another brand's results, use that operator's official channels. MaxiLotto results, with the winning numbers and any machine numbers, are on the [Results](/results) page as soon as each draw is published, and the times of today's draws are on [Today's Games](/games).",
        },
        {
          type: 'note',
          text: 'Be careful with anyone selling "sure banker" numbers or "fixed" results for any brand. Lotto draws are random; nobody can sell you a guaranteed number.',
        },
      ],
    },
    {
      id: 'online-or-shop',
      heading: 'Playing online or at a lotto shop',
      blocks: [
        {
          type: 'p',
          text: 'Most Nigerian players have bought tickets from a lotto agent or shop. Playing online works the same way, but from your phone:',
        },
        {
          type: 'list',
          items: [
            'Fund a wallet by bank transfer, card or USSD instead of paying cash.',
            'Your tickets are stored in your account, so there is no paper slip to lose.',
            'Online wins are credited to your MaxiLotto wallet automatically, and you can withdraw to your bank account.',
            'You can play from anywhere in Nigeria, on the website or the [Android app](/download-app).',
          ],
        },
        {
          type: 'p',
          text: 'If you prefer cash, MaxiLotto also sells tickets through MaxiLotto shops. Shop owners who want to sell MaxiLotto can [become an agent](/become-an-agent).',
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
      heading: 'Play responsibly, whichever brand you choose',
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
      question: 'Is MaxiLotto the same as Baba Ijebu or Premier Lotto?',
      answer:
        'No. MaxiLotto is a separate lotto brand operated by LukzerNet Nigeria Limited. It is not part of, or affiliated with, Premier Lotto (Baba Ijebu), Golden Chance or Green Lotto.',
    },
    {
      question: 'Which is better, MaxiLotto or Baba Ijebu?',
      answer:
        'They play the same 5/90 game. MaxiLotto adds online play with a wallet, an Android app, published odds for every bet type, Machine bets, Double Chance and accumulators. Choose whichever suits how you like to play, and only play with money you can afford to lose.',
    },
    {
      question: 'Can I check Baba Ijebu, Golden Chance or Green Lotto results on MaxiLotto?',
      answer:
        'No. MaxiLotto publishes only the results of its own draws. Other brands publish their results through their own official channels.',
    },
    {
      question: 'Can I play my usual Baba Ijebu numbers on MaxiLotto?',
      answer:
        'Yes. Any numbers from 1 to 90 can be played on MaxiLotto with the same bet types you know, such as 2 Direct, Perm, Banker and Against. Your ticket is decided by the MaxiLotto draw you choose.',
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
  disclaimer:
    'Premier Lotto, Baba Ijebu, Golden Chance and Green Lotto are names and trademarks of their respective owners. MaxiLotto is not affiliated with, endorsed by or connected to them; the names are used only to describe and compare.',
}
