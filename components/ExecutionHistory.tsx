"use client";

import { useState, useEffect } from "react";
import { getExecutionHistory } from "@/lib/api/trail";
import { useEvmAddress } from "@coinbase/cdp-hooks";

export function ExecutionHistory() {
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
    return <div className="text-red-500">Loading history...</div>;
  }

  if (!history) return null;

  const recentTransactions = history.totals?.stepStats?.[1]?.transactionHashes || [];
  const totalMints = history.totals?.transactions || 0;
  const totalWallets = history.totals?.wallets || 0;

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6 text-red-500">COMMUNITY ACTIVITY</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 border-2 border-red-900">
          <p className="text-red-400 text-sm">TOTAL MINTS</p>
          <p className="text-3xl font-bold text-red-500">{totalMints}</p>
        </div>
        <div className="p-4 border-2 border-red-900">
          <p className="text-red-400 text-sm">UNIQUE WALLETS</p>
          <p className="text-3xl font-bold text-red-500">{totalWallets}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4 text-red-500">RECENT MINTS</h3>
        <div className="space-y-2">
          {recentTransactions.slice(0, 10).map((tx: any, index: number) => (
            <div key={index} className="p-3 border border-red-900 hover:border-red-500 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {tx.farcasterData?.pfp_url ? (
                    <img 
                      src={tx.farcasterData.pfp_url} 
                      alt="" 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-red-900" />
                  )}
                  <div>
                    <p className="text-red-400">
                      {tx.farcasterData?.username || `${tx.walletAddress.slice(0, 6)}...${tx.walletAddress.slice(-4)}`}
                    </p>
                    <p className="text-red-600 text-xs">
                      {new Date(tx.blockTimestamp * 1000).toLocaleString()}
                    </p>
                  </div>
                </div>
                <a
                  href={`https://herd.eco/base/tx/${tx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-500 hover:text-red-400 text-sm"
                >
                  View →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}