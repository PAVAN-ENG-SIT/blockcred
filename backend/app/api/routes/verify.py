from fastapi import APIRouter, Depends, HTTPException
from app.services.verify_service import VerifyService
from app.api.dependencies import kms_adapter # Reusing our KMS singleton

router = APIRouter()

# Simple dependency injection for the verifier
def get_verify_service():
    return VerifyService(kms=kms_adapter)

@router.post("/verify")
def verify_certificate(
    vc_document: dict,
    verify_service: VerifyService = Depends(get_verify_service)
):
    try:
        result = verify_service.verify_credential(vc_document)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))