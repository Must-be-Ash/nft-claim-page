# Welcome to Embedded Wallet

## Overview

Embedded Wallets provide a seamless way to integrate secure, user-friendly crypto wallets directly into your application. Built on Coinbase's [trusted infrastructure](https://docs.cdp.coinbase.com/wallet-api-v2/docs/security#overview), they enable users to interact with blockchain applications without the complexity of traditional wallet management.

With Embedded Wallets, your users can access the full power of Web3 through familiar authentication methods like email and social logins - no seed phrases, browser extensions, or pop-ups required.

## Key benefits

* **User-custodied security**: Users maintain control of their assets while you focus on building great experiences
* **Easy onboarding**: Familiar login methods (email OTP, Google, Apple) replace complex seed phrases
* **Complete customization**: Full control over UI/UX to match your brand and user experience
* **Enterprise-grade infrastructure**: Fast wallet creation and transaction signing powered by CDP's Trusted Execution Environment (TEE)
* **Built-in features**: Access onramp/offramp, balances, transfers, swaps, and staking without additional integrations
* **USDC Rewards**: Earn 4.1% rewards on aggregated USDC balances across all CDP Wallets

## How it works

Embedded Wallets are designed to be invisible to end-users while providing full Web3 functionality:

1. **User authentication**: Users sign in with familiar methods like email OTP or OAuth (Google, Apple)
2. **Invisible wallet creation**: A wallet is instantly created without seed phrases or pop-ups
3. **Seamless transactions**: Users can send, swap, stake, and interact with dApps without managing private keys
4. **Developer control**: You maintain complete control over the UI/UX while users retain custody

<Info>
  Embedded Wallets leverage CDP's Trusted Execution Environment (TEE) for secure transaction signing while ensuring users maintain full custody of their assets.
</Info>

## Use cases

* **Gaming platforms**: Enable in-game purchases and NFT ownership without wallet friction
* **Social applications**: Let users tip, collect, and trade directly within your platform
* **Marketplaces**: Streamline checkout with built-in crypto payments and NFT trading
* **DeFi applications**: Provide access to lending, borrowing, and yield farming with simple UX
* **Creator platforms**: Enable direct monetization through tokens and NFTs

## Security and compliance

Embedded Wallets leverage CDP's advanced security infrastructure to provide true self-custody with enterprise-grade protection:

* **[Trusted Execution Environment (TEE)](/wallet-api/v2/introduction/security)**: All cryptographic operations occur within AWS Nitro Enclaves - secure, isolated environments that even Coinbase cannot access
* **Temporary Wallet Secrets**: Device-specific cryptographic keys are generated and stored locally on users' devices, never exposed to Coinbase
* **True self-custody**: Unlike traditional MPC solutions, our approach ensures faster operations while maintaining user control
* **Multi-device support**: Users can securely access their wallet from up to 5 different devices
* **Client-controlled security**: You control key storage methods and session durations to match your security requirements

This architecture combines the convenience of embedded wallets with the security guarantees of self-custodial solutions, ensuring your users maintain full control of their assets.

## What to read next

* **[Quickstart Guide](/embedded-wallets/quickstart)**: Get started with embedded wallets in under 10 minutes
* **[Security Configuration](/embedded-wallets/cors-configuration)**: Set up CORS and secure your embedded wallet implementation
