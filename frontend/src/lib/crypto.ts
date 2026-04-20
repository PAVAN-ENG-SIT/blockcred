// src/lib/crypto.ts
import { CredentialSchema } from "./schemas/credential.schema";

export async function parseCredentialFile(file: File): Promise<any> {
  try {
    const text = await file.text();
    const rawJson = JSON.parse(text);
    
    // ZOD VALIDATION: This is the zero-trust magic.
    // If the JSON doesn't match the schema, this throws an error instantly.
    const validatedData = CredentialSchema.parse(rawJson);
    
    return validatedData;
  } catch (error: any) {
    if (error.name === "ZodError") {
      // Zod gives us highly specific errors (e.g., "Missing field: issuer")
      throw new Error("Invalid credential format: Missing required data fields.");
    }
    throw new Error("Invalid JSON format. Please upload a valid BlockCred credential file.");
  }
}

export async function generateHash(file: File) {
  const buffer = await file.arrayBuffer();

  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);

  const hash = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  console.log("Frontend hash:", hash);

  return hash;
}