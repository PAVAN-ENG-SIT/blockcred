// src/hooks/useVerify.ts
import { useState } from "react";
import { parseCredentialFile } from "@/lib/crypto";
import { verifyCertificate } from "@/lib/api";
import { adaptVerifyResponse, VerifyResponseResult } from "@/lib/adapters/verifyAdapter";

export type VerifyStatus = "idle" | "hashing" | "verifying" | "success" | "error";

export function useVerify() {
  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerifyResponseResult | null>(null);

  const reset = () => {
    setStatus("idle");
    setError(null);
    setResult(null);
  };

  const verify = async (file: File) => {
    try {
      reset();

      // 1. Parsing Stage (Rename statsu later if needed, kept as hashing for backward compat UI)
      setStatus("hashing");
      const vcDocument = await parseCredentialFile(file);
      
      if (process.env.NODE_ENV === "development") {
        console.log("[DEBUG] Frontend parsed doc:", vcDocument);
      }

      // 2. Verifying Stage
      setStatus("verifying");
      const res = await verifyCertificate(vcDocument);

      // 3. Adapter Stage
      const finalResult = adaptVerifyResponse(res);
      setResult(finalResult);
      setStatus("success");

      return finalResult;
    } catch (err: any) {
      setError(err.message || "An unknown error occurred during verification");
      setStatus("error");
    }
  };

  return { verify, status, error, result, reset };
}