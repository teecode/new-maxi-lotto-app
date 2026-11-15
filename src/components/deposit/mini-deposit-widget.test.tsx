// @vitest-environment jsdom
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MiniDepositWidget } from "./mini-deposit-widget";
import type { MinimalUser } from "@/types/user";

const mockNavigate = vi.fn().mockResolvedValue(undefined);
const mockInvalidateQueries = vi.fn();
const mockDepositFunds = vi.fn();
const mockNewTransaction = vi.fn();

const sampleUser: MinimalUser = {
  customerId: 101,
  username: "adaokafor",
  displayName: "Ada Okafor",
  email: "player@maxilotto.ng",
  phoneNumber: "08012345678",
  token: "test-token",
  isVerified: true,
  isActive: true,
  walletBalance: 1500,
};

const mockAuthState = {
  isAuthenticated: true,
  minimalUser: sampleUser,
  syncUser: vi.fn().mockResolvedValue(undefined),
};

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, className }: { children: ReactNode; to: string; className?: string }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
}));

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
}));

vi.mock("@paystack/inline-js", () => ({
  default: class PaystackPop {
    newTransaction = mockNewTransaction;
  },
}));

vi.mock("@/services/PaymentService", () => ({
  depositFunds: (...args: unknown[]) => mockDepositFunds(...args),
}));

vi.mock("@/store/authStore", () => ({
  default: () => mockAuthState,
}));

describe("MiniDepositWidget", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthState.isAuthenticated = true;
    mockAuthState.minimalUser = sampleUser;
  });

  afterEach(() => {
    cleanup();
  });

  it("lets the user pick quick amounts, enforces minimum ₦100, and routes bank transfer deposits", () => {
    const onSuccess = vi.fn();
    render(<MiniDepositWidget onSuccess={onSuccess} />);

    const submitButton = screen.getByRole("button", { name: /Fund/i });
    expect(submitButton.textContent).toContain("1,000");

    fireEvent.click(screen.getByRole("button", { name: "₦2,000" }));
    expect(submitButton.textContent).toContain("2,000");

    const amountInput = screen.getByLabelText("Deposit amount in Naira");
    fireEvent.change(amountInput, { target: { value: "50" } });
    expect((submitButton as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "₦5,000" }));
    expect((submitButton as HTMLButtonElement).disabled).toBe(false);

    fireEvent.click(screen.getByRole("button", { name: /Bank Transfer/i }));
    fireEvent.click(submitButton);

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/deposit/sarepay-transfer",
      search: { amount: 5000 },
    });
  });

  it("renders a sign-in prompt when unauthenticated and no user prop is supplied", () => {
    mockAuthState.isAuthenticated = false;
    render(<MiniDepositWidget />);

    expect(screen.getByText("Quick Wallet Top-Up")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Sign In to Deposit" }).getAttribute("href")).toBe(
      "/auth/login",
    );
  });
});

