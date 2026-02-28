import { ChangePasswordForm } from '@/components/settings/change-password-form'
import { createFileRoute } from '@tanstack/react-router'
import PageHeader from "@/components/layouts/page-header.tsx";

export const Route = createFileRoute(
  '/_authenticated/settings/change-password',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <PageHeader title="Passwod Settings"/>
      {/* === change password form === */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <ChangePasswordForm />
        </div>

      </section>
    </>
  )
}
