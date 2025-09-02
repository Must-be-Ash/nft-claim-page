"use client";

import { useState, useEffect } from "react";
import { evaluateStep, readNode } from "@/lib/api/trail";
import { useTransaction } from "@/hooks/useTransaction";

const PRIMARY_NODE_ID = "01990c7d-708f-7eda-b441-5e5207a99c0d";
const USDC_READ_NODE_ID = "01990c7d-7090-7b98-a726-96059742778a";
const CLAIM_CONDITION_NODE_ID = "01990c7d-7090-7b98-a726-9606bfd85ae9";

interface NFTMetadata {
  image?: string;
  name?: string;
  description?: string;
}

export function ClaimStep() {
  const { executeTransaction, isPending, txError, isConnected, address } = useTransaction();
  const [tokenId, setTokenId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [nftMetadata, setNftMetadata] = useState<NFTMetadata | null>(null);
  const [pricePerToken, setPricePerToken] = useState<string>("0");
  const [usdcBalance, setUsdcBalance] = useState<string>("0");
  const [maxSupply, setMaxSupply] = useState<string>("0");
  const [claimed, setClaimed] = useState<string>("0");

  useEffect(() => {
    if (tokenId && address) {
      fetchNFTData();
    }
  }, [tokenId, address]);

  useEffect(() => {
    if (address) {
      fetchUSDCBalance();
    }
  }, [address]);

  const fetchUSDCBalance = async () => {
    if (!address) return;
    
    try {
      const response = await readNode(
        USDC_READ_NODE_ID,
        address,
        {
          [USDC_READ_NODE_ID]: {
            "inputs.account": { value: address }
          }
        }
      );
      
      const rawBalance = response.outputs?.arg_0?.value || "0";
      const formattedBalance = (BigInt(rawBalance) / BigInt(10 ** 6)).toString();
      setUsdcBalance(formattedBalance);
    } catch (err) {
      console.error("Failed to fetch USDC balance:", err);
    }
  };

  const fetchNFTData = async () => {
    try {
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
      
      const condition = response.outputs?.condition?.value;
      if (condition) {
        const price = condition.find((c: any) => c.name === "pricePerToken")?.value || "0";
        const formattedPrice = (BigInt(price) / BigInt(10 ** 6)).toString();
        setPricePerToken(formattedPrice);
        
        const max = condition.find((c: any) => c.name === "maxClaimableSupply")?.value || "0";
        setMaxSupply(max);
        
        const supply = condition.find((c: any) => c.name === "supplyClaimed")?.value || "0";
        setClaimed(supply);
        
        const metadataUrl = condition.find((c: any) => c.name === "metadata")?.value;
        if (metadataUrl) {
          try {
            const metaResponse = await fetch(metadataUrl);
            const metadata = await metaResponse.json();
            setNftMetadata(metadata);
          } catch (err) {
            console.error("Failed to fetch NFT metadata:", err);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch NFT data:", err);
    }
  };

  const handleClaim = async () => {
    if (!address || !tokenId || !quantity) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const userInputs = {
        [PRIMARY_NODE_ID]: {
          "inputs._allowlistProof.proof": { value: "" },
          "inputs._quantity": { value: quantity },
          "inputs._tokenId": { value: tokenId }
        }
      };

      const evaluation = await evaluateStep(1, {
        walletAddress: address,
        userInputs,
        execution: { type: "latest" }
      });

      await executeTransaction(
        evaluation.contractAddress,
        evaluation.callData,
        evaluation.payableAmount,
        PRIMARY_NODE_ID
      );

      setSuccess(true);
      setTimeout(() => {
        fetchNFTData();
        fetchUSDCBalance();
      }, 5000);
    } catch (err: any) {
      console.error("Claim failed:", err);
      setError(err.message || "Failed to claim NFT");
    } finally {
      setLoading(false);
    }
  };

  const totalCost = pricePerToken && quantity ? 
    (BigInt(pricePerToken) * BigInt(quantity)).toString() : "0";

  const remaining = maxSupply && claimed ? 
    (BigInt(maxSupply) - BigInt(claimed)).toString() : "0";

  return (
    <div className="w-full max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-red-500">CLAIM YOUR NFT</h2>
        
        {nftMetadata?.image && (
          <div className="mb-6">
            <img 
              src={nftMetadata.image} 
              alt={nftMetadata.name || "NFT"} 
              className="w-full max-w-md mx-auto rounded-lg border-2 border-red-900"
            />
            {nftMetadata.name && (
              <h3 className="text-xl text-red-400 mt-4">{nftMetadata.name}</h3>
            )}
            {nftMetadata.description && (
              <p className="text-red-300 mt-2">{nftMetadata.description}</p>
            )}
          </div>
        )}

        {tokenId && (
          <div className="space-y-2 mb-6 text-red-400">
            <p>Price per NFT: {pricePerToken} USDC</p>
            <p>Available: {remaining} / {maxSupply}</p>
            <p>Your USDC Balance: {usdcBalance}</p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-red-500 mb-2">Token ID</label>
          <input
            type="text"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            className="w-full p-3 bg-black border-2 border-red-900 text-red-500 focus:border-red-500 outline-none"
            placeholder="Enter token ID"
            disabled={!isConnected || loading}
          />
        </div>

        <div>
          <label className="block text-red-500 mb-2">Quantity</label>
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-3 bg-black border-2 border-red-900 text-red-500 focus:border-red-500 outline-none"
            placeholder="Enter quantity to mint"
            disabled={!isConnected || loading}
          />
        </div>

        {quantity && tokenId && (
          <div className="p-4 border-2 border-red-900">
            <p className="text-red-400">Total Cost: {totalCost} USDC</p>
          </div>
        )}

        <button
          onClick={handleClaim}
          disabled={!isConnected || loading || isPending}
          className="w-full p-4 bg-red-900 text-white font-bold hover:bg-red-800 disabled:bg-red-950 disabled:text-red-800 transition-colors"
        >
          {loading || isPending ? "CLAIMING..." : "CLAIM NFT"}
        </button>

        {error && (
          <div className="p-4 border-2 border-red-500 text-red-500">
            {error}
          </div>
        )}

        {txError && (
          <div className="p-4 border-2 border-red-500 text-red-500">
            Transaction Error: {txError.message}
          </div>
        )}

        {success && (
          <div className="p-4 border-2 border-green-500 text-green-500">
            NFT claimed successfully!
          </div>
        )}
      </div>
    </div>
  );
}