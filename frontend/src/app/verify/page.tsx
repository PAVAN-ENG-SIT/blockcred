// src/app/verify/page.tsx
"use client";

import { useVerify, VerifyStatus } from "@/hooks/useVerify";
import { DragDropZone } from "@/components/verify/DragDropZone";
import { useUIStore } from "@/store/uiStore";

export default function VerifyPage() {
  const { verify, status, error, result, reset } = useVerify();
  // Using useUIStore just to synchronize if needed, 
  // but useVerify local state accurately tracks the flow natively.
  // We'll map the UI visually based on `status`.

  const handleFileAccepted = async (file: File) => {
    await verify(file);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <main className="container mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-24">
        
        <div className="mb-12 text-center space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Verify Cryptographic Proof
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Drop a BlockCred credential below. Our zero-trust engine will hash it locally before verifying its anchor on the Polygon blockchain.
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-8">
          {status === 'idle' ? (
            <DragDropZone onFileAccepted={handleFileAccepted} />
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md">
              
              {status === 'hashing' && (
                <div className="animate-pulse space-y-4">
                  <span className="text-3xl block">⏳</span>
                  <h3 className="text-xl font-medium text-blue-400">Hashing Document...</h3>
                  <p className="text-sm text-gray-400">Zero-trust local SHA-256 calculation</p>
                </div>
              )}

              {status === 'verifying' && (
                <div className="animate-pulse space-y-4">
                  <span className="text-3xl block">🔍</span>
                  <h3 className="text-xl font-medium text-purple-400">Verifying on Blockchain...</h3>
                  <p className="text-sm text-gray-400">Checking Merkle proofs and contract state</p>
                </div>
              )}

              {status === 'success' && result && (
                <div className="space-y-4">
                  {result.isValid ? (
                    <>
                      <span className="text-5xl block">✅</span>
                      <h3 className="text-2xl font-medium text-green-400">Valid Certificate</h3>
                      <p className="mt-4 font-mono text-xs text-gray-300 break-all bg-black/40 p-3 rounded">
                        <strong>Hash:</strong> {result.hash}
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="text-5xl block">❌</span>
                      <h3 className="text-2xl font-medium text-red-500">Invalid Certificate</h3>
                      <p className="mt-4 text-sm text-red-400">
                        {result.proof && result.proof.length > 0
                          ? result.proof[0]
                          : "This document does not match any valid record on the blockchain."}
                      </p>
                    </>
                  )}
                  
                  <button 
                    onClick={reset}
                    className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/10"
                  >
                    Verify Another
                  </button>
                </div>
              )}

              {status === 'error' && (
                <div className="space-y-4">
                  <span className="text-5xl block">❌</span>
                  <h3 className="text-2xl font-medium text-red-500">Verification Failed</h3>
                  <div className="rounded-lg bg-red-500/10 p-4 border border-red-500/20 text-red-400 text-center text-sm">
                    {error}
                  </div>
                  <button 
                    onClick={reset}
                    className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/10"
                  >
                    Try Again
                  </button>
                </div>
              )}

            </div>
          )}
        </div>

      </main>
    </div>
  );
}