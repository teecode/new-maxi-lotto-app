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
    betTypeID: 1,
    nap: "1",
    napDescription: "1 Direct",
    code: "1 DIRECT",
    description: "1 Direct",
    groupCode: "",
    quickPlayCode: 0,
    winFactor: 40,
    minimumNumberOfBalls: 1,
    maximumNumberOfBalls: 1,
    minimumStake: 10,
    maximumStake: 50000,
  },
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

  it("renders next open draw, calculates 2 Sure potential win, and populates bet store on Play", async () => {
    render(<QuickPlayWidget />);

    expect(screen.getByText("MIDDAY 5/90")).toBeTruthy();
    // Default stake is 200 and 2 Direct winFactor is 240 -> 48,000
    expect(screen.getByText(/48,000/)).toBeTruthy();

    // Switch stake to 500 -> 120,000
    fireEvent.click(screen.getByRole("button", { name: "₦500" }));
    expect(screen.getByText(/120,000/)).toBeTruthy();

    // Switch mode to 1 Direct -> 500 * 40 = 20,000
    fireEvent.click(screen.getByRole("button", { name: "1 Direct" }));
    expect(screen.getByText(/20,000/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /Play This Ticket/i }));

    const state = useBetStore.getState();
    expect(state.selectedGame?.gameID).toBe(42);
    expect(state.betsList).toHaveLength(1);
    expect(state.betsList[0].betType.betTypeID).toBe(1);
    expect(state.betsList[0].selectedBalls).toHaveLength(1);
    expect(state.betsList[0].stake).toBe(500);
    expect(state.betsList[0].maxWinning).toBe(20000);
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/play" });
  });
});

