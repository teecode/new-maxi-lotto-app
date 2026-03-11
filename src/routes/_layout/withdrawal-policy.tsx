import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react';
import PageHeader from "@/components/layouts/page-header.tsx";

export const Route = createFileRoute('/_layout/withdrawal-policy')({
  component: RouteComponent,
})

const kycDocuments = [
  "Government-issued ID",
  "Proof of address",
  "Bank account verification",
];

const processingTimes = [
  "Bank transfers: up to 48 hours",
  "Payment gateways / e-wallets: up to 24 hours",
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col mt-2 space-y-1">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-1">
          <div className="flex w-7 h-7 shrink-0 items-center justify-center text-primary-900 font-medium mt-[-2px]">
            <ChevronRight size={18} />
          </div>
          <p className="text-[15px] text-slate-600 leading-relaxed">{item}</p>
        </li>
      ))}
    </ul>
  );
}

function RouteComponent() {
  return (
    <>
      <PageHeader title="Withdrawal Policy" />
      <section className="py-8 sm:py-12">
        <div className="container">
          <div className="grid lg:grid-cols-1 items-start gap-16 p-0 mx-auto max-w-5xl max-lg:max-w-2xl">
            <div>
              <h2 className="text-slate-900 text-2xl font-bold">Withdrawal Policy</h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">Last updated: {new Date().getFullYear()}</p>

              <div className="mt-8 space-y-4">
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  <strong>Maxilotto.ng</strong> ("Maxilotto", "we", "us", or "our") provides players with a secure method for withdrawing winnings and account balances. By requesting a withdrawal, users agree to comply with this policy. Maxilotto.ng is operated by <strong>LukzerNet Nigeria Limited</strong>, incorporated under the laws of the Federal Republic of Nigeria.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">1. Eligibility for Withdrawals</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Players must have a registered account and comply with Maxilotto's Terms & Conditions. Accounts may require verification before withdrawals are processed.
                </p>
              </div>

              <div className="mt-8">
                <h2 className="text-slate-900 text-base font-semibold">2. Identity Verification (KYC)</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed mt-2">
                  To protect users and comply with financial regulations, Maxilotto may require:
                </p>
                <BulletList items={kycDocuments} />
                <p className="text-[15px] text-slate-600 leading-relaxed mt-3">
                  Failure to provide documentation may delay withdrawals.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">3. Withdrawal Methods</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Withdrawals are typically processed using the same method used for deposits where possible. Supported methods may include bank transfers and approved electronic payment providers.
                </p>
              </div>

              <div className="mt-8">
                <h2 className="text-slate-900 text-base font-semibold">4. Processing Times</h2>
                <BulletList items={processingTimes} />
                <p className="text-[15px] text-slate-600 leading-relaxed mt-3">
                  Processing time may vary due to banking delays, verification checks, or public holidays.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">5. Withdrawal Limits</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Maxilotto may apply minimum or maximum withdrawal limits for security or operational reasons.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">6. Winnings Verification</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  All winnings are subject to verification of bet validity and system integrity before withdrawals are approved.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">7. Bonus Winnings</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Winnings derived from bonuses or promotions may require wagering requirements to be completed before withdrawal.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">8. Fraud Prevention</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Withdrawals may be delayed or cancelled if suspicious activity is detected, including multiple accounts, bonus abuse, fraud, or chargeback attempts.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">9. Account Ownership</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Withdrawals may only be made by the registered account holder and must be paid to an account in the same name.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">10. Currency</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  All transactions are processed in <strong>Nigerian Naira (NGN)</strong>.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">11. Errors</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  If funds are credited in error, Maxilotto reserves the right to reverse the transaction.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">Contact Us</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  For withdrawal-related enquiries, please contact our Customer Support team:{' '}
                  <a href="mailto:care@maxilotto.ng" className="text-primary-700 hover:underline">care@maxilotto.ng</a>
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}