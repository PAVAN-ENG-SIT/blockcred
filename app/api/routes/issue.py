import traceback
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.certificate import IssueCertificateRequest
from app.services.issuer_service import IssuerService
from app.api.dependencies import get_issuer_service

router = APIRouter()

@router.post("/issue", status_code=201)
def issue_new_certificate(
    request: IssueCertificateRequest,
    # In a real app, admin_user_id comes from a JWT token dependency
    admin_user_id: str = "admin_placeholder_123", 
    issuer_service: IssuerService = Depends(get_issuer_service)
):
    try:
        # Hand off to our orchestrator
        vc_document = issuer_service.issue_certificate(
            student_data=request.model_dump(), # <-- Updated for Pydantic V2
            admin_user_id=admin_user_id
        )
        return {"status": "success", "credential": vc_document}
        
    except Exception as e:
        # 🔥 THE HACKER TRICK: Grab the deep system traceback
        error_details = traceback.format_exc()
        print(f"🔥 FULL ERROR TRACE:\n{error_details}")
        
        # Send the full stack trace straight to your Swagger browser!
        raise HTTPException(status_code=500, detail=error_details)