import Ball from '@/components/ball';
import { EmptyState } from '@/components/empty-state';
import { FavouriteBallDialog } from '@/components/favourite-ball-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useFetchFavouriteBalls, useUserProfile } from '@/hooks/useUserProfile';
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import PageHeader from "@/components/layouts/page-header.tsx";

export const Route = createFileRoute('/_authenticated/favourite-balls')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: user } = useUserProfile();
  const { data: favouriteBalls, isFetching } = useFetchFavouriteBalls(user);

  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader title="Favourite Ball"/>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="flex flex-col items-center w-full">

              {isFetching ? (
                <Spinner />
              ) : favouriteBalls && favouriteBalls.length > 0 ? (
                <div className="bg-white rounded-2xl shadow w-full max-w-sm py-6 px-4 flex flex-wrap gap-2">
                  {favouriteBalls.map((num: number) => (
                    <Ball
                      key={num}
                      value={num}
                      isSelected
                      className="bg-[#FFF100] rounded-full h-10 w-10 text-[#0A4B7F]"
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No Favourite Balls"
                  description="You have not added any favourite balls yet."
                />
              )}
            </div>
          </div>

          {/* add favourite balls */}
          <div className="flex justify-center items-center mt-8">
            <Button
              variant={"primary"}
              className="px-6 w-full uppercase bg-primary-900 text-white flex items-center gap-2 rounded"
              onClick={() => setOpen(true)}
            >
              Add Favourite Balls
            </Button>
          </div>

          {user && (
            <FavouriteBallDialog
              open={open}
              currentUser={user}
              favouriteBalls={favouriteBalls || []}
              setOpen={setOpen}
            />
          )}
        </div>
      </section>
    </>
  )
}