"use client";

import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ClaimCard } from "@/components/ClaimCard";
import { useIsSignedIn, useIsInitialized } from "@coinbase/cdp-hooks";

export default function Home() {
  const { isInitialized } = useIsInitialized();
  const { isSignedIn } = useIsSignedIn();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-red-500 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-black to-red-950/20 -z-10"></div>
      
      <Header />
      
      <main className="pt-8 md:pt-6">
        <HeroSection />
        
        {isSignedIn && (
          <section className="relative py-12 md:py-20 px-4">
            <div className="container mx-auto flex justify-center">
              <ClaimCard />
            </div>
          </section>
        )}
      </main>
      
    </div>
  );
}
