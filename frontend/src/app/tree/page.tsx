"use client";

import { GlassCard } from "@/components/motion/GlassCard";
import { Network } from "lucide-react";

export default function TreePage() {
  return (
    <div className="min-h-screen bg-black text-white py-24 selection:bg-orange-500/30">
      <div className="absolute top-0 right-1/4 -z-10 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-orange-600/10 blur-[120px]" />
      
      <main className="container mx-auto px-4 max-w-5xl">
        <div className="mb-12 text-center">
          <Network className="h-12 w-12 text-orange-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold tracking-tight">Merkle Tree Structure</h1>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            This module visualizes all active and pending cryptographic hashes before they are anchored to the Polygon chain.
          </p>
        </div>

        <GlassCard className="p-8 text-center min-h-[400px] flex flex-col items-center justify-center border-orange-500/20 bg-orange-500/5">
          <h3 className="text-2xl font-semibold text-orange-400 mb-2">Tree Visualization Coming Soon</h3>
          <p className="text-gray-400">
            For Phase 2, this page will run a D3.js graphical visualization of exactly how your student hashes 
            are paired into a cryptographic Merkle Root.
          </p>
        </GlassCard>
      </main>
    </div>
  );
}
