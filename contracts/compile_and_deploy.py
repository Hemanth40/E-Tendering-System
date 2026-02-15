#!/usr/bin/env python3
"""
Script to compile and deploy the TenderContract to Ganache
"""

import json
import os
from web3 import Web3
from solcx import compile_standard, install_solc

def compile_contract():
    """Compile the Solidity contract"""
    print("Installing solc...")
    install_solc("0.8.0")

    print("Compiling contract...")
    contract_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "TenderContract.sol"))
    with open(contract_path, "r") as file:
        contract_source = file.read()

    compiled_sol = compile_standard(
        {
            "language": "Solidity",
            "sources": {"TenderContract.sol": {"content": contract_source}},
            "settings": {
                "outputSelection": {
                    "*": {
                        "*": ["abi", "metadata", "evm.bytecode", "evm.bytecode.sourceMap"]
                    }
                }
            },
        },
        solc_version="0.8.0",
    )

    # Save compiled contract
    with open("compiled_contract.json", "w") as file:
        json.dump(compiled_sol, file, indent=4)

    return compiled_sol

def deploy_contract():
    """Deploy the contract to Ganache"""
    print("Connecting to Ganache...")

    # Connect to Ganache
    w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))

    if not w3.is_connected():
        print("Failed to connect to Ganache. Make sure it's running on http://127.0.0.1:7545")
        return None

    print("Connected to Ganache")

    # Load compiled contract
    if not os.path.exists("compiled_contract.json"):
        print("Compiled contract not found. Please run compile first.")
        return None

    with open("compiled_contract.json", "r") as file:
        compiled_sol = json.load(file)

    # Get contract interface
    contract_interface = compiled_sol["contracts"]["TenderContract.sol"]["TenderContract"]

    # Get bytecode and abi
    bytecode = contract_interface["evm"]["bytecode"]["object"]
    abi = contract_interface["abi"]

    # Get the first account from Ganache
    accounts = w3.eth.accounts
    if not accounts:
        print("No accounts found in Ganache")
        return None

    deployer_account = accounts[0]
    print(f"Deploying from account: {deployer_account}")

    # Create contract instance
    TenderContract = w3.eth.contract(abi=abi, bytecode=bytecode)

    # Build transaction
    construct_txn = TenderContract.constructor().build_transaction(
        {
            "from": deployer_account,
            "nonce": w3.eth.get_transaction_count(deployer_account),
            "gas": 2000000,
            "gasPrice": w3.to_wei("21", "gwei"),
        }
    )

    # Send transaction (Ganache doesn't require signing)
    tx_hash = w3.eth.send_transaction(construct_txn)

    print(f"Transaction sent: {tx_hash.hex()}")

    # Wait for transaction receipt
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    contract_address = tx_receipt.contractAddress

    print(f"Contract deployed at: {contract_address}")

    # Save deployment info
    deployment_info = {
        "contract_address": contract_address,
        "abi": abi,
        "deployer": deployer_account,
        "tx_hash": tx_hash.hex()
    }

    with open("deployment_info.json", "w") as file:
        json.dump(deployment_info, file, indent=4)

    return contract_address

if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "compile":
        compile_contract()
    elif len(sys.argv) > 1 and sys.argv[1] == "deploy":
        deploy_contract()
    else:
        print("Usage:")
        print("  python compile_and_deploy.py compile  # Compile the contract")
        print("  python compile_and_deploy.py deploy   # Deploy the contract")
        print("  python compile_and_deploy.py           # Show this help")
