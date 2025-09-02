# NFT Claim Site Demo

A simple NFT claiming website showcasing [Coinbase Developer Platform (CDP) Embedded Wallets](https://www.coinbase.com/developer-platform/products/embedded-wallets) integrated with smart contracts using [Herd](https://herd.eco).

## Features

- **Email-based authentication** with OTP verification
- **Embedded wallet creation** - no browser extension required
- **Free NFT claiming** on Base mainnet
- **Real-time transaction tracking** and community activity

## Getting Started

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   - Get your CDP Project ID from [CDP Portal](https://portal.cdp.coinbase.com/projects)
   - Configure your domain at [Embedded Wallets Settings](https://portal.cdp.coinbase.com/products/embedded-wallets/)

3. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

## Tech Stack

- **Next.js 15** with TypeScript
- **CDP Embedded Wallets** for authentication and transactions
- **Herd API** for smart contract integration
- **Base** blockchain network

## How it Works

1. Users authenticate with their email (no wallet installation needed)
2. CDP creates an embedded wallet automatically
3. Users can claim free NFTs directly from the web interface
4. Herd API handles smart contract interactions seamlessly