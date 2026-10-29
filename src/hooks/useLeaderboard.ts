import { useQuery } from '@tanstack/react-query';
import { fetchLeaderboardData } from '@/services/LeaderboardService';
import type { LeaderboardUser } from '@/types/leaderboard';
import useAuthStore from '@/store/authStore';

export const useLeaderboard = () => {
  const { minimalUser, user } = useAuthStore();
  const currentUser = user || minimalUser;

  return useQuery<LeaderboardUser[], Error>({
    queryKey: ['leaderboard', currentUser?.customerId, currentUser?.username],
    queryFn: () => fetchLeaderboardData(currentUser),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
