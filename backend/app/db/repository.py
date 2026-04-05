import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load our secret keys from the .env file
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

class DatabaseRepository:
    def __init__(self):
        # Initialize the Supabase Client
        if SUPABASE_URL and SUPABASE_KEY:
            self.client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        else:
            self.client = None
            print("⚠️ Supabase keys missing. Running in local stub mode.")

    def save_certificate(self, vc_document: dict) -> None:
        if not self.client:
            print(f"🗄️ [DATABASE STUB] Saved credential to DB: {vc_document.get('id')}")
            return
            
        try:
            # We save the certificate to a Supabase table named 'certificates'
            # We extract the 'id' and 'student_id' so they are easily searchable
            data = self.client.table("certificates").insert({
                "id": vc_document.get("id"),
                "student_id": vc_document["credentialSubject"]["id"],
                "document": vc_document # The entire W3C JSON goes into a JSONB column!
            }).execute()
            
            print(f"🗄️ [SUPABASE] Successfully saved credential: {vc_document.get('id')} to the Cloud!")
            
        except Exception as e:
            print(f"❌ [SUPABASE ERROR] Failed to save credential: {str(e)}")
            raise e