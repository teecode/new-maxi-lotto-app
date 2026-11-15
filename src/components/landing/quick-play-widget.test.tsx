// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import QuickPlayWidget from "./quick-play-widget";
import { getLagosDateKey } from "@/lib/utils";
import { useBetStore } from "@/store/bet-store";
import type { BetType, Game } from "@/types/game";

const mockNavigate = vi.fn().mockResolvedValue(undefined);

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

const futureEnd = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

const mockGame: Game = {
  gameName: "MIDDAY 5/90",
  gameID: 42,
  templateGameId: 1,
  gameType: null,
  gameDay: "Sunday",
  gameImageUrl: "",
  gameBackgroundImageUrl: "",
  gameCode: "MID",
  date: futureEnd,
  startDateTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  endDateTime: futureEnd,
  isValidated: false,
  isActive: true,
  isGhanaGame: false,
  result: null,
  allowMachineNumberBet: true,
};

const mockBetTypes: BetType[] = [
  {
    betTypeID: 2,
    nap: "2",
    napDescription: "2 Direct",
    code: "2 DIRECT",
    description: "2 Direct",
    groupCode: "",
    quickPlayCode: 0,
    winFactor: 240,
    minimumNumberOfBalls: 2,
    maximumNumberOfBalls: 2,
    minimumStake: 10,
    maximumStake: 50000,
  },
  {
    betTypeID: 3,
    nap: "P2",
    napDescription: "Perm 2",
    code: "PERM 2",
    description: "Perm 2",
    groupCode: "",
    quickPlayCode: 0,
    winFactor: 240,
    minimumNumberOfBalls: 2,
    maximumNumberOfBalls: 30,
    minimumStake: 10,
    maximumStake: 50000,
  },
];

vi.mock("@/hooks/useGames", () => ({
  useFetchDailyGames: () => ({ data: [mockGame], isLoading: false }),
  useGetBetTypes: () => ({ data: mockBetTypes }),
}));

describe("getLagosDateKey", () => {
  it("formats UTC 23:30 as next day in Africa/Lagos (UTC+1)", () => {
    const utcLateNight = new Date("2026-11-15T23:30:00.000Z");
    expect(getLagosDateKey(utcLateNight)).toBe("2026-11-16");
  });
});

describe("QuickPlayWidget", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    useBetStore.setState({ selectedGame: null, betsList: [] });
  });

  afterEach(() => {
    cleanup();
  });

  it("supports 2 Sure, Perm 2, and Normal / Double Chance / Machine modes", async () => {
    render(<QuickPlayWidget />);

    expect(screen.getByText("MIDDAY 5/90")).toBeTruthy();
    // Default stake is 100 and 2 Direct winFactor is 240 -> 24,000
    expect(screen.getByText(/24,000/)).toBeTruthy();

    // Switch to Perm 2 (default 4 balls -> 6 lines × 100 = 600; max win = 6 * 100 * 240 = 144,000)
    fireEvent.click(screen.getByRole("button", { name: "Perm 2" }));
    expect(screen.getByText(/6 lines × ₦100 = ₦600/)).toBeTruthy();
    expect(screen.getByText(/144,000/)).toBeTruthy();

    // Switch to Double Chance -> halves max winning (144,000 / 2 = 72,000)
    fireEvent.click(screen.getByRole("button", { name: "Double Chance" }));
    expect(screen.getByText(/72,000/)).toBeTruthy();

    // Switch stake to 200 -> 6 lines * 200 = 1,200; max win = 144,000
    fireEvent.click(screen.getByRole("button", { name: "₦200" }));
    expect(screen.getByText(/6 lines × ₦200 = ₦1,200/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /Play This Ticket/i }));

    const state = useBetStore.getState();
    expect(state.selectedGame?.gameID).toBe(42);
    expect(state.betsList).toHaveLength(1);
    expect(state.betsList[0].betType.betTypeID).toBe(3);
    expect(state.betsList[0].selectedBalls).toHaveLength(4);
    expect(state.betsList[0].numberOfLines).toBe(6);
    expect(state.betsList[0].stake).toBe(1200);
    expect(state.betsList[0].winningType).toBe(3);
    expect(state.betsList[0].maxWinning).toBe(144000);
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/play" });
  });
});
