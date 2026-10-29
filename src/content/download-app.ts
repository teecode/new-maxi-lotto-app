import type { GuideContent } from './types'

/** Served from the site itself (IIS has a MIME type for .apk in public/web.config). */
export const APK_URL = '/downloads/maxilotto.apk'

export const DOWNLOAD_APP_GUIDE: GuideContent = {
  title: 'MaxiLotto App',
  subtitle: 'Download the official MaxiLotto app for Android',
  intro:
    'Play 5/90 lotto, check results and manage your wallet from the MaxiLotto app. It uses the same account as maxilotto.ng, so your balance, tickets and history are already there when you log in.',
  sections: [
    {
      id: 'what-you-can-do',
      heading: 'What you can do in the app',
      blocks: [
        {
          type: 'list',
          items: [
            "Play every MaxiLotto 5/90 draw: Direct (2 Sure, NAP 3), Perm, Banker, Against, Machine and Double Chance.",
            'Check results and your tickets as soon as each draw is published.',
            'Fund your wallet and withdraw your winnings to your bank account.',
            'Use the same login as the website.',
          ],
        },
      ],
    },
    {
      id: 'install-on-android',
      heading: 'How to install it on Android',
      blocks: [
        {
          type: 'steps',
          items: [
            'Tap the download button on this page.',
            'Open the downloaded file (maxilotto.apk) from your notifications or your Downloads folder.',
            'If Android asks, allow your browser to install apps: Settings → Apps → Special app access → Install unknown apps.',
            'Tap Install, then open MaxiLotto and log in with your MaxiLotto username and password.',
          ],
        },
      ],
    },
    {
      id: 'download-safely',
      heading: 'Download it safely',
      blocks: [
        {
          type: 'p',
          text: 'The official MaxiLotto app is the one on this page, at maxilotto.ng. Avoid copies from other websites or shared over WhatsApp: a modified app can steal your login or your money.',
        },
      ],
    },
    {
      id: 'iphone',
      heading: 'On iPhone',
      blocks: [
        {
          type: 'p',
          text: 'Open maxilotto.ng in Safari, tap the Share button, then Add to Home Screen. MaxiLotto opens from your home screen like an app.',
        },
      ],
    },
  ],
  faq: [
    { question: 'Is the MaxiLotto app free?', answer: 'Yes. The app is free to download and use.' },
    {
      question: 'Can I use my website account in the app?',
      answer: 'Yes. Log in with the same details you use on maxilotto.ng; your wallet, tickets and history are shared.',
    },
    {
      question: 'Why does my phone warn me when I install it?',
      answer:
        'Android shows that warning for any app installed from outside an app store. It is expected for the official file from maxilotto.ng. Do not install MaxiLotto files from anywhere else.',
    },
    {
      question: 'Is there a MaxiLotto app for iPhone?',
      answer: 'Add maxilotto.ng to your home screen from Safari (Share → Add to Home Screen) to use it like an app.',
    },
  ],
}
