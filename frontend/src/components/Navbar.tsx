"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ShieldCheck, LayoutDashboard, Search, FileCheck2, Network, User, LogOut } from "lucide-react";

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowMenu(false);
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo / Home */}
        <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
          <ShieldCheck className="h-6 w-6 text-blue-500" />
          <span className="text-xl font-bold tracking-tight text-white">BlockCred</span>
        </Link>
        
        {/* Show Sign Up when NOT logged in */}
        {!user && (
          <Link href="/login" className="flex items-center space-x-2 px-5 py-2 rounded-full bg-blue-600 text-sm font-medium text-white hover:bg-blue-500 transition-all active:scale-95">
            <User className="h-4 w-4" />
            <span>Sign Up</span>
          </Link>
        )}

        {/* Only show nav links + profile when logged in */}
        {user && (
          <div className="flex items-center space-x-1">
            
            <Link href="/dashboard" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            
            <Link href="/verify" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all">
              <FileCheck2 className="h-4 w-4 text-green-400" />
              <span>Verify</span>
            </Link>

            <Link href="/explorer" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all">
              <Search className="h-4 w-4 text-purple-400" />
              <span>Explorer</span>
            </Link>

            <Link href="/tree" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all">
              <Network className="h-4 w-4 text-orange-400" />
              <span>Tree</span>
            </Link>

            {/* Profile Circle */}
            <div className="relative ml-2">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center justify-center h-9 w-9 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-colors"
              >
                {user.email ? user.email[0].toUpperCase() : <User className="h-4 w-4" />}
              </button>

              {/* Dropdown */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-black/90 backdrop-blur-md shadow-2xl p-2">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center space-x-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </nav>
  );
}
