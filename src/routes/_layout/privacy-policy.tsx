import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react';
import PageHeader from "@/components/layouts/page-header.tsx";

export const Route = createFileRoute('/_layout/privacy-policy')({
  component: RouteComponent,
})

const purposeOfCollection = [
  "Providing online and retail lottery and gaming services",
  "Creating and managing user accounts",
  "Verifying identity, age, and eligibility",
  "Complying with legal, regulatory, and licensing requirements",
  "Preventing fraud, money laundering, and unlawful activity",
  "Ensuring platform security, integrity, and service continuity",
  "Internal reporting, analytics, and statistical purposes",
];

const dataWeCollect = [
  "Full name, date of birth, and contact details",
  "Email address and phone number",
  "Account login credentials",
  "Transaction, betting, and payment history",
  "Device, IP address, and usage information",
  "Any other information you voluntarily provide during registration or use of our services",
];

const howWeUseData = [
  "Register and manage your Maxilotto account",
  "Process deposits, bets, winnings, and withdrawals",
  "Communicate important service-related information",
  "Conduct identity, KYC, and anti-money laundering checks",
  "Improve our services and user experience",
  "Meet audit, regulatory, and compliance obligations",
];

const disclosure = [
  "Authorized employees, partners, and service providers who require the data to deliver our services",
  "Payment processors and verification partners strictly for transaction and compliance purposes",
  "Regulatory authorities, law enforcement agencies, courts, or government bodies where required by law or legal process",
  "Relevant authorities where disclosure is necessary in the public interest or to prevent fraud or criminal activity",
];

const yourRights = [
  "Access your personal data",
  "Request correction or deletion of inaccurate data",
  "Withdraw consent at any time",
  "Object to or restrict certain processing activities",
  "Lodge a complaint with the Nigeria Data Protection Commission (NDPC)",
];

const accessControl = [
  "Access the personal data we hold about you",
  "Request correction of inaccurate or incomplete data",
  "Request deletion of data where legally permissible",
];

const dataRetentionPoints = [
  "Deactivating or closing your account does not automatically erase all personal data",
  "Certain information, including identity records and transaction history, may be retained for as long as necessary to comply with legal, regulatory, audit, dispute resolution, or law enforcement requirements",
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
      <PageHeader title="Privacy Policy" />
      <section className="py-8 sm:py-12">
        <div className="container">
          <div className="grid lg:grid-cols-1 items-start gap-16 p-0 mx-auto max-w-5xl max-lg:max-w-2xl">
            <div>
              <h2 className="text-slate-900 text-2xl font-bold">Privacy Policy</h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">Last updated: {new Date().getFullYear()}</p>

              <div className="mt-8">
                <h2 className="text-slate-900 text-base font-semibold">Who we are:</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed mt-2">
                  Maxilotto.ng is operated by <strong>LukzerNet Nigeria Limited</strong>, a company duly incorporated under the laws of the Federal Republic of Nigeria.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed mt-2">
                  By accessing or using Maxilotto.ng, you confirm that you have read, understood, and agreed to the terms of this Privacy Policy. If you do not agree, please do not use our website or provide us with your personal information.
                </p>
              </div>

              <div className="mt-8">
                <h2 className="text-slate-900 text-base font-semibold">1. Purpose of Data Collection</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed mt-2">
                  Maxilotto collects and processes personal data strictly for legitimate purposes, including but not limited to:
                </p>
                <BulletList items={purposeOfCollection} />
                <p className="text-[15px] text-slate-600 leading-relaxed mt-3">
                  We only process personal data for the purposes for which it was collected.
                </p>
              </div>

              <div className="mt-8">
                <h2 className="text-slate-900 text-base font-semibold">2. Personal Information We Collect</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed mt-2">
                  We may collect and process the following categories of personal information:
                </p>
                <BulletList items={dataWeCollect} />
              </div>

              <div className="mt-8">
                <h2 className="text-slate-900 text-base font-semibold">3. Use of Personal Information</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed mt-2">
                  Your personal information may be used to:
                </p>
                <BulletList items={howWeUseData} />
                <p className="text-[15px] text-slate-600 leading-relaxed mt-3">
                  By providing your information, you confirm that its use in accordance with this Privacy Policy does not infringe your rights under applicable law.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">4. Marketing & Promotional Communications</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  From time to time, we may contact you via email, SMS, telephone, or other electronic means to inform you about new products or services, promotions, bonuses, special offers, and platform updates or events.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  You have the right to <strong>opt out</strong> of receiving marketing communications at any time by contacting us or using the unsubscribe options provided. Where permitted by law and in accordance with our <strong>Terms & Conditions</strong>, we may also publish limited winner information (such as first name, city, or image) for promotional purposes, subject to reasonable efforts to notify you in advance.
                </p>
              </div>

              <div className="mt-8">
                <h2 className="text-slate-900 text-base font-semibold">5. Disclosure of Personal Information</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed mt-2">
                  As a policy, Maxilotto does <strong>not sell or trade</strong> your personal information. We may disclose personal data only to:
                </p>
                <BulletList items={disclosure} />
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">6. Data Security</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Maxilotto safeguards your personal information using appropriate <strong>physical, electronic, and managerial security measures</strong> designed to protect against unauthorized access, loss, or misuse.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  While we take reasonable steps to protect your data, no method of transmission over the Internet is completely secure. Users are responsible for protecting their login credentials and personal devices.
                </p>
              </div>

              <div className="mt-8">
                <h2 className="text-slate-900 text-base font-semibold">7. Access to and Control of Your Information</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed mt-2">
                  Authorized members of Maxilotto management, compliance, and fraud prevention teams may access user data strictly on a need-to-know basis. You have the right to:
                </p>
                <BulletList items={accessControl} />
                <p className="text-[15px] text-slate-600 leading-relaxed mt-3">
                  We may require a written request and proof of identity before responding to certain data-related requests.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">8. Compliance with the Nigeria Data Protection Act (NDPA) 2023</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Maxilotto processes personal data strictly in accordance with the <strong>Nigeria Data Protection Act (NDPA) 2023</strong>. Our services are intended exclusively for users who are residents of and physically located in Nigeria. Only such users may exercise data protection rights under applicable Nigerian law.
                </p>
              </div>

              <div className="mt-8">
                <h2 className="text-slate-900 text-base font-semibold">9. Your Rights Under the NDPA</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed mt-2">
                  Subject to applicable law, you have the right to:
                </p>
                <BulletList items={yourRights} />
              </div>

              <div className="mt-8">
                <h2 className="text-slate-900 text-base font-semibold">10. Data Retention</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed mt-2">
                  You may request deactivation of your account and deletion of personal data when it is no longer required for the purposes for which it was collected. Please note that:
                </p>
                <BulletList items={dataRetentionPoints} />
                <p className="text-[15px] text-slate-600 leading-relaxed mt-3">
                  By continuing to use our services, you acknowledge and accept this data retention policy.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">11. Customer Support and Privacy Enquiries</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  For privacy-related enquiries, data access requests, or concerns, please contact our Customer Support team:
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:care@maxilotto.ng" className="text-primary-700 hover:underline">care@maxilotto.ng</a>
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  To protect your privacy and ensure accurate handling of sensitive matters, users are encouraged to contact our human Customer Support team through official channels only.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">12. Third-Party Websites</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Maxilotto.ng may contain links to third-party websites. We are not responsible for the privacy practices, content, or policies of such external sites. Users are encouraged to review the privacy policies of any third-party websites they visit.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-slate-900 text-base font-semibold">13. Changes to This Privacy Policy</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  We may update this Privacy Policy from time to time. Any changes will be published on this page and will take effect immediately upon posting.
                </p>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Continued use of Maxilotto.ng after updates constitutes acceptance of the revised Privacy Policy. Users are encouraged to review this policy regularly.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}