import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react';
import PageHeader from "@/components/layouts/page-header.tsx";

export const Route = createFileRoute('/_layout/terms-and-condition')({
  component: RouteComponent,
})

const termsAgreement = [
  "These Terms and Conditions",
  "Our Betting and Lottery Rules",
  "Our Privacy Policy",
  "Any bonus, promotion, or special offer rules published on our platform",
  "Any additional terms required for software or features you download or use",
];

const processingTimes = [
  "Bank transfers: Within 2 working days",
  "E-wallets: Within 24 hours",
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
      <PageHeader title="Terms & Conditions" />
      <section className="py-8 sm:py-12">
        <div className="container">
          <div className="grid lg:grid-cols-1 items-start gap-16 p-0 mx-auto max-w-5xl max-lg:max-w-2xl">
            <div>
              <h2 className="text-slate-900 text-2xl font-bold">Terms & Conditions</h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">Last updated: {new Date().getFullYear()}</p>

              <div className="mt-8 space-y-4">
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Please read these Terms and Conditions carefully before using our website, mobile app, or any related services. By accessing or using MaxiLotto, you agree to comply with these Terms, our Privacy Policy, and any other applicable policies. We may update these Terms periodically, and any changes will apply from the moment you next visit or log in.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">1. Introduction</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  These Terms & Conditions ("Terms" or "T&Cs") govern the use of MaxiLotto, a lottery and gaming platform operated as a brand of <strong>LukzerNet Nigeria Limited</strong>, a company duly incorporated under the laws of the Federal Republic of Nigeria.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  MaxiLotto provides online and offline lottery betting services ("Services") through various channels including our website, mobile applications, SMS, USSD, and authorised POS terminals.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  By registering an account, placing a bet, or using any of our Services, you ("you," "your," or "player") agree to be bound by:
                </p>
                <BulletList items={termsAgreement} />
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  These documents together form the "Terms of Use." Each time you place a bet, participate in a promotion, or use any part of our Services, you confirm that you have read, understood, and accepted the Terms of Use — including any future amendments.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  These Terms represent the full and final agreement between you and LukzerNet Nigeria Limited (operating as MaxiLotto) and replace any previous agreements or understandings, written or verbal.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">2. Eligibility and Use of Services</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  <strong>Age Restriction:</strong> Our services are available only to individuals aged 18 or older. We reserve the right to verify your age and suspend or close any account if we believe you are underage. All winnings by underage users will be forfeited.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  <strong>Account Registration:</strong> To access our Services, you must create an account and confirm you have the legal capacity to enter into a binding agreement. Providing false or misleading information may result in account closure.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  <strong>Personal Use:</strong> MaxiLotto is intended solely for your personal entertainment. Commercial or professional use of your account is strictly prohibited.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  <strong>Service Availability:</strong> While we strive to ensure uninterrupted access, we do not guarantee that our website or services will always be available. We are not responsible for any loss caused by downtime, disconnections, or other technical issues beyond our control.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  <strong>Liability:</strong> LukzerNet Nigeria Limited will not be liable for any direct or indirect losses arising from the use of our Services unless caused by gross negligence or intentional misconduct.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  <strong>System Issues:</strong> We accept no responsibility for inability to place bets due to network congestion, connectivity issues, or third-party system failures.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  <strong>Time Reference:</strong> All times displayed on our platform are in West Africa Time (WAT) unless stated otherwise.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  <strong>Governing Law:</strong> All betting contracts and legal relationships between you and MaxiLotto are governed by Nigerian law. All transactions are processed in Nigerian Naira (NGN).
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  <strong>Promotional Use:</strong> If you win NGN 500,000 or more, you consent to LukzerNet Nigeria Limited using your name, city, and/or image for promotional purposes, provided we make reasonable efforts to contact you first.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">3. Deposits and Withdrawals</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  You can fund your account through any of the approved payment methods (e.g., debit/credit card, bank transfer, e-wallet). Withdrawals will typically be processed using the same method you used for deposits.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  We may conduct identity and anti-money-laundering checks before processing transactions. Failure to pass verification may delay or prevent withdrawals.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  All withdrawals are subject to internal review. Any winnings or bonuses gained through breach of these Terms may be forfeited.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Standard processing times:
                </p>
                <BulletList items={processingTimes} />
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Reversing or charging back a deposit is prohibited. Any attempt to do so may result in account suspension and recovery of associated costs.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Deposited funds remain your property but are held by LukzerNet Nigeria Limited as trustee, not debtor. No interest will be paid on account balances.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">4. Acceptable Use</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  MaxiLotto must only be used for lawful, personal purposes. Any attempt to manipulate, exploit, or misuse our services is prohibited.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  All content, trademarks, logos, software, and intellectual property on MaxiLotto are owned by LukzerNet Nigeria Limited and protected by copyright. You may not reproduce, modify, or distribute them without written permission.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Attempts to interfere with our systems — including introducing malware or attempting unauthorized access — will result in legal action.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  We reserve the right to change, remove, or limit access to any part of the platform or its services without prior notice.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">5. External Links</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Our website may contain links to external websites operated by third parties. These links are for convenience only. We do not control and are not responsible for their content, accuracy, or reliability.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">6. Account Management</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  You are responsible for ensuring that using MaxiLotto is legal in your location. Accessing our services from a jurisdiction where gambling is illegal is prohibited.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  You must provide accurate and up-to-date personal information. Accounts with false details may be suspended or terminated.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Each player is permitted <strong>one account only</strong>. Multiple accounts — even under different names — may be treated as fraud and closed.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  You are responsible for keeping your login credentials confidential. Any activity conducted using your credentials will be considered valid.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  If you do not access your account for six months, it may be marked as inactive.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  You may close your account at any time by contacting customer support. If the closure is due to fraud or criminal activity, your funds and winnings may be forfeited.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">7. Responsible Gaming</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Gambling should be fun. We encourage you to set limits, play responsibly, and never gamble with money you cannot afford to lose.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  If you need a break, we offer self-exclusion options to temporarily or permanently suspend your account.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">8. Promotions and Bonuses</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Promotions and bonuses are subject to specific terms and conditions, which must be accepted before participation.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  We reserve the right to cancel or withhold bonuses, winnings, or benefits if we detect fraud, abuse, or attempts to manipulate promotions.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Promotions may be modified, suspended, or withdrawn at any time without prior notice.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">9. Legal Compliance</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  All betting activity on MaxiLotto is governed by Nigerian law, including the Criminal Code Act, CAP 22, and any relevant regulations.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Bets placed from outside Nigeria may also be subject to local laws and foreign exchange regulations. You are responsible for ensuring compliance.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">10. Errors and Mistakes</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  From time to time, errors may occur (e.g., incorrect odds, settlement errors, or accidental acceptance of incompatible bets).
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  In such cases, MaxiLotto reserves the right to cancel affected bets or correct settlements based on the accurate terms.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  If funds are mistakenly credited to your account, you must notify us immediately. We may recover the funds or reverse related transactions.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">11. Complaints and Feedback</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  We welcome your feedback. For complaints or suggestions, contact our Customer Support team. We aim to resolve issues quickly and fairly.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Abusive or offensive language towards our staff will not be tolerated and may result in account suspension.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Complaints about bet settlements must be submitted within <strong>24 hours</strong> of the relevant event.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">12. Waiver</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Failure by LukzerNet Nigeria Limited to enforce any part of these Terms does not constitute a waiver of our rights.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">13. Severability and Termination</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  If any part of these Terms is found invalid or unenforceable, the remaining sections will continue to apply in full.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  LukzerNet Nigeria Limited may suspend or terminate your account or access to our services at any time, without notice and at its sole discretion.
                </p>
              </div>

              <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-[14px] text-slate-500 leading-relaxed">
                  <strong className="text-slate-700">Note:</strong> "MaxiLotto" is a trading name and registered brand of LukzerNet Nigeria Limited, a company incorporated under the laws of the Federal Republic of Nigeria. All references to "we," "us," "our," or "the Company" in these Terms refer to LukzerNet Nigeria Limited.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}