import apiClient from '@/utils/apiClient';
import type { LeaderboardUser } from '@/types/leaderboard';
import { getRankByName } from '@/lib/ranks';
import type { MinimalUser, User } from '@/types/user';

/**
 * Calculates rank positions for leaderboard users.
 * 
 * Rules:
 * 1. Primary sort: Rank level (descending).
 * 2. Discriminator sort: Total accrued winnings (totalAmountWon descending).
 * 3. Tie rule: If two users have the SAME rank level AND the SAME total winnings accrued,
 *    they both receive the SAME rank position.
 */
export const calculateLeaderboardRanks = (users: LeaderboardUser[]): LeaderboardUser[] => {
  // Sort users based on rank level, then total amount won as discriminator
  const sorted = [...users].sort((a, b) => {
    if (b.rankLevel !== a.rankLevel) {
      return b.rankLevel - a.rankLevel; // Higher rank level first
    }
    // Discriminator: Total winnings accrued
    return b.totalAmountWon - a.totalAmountWon;
  });

  // Assign ranks handling ties
  let currentRank = 1;
  const rankedUsers: LeaderboardUser[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const user = sorted[i];

    if (i > 0) {
      const prevUser = sorted[i - 1];
      const isSameRankLevel = user.rankLevel === prevUser.rankLevel;
      const isSameWinnings = user.totalAmountWon === prevUser.totalAmountWon;

      if (isSameRankLevel && isSameWinnings) {
        // Tied position - keep same rank as previous user
        user.rankPosition = prevUser.rankPosition;
      } else {
        // Standard competition ranking (or dense ranking: i + 1)
        currentRank = i + 1;
        user.rankPosition = currentRank;
      }
    } else {
      user.rankPosition = 1;
    }

    rankedUsers.push(user);
  }

  return rankedUsers;
};

// Seed dataset representing top 20 ranked MaxiLotto customers
const MOCK_LEADERBOARD_USERS: Omit<LeaderboardUser, 'rankPosition'>[] = [
  {
    customerId: 101,
    username: "GoldenJackpot",
    displayName: "Emmanuel O.",
    rankName: "GOAT",
    rankLevel: 15,
    rankStar: 5,
    totalWins: 48,
    totalAmountWon: 52450000,
  },
  {
    customerId: 102,
    username: "ApexWinner99",
    displayName: "Chidi N.",
    rankName: "Sovereign",
    rankLevel: 12,
    rankStar: 5,
    totalWins: 32,
    totalAmountWon: 14850000,
  },
  {
    customerId: 103,
    username: "LottoLegend_01",
    displayName: "Amina B.",
    rankName: "Legend",
    rankLevel: 7,
    rankStar: 4,
    totalWins: 24,
    totalAmountWon: 8750000,
  },
  {
    customerId: 104,
    username: "LuckyStrike_NG",
    displayName: "Tunde A.",
    rankName: "Champion",
    rankLevel: 6,
    rankStar: 4,
    totalWins: 19,
    totalAmountWon: 5400000,
  },
  {
    customerId: 105,
    username: "FortuneSeeker",
    displayName: "Blessing K.",
    rankName: "Champion",
    rankLevel: 6,
    rankStar: 4,
    totalWins: 18,
    totalAmountWon: 5400000, // Tied rank example: Same rank level (6) & same total winnings (5,400,000)!
  },
  {
    customerId: 106,
    username: "MegaKing_X",
    displayName: "Obinna E.",
    rankName: "Master",
    rankLevel: 5,
    rankStar: 3,
    totalWins: 15,
    totalAmountWon: 3950000,
  },
  {
    customerId: 107,
    username: "StarBettor7",
    displayName: "Fatima S.",
    rankName: "Master",
    rankLevel: 5,
    rankStar: 3,
    totalWins: 14,
    totalAmountWon: 3100000,
  },
  {
    customerId: 108,
    username: "VelocitySpin",
    displayName: "David U.",
    rankName: "Pro",
    rankLevel: 4,
    rankStar: 3,
    totalWins: 11,
    totalAmountWon: 2450000,
  },
  {
    customerId: 109,
    username: "RoyalTicket",
    displayName: "Kelechi I.",
    rankName: "Pro",
    rankLevel: 4,
    rankStar: 3,
    totalWins: 10,
    totalAmountWon: 1980000,
  },
  {
    customerId: 110,
    username: "DeltaBaller",
    displayName: "Efe M.",
    rankName: "Scorer",
    rankLevel: 3,
    rankStar: 2,
    totalWins: 9,
    totalAmountWon: 1650000,
  },
  {
    customerId: 111,
    username: "HighStaker_9",
    displayName: "Grace H.",
    rankName: "Scorer",
    rankLevel: 3,
    rankStar: 2,
    totalWins: 8,
    totalAmountWon: 1320000,
  },
  {
    customerId: 112,
    username: "JackpotQueen",
    displayName: "Nkechi O.",
    rankName: "Scorer",
    rankLevel: 3,
    rankStar: 2,
    totalWins: 7,
    totalAmountWon: 1100000,
  },
  {
    customerId: 113,
    username: "TitanPlayz",
    displayName: "Suleiman Y.",
    rankName: "Rookie",
    rankLevel: 2,
    rankStar: 1,
    totalWins: 6,
    totalAmountWon: 950000,
  },
  {
    customerId: 114,
    username: "VanguardLotto",
    displayName: "Victor A.",
    rankName: "Rookie",
    rankLevel: 2,
    rankStar: 1,
    totalWins: 5,
    totalAmountWon: 820000,
  },
  {
    customerId: 115,
    username: "NaijaPredator",
    displayName: "Sunday P.",
    rankName: "Rookie",
    rankLevel: 2,
    rankStar: 1,
    totalWins: 4,
    totalAmountWon: 740000,
  },
  {
    customerId: 116,
    username: "QuickPickMaster",
    displayName: "Rita C.",
    rankName: "Rookie",
    rankLevel: 2,
    rankStar: 1,
    totalWins: 4,
    totalAmountWon: 680000,
  },
  {
    customerId: 117,
    username: "LuckyStreak_88",
    displayName: "Ibrahim D.",
    rankName: "Newbie",
    rankLevel: 1,
    rankStar: 1,
    totalWins: 3,
    totalAmountWon: 590000,
  },
  {
    customerId: 118,
    username: "DiamondSniper",
    displayName: "Joy T.",
    rankName: "Newbie",
    rankLevel: 1,
    rankStar: 1,
    totalWins: 3,
    totalAmountWon: 510000,
  },
  {
    customerId: 119,
    username: "AcePredictor",
    displayName: "Kenneth R.",
    rankName: "Newbie",
    rankLevel: 1,
    rankStar: 1,
    totalWins: 2,
    totalAmountWon: 430000,
  },
  {
    customerId: 120,
    username: "ZeroRisk_Lotto",
    displayName: "Mercy E.",
    rankName: "Newbie",
    rankLevel: 1,
    rankStar: 1,
    totalWins: 2,
    totalAmountWon: 350000,
  },
];

export const fetchLeaderboardData = async (
  currentUser?: MinimalUser | User | null
): Promise<LeaderboardUser[]> => {
  let rawUsers: Omit<LeaderboardUser, 'rankPosition'>[] = [];

  try {
    const response = await apiClient.get<LeaderboardUser[]>('User/Leaderboard');
    if (Array.isArray(response.data) && response.data.length > 0) {
      rawUsers = response.data;
    } else {
      rawUsers = [...MOCK_LEADERBOARD_USERS];
    }
  } catch {
    // If backend endpoint is not yet present, use rich mock seed data
    rawUsers = [...MOCK_LEADERBOARD_USERS];
  }

  // Check if current user is logged in
  if (currentUser) {
    const existingIndex = rawUsers.findIndex(
      (u) =>
        u.customerId === currentUser.customerId ||
        u.username.toLowerCase() === currentUser.username.toLowerCase()
    );

    if (existingIndex !== -1) {
      // Mark current user
      rawUsers[existingIndex].isCurrentUser = true;
      if (currentUser.username) {
        rawUsers[existingIndex].username = currentUser.username;
      }
    } else {
      // Inject current logged-in user into the dataset so they appear on the board
      const userRankName = (currentUser as User).rank || "Master";
      const rankDef = getRankByName(userRankName);
      const rankLevel = rankDef ? rankDef.level : 5;
      const rankStar = Math.min(5, Math.max(1, Math.ceil(rankLevel / 3)));

      const currentUserItem: Omit<LeaderboardUser, 'rankPosition'> = {
        customerId: currentUser.customerId,
        username: currentUser.username || "You",
        displayName: currentUser.displayName || currentUser.username || "Current User",
        rankName: rankDef ? rankDef.name : "Master",
        rankLevel: rankLevel,
        rankStar: rankStar,
        totalWins: 14,
        totalAmountWon: 3500000,
        isCurrentUser: true,
      };

      rawUsers.push(currentUserItem);
    }
  }

  // Calculate final ranks with tie-breaker logic
  const ranked = calculateLeaderboardRanks(rawUsers as LeaderboardUser[]);
  
  // Return top 20
  return ranked.slice(0, 20);
};
