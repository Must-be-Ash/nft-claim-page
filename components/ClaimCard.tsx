"use client";

import { useState, useEffect } from "react";
import { evaluateStep, readNode } from "@/lib/api/trail";
import { useTransaction } from "@/hooks/useTransaction";
import { useIsSignedIn } from "@coinbase/cdp-hooks";
import { Button } from "./Button";

const PRIMARY_NODE_ID = "01990c7d-708f-7eda-b441-5e5207a99c0d";
const USDC_READ_NODE_ID = "01990c7d-7090-7b98-a726-96059742778a";
const CLAIM_CONDITION_NODE_ID = "01990c7d-7090-7b98-a726-9606bfd85ae9";

interface NFTMetadata {
  image?: string;
  name?: string;
  description?: string;
}

export function ClaimCard() {
  const { executeTransaction, isPending, txError, isConnected, address } = useTransaction();
  const { isSignedIn } = useIsSignedIn();
  const [tokenId, setTokenId] = useState("0"); // Default to token ID 0
  const [conditionId, setConditionId] = useState("0"); // Default to condition ID 0
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [nftMetadata, setNftMetadata] = useState<NFTMetadata | null>(null);
  const [pricePerToken, setPricePerToken] = useState<string>("0");
  const [maxSupply, setMaxSupply] = useState<string>("0");
  const [claimed, setClaimed] = useState<string>("0");
  const [hasClaimed, setHasClaimed] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      fetchNFTData();
    }
  }, [address]);

  const fetchNFTData = async () => {
    try {
      console.log("Fetching NFT data for token:", tokenId);
      const response = await readNode(
        CLAIM_CONDITION_NODE_ID,
        address || "0x0000000000000000000000000000000000000000",
        {
          [PRIMARY_NODE_ID]: {
            "inputs._tokenId": { value: tokenId }
          },
          [CLAIM_CONDITION_NODE_ID]: {
            "inputs._tokenId": { value: tokenId },
            "inputs._conditionId": { value: "0" }
          }
        }
      );
      
      console.log("Full response from readNode:", response);
      const condition = response.outputs?.condition?.value;
      if (condition) {
        console.log("Found condition data:", condition);
        // Log each field in detail
        condition.forEach((field: any, index: number) => {
          console.log(`  Field ${index}:`, field.name, "=", field.value);
        });
        
        const price = condition.find((c: any) => c.name === "pricePerToken")?.value || "0";
        const formattedPrice = (BigInt(price) / BigInt(10 ** 6)).toString();
        setPricePerToken(formattedPrice);
        
        const max = condition.find((c: any) => c.name === "maxClaimableSupply")?.value || "0";
        console.log("Raw maxClaimableSupply:", max);
        
        // Check if this is the max uint256 value (unlimited supply)
        const maxUint256 = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
        let displayMax = max;
        
        if (max === maxUint256 || BigInt(max) === BigInt(maxUint256)) {
          displayMax = "∞"; // Show infinity symbol for unlimited supply
        }
        
        setMaxSupply(displayMax);
        
        // Check if drop is properly configured
        if (max === "0") {
          setError("This NFT drop is not currently configured. The maximum supply is set to 0. Please contact the drop creator.");
        }
        
        const supply = condition.find((c: any) => c.name === "supplyClaimed")?.value || "0";
        setClaimed(supply);

        // Check if condition is active
        const startTime = condition.find((c: any) => c.name === "startTimestamp")?.value;
        const endTime = condition.find((c: any) => c.name === "endTimestamp")?.value;
        console.log("Condition timing:", { startTime, endTime, currentTime: Math.floor(Date.now() / 1000) });
        
        const metadataUrl = condition.find((c: any) => c.name === "metadata")?.value;
        if (metadataUrl) {
          try {
            // Convert IPFS URL to gateway URL
            let fetchUrl = metadataUrl;
            if (metadataUrl.startsWith('ipfs://')) {
              const ipfsHash = metadataUrl.replace('ipfs://', '');
              fetchUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
            }
            
            const metaResponse = await fetch(fetchUrl);
            const metadata = await metaResponse.json();
            
            // Also convert image URLs from IPFS to gateway URLs
            if (metadata.image && metadata.image.startsWith('ipfs://')) {
              const imageHash = metadata.image.replace('ipfs://', '');
              metadata.image = `https://ipfs.io/ipfs/${imageHash}`;
            }
            
            setNftMetadata(metadata);
          } catch (err) {
            console.error("Failed to fetch NFT metadata:", err);
          }
        }
      } else {
        console.log("No condition found in response");
      }
    } catch (err) {
      console.error("Failed to fetch NFT data:", err);
    }
  };

  const handleClaim = async () => {
    if (!address) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const userInputs = {
        [PRIMARY_NODE_ID]: {
          "inputs._allowlistProof.proof": { value: "" },
          "inputs._quantity": { value: "1" }, // Always claim exactly 1 NFT
          "inputs._tokenId": { value: tokenId }
        }
      };

      console.log("Claim attempt with inputs:", userInputs);
      console.log("Using condition ID:", conditionId);

      const evaluation = await evaluateStep(1, {
        walletAddress: address,
        userInputs,
        execution: { type: "latest" }
      });

      console.log("Evaluation result:", evaluation);

      const result = await executeTransaction(
        evaluation.contractAddress,
        evaluation.callData,
        evaluation.payableAmount,
        PRIMARY_NODE_ID
      );

      setLastTxHash(result.transactionHash);
      setSuccess(true);
      setTimeout(() => {
        fetchNFTData();
      }, 5000);
    } catch (err: any) {
      console.error("Claim failed:", err);
      setError(err.message || "Failed to claim NFT");
    } finally {
      setLoading(false);
    }
  };

  const remaining = maxSupply && claimed ? 
    maxSupply === "∞" ? "∞" : (BigInt(maxSupply) - BigInt(claimed)).toString() : "0";

  const progressPercentage = maxSupply && claimed ? 
    maxSupply === "∞" ? 0 : (Number(claimed) / Number(maxSupply)) * 100 : 0;

  const handleCopyAddress = async () => {
    if (!address) return;
    
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const isInsufficientBalanceError = error?.includes('Insufficient balance') || 
    error?.includes('insufficient') || 
    txError?.message?.includes('Insufficient balance') ||
    txError?.message?.includes('insufficient');

  return (
    <div className="w-full max-w-xl mx-auto pt-24 md:pt-24">
      <div className="glass rounded-2xl p-6 md:p-8 animate-slide-up">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-4 text-center">
          Claim Your Free NFT
        </h2>

        {/* NFT Preview */}
        {nftMetadata?.image && (
          <div className="mb-6">
            <div className="relative rounded-xl overflow-hidden group">
              <img 
                src={nftMetadata.image} 
                alt={nftMetadata.name || "NFT"} 
                className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            {nftMetadata.name && (
              <h3 className="text-xl font-semibold text-white mt-4">{nftMetadata.name}</h3>
            )}
            {nftMetadata.description && (
              <p className="text-gray-400 mt-2 text-sm">{nftMetadata.description}</p>
            )}
          </div>
        )}

        {/* Stats - Simplified */}
        <div className="glass rounded-lg p-4 mb-6 text-center">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Price</div>
          <div className="text-2xl font-bold text-green-500">FREE</div>
        </div>

        {/* Supply Progress */}
        {maxSupply !== "0" && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Claimed</span>
              <span className="text-white font-semibold">{claimed} / {maxSupply}</span>
            </div>
            <div className="h-2 bg-black/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Simple claim info */}
        <div className="text-center mb-6">
          <p className="text-gray-400 text-sm">
            One free NFT per wallet • Gas fees apply
          </p>
        </div>

        {/* Claim Button */}
        <Button
          onClick={handleClaim}
          disabled={!isSignedIn || loading || isPending || maxSupply === "0"}
          loading={loading || isPending}
          size="lg"
          fullWidth
        >
          {maxSupply === "0" ? "Drop Not Available" : success ? "Claim Another NFT" : "Claim Free NFT"}
        </Button>

        {/* Status Messages */}
        {(error || txError) && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm mb-2">
              {error || `Transaction Error: ${txError?.message}`}
            </p>
            {isInsufficientBalanceError && address && (
              <div className="mt-3 pt-3 border-t border-red-500/30">
                <p className="text-red-300 text-xs mb-2">Your wallet address:</p>
                <button
                  onClick={handleCopyAddress}
                  className="group flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors w-full"
                >
                  <span className="font-mono text-red-200 text-sm">
                    {formatAddress(address)}
                  </span>
                  <div className="ml-auto flex items-center gap-1">
                    {copiedAddress ? (
                      <>
                        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-green-400 text-xs font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 text-red-300 group-hover:text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="text-red-300 group-hover:text-red-200 text-xs">Copy</span>
                      </>
                    )}
                  </div>
                </button>
                <p className="text-red-400 text-xs mt-2">
                  Send ETH to this address to cover gas fees
                </p>
              </div>
            )}
            {lastTxHash && (error?.includes("Transaction failed") || txError?.message?.includes("Transaction failed")) && (
              <div className="mt-3 pt-3 border-t border-red-500/30">
                <p className="text-red-300 text-xs mb-2">View transaction:</p>
                <a
                  href={`https://herd.eco/base/tx/${lastTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-200 hover:text-red-100 text-sm"
                >
                  <span className="font-mono">
                    {lastTxHash.slice(0, 8)}...{lastTxHash.slice(-6)}
                  </span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        )}

        {success && (
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
            <p className="text-green-400 text-sm mb-3">🎉 NFT claimed successfully!</p>
            {nftMetadata && (
              <div className="bg-black/30 rounded-lg p-3">
                <p className="text-green-300 text-xs mb-2">Your NFT:</p>
                {nftMetadata.image && (
                  <img 
                    src={nftMetadata.image} 
                    alt={nftMetadata.name || "Your NFT"} 
                    className="w-16 h-16 rounded-lg object-cover mb-2"
                  />
                )}
                <p className="text-white text-sm font-semibold">{nftMetadata.name || "NFT"}</p>
                {nftMetadata.description && (
                  <p className="text-gray-300 text-xs mt-1">{nftMetadata.description}</p>
                )}
              </div>
            )}
            {lastTxHash && (
              <div className="mt-3 pt-3 border-t border-green-500/30">
                <p className="text-green-300 text-xs mb-2">Transaction:</p>
                <a
                  href={`https://herd.eco/base/tx/${lastTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors text-green-200 hover:text-green-100 text-sm"
                >
                  <span className="font-mono">
                    {lastTxHash.slice(0, 8)}...{lastTxHash.slice(-6)}
                  </span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}