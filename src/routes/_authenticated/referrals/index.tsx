import { createFileRoute } from '@tanstack/react-router';
import PageHeader from '@/components/layouts/page-header';
import { useGetReferees, useGetTotalReferralEarnings, useGetMyReferralPlan } from '@/hooks/useReferrals';
import { useUserProfile } from '@/hooks/useUserProfile';
import { formatCurrency } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';
import { Users, Trophy, DollarSign, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

import { Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/referrals/')({
  component: ReferralsPage,
});

function ReferralsPage() {
  const { data: user, isFetching: isUserFetching } = useUserProfile();
  
  const [page] = useState(1);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  
  const { data: refereesData, isLoading: isRefereesLoading } = useGetReferees(page, 50);
  const { data: totalEarnings, isLoading: isEarningsLoading } = useGetTotalReferralEarnings();
  const { data: myPlan } = useGetMyReferralPlan();

  const referees = refereesData?.data || [];
  
  const activeReferees = referees.filter((r) => r.isActive).length;

  const filteredReferees = referees.filter((r) => {
    if (filter === 'ACTIVE') return r.isActive;
    if (filter === 'INACTIVE') return !r.isActive;
    return true;
  });

  const getRankColor = (rank: string) => {
    const r = rank?.toLowerCase() || 'newbie';
    if (r.includes('champion') || r.includes('gold')) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    if (r.includes('legend') || r.includes('diamond')) return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';
    if (r.includes('master') || r.includes('pro')) return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
    return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
  };

  return (
    <>
      <PageHeader title="Referrals & Downlines" />
      
      <section className="relative py-12 sm:py-20 bg-slate-50/50 min-h-[calc(100vh-200px)] overflow-hidden font-poppins">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-500/5 blur-[120px] rounded-full -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-900/5 blur-[120px] rounded-full -z-10 -translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 relative max-w-6xl">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Total Earnings Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-xl shadow-slate-900/10 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <Link to="/referrals/earnings" className="absolute inset-0 z-10" />
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <DollarSign className="w-24 h-24 text-white" />
              </div>
              <div className="relative z-20 pointer-events-none">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Total Earnings</p>
                {isEarningsLoading ? (
                  <Spinner className="text-white my-4" />
                ) : (
                  <h3 className="text-3xl sm:text-4xl font-black text-white tabular-nums tracking-tighter group-hover:text-emerald-400 transition-colors truncate">
                    {formatCurrency(totalEarnings || 0)}
                  </h3>
                )}
                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold max-w-full">
                  <Activity className="w-3 h-3 shrink-0" />
                  <span className="truncate">
                    {myPlan?.expiryDurationMonths > 0 
                      ? `Policy: ${myPlan.expiryDurationMonths} Months Expiry` 
                      : 'Non-Expiry Policy'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* My Rank Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative overflow-hidden rounded-[2rem] bg-white border border-slate-100 p-8 shadow-xl shadow-slate-200/50"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <Trophy className="w-24 h-24 text-slate-900" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">My Current Rank</p>
              {isUserFetching ? (
                <Spinner className="text-pink-500 my-4" />
              ) : (
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter truncate">
                  {user?.rank || 'Newbie'}
                </h3>
              )}
              <p className="mt-4 text-xs font-medium text-slate-500">Keep referring and winning to level up!</p>
            </motion.div>

            {/* Downline Stats Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative overflow-hidden rounded-[2rem] bg-pink-500 p-8 shadow-xl shadow-pink-500/20"
            >
              <div className="absolute top-0 right-0 p-6 opacity-20">
                <Users className="w-24 h-24 text-white" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-200 mb-2">Total Downlines</p>
              {isRefereesLoading ? (
                <Spinner className="text-white my-4" />
              ) : (
                <h3 className="text-3xl sm:text-4xl font-black text-white tabular-nums tracking-tighter truncate">
                  {referees.length}
                </h3>
              )}
              <div className="mt-4 flex items-center gap-4 text-xs font-bold text-pink-100">
                <span>{activeReferees} Active</span>
                <span className="w-1 h-1 rounded-full bg-pink-200" />
                <span>{referees.length - activeReferees} Inactive</span>
              </div>
            </motion.div>
          </div>

          {/* Downline Table Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
          >
            <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Your Network</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">View and manage your referral downlines.</p>
              </div>
              
              {/* Filters */}
              <div className="flex bg-slate-100 p-1 rounded-xl w-full overflow-x-auto scrollbar-hide sm:w-max">
                {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                      filter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto w-full">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-black">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4">Total Winnings</th>
                    <th className="px-6 py-4">Date Joined</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isRefereesLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <Spinner className="mx-auto text-pink-500" />
                        <p className="text-xs text-slate-500 font-bold mt-4 animate-pulse">Loading downlines...</p>
                      </td>
                    </tr>
                  ) : filteredReferees.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <Users className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                        <p className="text-sm font-bold text-slate-600">No referrals found</p>
                        <p className="text-xs text-slate-400 mt-1">Invite friends to build your network.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredReferees.map((referee, idx) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        key={referee.id} 
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                              {referee.referredName?.[0]?.toUpperCase() || referee.referredUsername?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                                {referee.referredUsername}
                              </p>
                              <p className="text-xs text-slate-500">{referee.referredName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn("px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border", getRankColor(referee.referredRank))}>
                            {referee.referredRank || 'Newbie'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-700">
                          {formatCurrency(referee.totalWinningAmount || 0)}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {referee.date ? format(new Date(referee.date), 'MMM dd, yyyy') : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className={cn("w-2 h-2 rounded-full", referee.isActive ? "bg-emerald-500" : "bg-slate-300")} />
                            <span className="text-xs font-bold text-slate-600">
                              {referee.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 p-4 md:hidden bg-slate-50/50">
              {isRefereesLoading ? (
                <div className="py-12 text-center">
                  <Spinner className="mx-auto text-pink-500" />
                  <p className="text-xs text-slate-500 font-bold mt-4 animate-pulse">Loading downlines...</p>
                </div>
              ) : filteredReferees.length === 0 ? (
                <div className="py-16 text-center">
                  <Users className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-600">No referrals found</p>
                  <p className="text-xs text-slate-400 mt-1">Invite friends to build your network.</p>
                </div>
              ) : (
                filteredReferees.map((referee, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    key={`mobile-${referee.id}`} 
                    className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 font-bold border border-slate-200 shrink-0">
                          {referee.referredName?.[0]?.toUpperCase() || referee.referredUsername?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">
                            {referee.referredUsername}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{referee.referredName}</p>
                        </div>
                      </div>
                      <span className={cn("px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border shrink-0 ml-2", getRankColor(referee.referredRank))}>
                        {referee.referredRank || 'Newbie'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-black text-slate-400 mb-1">Total Winnings</p>
                        <p className="font-bold text-slate-700">{formatCurrency(referee.totalWinningAmount || 0)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-black text-slate-400 mb-1">Date Joined</p>
                        <p className="text-sm text-slate-500">{referee.date ? format(new Date(referee.date), 'MMM dd, yyyy') : 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-black text-slate-400">Status</span>
                      <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                        <span className={cn("w-2 h-2 rounded-full", referee.isActive ? "bg-emerald-500" : "bg-slate-300")} />
                        <span className="text-xs font-bold text-slate-700">
                          {referee.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            
            {/* Pagination / Load More (Placeholder for presentation) */}
            {!isRefereesLoading && filteredReferees.length > 0 && (
              <div className="p-4 border-t border-slate-100 flex justify-center">
                <p className="text-xs text-slate-400 font-medium">Showing top {filteredReferees.length} results</p>
              </div>
            )}
          </motion.div>

        </div>
      </section>
    </>
  );
}
