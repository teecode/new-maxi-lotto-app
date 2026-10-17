import type { GuideContent } from './types'

// The figures the site advertises. The hero slides (components/hero-carousel.tsx)
// read them from here too, so a change of offer is made in one place. The bonus
// actually paid is set in the back office (Bonus records), so keep these in step with it.
export const PROMO = {
  firstDepositBonus: '50%',
  laterDepositBonus: '10%',
  referralCommission: '20%',
  agentCommission: '35%',
}

export const PROMOTIONS_GUIDE: GuideContent = {
  title: 'Promotions',
  subtitle: 'MaxiLotto bonuses, referral rewards and agent commission',
  intro:
    'Current MaxiLotto offers for players, ambassadors and agents. Every promotion has terms, can change or end, and bonus winnings may have to be played through before you can withdraw them.',
  sections: [
    {
      id: 'deposit-bonus',
      heading: `${PROMO.firstDepositBonus} first deposit bonus`,
      blocks: [
        {
          type: 'p',
          text: `Get a ${PROMO.firstDepositBonus} bonus on your very first deposit, then ${PROMO.laterDepositBonus} on every deposit after that while the offer runs. Fund your wallet by bank transfer, card or USSD and any bonus you qualify for is shown in your wallet.`,
        },
        {
          type: 'steps',
          items: [
            '[Create a free account](/auth/signup). You must be 18 or older.',
            '[Deposit](/deposit) into your wallet by bank transfer, card or USSD.',
            'Play any 5/90 draw from [Play 5/90](/play).',
          ],
        },
      ],
    },
    {
      id: 'ambassador',
      heading: `Ambassador programme: up to ${PROMO.referralCommission} commission`,
      blocks: [
        {
          type: 'p',
          text: `Invite friends with your referral link and earn up to ${PROMO.referralCommission} commission on their activity. Find your link under Profile Settings → Referral. Terms and conditions apply.`,
        },
      ],
    },
    {
      id: 'agent-commission',
      heading: `Agents: up to ${PROMO.agentCommission} commission`,
      blocks: [
        {
          type: 'p',
          text: `Own a shop? Sell MaxiLotto to your customers and earn up to ${PROMO.agentCommission} commission on every ticket. [Apply to become an agent](/become-an-agent) in about five minutes.`,
        },
      ],
    },
    {
      id: 'terms',
      heading: 'The rules that apply',
      blocks: [
        {
          type: 'list',
          items: [
            'Promotions can be changed, paused or withdrawn at any time; see section 8 of the [Terms and Conditions](/terms-and-condition).',
            'Winnings from bonuses may need wagering before withdrawal; see the [Withdrawal Policy](/withdrawal-policy).',
            'Bonuses gained through fraud or abuse are cancelled.',
            'MaxiLotto is for adults 18 and over. Please [play responsibly](/responsible-gambling).',
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: 'How do I get the MaxiLotto first deposit bonus?',
      answer: `Create an account and make your first deposit while the offer is running. The ${PROMO.firstDepositBonus} bonus you qualify for appears in your wallet.`,
    },
    {
      question: 'Can I withdraw my bonus?',
      answer: 'Winnings from bonuses may have wagering requirements to meet before withdrawal. The Withdrawal Policy explains the rules.',
    },
    {
      question: 'How does the MaxiLotto referral programme work?',
      answer: `Share your referral link from Profile Settings → Referral. Friends who sign up with it become your downline, and you earn up to ${PROMO.referralCommission} commission on their activity.`,
    },
  ],
}
