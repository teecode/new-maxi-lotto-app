// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { toast } from "sonner";
import BetSlip from "./bet-slip";
import type { BetList, BetType, Game } from "@/types/game";

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() },
}));
vi.mock("@/services/GameService", () => ({
  fetchDailyStakeSum: vi.fn().mockResolvedValue({ sum: 0 }),
}));

const perm2: BetType = {
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
  minimumStake: 5,
  maximumStake: 10000,
};

const game = { gameName: "TITAN", gameID: 1, allowMachineNumberBet: true } as Game;

const numbers = (count: number) => Array.from({ length: count }, (_, i) => i + 1);

function renderSlip(selectedBalls: number[]) {
  const addBet = vi.fn<(bet: BetList) => void>();
  render(
    <BetSlip
      selectedBalls={selectedBalls}
      bankerBalls={[]}
      againstBalls={[]}
      selectedBetType={perm2}
      collisionCount={0}
      betLists={[]}
      setSelectedBalls={vi.fn()}
      setBankerBalls={vi.fn()}
      setAgainstBalls={vi.fn()}
      setSelectedBetType={vi.fn()}
      selectedGame={game}
      selectionMode="normal"
      isMainBall
      addBet={addBet}
    />,
  );
  return addBet;
}

const enterStakePerLine = (value: number) =>
  fireEvent.change(screen.getByPlaceholderText("Enter amount"), { target: { value: String(value) } });

const addToMyGames = () => fireEvent.click(screen.getByRole("button", { name: "Add to My Games" }));

describe("BetSlip stake limits", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await vi.runAllTimersAsync();
    vi.useRealTimers();
    cleanup();
  });

  it("accepts a stake per line below the minimum when the total stake is within the limits", () => {
    // 26 numbers on Perm 2 is 325 lines; 325 x 4 = 1,300.
    const addBet = renderSlip(numbers(26));

    enterStakePerLine(4);
    addToMyGames();

    expect(toast.error).not.toHaveBeenCalled();
    expect(addBet).toHaveBeenCalledTimes(1);
    expect(addBet.mock.calls[0][0]).toMatchObject({ numberOfLines: 325, amount: 4, stake: 1300 });
  });

  it("accepts a total stake exactly at the minimum", () => {
    const addBet = renderSlip(numbers(2));

    enterStakePerLine(5);
    addToMyGames();

    expect(addBet).toHaveBeenCalledTimes(1);
    expect(addBet.mock.calls[0][0]).toMatchObject({ numberOfLines: 1, stake: 5 });
  });

  it("rejects a bet whose total stake is below the minimum", () => {
    // One line at 4 is a total of 4.
    const addBet = renderSlip(numbers(2));

    enterStakePerLine(4);
    addToMyGames();

    expect(addBet).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(expect.stringMatching(/^Total stake must be between/));
  });

  it("rejects a bet whose total stake is above the maximum", () => {
    // 325 lines at 100 is 32,500, over the 10,000 limit the server enforces on the whole bet.
    const addBet = renderSlip(numbers(26));

    enterStakePerLine(100);
    addToMyGames();

    expect(addBet).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(expect.stringMatching(/^Total stake must be between/));
  });

  it("asks for a stake when none is entered", () => {
    const addBet = renderSlip(numbers(2));

    addToMyGames();

    expect(addBet).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith("Enter a stake per line.");
  });

  it("asks for more numbers before it looks at the stake", () => {
    const addBet = renderSlip(numbers(1));

    enterStakePerLine(100);
    addToMyGames();

    expect(addBet).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith("Select at least 2 ball(s).");
  });
});

describe("BetSlip Double Chance", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await vi.runAllTimersAsync();
    vi.useRealTimers();
    cleanup();
  });

  it("adds the bet as winning type 3 with possible winning on half the stake", () => {
    const addBet = renderSlip(numbers(2));

    enterStakePerLine(100);
    fireEvent.click(screen.getByRole("button", { name: "Double Chance" }));
    addToMyGames();

    // One line at 100: the customer pays 100 once, and 50 rides on each set at odds of 240.
    expect(addBet.mock.calls[0][0]).toMatchObject({ winningType: 3, stake: 100, maxWinning: 12000 });
  });

  it("orders the toggle Normal, DC, Machine", () => {
    renderSlip(numbers(2));

    const toggle = screen.getByRole("button", { name: "Double Chance" }).parentElement!;
    const labels = Array.from(toggle.querySelectorAll("button")).map((b) => b.textContent?.trim());

    expect(labels).toEqual(["Normal Bet", "DC", "Machine Bet"]);
  });

  it("shows the stake-split note only once there is an amount to split", () => {
    renderSlip(numbers(2));
    fireEvent.click(screen.getByRole("button", { name: "Double Chance" }));

    expect(screen.queryByText(/splits your stake in two/)).toBeNull();

    enterStakePerLine(100);

    expect(screen.getByText(/splits your stake in two/).textContent).toContain("₦50 on the winning numbers");
  });

  it("keeps the stake-split note hidden while no numbers are picked", () => {
    renderSlip([]);
    fireEvent.click(screen.getByRole("button", { name: "Double Chance" }));

    enterStakePerLine(100);

    expect(screen.queryByText(/splits your stake in two/)).toBeNull();
  });

  it("is not offered on a game that does not allow machine bets", () => {
    game.allowMachineNumberBet = false;
    try {
      renderSlip(numbers(2));
      expect(screen.queryByRole("button", { name: "Double Chance" })).toBeNull();
      expect(screen.queryByRole("button", { name: "Machine Bet" })).toBeNull();
    } finally {
      game.allowMachineNumberBet = true;
    }
  });
});
