// src/app/(marketing)/page.tsx
import Link from "next/link";
import { User, ShieldCheck, ChevronRight, Lock } from "lucide-react"; // <-- Added the missing icons back!

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white">
      
      
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

      <main className="container z-10 mx-auto px-4 text-center">
        
        {/* Trust Badge */}
        <div className="mx-auto mb-8 flex max-w-fit items-center justify-center space-x-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
          <ShieldCheck className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-medium text-gray-300">
            Zero-Trust Cryptographic Verification
          </span>
        </div>

        {/* Hero Headline */}
        <h1 className="mx-auto mb-6 max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
          Verify Credentials with <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
            Absolute Mathematical Certainty
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400 sm:text-xl">
          BlockCred uses local SHA-256 hashing and Polygon blockchain anchors to ensure institutional credentials are authentic, untampered, and permanently verifiable.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
          <Link 
            href="/verify"
            className="group flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-black transition-all hover:scale-105 active:scale-95"
          >
            Launch Verifier
            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          
          <Link 
            href="/explorer"
            className="flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10 active:scale-95"
          >
            <Lock className="mr-2 h-4 w-4 text-gray-400" />
            View Block Explorer
          </Link>
        </div>

      </main>
    </div>
  );
}