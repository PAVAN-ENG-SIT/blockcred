# vc.py - Auto-generated
import uuid
from datetime import datetime, timezone

def format_w3c(student_data: dict, issuer_did: str) -> dict:
    """
    Transforms raw student data into a strict W3C-compliant Verifiable Credential.
    """
    return {
        "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://w3id.org/vc/status-list/2021/v1" # Prepping for Phase 2 Revocation
        ],
        "id": f"urn:uuid:{uuid.uuid4()}",
        "type": ["VerifiableCredential", "UniversityDegreeCredential"],
        "issuer": issuer_did,
        "issuanceDate": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "credentialSubject": {
            "id": f"did:student:{student_data.get('student_id')}",
            "name_hash": student_data.get("name_hash"), # Privacy-first: No plain-text names
            "course": student_data.get("course"),
            "grade": student_data.get("grade")
        }
    }