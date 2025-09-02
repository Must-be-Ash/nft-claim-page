"use client";

import { useState } from "react";
import { useSendEvmTransaction, useEvmAddress, useIsSignedIn } from "@coinbase/cdp-hooks";
import { submitExecution } from "@/lib/api/trail";

export function useTransaction() {
  const { sendEvmTransaction } = useSendEvmTransaction();
  const { evmAddress: address } = useEvmAddress();
  const { isSignedIn } = useIsSignedIn();
  const [isPending, setIsPending] = useState(false);
  const [txError, setTxError] = useState<Error | null>(null);

  const executeTransaction = async (
    contractAddress: string,
    callData: string,
    payableAmount: string,
    nodeId: string
  ) => {
    if (!address || !isSignedIn) {
      throw new Error("Wallet not connected");
    }

    setIsPending(true);
    setTxError(null);

    try {
      console.log("Sending transaction:", {
        to: contractAddress,
        data: callData,
        value: payableAmount,
        gas: "300000",
        chainId: 8453,
      });

      const result = await sendEvmTransaction({
        transaction: {
          to: contractAddress as `0x${string}`,
          data: callData as `0x${string}`,
          value: BigInt(payableAmount ?? "0"),
          chainId: 8453, // Base mainnet
          type: "eip1559" as const,
          gas: BigInt(300000), // Increased gas limit for NFT minting
        },
        evmAccount: address,
        network: "base", // Base mainnet
      });

      console.log("Transaction successfully sent:", result.transactionHash);

      // Submit execution to Herd API
      try {
        await submitExecution({
          nodeId,
          transactionHash: result.transactionHash,
          walletAddress: address,
          execution: { type: "latest" },
        });
        console.log("Execution submitted successfully");
      } catch (err: any) {
        console.error("Failed to submit execution:", err);
        
        // If the execution tracking fails due to transaction failure, throw the error
        // This usually means the transaction reverted on-chain
        if (err.message?.includes("Transaction") && err.message?.includes("failed")) {
          throw new Error("Transaction failed on-chain. Please check your transaction and try again.");
        }
        
        // For other execution tracking errors, don't throw - transaction might have succeeded
        console.warn("Execution tracking failed but transaction may have succeeded");
      }

      return result;
    } catch (error: any) {
      console.error("Transaction failed:", error);
      setTxError(error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  return {
    executeTransaction,
    isPending,
    txError,
    isConnected: isSignedIn,
    address,
  };
}