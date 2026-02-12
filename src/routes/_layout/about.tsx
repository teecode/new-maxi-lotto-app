import { createFileRoute } from '@tanstack/react-router'
import { Image } from '@unpic/react'

export const Route = createFileRoute('/_layout/about')({
  component: RouteComponent,
})

const featuresData = [
  {
    icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>),
    title: "Vision",
    description: "A transparent, mobile-first lotto experience that supports responsible play and delivers real value to players across Nigeria.",
  },
  {
    icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10zm0 14a1 1 0 1 1 1-1 1 1 0 0 1-1 1zm1-4a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0z"/></svg>), // Using a simpler 'Mission' icon or Target icon would be better
    title: "Mission",
    description: "Use secure technology, simple design, and instant wallet crediting to make lotto easy to understand, quick to play, and fair to win.",
  }
];

function RouteComponent() {
  return (
    <>
      <section
        className="py-20 sm:py-28 flex justify-center items-center relative bg-gradient-to-br from-[#0A4B7F] via-[#0185B6] to-[#01B1A8] overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        
        <h3 className="font-montserrat text-4xl sm:text-5xl text-white font-bold relative z-10 tracking-tight">About Us</h3>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 space-y-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-md:px-4">
            <div className="relative shadow-2xl shadow-indigo-600/40 rounded-2xl overflow-hidden shrink-0">
              <Image width={500} height={500} className="max-w-md w-full object-cover rounded-2xl"
                src="https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?q=80&w=451&h=451&auto=format&fit=crop"
                alt="" />
            </div>
            <div className="text-sm text-slate-600 max-w-lg">
              <h1 className="text-xl uppercase font-semibold text-slate-700">  MaxiLotto, by LukzerNet Nigeria Limited</h1>
              <div className="w-24 h-[3px] rounded-full bg-gradient-to-r from-primary-900 to-secondary-900"></div>
              <p className="mt-8">
                MaxiLotto is a modern 5/90 lotto platform created for today’s players—fast, transparent, and easy to use. As a brand of LukzerNet Nigeria Limited, we combine secure technology with clear rules and quick payouts, so you can focus on the thrill of the draw.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-5 max-md:px-4 mt-16">
            <div className="text-center">
              <h3 className="text-2xl uppercase font-bold text-[#0A4B7F] tracking-wide relative inline-block">
                Our Vision & Mission
                <span className="absolute -bottom-2 left-1/2 w-1/2 h-1 bg-gradient-to-r from-teal-400 to-cyan-500 -translate-x-1/2 rounded-full"></span>
              </h3>
            </div>

            <div className="w-full max-w-4xl mx-auto mt-12">
              <div className="grid md:grid-cols-2 gap-8">
                {featuresData.map((feature, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                  >
                    {/* Decorative gradient blob */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${index === 0 ? 'from-teal-500/10 to-cyan-500/10' : 'from-blue-500/10 to-indigo-500/10'} rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`} />
                    
                    <div className="relative z-10">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${index === 0 ? 'bg-teal-50 text-teal-600' : 'bg-blue-50 text-[#0A4B7F]'}`}>
                        {feature.icon}
                      </div>
                      
                      <h3 className="text-2xl font-bold font-montserrat text-gray-800 mb-4">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-base">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
