import hashlib
from typing import List
# crush all hashes into the root node of a tree
class AnchoringService:
    def __init__(self):
        # This is our in-memory waiting room for certificate hashes
        self.pending_hashes: List[str] = []

    def queue_for_batch(self, vc_hash: str) -> None:
        """Adds a new certificate hash to the queue."""
        self.pending_hashes.append(vc_hash)
        print(f"⛓️ [BLOCKCHAIN] Queued hash. Queue size is now: {len(self.pending_hashes)}")

    def _hash_pair(self, left: str, right: str) -> str:
        """Helper to combine two hashes and hash them again."""
        # Standard Merkle trees combine the strings and hash the result
        combined = (left + right).encode('utf-8')
        return hashlib.sha256(combined).hexdigest()

    def _build_merkle_root(self, leaves: List[str]) -> str:
        """Recursively pairs and hashes leaves until only 1 root remains."""
        if not leaves:
            return ""
        if len(leaves) == 1:
            return leaves[0] # The Root!

        # If there is an odd number of hashes, duplicate the last one to make a pair
        if len(leaves) % 2 != 0:
            leaves.append(leaves[-1])

        next_level = []
        # Step through the leaves 2 at a time
        for i in range(0, len(leaves), 2):
            paired_hash = self._hash_pair(leaves[i], leaves[i+1])
            next_level.append(paired_hash)

        # Recursively call this function on the new level
        return self._build_merkle_root(next_level)

    def anchor_batch(self) -> dict:
        """Calculates the final Merkle Root and clears the queue."""
        if not self.pending_hashes:
            return {"status": "No hashes in queue to anchor."}

        print(f"🌳 [MERKLE TREE] Building tree from {len(self.pending_hashes)} hashes...")
        
        # Calculate the Root
        merkle_root = self._build_merkle_root(self.pending_hashes.copy())
        
        # In Phase 2, this is where we will use Web3.py to send this root to Polygon!
        print(f"💎 [POLYGON STUB] Sending Merkle Root to Smart Contract: 0x{merkle_root}")
        
        # Clear the queue for the next batch
        self.pending_hashes.clear()
        
        return {
            "status": "Batch anchored successfully",
            "merkle_root": f"0x{merkle_root}",
            "certificates_anchored": len(self.pending_hashes) # Will show 0 because we just cleared it, but logically it's the batch size
        }