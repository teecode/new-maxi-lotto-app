import type { ContentSection } from './types'

export const ACCUMULATOR_SECTIONS: ContentSection[] = [
  {
    id: 'how-accumulator-bets-work',
    heading: 'How a lotto accumulator works',
    blocks: [
      {
        type: 'p',
        text: 'A MaxiLotto accumulator combines multiple market predictions for one selected game into a single ticket. Each prediction is a leg of the accumulator, and every leg must be correct for the ticket to win.',
      },
      {
        type: 'p',
        text: 'The odds for the legs are multiplied to calculate the combined odds. For example, legs with displayed factors of 2.00 and 3.00 produce combined odds of 6.00. This is an illustration only; available markets and factors vary by game.',
      },
    ],
  },
  {
    id: 'placing-an-accumulator',
    heading: 'How to place an accumulator',
    blocks: [
      {
        type: 'steps',
        items: [
          'Choose a game from the game list.',
          'Select one or more available outcomes from the accumulator markets. Choose Normal or Machine where that option is offered.',
          'Review the legs and stake in the accumulator slip, then place or book the ticket.',
        ],
      },
      {
        type: 'note',
        text: 'Only include a stake you can afford to lose. An accumulator needs every selected leg to win, so adding legs changes both the combined odds and the chance of winning.',
      },
      {
        type: 'p',
        text: "New to MaxiLotto? Read [how to play 5/90](/how-to-play) for the available bet types, or check [today's games](/games) and [recent results](/results).",
      },
    ],
  },
]
