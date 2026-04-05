import logging
from datetime import datetime, timezone

logging.basicConfig(level=logging.INFO)

class AuditService:
    def log(self, action: str, user_id: str, target_hash: str):
        # In a real system, this writes to an immutable log storage
        timestamp = datetime.now(timezone.utc).isoformat()
        logging.info(f"🛡️ [AUDIT LOG] {timestamp} | User: {user_id} | Action: {action} | Target: {target_hash}")