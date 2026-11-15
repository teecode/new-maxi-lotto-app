import type { Game } from "@/types/game";

/** Sorts draws so today's open games come first (soonest closing first), followed by closed today, tomorrow, and later. */
export function sortGamesForPlay(games: Game[]): Game[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  const dayOf = (g: Game) => {
    const d = new Date(g.endDateTime);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  const todayActive = games
    .filter((g) => dayOf(g).getTime() === today.getTime() && new Date(g.endDateTime) > now)
    .sort((a, b) => new Date(a.endDateTime).getTime() - new Date(b.endDateTime).getTime());

  const todayInactive = games
    .filter((g) => dayOf(g).getTime() === today.getTime() && new Date(g.endDateTime) <= now)
    .sort((a, b) => new Date(b.endDateTime).getTime() - new Date(a.endDateTime).getTime());

  const tomorrowGames = games
    .filter((g) => dayOf(g).getTime() === tomorrow.getTime())
    .sort((a, b) => new Date(a.endDateTime).getTime() - new Date(b.endDateTime).getTime());

  const laterGames = games
    .filter((g) => dayOf(g) >= dayAfterTomorrow)
    .sort((a, b) => new Date(a.endDateTime).getTime() - new Date(b.endDateTime).getTime());

  return [...todayActive, ...todayInactive, ...tomorrowGames, ...laterGames];
}

