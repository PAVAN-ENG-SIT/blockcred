// src/app/loading.tsx
import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* The spinning ring */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/5 border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.1)] backdrop-blur-xl">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        </div>
        
        {/* The loading text with a subtle pulse */}
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-medium tracking-widest text-gray-300 uppercase">
            Initializing System
          </h3>
          <p className="text-xs text-gray-500 mt-1 animate-pulse">
            Establishing secure connection...
          </p>
        </div>
      </div>
    </div>
  );
}