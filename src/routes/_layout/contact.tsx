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

      <section className="relative py-12 sm:py-24 bg-slate-50/50 overflow-hidden min-h-[calc(100vh-200px)]">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/5 blur-[120px] rounded-full -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-900/5 blur-[120px] rounded-full -z-10 -translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
              
              {/* Contact Information Column */}
              <div className="space-y-12 animate-in fade-in slide-in-from-left-8 duration-700">
                <div className="space-y-4">
                  <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                    We&apos;re Here to <span className="text-pink-500">Help.</span>
                  </h2>
                  <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md">
                    Have a question about tickets, payouts, or promos? Send us a message and our team will get back to you shortly.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                  {/* Phone Card */}
                  <div className="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.04)] transition-all duration-300">
                    <div className="flex items-center gap-5">
                      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20 group-hover:scale-110 transition-transform duration-300">
                        <PhoneCall size={24} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Call Us</p>
                        <a href="tel:09024284147" className="text-lg font-bold text-slate-900 hover:text-pink-500 transition-colors">
                          +234 902 428 4147
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Address Card */}
                  <div className="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.04)] transition-all duration-300">
                    <div className="flex items-start gap-5">
                      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 text-slate-900 border border-slate-200 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-300 shrink-0">
                        <Globe size={24} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Visit Us</p>
                        <p className="text-base font-bold text-slate-700 leading-snug">
                          B13 Behind City Park, Express Junction Udu Road, Delta State, Nigeria
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optional: Add social proof or help text below details if needed */}
              </div>

              {/* Contact Form Column */}
              <div className="lg:sticky lg:top-32 animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
                <div className="relative p-1 rounded-[3rem] bg-gradient-to-br from-slate-200 to-transparent shadow-2xl">
                  <div className="bg-white p-8 sm:p-10 rounded-[2.8rem] space-y-8">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-slate-900">Send a Message</h3>
                      <p className="text-sm text-slate-400 font-medium">We typically respond within 2-4 hours</p>
                    </div>
                    <ContactForm />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  )
}
