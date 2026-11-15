import { Link } from "@tanstack/react-router";
import { BellRing, Download, ShieldCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APK_URL } from "@/content/download-app";

export default function AppDownloadBanner() {
  return (
    <section className="py-12 sm:py-16 bg-[#091527] text-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 max-w-2xl">
            <img
              src="/pwa-192x192.png"
              alt="MaxiLotto App Icon"
              width={88}
              height={88}
              loading="lazy"
              className="size-20 sm:size-22 rounded-2xl shadow-xl ring-2 ring-white/20 shrink-0"
            />
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/15 border border-cyan-400/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                <Smartphone className="w-3.5 h-3.5" /> Official Android App &amp; iOS Web App
              </span>
              <h2 className="mt-2.5 text-2xl sm:text-3xl font-extrabold tracking-tight">
                Play Faster &amp; Get Instant Draw Alerts
              </h2>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                Same MaxiLotto account, wallet, and tickets on your phone. Download the official Android APK from maxilotto.ng or install directly to your home screen.
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified official APK
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BellRing className="w-4 h-4 text-[#FFF100]" /> Live draw &amp; win alerts
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#FFF100] hover:bg-[#ffe84a] text-[#0A4B7F] font-extrabold px-7 h-12 shadow-lg"
            >
              <a href={APK_URL} download>
                <Download className="w-4 h-4 mr-2" />
                Download Android App
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/25 bg-white/10 hover:bg-white/20 text-white font-bold px-6 h-12"
            >
              <Link to="/download-app">Install Guide</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

