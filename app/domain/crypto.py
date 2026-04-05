# crypto.py - Auto-generated
import json
import hashlib

def canonicalize_json(data: dict) -> str:
    """
    CRITICAL: Sorts JSON keys alphabetically and removes whitespace.
    Ensures the exact same dictionary always produces the exact same string.
    """
    # separators=(',', ':') removes spaces between keys and values
    return json.dumps(data, sort_keys=True, separators=(',', ':'))

def hash_payload(canonical_string: str) -> str:
    """
    Standardized SHA-256 hashing for the entire system.
    """
    sha_signature = hashlib.sha256(canonical_string.encode('utf-8')).hexdigest()
    return f"0x{sha_signature}"