import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/withdrawal-policy')({
  component: RouteComponent,
})

function RouteComponent() {
  return (<section className="py-8 sm:py-12">
      <div className="container">
        <div className="grid lg:grid-cols-1 items-start gap-16 p-0 mx-auto max-w-5xl max-lg:max-w-2xl">
          <div>
            <h2 className="text-slate-900 text-2xl font-bold">Withdrawal Policy</h2>
            {/*<div className="mt-8">*/}
            {/*  <h2 className="text-slate-900 text-base font-semibold">Play Smart. Play Safe.</h2> */}
            {/*</div>*/}

            <div className="mt-8 space-y-4">
              <p className="text-[15px] text-slate-600 leading-relaxed">
                {/*Gambling should be fun, not stressful. Set a budget, take breaks, and never chase losses. If you need a*/}
                {/*pause, use Self-Exclusion to temporarily or permanently restrict your account. 18+ only.*/}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
