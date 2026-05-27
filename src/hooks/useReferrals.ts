import { useQuery } from '@tanstack/react-query';
import { fetchReferees, fetchReferralTransactions, fetchTotalReferralEarnings, fetchMyReferralPlan } from '@/services/ReferralService';

export const useGetReferees = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ['referees', page, pageSize],
    queryFn: () => fetchReferees(page, pageSize),
    staleTime: 60000,
  });
};

export const useGetReferralTransactions = (fromDate?: string, toDate?: string, page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ['referralTransactions', fromDate, toDate, page, pageSize],
    queryFn: () => fetchReferralTransactions(fromDate, toDate, page, pageSize),
    staleTime: 60000,
  });
};

export const useGetTotalReferralEarnings = () => {
  return useQuery({
    queryKey: ['totalReferralEarnings'],
    queryFn: () => fetchTotalReferralEarnings(),
    staleTime: 60000,
  });
};

export const useGetMyReferralPlan = () => {
  return useQuery({
    queryKey: ['myReferralPlan'],
    queryFn: () => fetchMyReferralPlan(),
    staleTime: 60000,
  });
};
