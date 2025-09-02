# Quickstart

## Overview

Build a dapp using Coinbase Developer Platform (CDP) embedded wallet in under 5 minutes! This guide shows you how to integrate our wallet infrastructure directly into your React application using our [`cdp-create-app`](https://www.npmjs.com/package/@coinbase/create-cdp-app) package.

<Tip>
  Check out the [CDP Web SDK reference](https://coinbase.github.io/cdp-web) for comprehensive method signatures, types, and examples.
</Tip>

<Accordion title="What is an embedded wallet?">
  An **embedded wallet** is a crypto wallet built directly into your app. Unlike traditional wallets (like MetaMask) that require browser extensions and seed phrases, embedded wallets let users sign in with just their email, a familiar experience for most users.

  Key benefits:

  * **No downloads**: Works instantly in any browser
  * **Email sign-in**: No seed phrases to lose
  * **You control the UX**: Seamlessly integrated into your app
</Accordion>

## Prerequisites

* A free [CDP Portal](https://portal.cdp.coinbase.com) account and project
* [Node.js 22+](https://nodejs.org/en/download)
* A node package manager installed (i.e., `npm`, `pnpm`, or `yarn`)
* Basic familiarity with React and TypeScript

Let's get started by scaffolding a new React app with the necessary dependencies.

## 1. Add your domain

To begin, add your domain to the list of [allowed domains](https://portal.cdp.coinbase.com/products/embedded-wallets/domains) in CDP Portal.

<Steps titleSize="p">
  <Step title="Access CDP Portal">
    Navigate to the [Domains Configuration](https://portal.cdp.coinbase.com/products/embedded-wallets/domains) in CDP Portal, and click **Add domain** to include your local app.

    <Frame>
      <img src="https://mintlify.s3.us-west-1.amazonaws.com/coinbase-prod/images/cors-config-add-domain.png" alt="Add domain dialog in CDP Portal" />
    </Frame>
  </Step>

  <Step title="Add your domain">
    Use `http://localhost:3000` (the port your demo app will run locally).

    <Frame>
      <img src="https://mintlify.s3.us-west-1.amazonaws.com/coinbase-prod/images/cors-config-with-localhost.png" alt="Domain configuration with localhost" />
    </Frame>

    <Warning>
      Do not do this in your CDP project intended for production use. Malicious apps running locally could impersonate your frontend and abuse your project credentials.
    </Warning>
  </Step>

  <Step title="Save your changes">
    Click **Add domain** again to save your changes.

    <Frame>
      <img src="https://mintlify.s3.us-west-1.amazonaws.com/coinbase-prod/images/cors-config-with-domain.png" alt="Domain configuration saved in CDP Portal" />
    </Frame>

    You should see your local app URL listed in the CDP Portal dashboard. The allowlist will take effect immediately upon saving.
  </Step>
</Steps>

## 2. Create the demo app

<Steps titleSize="p">
  <Step title="Create a new demo app">
    Use the latest version of `cdp-app` to create a new demo app using your package manager:

    <CodeGroup>
      ```bash npm
      npm create @coinbase/cdp-app@latest
      ```

      ```bash pnpm
      pnpm create @coinbase/cdp-app@latest
      ```

      ```bash yarn
      yarn create @coinbase/cdp-app@latest
      ```
    </CodeGroup>

    Let this run in the background and move on to the next step.
  </Step>

  <Step title="Copy your Project ID">
    While the app is being created, navigate to [CDP Portal](https://portal.cdp.coinbase.com) and select your project from the top-left dropdown. Clicking the gear icon will take you to your project details:

    <Frame>
      <img src="https://mintlify.s3.us-west-1.amazonaws.com/coinbase-prod/images/embedded-wallet-project-id.png" alt="CDP Project ID in project settings" />
    </Frame>

    Copy the **Project ID** value. You will use this in the next step when configuring your demo app.
  </Step>
</Steps>

## 3. Configure

Follow the prompts to configure your app with an embedded wallet. Name your project, select `React` as a template, and enter your CDP Project ID that you copied in the previous step.

```console
Ok to proceed? (y) y

> npx
> create-cdp-app

✔ Project name: … cdp-app-react
✔ Select a template: › React
✔ CDP Project ID (Find your project ID at https://portal.cdp.coinbase.com/projects/overview): … 8c21e60b-c8af-4286-a0d3-111111111111
✔ Confirm you have whitelisted 'http://localhost:3000' by typing 'y' … y
```

## 4. Run

Navigate to your project directory, install dependencies, and start the development server:

<CodeGroup>
  ```bash npm
  cd cdp-app-react
  npm install
  npm run dev
  ```

  ```bash pnpm
  cd cdp-app-react
  pnpm install
  pnpm dev
  ```

  ```bash yarn
  cd cdp-app-react
  yarn install
  yarn dev
  ```
</CodeGroup>

On successful startup, you should see similar to the following:

```console
  VITE v7.0.5  ready in 268 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## 5. Demo your new wallet

Now that your embedded wallet is configured and your app is running, let's try it out.

<Steps titleSize="p">
  <Step title="Sign in">
    Head to [http://localhost:3000](http://localhost:3000) and click the **Sign In** button.

    <Frame>
      <img src="https://mintlify.s3.us-west-1.amazonaws.com/coinbase-prod/images/embedded-wallet-1-signin.png" alt="CDP React Demo Sign In" />
    </Frame>
  </Step>

  <Step title="Enter your email">
    <Frame>
      <img src="https://mintlify.s3.us-west-1.amazonaws.com/coinbase-prod/images/embedded-wallet-2-continue-with-email.png" alt="CDP React Demo Email" />
    </Frame>
  </Step>

  <Step title="Verify">
    Enter the verification code sent to your e-mail.

    <Frame>
      <img src="https://mintlify.s3.us-west-1.amazonaws.com/coinbase-prod/images/embedded-wallet-3-verify.png" alt="CDP React Demo Verify" />
    </Frame>
  </Step>

  <Step title="View your new wallet">
    Congrats! Your new embedded wallet has been created, authenticated, and is ready to use on the [Base Sepolia](https://sepolia.basescan.org/) network.

    <Accordion title="What is Base?">
      **Base** is a fast, low-cost blockchain built by Coinbase. **Base Sepolia** is its test network where you can experiment with fake money (testnet ETH) before deploying to production.
    </Accordion>

    From the demo app, you can copy-and-paste your wallet address from the top-right corner. You can also monitor your wallet balance and (eventually -- keep reading!) send transactions. You should see similar to the following:

    <Frame>
      <img src="https://mintlify.s3.us-west-1.amazonaws.com/coinbase-prod/images/embedded-wallet-4-post-signin.png" alt="CDP React Demo Transaction" />
    </Frame>

    Find record of your new wallet on Base Sepolia explorer using the URL: `https://sepolia.basescan.org/address/YOUR-WALLET-ADDRESS`.
  </Step>

  <Step title="Fund your wallet with testnet ETH">
    Before you can send transactions, you'll need to fund your wallet with testnet ETH. Follow the link to request testnet funds from a Base [Faucet](/faucets/introduction/welcome).

    <Accordion title="What is a transaction?">
      A blockchain transaction transfers cryptocurrency between wallets. Unlike bank transfers, they're:

      * **Public**: Visible on the blockchain
      * **Permanent**: Cannot be reversed
      * **Fast**: Usually complete in seconds
      * **Fee-based**: Require "gas" fees to process
    </Accordion>

    <Accordion title="What are testnet funds?">
      **Testnet funds** are fake cryptocurrency for testing. You get them free from a **faucet** (a service that "drips" test ETH to developers). Testnet funds are "play money" you can use for experimenting, without risking real money.
    </Accordion>

    <Frame>
      <img src="https://mintlify.s3.us-west-1.amazonaws.com/coinbase-prod/images/embedded-wallet-demo-faucet.png" alt="CDP React Demo Fund Wallet" />
    </Frame>
  </Step>

  <Step title="Send your first transaction">
    Now that your wallet has testnet ETH, you can send your first transaction! The demo app allows you to send 0.000001 ETH to yourself as a test.

    Click **Send Transaction** to initiate the transfer. Once complete, you'll see a transaction hash that you can look up on the blockchain explorer.

    <Frame>
      <img src="https://mintlify.s3.us-west-1.amazonaws.com/coinbase-prod/images/embedded-wallet-5-post-tx.png" alt="CDP React Demo Transaction" />
    </Frame>

    🎉 You've successfully created an embedded wallet and sent your first transaction! Try adding some [React Hooks](/embedded-wallets/react-hooks) or additional [components](/embedded-wallets/react-components) to expand your app.
  </Step>
</Steps>

## How it works

Want to customize your app or understand how CDP makes wallets so simple? Let's look at the key components that power your new embedded wallet.

The demo app is built with React and [Vite](https://vite.dev/), organized into these main files:

```
src/
├── App.tsx              # Main app component with authentication state
├── SignInScreen.tsx     # Sign-in UI component
├── SignedInScreen.tsx   # Post-authentication UI with balance tracking
├── Header.tsx           # Header with wallet address and auth button
├── Transaction.tsx      # Transaction sending component
├── UserBalance.tsx      # Balance display component
├── Loading.tsx          # Loading state component
├── Icons.tsx            # Icon components
├── config.ts            # CDP configuration
├── theme.ts             # Custom theme configuration
├── main.tsx             # Entry point
└── index.css            # Styles
```

<Tip>
  You can explore the package for this demo in more detail at [npmjs.com](https://www.npmjs.com/package/@coinbase/create-cdp-app?activeTab=code).
</Tip>

### Entry point + provider setup

`src/main.tsx` demonstrates how to wrap your app with the `CDPReactProvider` to enable CDP functionality throughout the component tree.

```tsx src/main.tsx
import { CDPReactProvider } from "@coinbase/cdp-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import { APP_CONFIG, CDP_CONFIG } from "./config.ts";
import { theme } from "./theme.ts";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CDPReactProvider config={CDP_CONFIG} app={APP_CONFIG} theme={theme}>
      <App />
    </CDPReactProvider>
  </StrictMode>,
);
```

<Accordion title="More on CDPReactProvider">
  The `CDPReactProvider` shares wallet functionality with your entire app, so any component can check if a user is signed in, get a wallet address, or send transactions.

  Without the Provider wrapping your app, none of your components would be able to use CDP's wallet features.
</Accordion>

With just this single provider, your entire app gains:

* **Embedded wallets**: No MetaMask or browser extensions required
* **Email authentication**: Users sign in like any Web2 app
* **Automatic key management**: CDP handles all private keys securely
* **Built-in theme support**: Match your brand with the `theme` prop

The `CDP_CONFIG` contains your **Project ID** from setup, stored securely in an environment variable (`VITE_CDP_PROJECT_ID`).

The `APP_CONFIG` contains metadata about your application:

* **name**: Your app's display name shown in the wallet UI
* **logoUrl**: URL to your app's logo displayed during authentication

Here's the complete `src/config.ts` file:

```tsx src/config.ts
import { type Config } from "@coinbase/cdp-core";
import { type AppConfig } from "@coinbase/cdp-react";

export const CDP_CONFIG: Config = { projectId: import.meta.env.VITE_CDP_PROJECT_ID };

export const APP_CONFIG: AppConfig = {
  name: "CDP React StarterKit",
  logoUrl: "http://localhost:3000/logo.svg",
};
```

<Tip>
  **Using Next.js?** Check out our [Next.js integration guide](/embedded-wallets/nextjs) for`"use client"` requirements and common gotchas.
</Tip>

### Auth state management

`src/App.tsx` demonstrates how CDP simplifies wallet state management with two simple hooks:

<Accordion title="What are React hooks?">
  React hooks are functions that start with `use` (like `useIsInitialized`). They let your components:

  * Remember information (state)
  * Connect to external systems (like CDP)
  * React to changes (like when a user signs in)

  Your app uses these hooks to decide what to render on screen.
</Accordion>

```tsx src/App.tsx
import { useIsInitialized, useIsSignedIn } from "@coinbase/cdp-hooks";

import Loading from "./Loading";
import SignedInScreen from "./SignedInScreen";
import SignInScreen from "./SignInScreen";

function App() {
  const { isInitialized } = useIsInitialized();
  const { isSignedIn } = useIsSignedIn();

  return (
    <div className="app flex-col-container flex-grow">
      {!isInitialized && <Loading />}
      {isInitialized && (
        <>
          {!isSignedIn && <SignInScreen />}
          {isSignedIn && <SignedInScreen />}
        </>
      )}
    </div>
  );
}

export default App;
```

CDP provides these powerful hooks:

* `useIsInitialized()`: Know when CDP is ready (no manual provider checks!)
* `useIsSignedIn()`: Instant auth status (no complex wallet connection state)

Unlike traditional Web3 apps that manage wallet providers, connection states, account changes, and network switches, CDP handles everything behind the scenes. Your app just checks if the user is signed in.

### Sign-in interface

`src/SignInScreen.tsx` showcases the power of CDP's embedded wallets - just one component handles everything:

```tsx src/SignInScreen.tsx
import { AuthButton } from "@coinbase/cdp-react/components/AuthButton";

function SignInScreen() {
  return (
    <main className="card card--login">
      <h1 className="sr-only">Sign in</h1>
      <p className="card-title">Welcome!</p>
      <p>Please sign in to continue.</p>
      <AuthButton />
    </main>
  );
}

export default SignInScreen;
```

The `AuthButton` component handles:

* **Email authentication**: No seed phrases or private keys
* **Wallet creation**: Automatically creates a wallet on first sign-in
* **Session management**: Handles tokens and persistence
* **UI/UX**: Professional auth flow with email verification

Compare this to traditional Web3 auth that requires wallet detection, connection flows, network switching, and error handling. CDP reduces hundreds of lines of code to a single component.

### The authenticated experience

`src/SignedInScreen.tsx` shows how CDP makes blockchain interactions as simple as Web2 development.

First, we get the user's wallet address with a single hook:

```tsx src/SignedInScreen.tsx
import { useEvmAddress, useIsSignedIn } from "@coinbase/cdp-hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPublicClient, http, formatEther } from "viem";
import { baseSepolia } from "viem/chains";
```

CDP provides instant access to:

* `useEvmAddress()`: The user's wallet address (no wallet connection flow needed)
* `useIsSignedIn()`: Auth status, which works just like any Web2 auth system (no complex wallet connection state)

Notice what's missing? No wallet provider setup, no connection management, no account change listeners. CDP handles it all.

<Accordion title="What is an Ethereum address?">
  An Ethereum address is a unique string of letters and numbers (like `0x742d35Cc6634C0532925a3b844Bc9e7595f7E123`) that identifies your wallet on the Ethereum network.

  Think of it like an email address: people can send cryptocurrency to it just like they'd send messages to your inbox. Your Ethereum address is public and shareable, but only you can access the funds sent to it.
</Accordion>

<Accordion title="What is EVM?">
  EVM stands for **Ethereum Virtual Machine**. It acts as the operating system that runs smart contracts and processes transactions on Ethereum and Ethereum-compatible blockchains.

  The EVM runs programs (smart contracts) on the blockchain. Many blockchains like Base, Polygon, and Avalanche are "EVM-compatible," meaning they use the same system as Ethereum. This is why:

  * The same wallet address works across all EVM chains
  * You can use the same tools and code
  * Developers can easily deploy to multiple chains

  When you see "EVM" in function names like `useEvmAddress()` or `sendEvmTransaction()`, it means these work with any EVM-compatible blockchain, not just Ethereum.
</Accordion>

We use viem to read blockchain data, but the wallet itself is managed entirely by CDP:

```tsx src/SignedInScreen.tsx
// Create a read-only client for Base Sepolia
const client = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

function SignedInScreen() {
  const isSignedIn = useIsSignedIn();
  const evmAddress = useEvmAddress();  // CDP provides the wallet address
  const [balance, setBalance] = useState<bigint | undefined>(undefined);
```

The `useEvmAddress()` hook gives us access to the user's CDP-managed wallet address. This address is created and secured by CDP's embedded wallet infrastructure - no seed phrases or private keys to manage.

<Accordion title="What are seed phrases and private keys?">
  Traditional wallets require users to manage:

  * **Private key**: A long secret code that controls the wallet
  * **Seed phrase**: 12-24 words to recover the private key

  CDP eliminates this complexity - users just sign in with email, and CDP securely manages the keys.
</Accordion>

For balance tracking, we query the blockchain using the CDP-provided address:

```tsx src/SignedInScreen.tsx
  const getBalance = useCallback(async () => {
    if (!evmAddress) return;
    
    // Query the blockchain for the CDP wallet's balance
    const balance = await client.getBalance({
      address: evmAddress,  // The CDP embedded wallet address
    });
    setBalance(balance);
  }, [evmAddress]);

  // Refresh balance on mount and every 500ms
  useEffect(() => {
    getBalance();
    const interval = setInterval(getBalance, 500);
    return () => clearInterval(interval);
  }, [getBalance]);
```

Finally, we compose the authenticated UI with CDP components:

```tsx src/SignedInScreen.tsx
  return (
    <>
      <Header />  {/* Contains CDP's AuthButton for sign out */}
      <main className="main flex-col-container flex-grow">
        <div className="main-inner flex-col-container">
          <div className="card card--user-balance">
            <UserBalance balance={formattedBalance} />
          </div>
          <div className="card card--transaction">
            {isSignedIn && evmAddress && (
              <Transaction 
                balance={formattedBalance} 
                onSuccess={getBalance}  // Refresh after CDP transaction
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
```

Key CDP integration points:

* The `Transaction` component uses CDP's `useSendEvmTransaction` hook
* The `Header` includes CDP's `AuthButton` for session management
* All wallet operations are handled by CDP's embedded wallet infrastructure

### Sending transactions

`src/Transaction.tsx` demonstrates how to send ETH using CDP's transaction hooks.

First, we set up the component with CDP hooks and state management:

```tsx src/Transaction.tsx
import { useSendEvmTransaction, useEvmAddress } from "@coinbase/cdp-hooks";
import { Button } from "@coinbase/cdp-react/components/Button";
import { LoadingSkeleton } from "@coinbase/cdp-react/components/LoadingSkeleton";
import { type MouseEvent, useCallback, useMemo, useState } from "react";

interface Props {
  balance?: string;
  onSuccess?: () => void;
}

function Transaction(props: Props) {
  const { balance, onSuccess } = props;
  const { sendEvmTransaction } = useSendEvmTransaction();  
  const { evmAddress } = useEvmAddress();                 
  const [isPending, setIsPending] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
```

Key CDP hooks:

* `useSendEvmTransaction()`: Sends transactions using the CDP embedded wallet
* `useEvmAddress()`: Gets the current user's wallet address

Next, we check if the user has funds to send:

```tsx src/Transaction.tsx
  const hasBalance = useMemo(() => {
    return balance && balance !== "0";
  }, [balance]);
```

Then we create the transaction handler using CDP's `sendEvmTransaction`:

```tsx src/Transaction.tsx
  const handleSendTransaction = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      if (!evmAddress) return;

      e.preventDefault();
      setIsPending(true);

      const { transactionHash } = await sendEvmTransaction({
        transaction: {
          to: evmAddress,              // Send to yourself for testing
          value: 1000000000000n,       // 0.000001 ETH in wei
          gas: 21000n,                 // Standard ETH transfer gas limit
          chainId: 84532,              // Base Sepolia testnet
          type: "eip1559",             // Modern gas fee model
        },
        evmAccount: evmAddress,        // Your CDP wallet address
        network: "base-sepolia",       // Target network
      });

      setTransactionHash(transactionHash);
      setIsPending(false);
      onSuccess?.();
    },
    [evmAddress, sendEvmTransaction, onSuccess],
  );
```

<Accordion title="Understanding the transaction code">
  **Why we use wei**: Wei is the smallest unit of ETH. Like how a dollar has 100 cents, 1 ETH has 1,000,000,000,000,000,000 wei (that's 18 zeros!). We use wei to avoid rounding errors when dealing with tiny amounts.

  **`gas`**: The computational fee for processing your transaction. More complex operations = more gas. The actual cost depends on network congestion (like surge pricing).

  **`chainId`**: A unique identifier for each blockchain network (e.g., 1 for Ethereum mainnet, [84532](https://chainlist.org/chain/84532) for Base Sepolia). This prevents transactions from one network being replayed on another.

  **The `n` suffix**: JavaScript's BigInt notation for handling numbers larger than `Number.MAX_SAFE_INTEGER` (2^53 - 1). Essential for blockchain math where we deal with 18-decimal precision!
</Accordion>

<Accordion title="What is EIP-1559?">
  [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) is a transaction type that is a major upgrade to how gas fees work in Ethereum (and EVM-compatible chains like Base). It was introduced to make transaction fees more predictable and to reduce fee volatility.

  Before EIP-1559, users would "bid" gas prices manually, with transactions stuck or overpaid (whoever paid more had a higher chance of being mined faster).

  With EIP-1559, each block has a base fee that is algorithmically adjusted depending on network demand, with users adding a priority fee (tip) to incentivize miners/validators. Overpaid gas (beyond what's needed) is refunded.
</Accordion>

The CDP SDK handles:

* Private key management (you never see or touch private keys)
* Transaction signing
* Broadcasting to the network
* Gas price estimation (though you can override)

<Accordion title="What is transaction signing?">
  Signing a transaction proves you authorized the payment:

  1. Your private key creates a unique digital signature
  2. This signature proves you own the wallet
  3. The network verifies the signature before processing

  With CDP, this happens automatically when you call `sendEvmTransaction` so you don't need to understand the cryptography behind it!
</Accordion>

Finally, the UI renders different content based on the transaction state:

```tsx src/Transaction.tsx
  return (
    <>
      {transactionHash ? (
        // Success state
        <>
          <h2>Transaction sent</h2>
          <a href={`https://sepolia.basescan.org/tx/${transactionHash}`}>
            {transactionHash.slice(0, 6)}...{transactionHash.slice(-4)}
          </a>
          <Button onClick={() => setTransactionHash(null)}>
            Send another transaction
          </Button>
        </>
      ) : (
        // Pre-transaction state (ready to send or needs funds)
        <>
          {hasBalance ? (
            <Button onClick={handleSendTransaction} isPending={isPending}>
              Send Transaction
            </Button>
          ) : (
            <p>Get testnet ETH from the faucet first!</p>
          )}
        </>
      )}
    </>
  );
```

The component intelligently handles different states:

* Loading skeletons while fetching balance
* Empty wallet state with faucet link
* Ready state with send button
* Success state with transaction hash and option to send another

### Wallet management header

`src/Header.tsx` provides a clean interface for users to view their wallet address and manage their session.

```tsx src/Header.tsx
function Header() {
  const evmAddress = useEvmAddress();  // Get the user's wallet address
  const [isCopied, setIsCopied] = useState(false);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(evmAddress);
    setIsCopied(true);
    // Reset after 2 seconds
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <header>
      <h1>CDP React StarterKit</h1>
      <div className="user-info">
        {/* Copy wallet address button */}
        <button onClick={copyAddress}>
          {isCopied ? <IconCheck /> : <IconCopy />}
          <span>{evmAddress.slice(0, 6)}...{evmAddress.slice(-4)}</span>
        </button>
        
        {/* Sign out button */}
        <AuthButton />
      </div>
    </header>
  );
}
```

Key features:

* **Wallet display**: Shows truncated address (e.g., `0x1234...5678`)
* **Copy to clipboard**: One-click copying with visual feedback
* **Session management**: Sign out via CDP's `AuthButton`

### Balance display

`src/UserBalance.tsx` displays the user's ETH balance with a helpful faucet link.

```tsx src/UserBalance.tsx
function UserBalance({ balance }: { balance?: string }) {
  return (
    <>
      <h2 className="card-title">Available balance</h2>
      <p className="user-balance">
        {balance === undefined && <LoadingSkeleton />}
        {balance !== undefined && (
          <span className="flex-row-container">
            <img src="/eth.svg" alt="" className="balance-icon" />
            <span>{balance}</span>
          </span>
        )}
      </p>
      <p>
        Get testnet ETH from{" "}
        <a href="https://portal.cdp.coinbase.com/products/faucet">
          Base Sepolia Faucet
        </a>
      </p>
    </>
  );
}
```

Key features:

* Shows ETH balance with an icon
* Loading skeleton while fetching balance
* Direct link to the faucet for getting testnet funds

### Theme customization

The demo app provides extensive theming capabilities through CSS variables and the CDP theme system, allowing you to fully customize the look and feel to match your brand.

```tsx src/theme.ts
export const theme: Partial<Theme> = {
  "colors-bg-default": "var(--cdp-example-card-bg-color)",
  "colors-bg-overlay": "var(--cdp-example-bg-overlay-color)",
  "colors-bg-skeleton": "var(--cdp-example-bg-skeleton-color)",
  "colors-bg-primary": "var(--cdp-example-accent-color)",
  "colors-bg-secondary": "var(--cdp-example-bg-low-contrast-color)",
  "colors-fg-default": "var(--cdp-example-text-color)",
  "colors-fg-muted": "var(--cdp-example-text-secondary-color)",
  "colors-fg-primary": "var(--cdp-example-accent-color)",
  "colors-fg-onPrimary": "var(--cdp-example-accent-foreground-color)",
  "colors-fg-onSecondary": "var(--cdp-example-text-color)",
  "colors-line-default": "var(--cdp-example-card-border-color)",
  "colors-line-heavy": "var(--cdp-example-text-secondary-color)",
  "colors-line-primary": "var(--cdp-example-accent-color)",
  "font-family-sans": "var(--cdp-example-font-family)",
  "font-size-base": "var(--cdp-example-base-font-size)",
  // ... maps to CSS variables defined in index.css
};
```

The app includes:

* **Dark mode support**: Enables light and dark themes
* **Customizable colors**: Primary accent, backgrounds, text, borders, and more
* **Typography control**: Font family and base font size
* **Responsive breakpoints**: Different styles for mobile, tablet, and desktop
* **Component theming**: Style CDP components like buttons, inputs, and modals

All theme values are defined as CSS variables in `index.css`, making it easy to rebrand the entire app by updating a few color values.

For more information on theme customization, see the [theme customization documentation](/embedded-wallets/react-components#3-customize-theme-optional).

## What to read next

* [`create-cdp-app`](https://www.npmjs.com/package/@coinbase/create-cdp-app): View the `npm` package directly
* [**CDP Web SDK Documentation**](https://coinbase.github.io/cdp-web): Comprehensive API reference for the CDP Web SDK
* [**End User Authentication**](/embedded-wallets/end-user-authentication): Deep dive into authentication methods, error handling, and advanced patterns
* [**Embedded Wallet - React Hooks**](/embedded-wallets/react-hooks): Learn about available hooks like `useSignInWithEmail`, `useEvmAddress`, and `useSendEvmTransaction`
* [**Embedded Wallet - React Components**](/embedded-wallets/react-components): Explore pre-built components for authentication, wallet management, and transactions
* [**Embedded Wallet - Wagmi Integration**](/embedded-wallets/wagmi): Use CDP wallets with the popular wagmi library for Ethereum development
