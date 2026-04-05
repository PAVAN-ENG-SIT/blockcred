class KeyNotFoundError(Exception):
    """Raised when a requested cryptographic key is missing from the vault."""
    pass

class SignatureInvalidError(Exception):
    """Raised when a cryptographic signature fails verification."""
    pass