// src/lib/api.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Generic retry logic for all async functions
 */
export async function retry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries === 0) throw err;
    return retry(fn, retries - 1);
  }
}

/**
 * Centralized API fetch wrapper
 * Ensures headers, error handling, logging, and JSON parsing are uniform 
 */
export async function apiFetch(endpoint: string, options?: RequestInit) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      // Only log full error texts in dev mode
      if (process.env.NODE_ENV === "development") {
        console.error(`API Error response from ${endpoint}:`, errorText);
      }
      throw new Error(errorText || "API Error");
    }

    const data = await res.json();
    
    if (process.env.NODE_ENV === "development") {
      console.log(`[API SUCCESS] ${endpoint}:`, data);
    }
    
    return data;
  } catch (err) {
    console.error(`[API ERROR] calling ${endpoint}:`, err);
    throw err;
  }
}

// ---------------------------------------------------------------------
// Domain-Specific API Functions
// ---------------------------------------------------------------------

/**
 * Endpoint for verifying a certificate against the backend
 * @param vcDocument The parsed credential file JSON
 */
export async function verifyCertificate(vcDocument: any) {
  return retry(() =>
    apiFetch("/api/v1/verify", {
      method: "POST",
      body: JSON.stringify(vcDocument),
    })
  );
}

/**
 * Fetch all blocks for the explorer
 */
export async function getBlocks() {
  return retry(() => apiFetch("/api/v1/blocks"));
}

/**
 * Admin: Issue a new certificate
 */
export async function issueCertificate(studentData: any) {
  return retry(() =>
    apiFetch("/api/v1/issue", {
      method: "POST",
      body: JSON.stringify(studentData),
    })
  );
}

/**
 * Admin: Anchor pending certificates to Polygon
 */
export async function anchorCertificates() {
  return retry(() =>
    apiFetch("/api/v1/anchor", {
      method: "POST"
    })
  );
}