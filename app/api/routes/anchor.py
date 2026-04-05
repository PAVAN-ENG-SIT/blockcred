from fastapi import APIRouter
from app.api.dependencies import anchoring_service
from app.blockchain import anchor_root_to_blockchain

router = APIRouter()

@router.post("/anchor")
def trigger_blockchain_anchor():
    """
    Manually triggers the Merkle Tree calculation 
    and submits the root to the Polygon blockchain.
    """
    # 1. Calculate the Merkle Root from pending certificates
    result = anchoring_service.anchor_batch()
    
    # 2. Extract the root hash using the exact key you just found!
    root_hash = result.get("merkle_root") 

    if root_hash:
        try:
            # 3. 🚀 Push it to Polygon!
            tx_hash = anchor_root_to_blockchain(root_hash)
            
            # 4. Attach the Web3 receipt to your API response
            result["blockchain_tx_hash"] = tx_hash
            result["blockchain_status"] = "Success - Anchored to Polygon"
            
        except Exception as e:
            print(f"❌ Blockchain anchoring failed: {e}")
            result["blockchain_error"] = str(e)
            result["blockchain_status"] = "Partial Success - DB updated, but blockchain failed."

    return result