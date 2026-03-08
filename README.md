# MaxiLotto Online User Web

This repository houses the modern, user-facing online platform for MaxiLotto. It allows players directly register, deposit funds, browse game schedules, and securely place their bets.

## Features

- **Dynamic Game Lobbies**: Real-time integration displaying active "Today Games" and schedules.
- **Staking Interface**: User-friendly, responsive interface allowing players to select valid numbers directly onto betting slips.
- **Wallet & Cashier**: A secure hub for users to observe their balances, process deposits through integrated payment gateways, and request withdrawals.
- **Bet History**: Detailed tracking of user tickets, categorized by pending, winning, or losing states.
- **Authentication**: Full registration and secure login flows bridging to the .NET Backend APIs.
- **Responsive Animations**: Beautiful UI embellishments powered by Framer Motion.

## Tech Stack

We utilize a cutting-edge front-end stack ensuring speed, type safety, and maintainability:
- **Core**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [TanStack Router](https://tanstack.com/router) (Providing file-based route management)
- **State Management**: [TanStack Query (React-Query)](https://tanstack.com/query/latest) & [Zustand](https://zustand-demo.pmnd.rs/) / [@tanstack/store](https://tanstack.com/store/latest).
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: Extensive utilization of [shadcn/ui](https://ui.shadcn.com/) alongside [Radix UI](https://www.radix-ui.com/).
- **Package Manager**: [Bun](https://bun.sh/) (for ultra-fast package installations and script execution)

## Getting Started

### Prerequisites
- Install [Bun](https://bun.sh/) globally.
- Ensure the `MAXILOTTOBACKEND.ONLINEWEB` API is active or reachable.

### Running Locally

1. Install all required dependencies:
   ```bash
   bun install
   ```

2. Generate required TanStack Router code:
   ```bash
   bun run generate
   ```

3. Launch the local development server:
   ```bash
   bun --bun run dev
   ```

4. The application will be running at `http://localhost:3000`.

### Production Deployment
Production builds execute standard static transpilation using Vite. The resulting `dist` folder can be hosted practically anywhere (IIS, Nginx, Vercel). The automated pipeline utilizes:
```bash
bun --bun run build
```
