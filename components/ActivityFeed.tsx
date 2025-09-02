"use client";

import { useState, useEffect } from "react";
import { getExecutionHistory } from "@/lib/api/trail";
import { useEvmAddress } from "@coinbase/cdp-hooks";

export function ActivityFeed() {
  const { evmAddress: address } = useEvmAddress();
  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 60000);
    return () => clearInterval(interval);
  }, [address]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getExecutionHistory(address ? [address] : []);
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !history) {
    return (
      <div className="w-full max-w-xl mx-auto">
        <div className="glass rounded-2xl p-6 md:p-8 animate-pulse">
          <div className="h-8 bg-white/10 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white/5 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!history) return null;

  const recentTransactions = history.totals?.stepStats?.[1]?.transactionHashes || [];
  const totalMints = history.totals?.transactions || 0;
  const totalWallets = history.totals?.wallets || 0;

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="glass rounded-2xl p-6 md:p-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          Live Activity
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="glass rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-red-500 mb-1">{totalMints}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Total Mints</div>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-red-500 mb-1">{totalWallets}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Collectors</div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Recent Mints
          </h3>
          
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Be the first to mint!
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {recentTransactions.slice(0, 10).map((tx: any, index: number) => (
                <div 
                  key={index} 
                  className="group glass rounded-lg p-4 hover:bg-white/5 transition-all duration-300 cursor-pointer"
                  onClick={() => window.open(`https://herd.eco/base/tx/${tx.txHash}`, "_blank")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {tx.farcasterData?.pfp_url ? (
                        <img 
                          src={tx.farcasterData.pfp_url} 
                          alt="" 
                          className="w-10 h-10 rounded-full ring-2 ring-red-500/20"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {tx.walletAddress.slice(2, 4).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium text-sm">
                          {tx.farcasterData?.username || `${tx.walletAddress.slice(0, 6)}...${tx.walletAddress.slice(-4)}`}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {new Date(tx.blockTimestamp * 1000).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <svg 
                      className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}