import BankCard from '@/components/bank-card'
import { EmptyCreditCard } from '@/components/empty-credit-card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import UserBalance from '@/components/user/user-balance'
import { useGetCreditCards } from '@/hooks/useCreditCards'
import { useUserProfile } from '@/hooks/useUserProfile'
import { Link } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import type { EmblaOptionsType } from 'embla-carousel'
import DataLoader from "@/components/data-loader.tsx";
import PageHeader from "@/components/layouts/page-header.tsx";

const OPTIONS: EmblaOptionsType = { slidesToScroll: 2 }

export const Route = createFileRoute('/_authenticated/wallet')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: user, isFetching: isUserFetching } = useUserProfile()
  const { data: creditCards, isLoading: isCardsLoading } = useGetCreditCards()

  return (
    <>
      <PageHeader title="My Wallet"/>
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {/* Balance */}
          <div className="mb-6 flex flex-col items-center gap-1">
            {isUserFetching ? (
              <DataLoader/>
            ) : (
              <UserBalance walletBalance={user?.walletBalance || 0} />
            )}
          </div>
        </div>
      </section>

      {/* credit card holder */}
      <section className="flex flex-col bg-gray-100 p-4">
        <div className="container mx-auto px-4">
          {/* add new */}
          <div className="flex justify-end mb-4">
            <Button variant="ghost" className="font-muted-foreground uppercase">
              Add New <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* cards */}
          {isCardsLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : !creditCards || creditCards.length === 0 ? (
            <EmptyCreditCard />
          ) : (
            <BankCard debitCards={creditCards} options={OPTIONS} />
          )}

          {/* deposit and withdraw buttons */}
          <div className="mt-6 flex justify-center gap-4">
            <Button
              size={"lg"}
              className="w-32 bg-[#FF005C] rounded-3xl text-white hover:bg-[#FF005C]/90"
              asChild
            >
              <Link to="/deposit">
                Deposit
              </Link>
            </Button>
            <Button
              size={"lg"}
              className="w-32 bg-[#0185B6] rounded-3xl text-white hover:bg-[#0185B6]/90"
              asChild
            >
              <Link to="/withdrawal">
                Withdraw
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}