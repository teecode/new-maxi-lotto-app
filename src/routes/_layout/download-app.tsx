import { createFileRoute } from '@tanstack/react-router'
import { Download, ShieldCheck } from 'lucide-react'
import { GuidePage } from '@/components/content/guide-page'
import { APK_URL, DOWNLOAD_APP_GUIDE } from '@/content/download-app'

export const Route = createFileRoute('/_layout/download-app')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <GuidePage
      guide={DOWNLOAD_APP_GUIDE}
      id="download-app"
      top={
        <div className="rounded-3xl bg-gradient-to-br from-[#0A4B7F] via-[#0185B6] to-[#01B1A8] p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center gap-6">
          <img src="/pwa-192x192.png" alt="" width={96} height={96} className="size-20 sm:size-24 rounded-2xl shadow-lg shrink-0" />
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold">MaxiLotto for Android</h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-white/85">
              <ShieldCheck className="size-4" /> Official app, free, from maxilotto.ng
            </p>
          </div>
          <a
            href={APK_URL}
            download
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#0A4B7F] font-bold px-7 py-3 shadow-lg hover:scale-[1.02] transition-transform"
          >
            <Download className="size-5" /> Download the app
          </a>
        </div>
      }
    />
  )
}
