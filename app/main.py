from fastapi import FastAPI
from app.api.routes import issue, verify, anchor

app = FastAPI(
    title="ZeroCert Enterprise API",
    description="Zero-Trust Cryptographic Credential Infrastructure",
    version="1.0.0"
)

# Attach our API routes
app.include_router(issue.router, prefix="/api/v1")
app.include_router(verify.router, prefix="/api/v1") 
app.include_router(anchor.router, prefix="/api/v1")

@app.get("/health", tags=["System"])
def health_check():
    """Simple check to ensure the server is running."""
    return {
        "status": "System Operational", 
        "cryptographic_enclave": "Active"
    }