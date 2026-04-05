# base_kms.py - Auto-generated
from abc import ABC, abstractmethod

class BaseKMS(ABC):
    """
    Abstract Base Class defining the mandatory interface for all Key Management Systems.
    Whether local or AWS, they MUST implement these exact methods.
    """

    @abstractmethod
    def sign_payload(self, payload_hash: str, key_id: str) -> str:
        """Signs a canonicalized hash using the specified key version."""
        pass

    @abstractmethod
    def get_public_key(self, key_id: str) -> str:
        """Retrieves the public key for verification purposes."""
        pass

    @abstractmethod
    def rotate_key(self) -> str:
        """Generates a new active key pair and returns the new key_id."""
        pass
    