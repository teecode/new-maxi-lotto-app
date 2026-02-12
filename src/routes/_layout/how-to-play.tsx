import { createFileRoute } from '@tanstack/react-router'
import { Alert, AlertContent, AlertDescription, AlertIcon } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react';

const HOW_TO_PLAY_STEPS: string[] = [
  'Create an account and complete quick KYC when required for withdrawals.',
  'Fund your wallet via any supported method.',
  'Pick your game (5/90, 2-Direct, Banker, Perm, and more).',
  'Choose your numbers and set your stake.',
  'Confirm your ticket and follow the draw on the Results page.',
  'Get paid automatically into your wallet when you win.',
  'Tip: You can combine strategies across Banker, Perms, and 2-Direct to match your risk preference.',
];


export const Route = createFileRoute('/_layout/how-to-play')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <section
        className="py-10 sm:py-24 flex justify-center items-center relative bg-gradient-to-b from-[#01B1A8] to-[#0185B6] overflow-hidden">
        <h3 className="font-montserrat text-lg text-white font-bold">Learn the Basics in
          Minutes</h3>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container space-y-6">
          <ul className="space-y-4">
            {HOW_TO_PLAY_STEPS.map((step, index) => (
              <li key={index} className="flex items-start gap-4">
                <div
                  className="flex w-7 h-7 shrink-0 items-center justify-center rounded-full bg-accent-1-900 text-primary-900 font-medium">
                  {index + 1}
                </div>
                <p className="text-slate-700">{step}</p>
              </li>
            ))}
          </ul>
          <Alert variant="info" appearance="light">
            <AlertIcon>
              <AlertCircle />
            </AlertIcon>
            <AlertContent>
              <AlertDescription>
                <strong>Tip:</strong> You can combine strategies across Banker, Perms, and 2-Direct
                to match your risk preference.
              </AlertDescription>
            </AlertContent>
          </Alert>

          {/* Accumulator Bets Explanation */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-8">
            <h2 className="text-xl md:text-2xl font-bold text-[#0A4B7F] mb-4 flex items-center gap-2">
              <span className="text-2xl">🚀</span> 
              What is an Accumulator Bet?
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Imagine you want to bet on a football match, but instead of just betting on <strong>one team</strong> to win, 
                you bet on <strong>3 or 4 teams</strong> all at once in a single ticket.
              </p>
              
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <h3 className="font-bold text-[#0A4B7F] mb-2">Here is how it works:</h3>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>You pick multiple games (like a "combo").</li>
                  <li><strong>The Good News:</strong> If they all win, you win a <strong>HUGE</strong> amount of money because the winnings multiply each other! 💰</li>
                  <li><strong>The Catch:</strong> All your picks must be correct. If even one game loses, the whole ticket loses.</li>
                </ul>
              </div>

              <p className="font-medium">
                It is high risk, but <strong>very high reward</strong>. Perfect if you have a few lucky numbers across different games!
              </p>
            </div>
          </div>

          {/* Bet Types Explanation - Simple Terms */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-6">
            <h2 className="text-xl md:text-2xl font-bold text-[#0A4B7F] mb-6 flex items-center gap-2">
              <span className="text-2xl">🎲</span> 
              Fun Ways to Bet
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* High / Low */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-[#01B1A8] flex items-center gap-2">
                  <span>📈</span> High or Low?
                </h3>
                <p className="text-sm text-gray-600">Guess if a number will be bigger or smaller than a target.</p>
                <ul className="space-y-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">
                  <li><strong>First Ball High/Low:</strong> Will the 1st ball be &gt; 40? or &lt; 40?</li>
                  <li><strong>Last Ball High/Low:</strong> Will the 5th ball be &gt; 80?</li>
                  <li className="text-xs text-gray-500 italic">Example: "FB_HI_50" means "First Ball Higher than 50"</li>
                </ul>
              </div>

              {/* Comparisons */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-[#01B1A8] flex items-center gap-2">
                  <span>🆚</span> Who is Bigger?
                </h3>
                <p className="text-sm text-gray-600">Compare two balls against each other.</p>
                <ul className="space-y-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">
                  <li><strong>First vs Last:</strong> Is the 1st ball bigger than the Last ball?</li>
                  <li><strong>First vs Second:</strong> Is the 1st ball bigger than the 2nd ball?</li>
                  <li className="text-xs text-gray-500 italic">Example: "F_GT_L" means "First Greater Than Last"</li>
                </ul>
              </div>

              {/* Odd / Even */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-[#01B1A8] flex items-center gap-2">
                  <span>1️⃣</span> Odd or Even?
                </h3>
                <p className="text-sm text-gray-600">Guess if a ball is Odd (1, 3, 5...) or Even (2, 4, 6...).</p>
                <ul className="space-y-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">
                  <li><strong>First Odd/Even:</strong> Is the 1st ball Odd or Even?</li>
                  <li><strong>Last Odd/Even:</strong> Is the last ball Odd or Even?</li>
                </ul>
              </div>

              {/* Sums */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-[#01B1A8] flex items-center gap-2">
                  <span>➕</span> Total Sum
                </h3>
                <p className="text-sm text-gray-600">Add up all 5 winning numbers. What is the total?</p>
                <ul className="space-y-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">
                  <li><strong>Sum High:</strong> Is the total &gt; 200?</li>
                  <li><strong>Sum Low:</strong> Is the total &lt; 100?</li>
                  <li><strong>Sum Range:</strong> Is the total between 100 and 150?</li>
                </ul>
              </div>

            </div>
          </div>

        </div>
      </section>
    </>
  )
}
