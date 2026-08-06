import {createFileRoute} from '@tanstack/react-router'
import {Alert, AlertContent, AlertDescription, AlertIcon} from '@/components/ui/alert'
import {AlertCircle, Loader2} from 'lucide-react';
import {useGetBetTypes, useGetBlockingRules} from '@/hooks/useGames';
import {useMemo} from 'react';
import PageHeader from "@/components/layouts/page-header.tsx";

const HOW_TO_PLAY_STEPS: string[] = [
  'Create an account and complete quick KYC when required for withdrawals.',
  'Fund your wallet via Instant Bank Transfer, Card, or USSD in Nigerian Naira (₦).',
  'Pick your game mode (5/90, 1-Direct, 2-Direct, Banker, Perms, or Maxi Derive).',
  'Choose your numbers and set your stake in Naira (e.g. ₦100 per line).',
  'Confirm your ticket and track live draw results on the Results page.',
  'Get paid automatically into your Naira wallet as soon as the draw completes.',
  'Tip: You can combine strategies across Single bets and Accumulators to customize your risk preference.',
];

export const Route = createFileRoute('/_layout/how-to-play')({
  component: RouteComponent,
})

function LottoBall({ number, color = 'gold', highlighted = false }: { number: string | number; color?: 'gold' | 'blue' | 'purple' | 'emerald'; highlighted?: boolean }) {
  const colorStyles = {
    gold: 'from-amber-400 via-amber-500 to-amber-700 text-white shadow-amber-300/50',
    blue: 'from-blue-400 via-blue-600 to-blue-800 text-white shadow-blue-300/50',
    purple: 'from-purple-400 via-purple-600 to-purple-800 text-white shadow-purple-300/50',
    emerald: 'from-emerald-400 via-emerald-600 to-emerald-800 text-white shadow-emerald-300/50',
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-b ${colorStyles[color]} font-extrabold shadow-md transition-transform ${
        highlighted ? 'scale-110 ring-2 ring-yellow-400 ring-offset-2 w-9 h-9 text-sm' : 'w-8 h-8 text-xs'
      }`}
    >
      {number}
    </div>
  );
}

function RouteComponent() {
  const {data: blockingRules, isLoading: isLoadingRules} = useGetBlockingRules();
  const {data: betTypes, isLoading: isLoadingBetTypes} = useGetBetTypes(2);

  const rulesList = useMemo(() => {
    if (!blockingRules || !blockingRules.groups || !betTypes) return [];

    return blockingRules.groups.map(group => {
      const groupBetTypes = betTypes.filter(bt => group.codes.includes(bt.quickPlayCode));
      const firstBet = groupBetTypes[0];
      const title = firstBet?.napDescription || firstBet?.nap || group.groupId;

      return {
        id: group.groupId,
        title: title,
        maxSelections: group.maxSelections,
        description: `Restricted to ${group.maxSelections === -1 ? "Unlimited" : group.maxSelections} selection${group.maxSelections !== 1 ? 's' : ''} from this group.`,
        examples: groupBetTypes.map(bt => bt.description || bt.code).slice(0, 3).join(", ") + (groupBetTypes.length > 3 ? ", ..." : "")
      };
    });
  }, [blockingRules, betTypes]);

  const isLoading = isLoadingRules || isLoadingBetTypes;

  return (
    <>
      <PageHeader title="Maxi Derive & How to Play" />

      <section className="py-8 sm:py-12 bg-slate-50/50">
        <div className="container space-y-10">

          {/* Quick 7-Step Start */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0A4B7F] flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              Get Started in 7 Easy Steps
            </h2>
            <ul className="grid md:grid-cols-2 gap-4">
              {HOW_TO_PLAY_STEPS.map((step, index) => (
                <li key={index} className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex w-8 h-8 shrink-0 items-center justify-center rounded-full bg-[#0A4B7F] text-white font-bold text-sm shadow-sm">
                    {index + 1}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{step}</p>
                </li>
              ))}
            </ul>
            <Alert variant="info" appearance="light" className="bg-blue-50/60 border-blue-100">
              <AlertIcon>
                <AlertCircle className="text-[#0A4B7F]" />
              </AlertIcon>
              <AlertContent>
                <AlertDescription className="text-sm text-[#0A4B7F]">
                  <strong>Pro Tip:</strong> All bets and payouts are processed instantly in Nigerian Naira (₦). You can combine Single Bets and Accumulators to customize your payout returns!
                </AlertDescription>
              </AlertContent>
            </Alert>
          </div>

          {/* Single Bets Explanation with Inline Image */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="space-y-4 lg:w-3/5">
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full uppercase tracking-wider">
                  Independent Payouts
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A4B7F] flex items-center gap-2">
                  <span>🎯</span> What is a Single Bet?
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  A <strong>Single Bet</strong> is the simplest and safest way to play MaxiLotto. Every line you select on your ticket stands <strong>100% independently</strong>.
                </p>

                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 space-y-3">
                  <h3 className="font-bold text-emerald-900 flex items-center gap-2">
                    <span>💡</span> How Single Bet Payouts Work:
                  </h3>
                  <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside">
                    <li>You can place one or multiple picks on a single ticket.</li>
                    <li><strong>Line-by-Line Payouts:</strong> If you place 3 picks and 2 win while 1 loses, you get paid cash for both winning picks! 💰</li>
                    <li><strong>Naira Payout Formula:</strong> <code className="bg-white px-2 py-0.5 rounded text-emerald-800 font-mono font-bold">Line Return (₦) = Stake per Line (₦) × Odds Factor</code></li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <strong className="text-[#0A4B7F]">Example:</strong> Stake ₦100 per line on 2-Direct (240x odds). If your line hits, you win <span className="font-bold text-emerald-700 font-mono text-sm">₦24,000</span> directly in your wallet!
                </div>
              </div>

              <div className="lg:w-2/5 w-full flex justify-center">
                <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-900 max-w-sm w-full">
                  <img
                    src="/single-bet-naira.png"
                    alt="Single Bet Naira Payout Illustration"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Accumulator Bets Explanation with Inline Image */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="lg:w-2/5 w-full order-2 lg:order-1 flex justify-center">
                <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-900 max-w-sm w-full">
                  <img
                    src="/accumulator-naira.png"
                    alt="Accumulator Bet Naira Multiplier Illustration"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              <div className="space-y-4 lg:w-3/5 order-1 lg:order-2">
                <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full uppercase tracking-wider">
                  Combo Multipliers
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A4B7F] flex items-center gap-2">
                  <span>🚀</span> What is an Accumulator Bet?
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  An <strong>Accumulator</strong> combines multiple selections into 1 mega ticket where odds multiply together for massive cash returns!
                </p>

                <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 space-y-3">
                  <h3 className="font-bold text-blue-900 flex items-center gap-2">
                    <span>⚡</span> High Risk, Massive Naira Rewards:
                  </h3>
                  <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside">
                    <li>Select picks across different games or markets into one accumulator.</li>
                    <li><strong>Multiplier Magic:</strong> Odds multiply together (e.g. 5x × 10x × 20x = <strong>1,000x multiplier!</strong>).</li>
                    <li><strong>All-or-Nothing:</strong> All picks must win. If 1 game loses, the ticket loses.</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <strong className="text-[#0A4B7F]">Example:</strong> A ₦500 stake on a 4-leg accumulator with combined odds of 500x pays out <span className="font-bold text-blue-700 font-mono text-sm">₦250,000</span> in Naira cash!
                </div>
              </div>
            </div>
          </div>

          {/* Core Bet Types (Direct & Perm) with Inline Image */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="space-y-4 lg:w-3/5">
                <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full uppercase tracking-wider">
                  Official Game Odds
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A4B7F] flex items-center gap-2">
                  <span>🎟️</span> Direct Bets (1-Direct, 2-Direct & Direct 3–5)
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  In 5/90 lotteries, 5 winning balls are drawn out of 90. Here are the exact official win factors (odds) for Direct bets:
                </p>
              </div>

              <div className="lg:w-2/5 w-full flex justify-center">
                <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-900 max-w-sm w-full">
                  <img
                    src="/direct-bets-naira.png"
                    alt="Direct Bets Naira Draw Illustration"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-2">

              {/* 1-Direct */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-[#0A4B7F] flex items-center gap-2">
                    <span>🎯</span> 1-Direct (First Ball)
                  </h3>
                  <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-mono">40x Odds</span>
                </div>
                <p className="text-sm text-slate-600">Pick 1 lucky number. It must drop as the <strong>very 1st ball</strong> drawn!</p>

                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="text-slate-500 font-semibold">Draw Result Example:</div>
                  <div className="flex items-center gap-2">
                    <LottoBall number="45" color="gold" highlighted={true} />
                    <LottoBall number="12" color="blue" />
                    <LottoBall number="34" color="blue" />
                    <LottoBall number="88" color="blue" />
                    <LottoBall number="71" color="blue" />
                  </div>
                  <p className="text-emerald-700 font-semibold pt-1">
                    ✓ You picked <span className="underline">#45</span>. 1st Ball was 45 → Pays <span className="font-bold text-emerald-800 font-mono text-sm">₦4,000</span> on ₦100 stake! (₦100 × 40x)
                  </p>
                </div>
              </div>

              {/* 2-Direct */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-[#0A4B7F] flex items-center gap-2">
                    <span>✌️</span> 2-Direct (NAP 2)
                  </h3>
                  <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-mono">240x Odds</span>
                </div>
                <p className="text-sm text-slate-600">Pick 2 numbers. <strong>BOTH</strong> numbers must drop anywhere among the 5 winning balls.</p>

                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="text-slate-500 font-semibold">Draw Result Example:</div>
                  <div className="flex items-center gap-2">
                    <LottoBall number="05" color="blue" />
                    <LottoBall number="12" color="gold" highlighted={true} />
                    <LottoBall number="34" color="blue" />
                    <LottoBall number="88" color="gold" highlighted={true} />
                    <LottoBall number="71" color="blue" />
                  </div>
                  <p className="text-emerald-700 font-semibold pt-1">
                    ✓ You picked <span className="underline">#12 & #88</span>. Both hit → Pays <span className="font-bold text-emerald-800 font-mono text-sm">₦24,000</span> on ₦100 stake! (₦100 × 240x)
                  </p>
                </div>
              </div>

              {/* 3-Direct */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-[#0A4B7F] flex items-center gap-2">
                    <span>🔥</span> 3-Direct (NAP 3)
                  </h3>
                  <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-mono">2,100x Odds</span>
                </div>
                <p className="text-sm text-slate-600">Pick 3 numbers. All 3 must drop among the 5 winning numbers drawn.</p>
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <strong className="text-[#0A4B7F]">Payout Example:</strong> Stake ₦100 → Pays <span className="font-bold text-emerald-800 font-mono text-sm">₦210,000</span> cash! (₦100 × 2,100x)
                </div>
              </div>

              {/* 4-Direct & 5-Direct */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-[#0A4B7F] flex items-center gap-2">
                    <span>💎</span> 4-Direct & 5-Direct
                  </h3>
                  <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-mono">4,000x - 44,000x</span>
                </div>
                <p className="text-sm text-slate-600">Match 4 or 5 numbers drawn for giant jackpots!</p>
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <strong className="text-[#0A4B7F]">Payout Examples:</strong><br />
                  • 4-Direct (4,000x): ₦100 stake → <span className="font-bold text-emerald-800 font-mono">₦400,000</span><br />
                  • 5-Direct (44,000x): ₦100 stake → <span className="font-bold text-emerald-800 font-mono">₦4,400,000</span>
                </div>
              </div>

            </div>
          </div>

          {/* Permutation & Banker/Against Section with Inline Image */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="lg:w-2/5 w-full order-2 lg:order-1 flex justify-center">
                <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-900 max-w-sm w-full">
                  <img
                    src="/banker-against-naira.png"
                    alt="Banker & Against Bet Payout Illustration"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              <div className="space-y-4 lg:w-3/5 order-1 lg:order-2">
                <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full uppercase tracking-wider">
                  Multiple Line Coverage
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A4B7F] flex items-center gap-2">
                  <span>🔄</span> Permutations & Banker Bets
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Permutations and Banker Against bets let you cover multiple winning combinations on a single ticket:
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-2">

              {/* Permutation */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-amber-300 transition-colors">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-amber-900 flex items-center gap-2">
                    <span>🔄</span> Permutation (Perm 2 to 5)
                  </h3>
                  <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-mono">Perm 2 = 240x</span>
                </div>
                <p className="text-sm text-slate-600">Select a pool of numbers (e.g. 4 numbers in Perm 2). The system generates all possible pairs for you!</p>

                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="text-slate-500 font-semibold">Your Picks: #10, #20, #30, #40 (₦100 per line)</div>
                  <p className="text-slate-700">If 3 numbers drop (#10, #30, #40), you hit <strong>3 winning pairs</strong>: 3 × (₦100 × 240x) = <span className="font-bold text-amber-800 font-mono text-sm">₦72,000</span> total payout!</p>
                </div>
              </div>

              {/* Banker & Against */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-indigo-300 transition-colors">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-indigo-900 flex items-center gap-2">
                    <span>🏦</span> Banker & Against (AGS)
                  </h3>
                  <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full font-mono">240x Odds</span>
                </div>
                <p className="text-sm text-slate-600">Pick 1 key <strong>Banker</strong> number paired <em>against</em> secondary numbers.</p>

                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="text-slate-500 font-semibold">Banker #7 vs Against #15, #23, #42 (₦100 per pair)</div>
                  <p className="text-slate-700">You win whenever <strong>#7</strong> drops alongside any against number! Each matching pair pays <span className="font-bold text-indigo-800 font-mono text-sm">₦24,000</span> (₦100 × 240x).</p>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Odds & Win Factors Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0A4B7F] flex items-center gap-2">
              <span>📊</span>
              Official MaxiLotto Win Factors (Odds Table)
            </h2>
            <p className="text-xs text-slate-600">
              Reference table showing official payout multiplier factors per ₦100 stake:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-[#0A4B7F] border-b border-slate-200">
                    <th className="p-3 font-bold">Bet Type</th>
                    <th className="p-3 font-bold">Code</th>
                    <th className="p-3 font-bold">Win Factor (Odds)</th>
                    <th className="p-3 font-bold">Payout on ₦100 Stake</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-blue-900">1 DIRECT (First Ball)</td>
                    <td className="p-3 font-mono">D1</td>
                    <td className="p-3 font-bold text-emerald-700 font-mono">40.00x</td>
                    <td className="p-3 font-bold font-mono">₦4,000</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-blue-900">2 DIRECT / PERM 2</td>
                    <td className="p-3 font-mono">D2 / P2</td>
                    <td className="p-3 font-bold text-emerald-700 font-mono">240.00x</td>
                    <td className="p-3 font-bold font-mono">₦24,000</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-blue-900">3 DIRECT / PERM 3</td>
                    <td className="p-3 font-mono">D3 / P3</td>
                    <td className="p-3 font-bold text-emerald-700 font-mono">2,100.00x</td>
                    <td className="p-3 font-bold font-mono">₦210,000</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-blue-900">4 DIRECT / PERM 4</td>
                    <td className="p-3 font-mono">D4 / P4</td>
                    <td className="p-3 font-bold text-emerald-700 font-mono">4,000.00x</td>
                    <td className="p-3 font-bold font-mono">₦400,000</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-blue-900">5 DIRECT / PERM 5</td>
                    <td className="p-3 font-mono">D5 / P5</td>
                    <td className="p-3 font-bold text-emerald-700 font-mono">44,000.00x</td>
                    <td className="p-3 font-bold font-mono">₦4,400,000</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-indigo-900">BANKER / AGAINST SINGLES</td>
                    <td className="p-3 font-mono">AG / AGS</td>
                    <td className="p-3 font-bold text-indigo-700 font-mono">240.00x</td>
                    <td className="p-3 font-bold font-mono">₦24,000 per match</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Normal vs Machine Numbers */}
          <div className="bg-purple-50/60 rounded-3xl p-6 sm:p-8 shadow-sm border border-purple-100 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-900 flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              Normal vs. Machine Numbers
            </h2>
            <p className="text-slate-700 leading-relaxed">
              In standard lotteries, 5 numbers are drawn as the <strong>Winning Numbers</strong>, and another 5 numbers are drawn as the <strong>Machine Numbers</strong>.
            </p>

            <div className="grid md:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm space-y-1">
                <h3 className="font-bold text-[#0A4B7F] flex items-center gap-2">
                  <span className="text-lg">🎯</span> Normal Bet
                </h3>
                <p className="text-xs text-slate-600">Your selections are checked against the 5 Winning Numbers drawn. Standard payout mode in Naira (₦).</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm space-y-1">
                <h3 className="font-bold text-purple-700 flex items-center gap-2">
                  <span className="text-lg">⚙️</span> Machine Bet
                </h3>
                <p className="text-xs text-slate-600">Your selections are checked against the 5 Machine Numbers drawn. Switch modes in your bet slip anytime!</p>
              </div>
            </div>
          </div>

          {/* Maxi Derive & Fun Proposition Markets */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0A4B7F] flex items-center gap-2">
              <span className="text-2xl">🎲</span>
              Maxi Derive & Proposition Markets
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              {/* High / Low */}
              <div className="space-y-3 bg-slate-50 p-4.5 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-base text-[#01B1A8] flex items-center gap-2">
                  <span>📈</span> High or Low?
                </h3>
                <p className="text-xs text-slate-600">Predict if a ball will be bigger or smaller than a threshold.</p>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li>• <strong>First Ball High/Low:</strong> Will 1st ball be &gt; 40 or &lt; 40?</li>
                  <li>• <strong>Last Ball High/Low:</strong> Will 5th ball be &gt; 80?</li>
                </ul>
              </div>

              {/* Comparisons */}
              <div className="space-y-3 bg-slate-50 p-4.5 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-base text-[#01B1A8] flex items-center gap-2">
                  <span>🆚</span> Ball Comparisons
                </h3>
                <p className="text-xs text-slate-600">Compare drawn balls against each other.</p>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li>• <strong>First vs Last:</strong> Is 1st ball greater than 5th ball?</li>
                  <li>• <strong>First 2 vs Last 2:</strong> Is sum of first 2 greater than sum of last 2?</li>
                </ul>
              </div>

              {/* Odd / Even */}
              <div className="space-y-3 bg-slate-50 p-4.5 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-base text-[#01B1A8] flex items-center gap-2">
                  <span>1️⃣</span> Odd or Even?
                </h3>
                <p className="text-xs text-slate-600">Bet on parity of drawn balls.</p>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li>• <strong>First Odd/Even:</strong> Is 1st ball Odd or Even?</li>
                  <li>• <strong>Last Odd/Even:</strong> Is last ball Odd or Even?</li>
                </ul>
              </div>

              {/* Sums */}
              <div className="space-y-3 bg-slate-50 p-4.5 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-base text-[#01B1A8] flex items-center gap-2">
                  <span>➕</span> Total Ball Sum
                </h3>
                <p className="text-xs text-slate-600">Add up all 5 drawn numbers.</p>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li>• <strong>Sum High:</strong> Is total &gt; 200?</li>
                  <li>• <strong>Sum Low:</strong> Is total &lt; 100?</li>
                </ul>
              </div>

            </div>
          </div>

          {/* Referral Ambassador Program Guide */}
          <div id="referrals" className="bg-gradient-to-br from-[#01B1A8]/10 to-blue-50/50 rounded-3xl p-6 sm:p-8 shadow-sm border border-[#01B1A8]/20 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0A4B7F] flex items-center gap-2">
              <span className="text-2xl">🤝</span>
              Ambassador Program — Earn 20% Commission
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Earn passive income in Nigerian Naira (₦) by inviting friends! You instantly receive up to <strong>20% commission</strong> on your downline's activity.
            </p>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2 text-xs text-slate-700">
              <p>1. Go to Profile Settings → Referral tab.</p>
              <p>2. Share your unique referral link via WhatsApp, Twitter, or Facebook.</p>
              <p>3. Track your real-time Naira earnings on your Referral Dashboard!</p>
            </div>
          </div>

          {/* Accumulator Restrictions */}
          <div className="bg-red-50/50 rounded-3xl p-6 sm:p-8 shadow-sm border border-red-100 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-red-800 flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              Accumulator Rules & Restrictions
            </h2>
            <p className="text-sm text-slate-700">
              To maintain fair play, correlated outcomes cannot be stacked excessively within a single accumulator ticket.
            </p>

            {isLoading ? (
              <div className="flex justify-center items-center py-8 text-slate-500">
                <Loader2 className="animate-spin mr-2"/> Loading rules...
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {rulesList.map(rule => (
                  <div key={rule.id} className="bg-white p-4 rounded-2xl border border-red-100 shadow-sm space-y-1">
                    <h4 className="font-bold text-[#0A4B7F] text-sm">{rule.title}</h4>
                    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ${rule.maxSelections === 1 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      Max {rule.maxSelections} Selection{rule.maxSelections !== 1 ? 's' : ''}
                    </span>
                    <p className="text-xs text-slate-500 italic pt-1">
                      Examples: {rule.examples}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>
    </>
  )
}
