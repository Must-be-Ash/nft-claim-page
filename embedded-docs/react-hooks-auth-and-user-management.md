# React Hooks

## Overview

CDP provides React hooks for conveniently accessing the CDP Embedded Wallet SDK functionality. Built on top of `@coinbase/cdp-core`, these hooks offer a React-friendly interface for authentication and embedded wallet operations.

<Tip>
  Check out the [CDP Web SDK reference](https://coinbase.github.io/cdp-web) for comprehensive method signatures, types, and examples.
</Tip>

<Accordion title="Available hooks">
  ### Auth and user management

  * `useSignInWithEmail` - Initiate email authentication flow
  * `useVerifyEmailOTP` - Verify OTP code sent to email
  * `useSignInWithSms` - Initiate SMS authentication flow
  * `useVerifySmsOTP` - Verify OTP code sent via SMS
  * `useCurrentUser` - Get the current authenticated user
  * `useIsSignedIn` - Check if user is signed in
  * `useSignOut` - Sign out the current user
  * `useGetAccessToken` - Retrieve the access token of the current user

  ### Wallet operations

  * `useEvmAddress` - Get the primary EVM wallet address
  * `useEvmAccounts` - Get all EVM accounts
  * `useSendEvmTransaction` - Send transactions on Base networks (Base and Base Sepolia only)
  * `useSignEvmTransaction` - Sign transactions for any EVM network
  * `useSignEvmMessage` - Sign plain text messages
  * `useSignEvmTypedData` - Sign EIP-712 typed data
  * `useSignEvmHash` - Sign message hashes
  * `useExportEvmAccount` - Export wallet private key

  ### SDK state

  * `useIsInitialized` - Check if SDK is ready
  * `useConfig` - Access CDP configuration
</Accordion>

## Prerequisites

The fastest way to get started is to complete the [Quickstart](/embedded-wallets/quickstart). If you already have your own app, you should complete the prerequisites below before proceeding. You will need:

1. A [CDP Portal](https://portal.cdp.coinbase.com) account and CDP project
2. [Node.js 22+](https://nodejs.org/en/download) installed
3. Your local app domain [configured](/embedded-wallets/domains) in CDP Portal
4. A package manager of your choice, with `cdp-hooks` installed:

<CodeGroup>
  ```bash npm
  # With npm
  npm install @coinbase/cdp-core @coinbase/cdp-hooks
  ```

  ```bash pnpm
  # With pnpm
  pnpm add @coinbase/cdp-core @coinbase/cdp-hooks
  ```

  ```bash yarn
  # With yarn
  yarn add @coinbase/cdp-core @coinbase/cdp-hooks
  ```
</CodeGroup>

## 1. Setup hooks provider

If you're not using the demo app from the Quickstart, you'll need to manually set up the `CDPHooksProvider` in your application:

<Warning>
  **Using Next.js?** Check out our [Next.js integration guide](/embedded-wallets/nextjs) for `"use client"` requirements and common gotchas.
</Warning>

```tsx
import { CDPHooksProvider } from "@coinbase/cdp-hooks";

function App() {
  return (
    <CDPHooksProvider 
      config={{
        projectId: "your-project-id",
        basePath: "https://api.cdp.coinbase.com", // CDP API url
        useMock: false, // Use live APIs or use mock data for testing
        debugging: false, // Log API requests and responses
      }}
    >
      <YourApp />
    </CDPHooksProvider>
  );
}
```

## 2. Ensure SDK initialization

Always ensure the SDK is initialized before authenticating a user or performing wallet operations:

```tsx
import { useIsInitialized } from "@coinbase/cdp-hooks";

function App() {
  const { isInitialized } = useIsInitialized();

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return <Page />;
}
```

## Hook examples

Now let's explore how to use CDP hooks to build wallet functionality into your React application.

### User sign-in

Our authentication uses a two-step flow:

1. Submit user email to initiate the authentication flow, which will send the user a One-Time-Password (OTP) and return a `flowId`
2. Submit the six-digit OTP and `flowId`, after which the user will be authenticated, returning a User object

```tsx
import { useSignInWithEmail, useVerifyEmailOTP } from "@coinbase/cdp-hooks";

function SignIn() {
  const { signInWithEmail } = useSignInWithEmail();
  const { verifyEmailOTP } = useVerifyEmailOTP();

  const handleSignIn = async (email: string) => {
    try {
      // Start sign in flow
      const { flowId } = await signInWithEmail({ email });

      // Get OTP from user input...
      const otp = "123456";

      // Complete sign in
      const { user, isNewUser } = await verifyEmailOTP({
        flowId,
        otp
      });

      console.log("Signed in user:", user);
      console.log("User EVM address", user.evmAccounts[0]);
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  return <button onClick={() => handleSignIn("user@example.com")}>Sign In</button>;
}
```

### View user profile

Display user information and wallet addresses using CDP hooks:

```tsx
import { useCurrentUser, useEvmAddress } from "@coinbase/cdp-hooks";

function Profile() {
  const { user } = useCurrentUser();
  const { evmAddress: primaryAddress } = useEvmAddress();

  if (!user) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>User ID: {user.userId}</p>
      <p>Primary Address: {primaryAddress}</p>
      <p>All Accounts: {user.evmAccounts.join(", ")}</p>
    </div>
  );
}
```

### Send a transaction

We support signing and sending a blockchain transaction in a single action on Base or Base Sepolia. For other networks, see the [next section](#sign-and-broadcast-non-base-networks).

```tsx
import { useSendEvmTransaction, useEvmAddress } from "@coinbase/cdp-hooks";

function SendTransaction() {
  const { sendEvmTransaction } = useSendEvmTransaction();
  const { evmAddress } = useEvmAddress();

  const handleSend = async () => {
    if (!evmAddress) return;

    try {
      const result = await sendEvmTransaction({
        transaction: {
          to: evmAddress,              // Send to yourself for testing
          value: 1000000000000n,       // 0.000001 ETH in wei
          gas: 21000n,                 // Standard ETH transfer gas limit
          chainId: 84532,              // Base Sepolia
          type: "eip1559",             // Modern gas fee model
        },
        evmAccount: evmAddress,        // Your CDP wallet address
        network: "base-sepolia",       // Target network
      });

      console.log("Transaction hash:", result.transactionHash);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return <button onClick={handleSend}>Send Transaction</button>;
}
```

### Sign and broadcast (non-Base networks)

For networks other than Base or Base Sepolia, you can sign a transaction with the wallet and broadcast it yourself. This example uses the public client from `viem` to broadcast the transaction:

```tsx
import { useSignEvmTransaction, useEvmAddress } from "@coinbase/cdp-hooks";
import { http, createPublicClient } from "viem";
import { sepolia } from "viem/chains";

function NonBaseTransaction() {
  const { signEvmTransaction } = useSignEvmTransaction();
  const { evmAddress } = useEvmAddress();

  const handleSend = async () => {
    if (!evmAddress) return;

    try {
      // Sign the transaction
      const { signedTransaction } = await signEvmTransaction({
        evmAccount: evmAddress,
        transaction: {
          to: evmAddress,              // Send to yourself for testing
          value: 1000000000000n,       // 0.000001 ETH in wei
          gas: 21000n,                 // Standard ETH transfer gas limit
          chainId: 11155111,           // Sepolia
          type: "eip1559",             // Modern gas fee model
        }
      });

      // Broadcast using a different client
      const client = createPublicClient({
        chain: sepolia,
        transport: http()
      });

      const hash = await client.sendRawTransaction({
        serializedTransaction: signedTransaction
      });

      console.log("Transaction hash:", hash);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return <button onClick={handleSend}>Send Transaction</button>;
}
```

### Sign messages and typed data

You can sign EVM messages, hashes, and typed data to generate signatures for various on-chain applications:

```tsx
import { useSignEvmMessage, useSignEvmTypedData, useSignEvmHash, useEvmAddress } from "@coinbase/cdp-hooks";

function SignData() {
  const { signEvmMessage } = useSignEvmMessage();
  const { signEvmTypedData } = useSignEvmTypedData();
  const { signEvmHash } = useSignEvmHash();
  const { evmAddress } = useEvmAddress();

  const handleSignMessage = async () => {
    if (!evmAddress) return;

    const result = await signEvmMessage({
      evmAccount: evmAddress,
      message: "Hello World"
    });

    console.log("Message signature:", result.signature);
  };

  const handleSignTypedData = async () => {
    if (!evmAddress) return;

    const result = await signEvmTypedData({
      evmAccount: evmAddress,
      typedData: {
        domain: {
          name: "Example DApp",
          version: "1",
          chainId: 84532,
        },
        types: {
          Person: [
            { name: "name", type: "string" },
            { name: "wallet", type: "address" }
          ]
        },
        primaryType: "Person",
        message: {
          name: "Bob",
          wallet: evmAddress
        }
      }
    });

    console.log("Typed data signature:", result.signature);
  };

  const handleSignHash = async () => {
    if (!evmAddress) return;

    const result = await signEvmHash({
      evmAccount: evmAddress,
      hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    });

    console.log("Hash signature:", result.signature);
  };

  return (
    <div>
      <button onClick={handleSignMessage}>Sign Message</button>
      <button onClick={handleSignTypedData}>Sign Typed Data</button>
      <button onClick={handleSignHash}>Sign Hash</button>
    </div>
  );
}
```

### Export private keys

Allow users to export their private key to import it into an EVM-compatible wallet of their choice:

<Warning>
  Handle private keys with extreme care! Never log them to console in production or expose them in your UI without proper security measures.
</Warning>

```tsx
import { useExportEvmAccount, useEvmAddress } from "@coinbase/cdp-hooks";

function ExportKey() {
  const { exportEvmAccount } = useExportEvmAccount();
  const { evmAddress } = useEvmAddress();

  const handleExport = async () => {
    if (!evmAddress) return;

    try {
      const { privateKey } = await exportEvmAccount({
        evmAccount: evmAddress
      });

      // Handle the private key securely
      // Never log or display in production!
      navigator.clipboard.writeText(privateKey);
      alert("Private key copied to clipboard");
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return <button onClick={handleExport}>Export Private Key</button>;
}
```

## What to read next

* [**CDP Web SDK Documentation**](https://coinbase.github.io/cdp-web): Comprehensive API reference for the CDP Web SDK
* [**Embedded Wallet - React Components**](/embedded-wallets/react-components): Pre-built UI components that work seamlessly with these hooks
* [**Embedded Wallet - Wagmi Integration**](/embedded-wallets/wagmi): Use CDP wallets with the popular wagmi library
* [**Embedded Wallet - Next.js**](/embedded-wallets/nextjs): Special considerations for Next.js applications
