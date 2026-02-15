"""
Blockchain integration module for E-Tendering System
"""

import json
import os
from web3 import Web3
from web3.contract import Contract
from typing import Optional, Dict, Any
from dotenv import load_dotenv
import os
load_dotenv()

def config(key, default=None):
    return os.getenv(key, default)

class BlockchainManager:
    def __init__(self):
        self.w3 = Web3(Web3.HTTPProvider(config("GANACHE_URI", default="http://127.0.0.1:7545")))
        self.contract: Optional[Contract] = None
        self.contract_address: Optional[str] = None
        self.abi: Optional[list] = None

        # Load contract info if available
        self._load_contract_info()

    def _load_contract_info(self):
        """Load deployed contract information"""
        deployment_file = os.path.join(os.path.dirname(__file__), "../contracts/deployment_info.json")

        if os.path.exists(deployment_file):
            with open(deployment_file, "r") as f:
                deployment_info = json.load(f)
                self.contract_address = deployment_info["contract_address"]
                self.abi = deployment_info["abi"]
                self.contract = self.w3.eth.contract(
                    address=self.contract_address,
                    abi=self.abi
                )
        else:
            print("Warning: Contract not deployed yet. Run deployment script first.")

    def is_connected(self) -> bool:
        """Check if connected to blockchain"""
        return self.w3.is_connected()

    def get_accounts(self) -> list:
        """Get available accounts"""
        return self.w3.eth.accounts

    def create_tender_hash(self, tender_data: Dict[str, Any]) -> str:
        """Create a hash for tender data"""
        # Convert tender data to string and hash it
        tender_string = json.dumps(tender_data, sort_keys=True)
        return self.w3.keccak(text=tender_string).hex()

    def create_bid_hash(self, bid_data: Dict[str, Any]) -> str:
        """Create a hash for bid data"""
        bid_string = json.dumps(bid_data, sort_keys=True)
        return self.w3.keccak(text=bid_string).hex()

    async def submit_tender_to_blockchain(self, tender_data: Dict[str, Any], admin_address: str) -> Optional[str]:
        """Submit tender to blockchain"""
        if not self.contract:
            return None

        try:
            tender_hash = self.create_tender_hash(tender_data)

            # Call contract function
            tx_hash = self.contract.functions.createTender(
                tender_data["title"],
                int(tender_data["budget"]),
                int(tender_data["deadline_timestamp"]),  # Unix timestamp
                tender_hash
            ).transact({
                'from': admin_address,
                'gas': 2000000
            })

            # Wait for transaction receipt
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)

            # Process the event log to get the tenderId
            log = self.contract.events.TenderCreated().process_receipt(receipt)
            tender_id = log[0]['args']['tenderId']

            return {
                "transaction_hash": receipt.transactionHash.hex(),
                "blockchain_tender_id": tender_id
            }

        except Exception as e:
            print(f"Error submitting tender to blockchain: {e}")
            return None

    async def submit_bid_to_blockchain(self, tender_id: int, bid_amount: int, bidder_address: str) -> Optional[str]:
        """Submit bid to blockchain"""
        if not self.contract:
            return None

        try:
            bid_data = {
                "tender_id": tender_id,
                "bidder_address": bidder_address,
                "amount": bid_amount,
                "timestamp": self.w3.eth.get_block('latest')['timestamp']
            }
            bid_hash = self.create_bid_hash(bid_data)

            # Call contract function
            tx_hash = self.contract.functions.submitBid(
                tender_id,
                bid_amount,
                bid_hash
            ).transact({
                'from': bidder_address,
                'gas': 2000000
            })

            # Wait for transaction receipt
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            return receipt.transactionHash.hex()

        except Exception as e:
            print(f"Error submitting bid to blockchain: {e}")
            return None

    async def close_tender_on_blockchain(self, tender_id: int, admin_address: str) -> Optional[str]:
        """Close tender on blockchain"""
        if not self.contract:
            return None

        try:
            tx_hash = self.contract.functions.closeTender(tender_id).transact({
                'from': admin_address,
                'gas': 2000000
            })

            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            return receipt.transactionHash.hex()

        except Exception as e:
            print(f"Error closing tender on blockchain: {e}")
            return None

    async def evaluate_bids_on_blockchain(self, tender_id: int, admin_address: str) -> Optional[Dict[str, Any]]:
        """Evaluate bids and declare winner on blockchain"""
        if not self.contract:
            return None

        try:
            # First check if there are bids for this tender
            bids = self.contract.functions.getTenderBids(tender_id).call()
            if len(bids) == 0:
                print(f"No bids found for tender {tender_id}")
                return None

            # Evaluate the bids to determine winner
            tx_hash = self.contract.functions.evaluateBids(tender_id).transact({
                'from': admin_address,
                'gas': 2000000
            })

            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)

            # Get winner info from contract using getWinningBid
            winning_bid = self.contract.functions.getWinningBid(tender_id).call()

            return {
                "winner_address": winning_bid[1],  # bidder address
                "winning_amount": winning_bid[2],  # amount
                "tx_hash": receipt.transactionHash.hex()
            }

        except Exception as e:
            print(f"Error evaluating bids on blockchain: {e}")
            return None

    def get_tender_bids_from_blockchain(self, tender_id: int) -> list:
        """Get bids for a tender from blockchain"""
        if not self.contract:
            return []

        try:
            bids = self.contract.functions.getTenderBids(tender_id).call()
            return bids
        except Exception as e:
            print(f"Error getting bids from blockchain: {e}")
            return []

# Global blockchain manager instance
blockchain_manager = BlockchainManager()
