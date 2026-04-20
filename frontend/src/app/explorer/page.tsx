"use client";

import { useState } from "react";
import { GlassCard } from "@/components/motion/GlassCard";
import { Search, Hash, Cpu, Globe2, Activity } from "lucide-react";

export default function ExplorerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  // In a full production build, this would fetch from a true indexing node 
  // or a library like ethers.js connected to Polygon RPC.
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResult(null);

    // Simulate network delay
    setTimeout(() => {
      setIsSearching(false);
      setSearchResult({
        status: "Confirmed",
        network: "Polygon POS (Mainnet)",
        block: "55819024",
        timestamp: new Date().toISOString(),
        contract: "0x3A21...7F9E",
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 py-24">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-[100px]" />

      <main className="container mx-auto px-4 max-w-5xl">
        <div className="mb-12 text-center">
          <Globe2 className="mx-auto h-12 w-12 text-purple-400 mb-4" />
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Polygon Explorer</h1>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Search for Merkle Root Transaction Hashes to trace batched credential anchors natively on the blockchain.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-16">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Tx Hash (0x...) or Merkle Root..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-32 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-2xl transition-all"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-2 px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-full transition-colors disabled:opacity-50"
            >
              {isSearching ? "Scanning..." : "Search"}
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Network Stats layer */}
          <GlassCard className="p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Activity className="h-5 w-5 text-green-400" />
              <h3 className="font-semibold text-gray-200">Network Status</h3>
            </div>
            <p className="text-2xl font-bold text-white mt-2">Active</p>
            <p className="text-sm text-gray-400 mt-1">Polygon POS Connected</p>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Cpu className="h-5 w-5 text-blue-400" />
              <h3 className="font-semibold text-gray-200">Latest Block</h3>
            </div>
            <p className="text-2xl font-bold font-mono text-white mt-2">55819024</p>
            <p className="text-sm text-gray-400 mt-1">Updated 12s ago</p>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Hash className="h-5 w-5 text-purple-400" />
              <h3 className="font-semibold text-gray-200">Total Anchors</h3>
            </div>
            <p className="text-2xl font-bold font-mono text-white mt-2">1,248</p>
            <p className="text-sm text-gray-400 mt-1">Historical Merkle Roots</p>
          </GlassCard>
        </div>

        {/* Search Results */}
        {searchResult && (
          <GlassCard className="p-8 border-purple-500/30">
            <h2 className="text-xl font-bold mb-6 flex items-center border-b border-white/10 pb-4">
              <Search className="mr-2 h-5 w-5 text-purple-400" />
              Transaction Details
            </h2>
            
            <div className="space-y-4 font-mono text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">Transaction Hash</span>
                <span className="text-white break-all">{searchQuery || "0x..."}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">Status</span>
                <span className="text-green-400 bg-green-400/10 px-3 py-1 rounded-full">{searchResult.status}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">Block</span>
                <span className="text-blue-400">{searchResult.block}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">Timestamp</span>
                <span className="text-white">{searchResult.timestamp}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2">
                <span className="text-gray-400">Contract (BlockCredAnchor)</span>
                <span className="text-purple-400">{searchResult.contract}</span>
              </div>
            </div>
          </GlassCard>
        )}
      </main>
    </div>
  );
}
