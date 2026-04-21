import os
from web3 import Web3
from web3.middleware import ExtraDataToPOAMiddleware
from dotenv import load_dotenv

load_dotenv()

# 1. Load your secrets
RPC_URL = os.getenv("RPC_URL")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")

# 2. Paste your entire ABI list here
CONTRACT_ABI=[
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": False,
    "inputs": [
      {
        "indexed": True,
        "internalType": "uint256",
        "name": "batchId",
        "type": "uint256"
      },
      {
        "indexed": True,
        "internalType": "bytes32",
        "name": "root",
        "type": "bytes32"
      },
      {
        "indexed": False,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": False,
        "internalType": "address",
        "name": "admin",
        "type": "address"
      }
    ],
    "name": "RootAnchored",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_merkleRoot",
        "type": "bytes32"
      }
    ],
    "name": "anchorRoot",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "anchorTimestamps",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "batchCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_batchId",
        "type": "uint256"
      }
    ],
    "name": "getRootDetails",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "merkleRoots",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

if not RPC_URL or not PRIVATE_KEY or not CONTRACT_ADDRESS:
    print("⚠️ Blockchain ENV missing, skipping init")
    w3 = None
    contract = None
    account = None
else:
    RPC_URL = RPC_URL.strip()
    PRIVATE_KEY = PRIVATE_KEY.strip()
    CONTRACT_ADDRESS = CONTRACT_ADDRESS.strip()

    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)

    checksum_address = Web3.to_checksum_address(CONTRACT_ADDRESS)
    contract = w3.eth.contract(address=checksum_address, abi=CONTRACT_ABI)
    account = w3.eth.account.from_key(PRIVATE_KEY)

def anchor_root_to_blockchain(merkle_root_hex: str):
    """
    Takes a Merkle Root (e.g., '0x123abc...') and permanently saves it to Polygon.
    """
    if not w3 or not contract or not account:
        raise Exception("Blockchain not initialized properly")

    if not w3.is_connected():
        raise Exception("❌ Failed to connect to blockchain")

    if not w3 or not contract or not account:
        raise Exception("Blockchain not initialized properly")

    print(f"Anchoring root to blockchain: {merkle_root_hex}")
    
    # Get nonce
    nonce = w3.eth.get_transaction_count(account.address)

    # 1. Build transaction
    transaction = contract.functions.anchorRoot(merkle_root_hex).build_transaction({
        'chainId': 80002, 
        'gas': 100000,  
        'maxFeePerGas': w3.to_wei('150', 'gwei'),
        'maxPriorityFeePerGas': w3.to_wei('150', 'gwei'),
        'nonce': nonce,
    })

    # 2. Sign
    signed_txn = w3.eth.account.sign_transaction(transaction, private_key=PRIVATE_KEY)

    # 3. Send
    print("Sending transaction...")
    tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
    
    # 4. Wait
    print("Waiting for network confirmation...")
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

    print(f"✅ Success! Root anchored in block {tx_receipt.blockNumber}")
    return w3.to_hex(tx_hash)



# --- QUICK TEST RUN ---
if __name__ == "__main__":
    # A fake 32-byte Merkle Root for testing (must be exactly 64 characters after the 0x)
    fake_root = "0x" + "a" * 64 
    anchor_root_to_blockchain(fake_root)