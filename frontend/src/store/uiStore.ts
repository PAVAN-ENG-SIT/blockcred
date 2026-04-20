// src/store/uiStore.ts
import { create } from "zustand";
import { VerifyStatus } from "@/hooks/useVerify";
import { VerifyResponseResult } from "@/lib/adapters/verifyAdapter";

interface UIState {
  loading: boolean;
  status: VerifyStatus;
  result: VerifyResponseResult | null;
  error: string | null;

  setLoading: (loading: boolean) => void;
  setStatus: (status: VerifyStatus) => void;
  setResult: (result: VerifyResponseResult | null) => void;
  setError: (error: string | null) => void;
  resetVerifyFlow: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  loading: false,
  status: "idle",
  result: null,
  error: null,

  setLoading: (loading) => set({ loading }),
  setStatus: (status) => set({ status }),
  setResult: (result) => set({ result }),
  setError: (error) => set({ error }),
  resetVerifyFlow: () => set({ loading: false, status: "idle", result: null, error: null }),
}));
