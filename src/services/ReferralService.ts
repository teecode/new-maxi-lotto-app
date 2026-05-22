import apiClient from '@/utils/apiClient';

export interface Referee {
  id: number;
  referrerName: string;
  referredName: string;
  referredUsername: string;
  date: string;
  referralType: number;
  referralCode: string;
  referralTypeName: string;
  isActive: boolean;
  commission: number;
  commissionSchedule: string;
  commissionType: string;
  referredRank: string;
  totalWinningAmount: number;
  winningCount: number;
}

export interface PaginatedReferees {
  data: Referee[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
}

export interface ReferralTransaction {
  id: number;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  date: string;
  details: string;
  referenceCode: string;
  ip: string;
  transactionCategory: number;
}

export interface PaginatedReferralTransactions {
  data: ReferralTransaction[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
}

export const fetchReferees = async (page = 1, pageSize = 10): Promise<PaginatedReferees> => {
  try {
    const response = await apiClient.get<PaginatedReferees>('referral/referees', {
      params: { page, pageSize },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || 'Failed to fetch referees.');
    }
    throw new Error('Network error, please try again.');
  }
};

export const fetchReferralTransactions = async (
  fromDate?: string,
  toDate?: string
): Promise<PaginatedReferralTransactions> => {
  try {
    const response = await apiClient.get<PaginatedReferralTransactions>('referral/Transactions', {
      params: { FromDate: fromDate, ToDate: toDate },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || 'Failed to fetch referral transactions.');
    }
    throw new Error('Network error, please try again.');
  }
};
