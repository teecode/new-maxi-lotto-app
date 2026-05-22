import { useQuery } from '@tanstack/react-query';
import { fetchReferees, fetchReferralTransactions } from '@/services/ReferralService';

export const useGetReferees = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ['referees', page, pageSize],
    queryFn: () => fetchReferees(page, pageSize),
    staleTime: 60000,
  });
};

export const useGetReferralTransactions = (fromDate?: string, toDate?: string) => {
  return useQuery({
    queryKey: ['referralTransactions', fromDate, toDate],
    queryFn: () => fetchReferralTransactions(fromDate, toDate),
    staleTime: 60000,
  });
};
