from app.adapters.local_kms import LocalKMS
from app.services.issuer_service import IssuerService
from app.db.repository import DatabaseRepository
from app.services.audit_service import AuditService
from app.services.anchoring_service import AnchoringService

# We initialize these once so they act as singletons while the server runs
kms_adapter = LocalKMS()
db_repo = DatabaseRepository()
audit_service = AuditService()
anchoring_service = AnchoringService()

def get_issuer_service() -> IssuerService:
    """
    FastAPI will automatically call this function whenever an API route 
    requests the IssuerService.
    """
    return IssuerService(
        kms=kms_adapter,
        db_repo=db_repo,
        audit_service=audit_service,
        anchoring_service=anchoring_service
    )