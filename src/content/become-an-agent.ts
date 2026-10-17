import type { ContentSection, FaqEntry } from './types'

// Facts here mirror the application form in routes/_layout/become-an-agent.tsx
// (required fields, Delta State only, review time) and the agent offer on the
// home page (up to 35% commission). Update both together.

export const AGENT_GUIDE_TITLE = 'How to become a MaxiLotto lotto agent in Nigeria'

export const AGENT_GUIDE_INTRO =
  'Running a lotto outlet is one of the simplest ways to add steady income to a shop in Nigeria. As a MaxiLotto agent you sell 5/90 lotto tickets to your customers, pay out their wins, and earn commission on every ticket you sell.'

export const AGENT_GUIDE_SECTIONS: ContentSection[] = [
  {
    id: 'why-become-an-agent',
    heading: 'Why sell MaxiLotto',
    blocks: [
      {
        type: 'list',
        items: [
          'Earn up to 35% commission on tickets sold (terms and conditions apply).',
          'Applying is free and takes about five minutes online.',
          'Sell from a PC with a receipt printer using the MaxiLotto web POS, or from a MaxiLotto lotto terminal.',
          'Daily 5/90 draws with published odds, results and machine numbers your customers already understand.',
          'Support from the MaxiLotto team whenever you need it.',
        ],
      },
    ],
  },
  {
    id: 'bet-shop-or-terminal',
    heading: 'Bet shop or lotto terminal?',
    blocks: [
      {
        type: 'terms',
        items: [
          {
            term: 'Bet shop',
            text: 'For people who already run a betting or business shop. Bet shop activation can usually be completed within a day.',
          },
          {
            term: 'Lotto terminals',
            text: 'For agents who want dedicated MaxiLotto terminals. Setup takes longer because of compliance checks and due diligence.',
          },
        ],
      },
    ],
  },
  {
    id: 'requirements',
    heading: 'What you need to apply',
    blocks: [
      {
        type: 'list',
        items: [
          'Your full name, date of birth, phone number, WhatsApp number, email and residential address.',
          'Your NIN and BVN, plus a valid ID: driver\'s licence, voter\'s card, international passport or National Identity Number. You can also upload the ID, a passport photograph and a utility bill.',
          'Your proposed agency name, the shop or business address, state, LGA and preferred sales territory.',
          'A Nigerian bank account for your earnings.',
        ],
      },
      {
        type: 'note',
        text: 'MaxiLotto is currently appointing agents in Delta State, with more states to follow.',
      },
    ],
  },
  {
    id: 'how-to-apply',
    heading: 'How to apply',
    blocks: [
      {
        type: 'steps',
        items: [
          'Choose bet shop or lotto terminals and enter your personal details.',
          'Add your KYC details: NIN, BVN and ID.',
          'Tell us about your business: agency name, shop address, state, LGA and territory.',
          'Add your bank account. The account name is confirmed automatically.',
          'Submit and save your reference number. The MaxiLotto team reviews every application and contacts you within 3 to 5 business days.',
        ],
      },
    ],
  },
]

export const AGENT_FAQ: FaqEntry[] = [
  {
    question: 'How much does it cost to become a MaxiLotto agent?',
    answer: 'Applying is free. Our team will explain any setup requirements for your outlet when it reviews your application.',
  },
  {
    question: 'How much commission do MaxiLotto agents earn?',
    answer: 'Agents earn up to 35% commission on tickets sold. Terms and conditions apply.',
  },
  {
    question: 'Which states can I apply from?',
    answer: 'MaxiLotto is currently appointing agents in Delta State. More states will open over time.',
  },
  {
    question: 'How long does approval take?',
    answer:
      'The team contacts you within 3 to 5 business days. Once approved, a bet shop can usually be activated within a day; lotto terminals take longer because of compliance checks.',
  },
  {
    question: 'Can I sell MaxiLotto from my existing betting shop?',
    answer:
      'Yes. Choose "Bet Shop" on the application. MaxiLotto runs on a normal PC with a receipt printer through the MaxiLotto web POS.',
  },
]
