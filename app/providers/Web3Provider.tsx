"use client";

import { CDPReactProvider } from "@coinbase/cdp-react";
import { type Config } from "@coinbase/cdp-core";
import { type AppConfig } from "@coinbase/cdp-react";

const CDP_CONFIG: Config = {
  projectId: process.env.NEXT_PUBLIC_CDP_PROJECT_ID || "",
};

const APP_CONFIG: AppConfig = {
  name: "LIVE",
  logoUrl: "/logo.svg",
  authMethods: ["email"], // Only email authentication
};

const theme = {
  "colors-bg-default": "#000000",
  "colors-bg-overlay": "rgba(0, 0, 0, 0.8)",
  "colors-bg-skeleton": "#1A1A1A",
  "colors-bg-primary": "#FF0000",
  "colors-bg-secondary": "#2A2A2A",
  "colors-fg-default": "#FFFFFF",
  "colors-fg-muted": "#999999",
  "colors-fg-primary": "#FF0000",
  "colors-fg-onPrimary": "#FFFFFF",
  "colors-fg-onSecondary": "#FFFFFF",
  "colors-line-default": "rgba(255, 0, 0, 0.2)",
  "colors-line-heavy": "#666666",
  "colors-line-primary": "#FF0000",
  "font-family-sans": "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  "font-size-base": "16px",
};

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <CDPReactProvider config={CDP_CONFIG} app={APP_CONFIG} theme={theme}>
      {children}
    </CDPReactProvider>
  );
};