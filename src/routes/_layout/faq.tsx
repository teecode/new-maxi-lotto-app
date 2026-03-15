import FaqData from '@/components/faq-data'
import { createFileRoute } from '@tanstack/react-router'
import PageHeader from "@/components/layouts/page-header.tsx";

export const Route = createFileRoute('/_layout/faq')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <PageHeader title="Faq" className="uppercase"/>

      <section className="relative py-12 sm:py-24 bg-slate-50/50 min-h-[calc(100vh-200px)] overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-sky-500/5 blur-[120px] rounded-full -z-10 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-slate-900/5 blur-[120px] rounded-full -z-10 translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
                Frequently Asked <span className="text-pink-500">Questions</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                Everything you need to know about MaxiLotto. Can&apos;t find what you&apos;re looking for? Reach out to our support team.
              </p>
            </div>
            
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              <FaqData />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
