"use client";

import { useIsSignedIn } from "@coinbase/cdp-hooks";
import { EmailAuth } from "./EmailAuth";

export function HeroSection() {
  const { isSignedIn } = useIsSignedIn();

  if (isSignedIn) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto animate-slide-up">
        <div className="mb-12">
          <span className="inline-block px-4 py-2 text-xs md:text-sm font-semibold text-red-500 glass rounded-full mb-6">
            EXCLUSIVE DROP
          </span>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight">
            CLAIM YOUR
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600 text-glow">
              NFT
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join the exclusive LIVE collection. One free NFT per wallet.
          </p>
        </div>

        <EmailAuth />
      </div>

    </section>
  );
}