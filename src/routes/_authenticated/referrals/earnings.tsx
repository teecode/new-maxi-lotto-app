import { createFileRoute, Link } from '@tanstack/react-router';
import PageHeader from '@/components/layouts/page-header';
import { useGetReferralTransactions } from '@/hooks/useReferrals';
import { formatCurrency } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';
import { ArrowLeft, Receipt, DollarSign, Calendar } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_authenticated/referrals/earnings')({
  component: EarningsPage,
});

function EarningsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const { data: transactionsData, isLoading } = useGetReferralTransactions(undefined, undefined, page, pageSize);

  const transactions = transactionsData?.data || [];
  const totalPages = transactionsData?.totalPages || 1;

  return (
    <>
      <PageHeader title="Referral Earnings" />
      
      <section className="py-8 sm:py-12 bg-slate-50/50 min-h-[calc(100vh-200px)]">
        <div className="container mx-auto px-4 max-w-4xl">
          
          <div className="mb-6 flex items-center justify-between">
            <Link to="/referrals" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Earnings History</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Detailed list of your referral commissions.</p>
              </div>
              <div className="p-3 bg-pink-50 rounded-xl">
                <Receipt className="w-6 h-6 text-pink-500" />
              </div>
            </div>

            {isLoading ? (
              <div className="p-12 text-center">
                <Spinner className="mx-auto text-pink-500" />
                <p className="text-sm text-slate-500 font-bold mt-4 animate-pulse">Loading transactions...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-16 text-center">
                <DollarSign className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-base font-bold text-slate-600">No earnings yet</p>
                <p className="text-sm text-slate-400 mt-1">Keep referring friends to earn commissions.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {transactions.map((tx, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    key={tx.id} 
                    className="p-6 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1 w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{tx.details || 'Referral Commission'}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(tx.date), 'MMM dd, yyyy h:mm a')}
                          </span>
                          {tx.referenceCode && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">Ref: {tx.referenceCode}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-black ${tx.amount < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                      </p>
                      <p className="text-xs text-slate-400 font-medium mt-1">Balance: {formatCurrency(tx.balanceAfter)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {!isLoading && totalPages > 1 && (
              <div className="p-6 border-t border-slate-100 flex items-center justify-between">
                <Button 
                  variant="outline" 
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="rounded-xl font-bold"
                >
                  Previous
                </Button>
                <p className="text-sm font-medium text-slate-500">
                  Page {page} of {totalPages}
                </p>
                <Button 
                  variant="outline" 
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="rounded-xl font-bold"
                >
                  Next
                </Button>
              </div>
            )}
          </div>

        </div>
      </section>
    </>
  );
}
