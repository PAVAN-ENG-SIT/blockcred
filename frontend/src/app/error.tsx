// src/app/error.tsx
"use client"; // <-- This is the magic line that fixes the build error

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // You can log the error to an error reporting service here
    console.error("Global UI Crash:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4 text-white">
      <div className="relative max-w-md overflow-hidden rounded-3xl border border-red-500/20 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-xl">
        {/* Subtle red glow effect behind the card */}
        <div className="absolute -inset-24 -z-10 bg-red-500/10 blur-3xl" />

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-red-400">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <h2 className="mb-2 text-2xl font-semibold tracking-tight">
          System Interruption
        </h2>
        <p className="mb-8 text-sm text-gray-400">
          A critical rendering error occurred in the cryptographic UI layer. 
          {error.message && (
            <span className="mt-2 block font-mono text-xs text-red-400/80 break-words">
              {error.message}
            </span>
          )}
        </p>

        <button
          onClick={() => reset()}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-white/20 active:scale-95"
        >
          <RefreshCcw className="h-4 w-4 transition-transform group-hover:-rotate-180" />
          Reboot Interface
        </button>
      </div>
    </div>
  );
}