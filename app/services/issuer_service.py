from app.ports.base_kms import BaseKMS
from app.domain.crypto import canonicalize_json, hash_payload
from app.domain.vc import format_w3c  # <-- We are finally importing this!

class IssuerService:
    def __init__(self, kms: BaseKMS, db_repo, audit_service, anchoring_service):
        self.kms = kms
        self.db = db_repo
        self.audit = audit_service
        self.anchoring = anchoring_service

    def issue_certificate(self, student_data: dict, admin_user_id: str) -> dict:
        # 1. Domain Logic: Format to W3C Credential
        issuer_did = "did:polygon:0xYourUniversityAddress"
        vc_document = format_w3c(student_data, issuer_did)
        
        # 2. Domain Logic: Canonicalize and Hash
        canonical_doc = canonicalize_json(vc_document)
        document_hash = hash_payload(canonical_doc)
        
        # 3. Port: Sign via KMS
        active_key = self.kms.active_key_id
        signature = self.kms.sign_payload(document_hash, active_key)
        
        # 4. Construct Final Payload
        vc_document["proof"] = {
            "type": "Ed25519Signature2018",
            "verificationMethod": f"{issuer_did}#{active_key}",
            "signatureValue": signature
        }
        
        # 5. DB Layer: Save to PostgreSQL
        self.db.save_certificate(vc_document)
        
        # 6. Service Layer: Queue for Blockchain Anchoring
        self.anchoring.queue_for_batch(document_hash)
        
        # 7. Audit Layer: Immutable logging
        self.audit.log(
            action="CERTIFICATE_ISSUED",
            user_id=admin_user_id,
            target_hash=document_hash
        )
        
        return vc_document