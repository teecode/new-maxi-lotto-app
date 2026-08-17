import { useState, useEffect, useRef } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { RankStar } from '@/components/leaderboard/rank-star';
import { getRankColor } from '@/lib/ranks';
import { formatCurrency, cn } from '@/lib/utils';
import PageHeader from '@/components/layouts/page-header';
import { Spinner } from '@/components/ui/spinner';
import useAuthStore from '@/store/authStore';
import {
  Trophy,
  Crown,
  Medal,
  Search,
  Sparkles,
  ArrowUpRight,
  Flame,
  Award,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const Route = createFileRoute('/_layout/leaderboard')({
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const { data: leaderboard, isLoading } = useLeaderboard();
  const { isAuthenticated, user: fullUser, minimalUser } = useAuthStore();
  const currentUser = fullUser || minimalUser;

  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  // Refs for auto-scroll
  const rowRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Identify logged in user on the board
  const currentUserRecord = leaderboard?.find(
    (u) =>
      u.isCurrentUser ||
      (currentUser &&
        (u.customerId === currentUser.customerId ||
          u.username.toLowerCase() === currentUser.username.toLowerCase()))
  );

  // Auto-scroll to logged-in user on initial mount
  useEffect(() => {
    if (currentUserRecord && rowRefs.current[currentUserRecord.customerId]) {
      const timer = setTimeout(() => {
        const el = rowRefs.current[currentUserRecord.customerId];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setHighlightedId(currentUserRecord.customerId);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentUserRecord, leaderboard]);

  const scrollToUserRecord = () => {
    if (currentUserRecord && rowRefs.current[currentUserRecord.customerId]) {
      const el = rowRefs.current[currentUserRecord.customerId];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedId(currentUserRecord.customerId);
        // Re-trigger glow effect animation
        setTimeout(() => setHighlightedId(null), 4000);
      }
    }
  };

  // Filtered dataset for search
  const filteredLeaderboard = leaderboard?.filter((item) => {
    const matchesSearch =
      item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const top3 = leaderboard ? leaderboard.slice(0, 3) : [];
  // Arrange top 3 podium order: [2nd (Silver), 1st (Gold), 3rd (Bronze)]
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <PageHeader title="MaxiLotto Leaderboard" />

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[200px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold mb-4 backdrop-blur-md animate-pulse">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>TOP 20 RANKED PLAYERS</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
            Hall of <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">Champions</span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            Celebrating MaxiLotto's most formidable players ranked by tier achievement and accrued winnings. Place your bets and climb to the top!
          </p>

          {/* Quick stats summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-4 text-center backdrop-blur-md">
              <p className="text-xs text-slate-400 font-medium">Top Rank</p>
              <p className="text-lg sm:text-2xl font-black text-amber-400 mt-1">G.O.A.T 👑</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-4 text-center backdrop-blur-md">
              <p className="text-xs text-slate-400 font-medium">Top Winnings</p>
              <p className="text-lg sm:text-2xl font-black text-teal-400 mt-1">
                {top3[0] ? formatCurrency(top3[0].totalAmountWon) : '₦0'}
              </p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-4 text-center backdrop-blur-md">
              <p className="text-xs text-slate-400 font-medium">Active Contenders</p>
              <p className="text-lg sm:text-2xl font-black text-cyan-400 mt-1">Top 20</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-4 text-center backdrop-blur-md">
              <p className="text-xs text-slate-400 font-medium">Tie-Breaker</p>
              <p className="text-xs sm:text-sm font-bold text-slate-200 mt-1.5">Accrued Winnings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 pt-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner className="w-12 h-12 text-amber-400" />
            <p className="text-slate-400 text-sm mt-4 font-medium">Loading Leaderboard Champions...</p>
          </div>
        ) : (
          <>
            {/* === Podium Section (Top 3 Players) === */}
            {top3.length > 0 && (
              <div className="mb-16">
                <div className="text-center mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center justify-center gap-2">
                    <Crown className="w-6 h-6 text-amber-400" />
                    <span>The Top 3 Podium</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">The supreme leaders of MaxiLotto</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-5xl mx-auto">
                  {podiumOrder.map((player) => {
                    if (!player) return null;
                    const isFirst = player.rankPosition === 1;
                    const isSecond = player.rankPosition === 2;
                    const isThird = player.rankPosition === 3;

                    const color = getRankColor(player.rankName);

                    return (
                      <div
                        key={player.customerId}
                        className={cn(
                          "relative rounded-2xl p-6 transition-all duration-300 flex flex-col items-center text-center backdrop-blur-xl border",
                          isFirst && "md:-translate-y-4 bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-900 border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.25)] order-1 md:order-2",
                          isSecond && "bg-gradient-to-b from-slate-400/15 via-slate-900 to-slate-900 border-slate-400/30 shadow-lg order-2 md:order-1",
                          isThird && "bg-gradient-to-b from-amber-700/15 via-slate-900 to-slate-900 border-amber-700/30 shadow-lg order-3 md:order-3"
                        )}
                      >
                        {/* Crown / Badge */}
                        <div className="absolute -top-6">
                          {isFirst && (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/40 ring-4 ring-slate-950">
                              <Crown className="w-7 h-7 fill-slate-950" />
                            </div>
                          )}
                          {isSecond && (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-300 to-slate-100 flex items-center justify-center text-slate-950 shadow-md ring-4 ring-slate-950">
                              <Medal className="w-6 h-6 fill-slate-800" />
                            </div>
                          )}
                          {isThird && (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-700 flex items-center justify-center text-white shadow-md ring-4 ring-slate-950">
                              <Medal className="w-6 h-6 fill-amber-300" />
                            </div>
                          )}
                        </div>

                        {/* Rank Badge */}
                        <div className="mt-4 mb-3">
                          <span
                            className={cn(
                              "inline-block font-black text-sm px-3 py-1 rounded-full border shadow-sm",
                              isFirst && "bg-amber-400/20 text-amber-300 border-amber-400/40",
                              isSecond && "bg-slate-300/20 text-slate-200 border-slate-300/40",
                              isThird && "bg-amber-700/20 text-amber-400 border-amber-700/40"
                            )}
                          >
                            #{player.rankPosition} RANK
                          </span>
                        </div>

                        {/* Avatar */}
                        <div className="relative mb-3">
                          <div
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-xl font-bold text-white border-2 shadow-inner"
                            style={{
                              backgroundColor: `${color}33`,
                              borderColor: color,
                            }}
                          >
                            {player.username.charAt(0).toUpperCase()}
                          </div>
                          {player.isCurrentUser && (
                            <span className="absolute -bottom-1 -right-1 bg-teal-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-950">
                              YOU
                            </span>
                          )}
                        </div>

                        {/* Username & Rank Name */}
                        <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide truncate max-w-[200px]">
                          @{player.username}
                        </h3>

                        <div className="mt-1 mb-3 flex items-center gap-2">
                          <span
                            className="text-xs font-bold px-2.5 py-1 rounded-full border"
                            style={{
                              color: color,
                              backgroundColor: `${color}1F`,
                              borderColor: `${color}40`,
                            }}
                          >
                            {player.rankName}
                          </span>
                        </div>

                        {/* RankStar */}
                        <div className="mb-4">
                          <RankStar rankName={player.rankName} count={player.rankStar} size="md" showCount />
                        </div>

                        {/* Winnings accrued */}
                        <div className="w-full pt-3 border-t border-slate-800/80 flex flex-col items-center">
                          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Total Winnings</span>
                          <span className="text-base sm:text-lg font-black text-teal-400 mt-0.5">
                            {formatCurrency(player.totalAmountWon)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* === Search & Controls === */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Username or Rank Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 text-xs sm:text-sm rounded-xl pl-9 pr-4 py-2.5 border border-slate-800 focus:outline-none focus:border-amber-400/50 transition-colors"
                />
              </div>

              {/* Logged in user quick jump status */}
              {currentUserRecord ? (
                <button
                  onClick={scrollToUserRecord}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 border border-amber-500/30 text-xs sm:text-sm font-semibold transition-all duration-300"
                >
                  <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
                  <span>Your Rank: <strong>#{currentUserRecord.rankPosition}</strong> (@{currentUserRecord.username})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : isAuthenticated ? (
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>Logged in as <strong>@{currentUser?.username}</strong></span>
                </div>
              ) : (
                <Link
                  to="/auth/login"
                  className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1"
                >
                  Log in to highlight your position on the board <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {/* === Full Top 20 Rankings Table === */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md mb-12">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 text-xs uppercase font-bold tracking-wider">
                      <th className="py-4 px-4 sm:px-6 w-20 text-center">Rank</th>
                      <th className="py-4 px-4 sm:px-6">Customer (Username)</th>
                      <th className="py-4 px-4 sm:px-6">Rank Name</th>
                      <th className="py-4 px-4 sm:px-6 text-center">RankStar</th>
                      <th className="py-4 px-4 sm:px-6 text-center">Wins</th>
                      <th className="py-4 px-4 sm:px-6 text-right">Total Winnings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredLeaderboard && filteredLeaderboard.length > 0 ? (
                      filteredLeaderboard.map((userItem, index) => {
                        const isUserHighlighted =
                          userItem.isCurrentUser ||
                          highlightedId === userItem.customerId ||
                          (currentUser &&
                            (userItem.customerId === currentUser.customerId ||
                              userItem.username.toLowerCase() === currentUser.username.toLowerCase()));

                        const rankColor = getRankColor(userItem.rankName);
                        
                        // Check if tied rank with previous player
                        const isTied =
                          index > 0 &&
                          filteredLeaderboard[index - 1].rankPosition === userItem.rankPosition;

                        return (
                          <tr
                            key={userItem.customerId}
                            ref={(el) => {
                              rowRefs.current[userItem.customerId] = el;
                            }}
                            className={cn(
                              "transition-all duration-500 group hover:bg-slate-800/40",
                              isUserHighlighted
                                ? "bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 border-y-2 border-amber-400/80 shadow-[0_0_25px_rgba(251,191,36,0.35)] ring-2 ring-amber-400/60 animate-pulse"
                                : index % 2 === 0
                                ? "bg-slate-900/30"
                                : "bg-slate-950/30"
                            )}
                          >
                            {/* Rank Position */}
                            <td className="py-4 px-4 sm:px-6 text-center font-bold">
                              <div className="flex flex-col items-center justify-center">
                                {userItem.rankPosition === 1 ? (
                                  <span className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/50 flex items-center justify-center font-black text-sm shadow-sm">
                                    🥇
                                  </span>
                                ) : userItem.rankPosition === 2 ? (
                                  <span className="w-8 h-8 rounded-full bg-slate-300/20 text-slate-200 border border-slate-300/50 flex items-center justify-center font-black text-sm shadow-sm">
                                    🥈
                                  </span>
                                ) : userItem.rankPosition === 3 ? (
                                  <span className="w-8 h-8 rounded-full bg-amber-700/20 text-amber-400 border border-amber-700/50 flex items-center justify-center font-black text-sm shadow-sm">
                                    🥉
                                  </span>
                                ) : (
                                  <span className="text-slate-300 font-extrabold text-sm sm:text-base">
                                    #{userItem.rankPosition}
                                  </span>
                                )}
                                {isTied && (
                                  <span className="text-[10px] text-amber-400 font-semibold mt-0.5">
                                    (TIED)
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Username & Avatar */}
                            <td className="py-4 px-4 sm:px-6">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 border"
                                  style={{
                                    backgroundColor: `${rankColor}26`,
                                    borderColor: rankColor,
                                  }}
                                >
                                  {userItem.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm sm:text-base text-white truncate">
                                      @{userItem.username}
                                    </span>
                                    {isUserHighlighted && (
                                      <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 shadow-md">
                                        YOU
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-400 truncate">
                                    {userItem.displayName}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Rank Name */}
                            <td className="py-4 px-4 sm:px-6">
                              <span
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs"
                                style={{
                                  color: rankColor,
                                  backgroundColor: `${rankColor}1A`,
                                  borderColor: `${rankColor}40`,
                                }}
                              >
                                <Award className="w-3.5 h-3.5" style={{ color: rankColor }} />
                                {userItem.rankName}
                              </span>
                            </td>

                            {/* RankStar */}
                            <td className="py-4 px-4 sm:px-6 text-center">
                              <RankStar
                                rankName={userItem.rankName}
                                count={userItem.rankStar}
                                size="sm"
                                showCount
                              />
                            </td>

                            {/* Wins */}
                            <td className="py-4 px-4 sm:px-6 text-center">
                              <span className="inline-block px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-bold text-xs">
                                {userItem.totalWins} wins
                              </span>
                            </td>

                            {/* Total Winnings */}
                            <td className="py-4 px-4 sm:px-6 text-right font-black text-sm sm:text-base text-teal-400">
                              {formatCurrency(userItem.totalAmountWon)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                          No ranked players matched your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Floating Pill Button to scroll back to user rank if logged in */}
      {currentUserRecord && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={scrollToUserRecord}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs sm:text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-amber-400/30"
          >
            <Trophy className="w-4 h-4 fill-slate-950" />
            <span>My Rank (# {currentUserRecord.rankPosition})</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default LeaderboardPage;
