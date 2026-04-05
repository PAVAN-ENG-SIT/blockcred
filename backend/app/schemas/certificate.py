from pydantic import BaseModel, Field

class IssueCertificateRequest(BaseModel):
    student_id: str = Field(..., description="Unique ID of the student")
    name_hash: str = Field(..., description="SHA-256 hash of the student's legal name")
    course: str = Field(..., description="Name of the completed course or degree")
    grade: str = Field(..., description="Final grade or classification")
    
    class Config:
        json_schema_extra = {  # <-- Updated for Pydantic V2
            "example": {
                "student_id": "987654321",
                "name_hash": "0xabc123def456...",
                "course": "Blockchain Architecture 101",
                "grade": "A+"
            }
        }