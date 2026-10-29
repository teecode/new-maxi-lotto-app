export interface LeaderboardUser {
  customerId: number;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  rankName: string;       // e.g. "GOAT", "Legend", "Champion"
  rankLevel: number;      // 1 to 15 matching RANKS in ranks.ts
  rankStar: number;       // Star rating (1 to 5)
  totalWins: number;      // Total number of game wins
  totalAmountWon: number; // Total winnings accrued (used as tie-breaker)
  rankPosition?: number;  // Calculated leaderboard rank (1, 2, 3, etc. with ties)
  isCurrentUser?: boolean;
}
