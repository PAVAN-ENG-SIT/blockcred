// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { GlassCard } from "@/components/motion/GlassCard";
import { ShieldCheck, Loader2, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        window.location.href = "/dashboard";
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Check your email for the confirmation link!");
      }
    } catch (err: any) {
      setError(err.message || "Failed to authenticate.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Failed to initialize Google Authentication.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white py-24">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[100px]" />

      <main className="container z-10 mx-auto px-4 flex justify-center">
        <GlassCard className="w-full max-w-md p-8 sm:p-10">
          
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 border border-white/10 shadow-xl">
            <ShieldCheck className="h-8 w-8 text-blue-400" />
          </div>

          <h1 className="mb-2 text-center text-2xl font-bold tracking-tight text-white">
            Secure Access
          </h1>
          <p className="mb-8 text-center text-sm text-gray-400">
            Authenticate to access the BlockCred engine.
          </p>

          {/* Toggle Buttons */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-6 border border-white/10">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                isLogin ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                !isLogin ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="User ID or Email"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 rounded-xl font-medium text-white bg-blue-600 flex-1 hover:bg-blue-500 transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isLogin ? "Sign In" : "Sign Up")}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="mx-4 text-xs text-gray-500 uppercase tracking-widest">OR</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="group relative flex w-full items-center justify-center space-x-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition-all hover:bg-gray-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {/* Google "G" SVG Icon */}
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {error && (
            <div className="mt-6 rounded-lg bg-red-500/10 p-3 border border-red-500/20 text-red-400 text-xs font-medium text-center">
              {error}
            </div>
          )}
          
        </GlassCard>
      </main>
    </div>
  );
}