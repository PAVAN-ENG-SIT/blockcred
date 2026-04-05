from app.domain.crypto import canonicalize_json, hash_payload
from app.adapters.local_kms import LocalKMS 

class VerifyService:
    def __init__(self, kms: LocalKMS):
        self.kms = kms

    def verify_credential(self, vc_document: dict) -> dict:
        try:
            # 1. Extract the proof and remove it to recreate the original document
            document_copy = vc_document.copy()
            proof = document_copy.pop("proof", None)
            
            if not proof:
                return {"is_valid": False, "reason": "No cryptographic proof found."}
                
            signature_hex = proof.get("signatureValue")
            verification_method = proof.get("verificationMethod") 
            
            # Extract key ID (In Phase 2, we fetch this public key from the Blockchain DID)
            key_id = verification_method.split("#")[-1]
            
            # 2. Re-calculate the hash EXACTLY how it was issued
            canonical_doc = canonicalize_json(document_copy)
            recalculated_hash = hash_payload(canonical_doc)
            
            # 3. Verify the signature cryptographically
            is_valid = self.kms.verify_signature(recalculated_hash, signature_hex, key_id)
            
            if is_valid:
                return {"is_valid": True, "reason": "Signature is mathematically valid and data is untampered."}
            else:
                return {"is_valid": False, "reason": "Signature verification failed. Data may be tampered."}
                
        except Exception as e:
            return {"is_valid": False, "reason": f"Verification error: {str(e)}"}