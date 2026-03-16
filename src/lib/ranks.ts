export interface RankDefinition {
  level: number;
  name: string;
  minWins: number;
  minAmount: number;
  color: string;
}

export const RANKS: RankDefinition[] = [
  { level: 1, name: "Newbie", minWins: 0, minAmount: 0, color: "#808080" },
  { level: 2, name: "Rookie", minWins: 1, minAmount: 1000, color: "#CD7F32" },
  { level: 3, name: "Scorer", minWins: 1, minAmount: 5000, color: "#CD7ABB" },
  { level: 4, name: "Pro", minWins: 2, minAmount: 10000, color: "#C0C0C0" },
  { level: 5, name: "Master", minWins: 4, minAmount: 25000, color: "#DDDAAA" },
  { level: 6, name: "Champion", minWins: 4, minAmount: 50000, color: "#FFD700" },
  { level: 7, name: "Legend", minWins: 5, minAmount: 100000, color: "#334700" },
  { level: 8, name: "Kingpin", minWins: 7, minAmount: 250000, color: "#E5EAA1" },
  { level: 9, name: "Tycoon", minWins: 10, minAmount: 500000, color: "#AAACC1" },
  { level: 10, name: "Don", minWins: 12, minAmount: 1000000, color: "#00CED1" },
  { level: 11, name: "Mogul", minWins: 15, minAmount: 2500000, color: "#9400D3" },
  { level: 12, name: "Sovereign", minWins: 20, minAmount: 5000000, color: "#FF1493" },
  { level: 13, name: "Overlord", minWins: 25, minAmount: 10000000, color: "#FF0000" },
  { level: 14, name: "Diety", minWins: 30, minAmount: 25000000, color: "#000000" },
  { level: 15, name: "GOAT", minWins: 35, minAmount: 50000000, color: "#310d46ff" }
];

export const getRankByName = (rankName?: string): RankDefinition | undefined => {
  if (!rankName) return RANKS[0]; // Default to Newbie
  return RANKS.find(r => r.name.toLowerCase() === rankName.toLowerCase());
};

export const getRankColor = (rankName?: string): string => {
  const rank = getRankByName(rankName);
  return rank ? rank.color : "#808080";
};
