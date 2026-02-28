import ContactForm from '@/components/contact-form'
import { createFileRoute } from '@tanstack/react-router'
import { Globe, PhoneCall } from 'lucide-react'
import PageHeader from "@/components/layouts/page-header.tsx";

export const Route = createFileRoute('/_layout/contact')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <PageHeader title="Contacts"/>

    <section className="py-8 sm:py-12">
      <div className="container">
        <div className="grid lg:grid-cols-2 items-start gap-16 p-0 mx-auto max-w-5xl max-lg:max-w-2xl">
          <div>
            <h2 className="text-slate-900 text-2xl font-bold">We’re Here to Help</h2>
            <p className="text-[15px] text-slate-600 mt-4 leading-relaxed">Have a question about tickets, payouts, or promos? Send us a message and we’ll get back to you.</p>
            <div className="mt-8">
              <h3 className="text-slate-900 text-base font-semibold">Phone Number</h3>
              <ul className="mt-2">
                <li className="flex items-center">
                  <div className="bg-[#e6e6e6cf] h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <PhoneCall size={20} />
                  </div>
                  <a href="tel:09024284147" className="text-sm ml-4">
                    <span className="font-semibold text-slate-600">+234 902 428 4147</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <h3 className="text-slate-900 text-base font-semibold">Office Address</h3>
              <ul className="mt-2">
                <li className="flex items-center">
                  <div className="bg-[#e6e6e6cf] h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <Globe size={20} />
                  </div>
                  <a href="javascript:void(0);" className="text-sm ml-4">
                    <span className="font-semibold text-slate-600">B13 Behind13 City Park, Express Junction Udu Road, Delta State</span>
                  </a>
                </li>
              </ul>
            </div>

          </div>

          <div className="lg:ml-auto space-y-4">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
    </>
  )
}
