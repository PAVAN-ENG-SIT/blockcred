// src/lib/adapters/verifyAdapter.ts

export type VerifyResponseResult = {
  isValid: boolean;
  hash: string;
  proof: string[];
};

/**
 * Converts backend response to UI-friendly format
 * Expected backend format: { valid: boolean, hash: string, merkle_proof: string[] }
 */
export function adaptVerifyResponse(data: any): VerifyResponseResult {
  return {
    isValid: data.is_valid || data.valid || false,
    hash: data.hash || "",
    proof: data.merkle_proof || data.reason ? [data.reason] : [],
  };
}
