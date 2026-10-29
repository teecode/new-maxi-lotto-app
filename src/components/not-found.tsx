import { Link } from '@tanstack/react-router'

// Shown for any URL the router does not know. components/seo-manager.tsx marks
// it noindex (the path is not in src/seo/site.ts), so it never lands in search.
const links = [
  { to: '/play', label: 'Play 5/90' },
  { to: '/results', label: 'Lotto results' },
  { to: '/games', label: "Today's games" },
  { to: '/how-to-play', label: 'How to play' },
  { to: '/download-app', label: 'Get the app' },
  { to: '/contact', label: 'Customer care' },
] as const

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A4B7F] via-[#0185B6] to-[#01B1A8] px-4 py-24 font-poppins">
      <div className="max-w-lg text-center text-white">
        <Link to="/" aria-label="MaxiLotto home">
          <img src="/footer-logo.png" alt="MaxiLotto" width={238} height={36} className="mx-auto mb-10" />
        </Link>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70">Error 404</p>
        <h1 className="mt-3 font-montserrat text-3xl sm:text-4xl font-bold">Page not found</h1>
        <p className="mt-4 text-white/85">
          The page you are looking for has moved or does not exist. These might help:
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-2xl bg-white/15 border border-white/25 px-4 py-3 text-sm font-semibold hover:bg-white/25 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3 font-bold shadow-lg hover:scale-[1.02] transition-transform"
        >
          Back to home
        </Link>
      </div>
    </section>
  )
}
