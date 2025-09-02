"use client";

import { useState, useEffect } from "react";
import { useIsSignedIn, useEvmAddress, useSignOut } from "@coinbase/cdp-hooks";
import { Button } from "./Button";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isSignedIn } = useIsSignedIn();
  const { evmAddress } = useEvmAddress();
  const { signOut } = useSignOut();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const handleCopyAddress = async () => {
    if (evmAddress) {
      try {
        await navigator.clipboard.writeText(evmAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy address:", error);
      }
    }
  };

  const truncatedAddress = evmAddress 
    ? `${evmAddress.slice(0, 6)}...${evmAddress.slice(-4)}`
    : "";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "glass py-3" : "py-4 md:py-6"
    }`}>
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 blur-xl opacity-50 animate-pulse"></div>
              <h1 className="relative text-2xl md:text-3xl font-black tracking-wider text-white">
                LIVE
                <span className="text-red-500 animate-glow">.</span>
              </h1>
            </div>
          </div>
          
          {isSignedIn && evmAddress ? (
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyAddress}
                className="text-white text-sm hidden md:block hover:text-red-400 transition-colors cursor-pointer group relative"
                title="Click to copy address"
              >
                {truncatedAddress}
                {copied && (
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    Copied!
                  </span>
                )}
              </button>
              <Button
                onClick={handleSignOut}
                variant="secondary"
                size="md"
              >
                Sign Out
              </Button>
            </div>
          ) : null}
        </nav>
      </div>
    </header>
  );
}