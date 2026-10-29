import AuthLayout from '@/components/layouts/auth-layout'
import { createFileRoute, redirect } from '@tanstack/react-router'

const fallback = '/account/profile' as const

export const Route = createFileRoute('/auth')({
  // A plain function rather than a zod schema: route options are loaded with the
  // app's first bundle, and zod would come with them.
  validateSearch: (search: Record<string, unknown>): { redirect?: string } =>
    search.redirect === undefined ? {} : { redirect: typeof search.redirect === 'string' ? search.redirect : '' },
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback })
    }
  },
  component: AuthLayout,
})

