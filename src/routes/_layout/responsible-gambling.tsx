import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react';
import PageHeader from "@/components/layouts/page-header.tsx";

export const Route = createFileRoute('/_layout/responsible-gambling')({
  component: RouteComponent,
})

const guidelines = [
  "Gamble strictly for enjoyment and entertainment",
  "Only play with money you can comfortably afford to lose",
  "Never use funds meant for daily living, bills, or essential needs",
  "Set clear limits on time and money spent gambling",
  "Decide your entertainment budget in advance and stick to it",
  "Avoid chasing losses; losses should be viewed as the cost of entertainment",
  "Do not borrow money or seek credit to gamble",
  "Ensure you understand the rules and odds of the games you play",
  "Maintain a healthy balance between gambling and other leisure activities",
  "Do not gamble as a way to escape stress, loneliness, or depression",
  "Avoid gambling when under the influence of alcohol or drugs",
];

const problemSigns = [
  "Spending more money than intended",
  "Poor performance at work or school",
  "Relationship or family conflicts",
  "Dishonesty, secrecy, or borrowing to gamble",
  "Feelings of anxiety, stress, or depression linked to gambling",
];

const selfAssessment = [
  "In the last 6 months, has gambling caused arguments or serious problems with family, friends, or colleagues?",
  "Have you ever claimed to be winning when you were actually losing?",
  "Have you tried to hide the amount you gamble from others?",
  "In the last year, have you gambled to escape personal problems or improve your mood?",
  "Have you ever tried to obtain money for gambling through dishonest or illegal means?",
  "After losing money, have you immediately gambled again to try to recover losses?",
  "Have you gambled longer or more frequently than you planned, despite promising yourself not to?",
];

const underageActions = [
  "The account will be closed immediately",
  "Any winnings will be forfeited",
];

const selfExclusionOptions = [
  "Temporarily suspend your account for a defined period, or",
  "Request permanent account closure",
];

const selfExclusionDuring = [
  "Your account will remain inaccessible",
  "We will take reasonable steps to prevent the creation of new accounts",
];

const advertisingStandards = [
  "Do not target minors or vulnerable individuals",
  "Do not make misleading claims about winnings or guaranteed success",
  "Clearly display age-restriction messaging across our platforms",
];

const fairGaming = [
  "Maintaining game integrity and fairness",
  "Protecting player data and transactions",
  "Operating secure systems and controls",
];

const socialHandles = [
  "X (Twitter): @maxilottong",
  "Instagram: @maxilottong",
  "Facebook: @maxilottong",
  "LinkedIn: @maxilottong",
  "TikTok: @maxilottong",
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
      <PageHeader title="Responsible Gaming" />
      <section className="py-8 sm:py-12">
        <div className="container">
          <div className="grid lg:grid-cols-1 items-start gap-16 p-0 mx-auto max-w-5xl max-lg:max-w-2xl">
            <div>
              <h2 className="text-slate-900 text-2xl font-bold">Responsible Gaming Policy</h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">Last updated: {new Date().getFullYear()}</p>

              <div className="mt-8 space-y-4">
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  At <strong>Maxilotto.ng</strong>, responsible gaming is a core part of how we operate. Our objective is to provide a <strong>safe, fair, and enjoyable gaming environment</strong> while minimizing the risk of harm associated with gambling.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  We are committed to protecting our players and promoting responsible play across all our platforms, including online, mobile, and retail channels.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">1. Our Commitment to Responsible Gaming</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Maxilotto actively implements safeguards, controls, and responsible gaming strategies designed to help players stay in control of their gambling activities.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Gambling should always be treated as a form of <strong>entertainment</strong>, not as a source of income or a solution to financial or personal difficulties.
                </p>
              </div>

              <div className="mt-8">
                <h2 className="text-slate-900 text-base font-semibold">2. Responsible Gaming Guidelines for Players</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed mt-2">
                  We encourage all players to observe the following principles:
                </p>
                <BulletList items={guidelines} />
                <p className="text-[15px] text-slate-600 leading-relaxed mt-3">
                  If gambling stops being fun, it is time to pause.
                </p>
              </div>

              <div className="mt-8">
                <h2 className="text-slate-900 text-base font-semibold">3. Recognising Problem Gambling</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed mt-2">
                  Problem gambling may present itself through behaviours such as:
                </p>
                <BulletList items={problemSigns} />
                <p className="text-[15px] text-slate-600 leading-relaxed mt-3">
                  If you recognise any of these signs, we strongly encourage you to take action early.
                </p>
              </div>

              <div className="mt-8">
                <h2 className="text-slate-900 text-base font-semibold">4. Self-Assessment: Reality Check</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed mt-2">
                  Take a moment to answer the following questions honestly:
                </p>
                <BulletList items={selfAssessment} />
                <p className="text-[15px] text-slate-600 leading-relaxed mt-3">
                  If you answered <strong>"Yes" to five or more</strong> of these questions, gambling may no longer be a form of entertainment for you. We strongly advise taking a break and seeking professional support.
                </p>
              </div>

              <div className="mt-8">
                <h2 className="text-slate-900 text-base font-semibold">5. Age Verification and Underage Gambling</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed mt-2">
                  Gambling on Maxilotto is strictly limited to individuals <strong>18 years and above</strong>. All customers must undergo age and identity verification. If we discover that an underage or vulnerable individual has accessed our services:
                </p>
                <BulletList items={underageActions} />
                <p className="text-[15px] text-slate-600 leading-relaxed mt-3">
                  We take active measures to prevent underage gambling. If you suspect that a minor is using Maxilotto, please contact our Customer Support team immediately. Persons under the age of 18 are not permitted to use Maxilotto services or participate at any affiliated outlets.
                </p>
              </div>

              <div className="mt-8">
                <h2 className="text-slate-900 text-base font-semibold">6. Self-Exclusion and Account Controls</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed mt-2">
                  Maxilotto offers <strong>self-exclusion options</strong> for players who feel they may be losing control or need a break. Self-exclusion allows you to:
                </p>
                <BulletList items={selfExclusionOptions} />
                <p className="text-[15px] text-slate-600 leading-relaxed mt-3">
                  During a self-exclusion period:
                </p>
                <BulletList items={selfExclusionDuring} />
                <p className="text-[15px] text-slate-600 leading-relaxed mt-3">
                  Self-exclusion requests can be made by contacting our Customer Support team.
                </p>
              </div>

              <div className="mt-8">
                <h2 className="text-slate-900 text-base font-semibold">7. Advertising and Marketing Standards</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed mt-2">
                  Our advertising and promotional activities are conducted responsibly. We:
                </p>
                <BulletList items={advertisingStandards} />
              </div>

              <div className="mt-8">
                <h2 className="text-slate-900 text-base font-semibold">8. Fair and Secure Gaming</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed mt-2">
                  We are committed to:
                </p>
                <BulletList items={fairGaming} />
                <p className="text-[15px] text-slate-600 leading-relaxed mt-3">
                  All gaming activities are monitored to ensure compliance with applicable rules and regulations.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">9. Staff Training and Internal Controls</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Our staff receive regular training on responsible gaming practices and compliance requirements.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Where necessary, Maxilotto may restrict or suspend a customer's access to services in accordance with our <strong>Terms & Conditions</strong>, particularly where responsible gaming concerns arise.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">10. Regulatory Compliance</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Maxilotto operates in strict compliance with all applicable Nigerian gaming laws and regulatory requirements. We adhere to high ethical standards and cooperate fully with relevant authorities where reporting is required.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">11. Need Help or Support?</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  We provide customer support to assist players with responsible gaming concerns.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  <strong>Customer Support Email:</strong>{' '}
                  <a href="mailto:care@maxilotto.ng" className="text-primary-700 hover:underline">care@maxilotto.ng</a>
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  <strong>Social Media (Support & Updates):</strong>
                </p>
                <BulletList items={socialHandles} />

                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                  <p className="text-[14px] text-slate-700 font-semibold">External Support Organisations</p>
                  <p className="text-[14px] text-slate-600 leading-relaxed">
                    If you need professional help, the following recognised organisations can assist confidentially:
                  </p>
                  <div>
                    <p className="text-[14px] text-slate-700 font-medium">Gamble Alert</p>
                    <p className="text-[14px] text-slate-600">
                      Website:{' '}
                      <a href="https://gamblealert.org" target="_blank" rel="noreferrer" className="text-primary-700 hover:underline">gamblealert.org</a>
                    </p>
                    <p className="text-[14px] text-slate-600">Phone: +234 916 295 7989</p>
                    <p className="text-[14px] text-slate-600">
                      Email:{' '}
                      <a href="mailto:info@gamblealert.org" className="text-primary-700 hover:underline">info@gamblealert.org</a>
                    </p>
                  </div>
                  <p className="text-[14px] text-slate-600 leading-relaxed">
                    You may also consider <strong>Gambling Therapy</strong>, which provides free support and counselling services.
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">12. Policy Review</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Maxilotto will review and update this Responsible Gaming Policy periodically to ensure it remains effective, compliant, and aligned with best practices.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}