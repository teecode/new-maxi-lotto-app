import { Outlet, useLocation } from '@tanstack/react-router'
import { Image } from '@unpic/react'

const AuthLayout = () => {
  const location = useLocation()
  const isSignup = location.pathname.includes('/signup')
  
  const title = isSignup ? "Play Smart, Win Together." : "Win Big, Live Free."
  const subtitle = isSignup 
    ? "Create an account and join the excitement. Daily draws, instant wins, infinite possibilities." 
    : "Your next big win is just a click away. Join thousands of winners today."

  return (
    <div className="relative w-full min-h-screen font-poppins overflow-hidden bg-[#0f172a]">
      
      {/* ═══ FULL-SCREEN BACKGROUND ═══ */}
      <div className="absolute inset-0 z-0">
        {/* Deep Teal/Blue Gradient Overlay */}
        <div className="absolute inset-0 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-[#0f2d37] to-[#042f2e] z-0" />
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/40 via-transparent to-teal-900/30 mix-blend-overlay z-0" />
        
        {/* 3D FLOATING LOTTO BALLS (CSS only) */}
        {/* Ball 1 - Large, Top Left */}
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full opacity-60 animate-float-slow z-0">
           <div className="w-full h-full rounded-full bg-gradient-to-br from-teal-400 via-teal-600 to-teal-900 shadow-[inset_-20px_-20px_50px_rgba(0,0,0,0.5),_0_0_50px_rgba(45,212,191,0.3)]"></div>
        </div>
        
        {/* Ball 2 - Medium, Bottom Right */}
        <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-40 animate-float-delayed z-0">
           <div className="w-full h-full rounded-full bg-gradient-to-tl from-cyan-400 via-cyan-700 to-slate-900 shadow-[inset_20px_20px_60px_rgba(0,0,0,0.5),_0_0_60px_rgba(34,211,238,0.2)]"></div>
        </div>

        {/* Ball 3 - Small, Floating Centerish */}
        <div className="absolute top-[20%] right-[30%] w-32 h-32 rounded-full opacity-30 animate-bounce-slow z-0 blur-[2px]">
           <div className="w-full h-full rounded-full bg-gradient-to-b from-purple-400 via-purple-600 to-slate-900 shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.5)]"></div>
        </div>

        {/* Subtle Grid - Low Opacity */}
        <div 
          className="absolute inset-0 opacity-[0.02] z-10 pointer-events-none"
          style={{ 
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', 
            backgroundSize: '80px 80px' 
          }}
        />
      </div>

      {/* ═══ CONTENT LAYER ═══ */}
      <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row">
        
        {/* LEFT: Messaging (Desktop Only) - Occupies 50-60% */}
        <div className="hidden lg:flex flex-col justify-center w-[55%] p-16 xl:p-24 relative">
          
          {/* Logo */}
          <div className="mb-12">
            <div className="bg-white/5 backdrop-blur-sm inline-flex items-center gap-3 px-6 py-4 rounded-2xl border border-white/10 shadow-xl">
              <Image src="/maxilotto.png" alt="Maxi Lotto" width={180} height={56} className="h-10 w-auto object-contain brightness-0 invert drop-shadow-md" />
            </div>
          </div>

          {/* Hero Text */}
          <div className="space-y-8 max-w-2xl">
            <h1 className="text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.05] text-transparent bg-clip-text bg-gradient-to-r from-white via-teal-50 to-cyan-100 drop-shadow-sm">
              {title}
            </h1>
            <p className="text-xl text-teal-100/80 font-medium leading-relaxed max-w-lg border-l-4 border-teal-500/50 pl-6">
              {subtitle}
            </p>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex items-center gap-8">
            <div className="flex items-center gap-3 px-4 py-2 bg-teal-900/30 rounded-full border border-teal-500/20">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <span className="text-sm font-semibold text-emerald-100 tracking-wide">Secure & Licensed</span>
            </div>
             <div className="flex items-center gap-3 px-4 py-2 bg-cyan-900/30 rounded-full border border-cyan-500/20">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <span className="text-sm font-semibold text-blue-100 tracking-wide">Instant Payouts</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-12 text-xs text-slate-500/80 font-medium">
            © {new Date().getFullYear()} Maxilotto. All rights reserved.
          </div>
        </div>

        {/* RIGHT: Floating Glass Card (Form) - Center-Right */}
        <div className="w-full flex-1 flex items-center justify-center lg:justify-start lg:pl-12 p-6 h-screen">
          <div className="w-full max-w-[440px] p-8 sm:p-10 bg-[#0f172a]/60 lg:bg-[#0f172a]/40 backdrop-blur-xl border border-white/[0.08] rounded-3xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-inset ring-white/[0.05] relative overflow-hidden group">
            
            {/* Glossy Reflection Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] to-transparent pointer-events-none" />
            
            {/* Top Shine */}
            <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-br from-transparent via-white/[0.03] to-transparent group-hover:via-white/[0.05] transition-all duration-1000 rotate-45 pointer-events-none" />

            <Outlet />
          </div>
        </div>

      </div>
    </div>
  )
}

export default AuthLayout
