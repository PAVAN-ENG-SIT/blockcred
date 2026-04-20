# local_kms.py - Auto-generated
import base64
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.hazmat.primitives import serialization
from app.ports.base_kms import BaseKMS
from app.core.exceptions import KeyNotFoundError # Implements Fix 6 (Strict Errors)

class LocalKMS(BaseKMS):
    def __init__(self):
        self._keys = {}
        # In a real system, this loads from an encrypted local file.
        # For Phase 1 runtime, we store keys in a simulated memory vault.
        self._vault = {}
        self.active_key_id = self.rotate_key()

    def rotate_key(self) -> str:
        """Simulates key rotation by generating a new Ed25519 keypair."""
        private_key = ed25519.Ed25519PrivateKey.generate()
        public_key = private_key.public_key()
        
        # Generate a simulated key_id (e.g., key-16830492)
        key_id = f"key-{id(private_key)}"
        
        self._vault[key_id] = {
            "private": private_key,
            "public": public_key
        }
        self.active_key_id = key_id
        return key_id

    def sign_payload(self, payload_hash: str, key_id: str = None) -> str:
        target_key_id = key_id or self.active_key_id
        if target_key_id not in self._vault:
            raise KeyNotFoundError(f"Key {target_key_id} compromised or missing.")
            
        private_key = self._vault[target_key_id]["private"]
        signature = private_key.sign(payload_hash.encode('utf-8'))
        
        # Return as base64 string for JSON compatibility
        return base64.b64encode(signature).decode('utf-8')

    def get_public_key(self, key_id: str) -> str:
        if key_id not in self._vault:
            raise KeyNotFoundError(f"Key {key_id} not found.")
            
        public_key = self._vault[key_id]["public"]
        public_bytes = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )
        return public_bytes.decode('utf-8')
    def verify_signature(self, payload_hash: str, signature_b64: str, key_id: str) -> bool:
        from cryptography.exceptions import InvalidSignature
        import base64
        
        if key_id not in self._vault:
            print(f"⚠️ Verification failed: Key {key_id} not found in memory (did the server restart?).")
            return False 
            
        public_key = self._vault[key_id]["public"]
        try:
            public_key.verify(
                base64.b64decode(signature_b64),
                payload_hash.encode('utf-8')
            )
            return True
        except InvalidSignature:
            return False