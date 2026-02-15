from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models import Tender, TenderStatus, User, UserRole
from auth import get_current_user
from datetime import datetime
from blockchain import blockchain_manager
from database import get_database
from bson import ObjectId
import json

router = APIRouter()

@router.post("/")
async def create_tender(tender_data: dict, current_user: User = Depends(get_current_user)):
    # Validate required fields
    required_fields = ["title", "description", "budget", "deadline", "requirements"]
    for field in required_fields:
        if field not in tender_data:
            raise HTTPException(status_code=422, detail=f"Field '{field}' is required")
    if current_user.role not in [UserRole.ADMIN, UserRole.ORGANIZER]:
        raise HTTPException(status_code=403, detail="Only admins and organizers can create tenders")

    db = get_database()
    tenders_collection = db["tenders"]

    deadline_dt = datetime.fromisoformat(tender_data["deadline"])
    deadline_timestamp = int(deadline_dt.timestamp())

    tender = Tender(
        title=tender_data["title"],
        description=tender_data["description"],
        budget=tender_data["budget"],
        deadline=deadline_dt,
        requirements=tender_data["requirements"],
        admin_id=str(current_user.id),
        status=TenderStatus.PUBLISHED
    )

    # Store in MongoDB
    result = tenders_collection.insert_one(tender.dict(by_alias=True))
    tender_id = str(result.inserted_id)

    # Create blockchain hash and submit to blockchain
    blockchain_data = {
        "title": tender_data["title"],
        "description": tender_data["description"],
        "budget": tender_data["budget"],
        "deadline": tender_data["deadline"],
        "requirements": tender_data["requirements"],
        "admin_id": str(current_user.id),
        "timestamp": datetime.utcnow().isoformat()
    }

    tender_hash = blockchain_manager.create_tender_hash(blockchain_data)

    # Submit to blockchain if connected
    blockchain_tx = None
    blockchain_tender_id = None
    if blockchain_manager.is_connected():
        admin_address = current_user.wallet_address or "0x713A6B63f783269F0AD6b31868B971FE116cC1D7"
        blockchain_tx = await blockchain_manager.submit_tender_to_blockchain(
            {
                **blockchain_data,
                "deadline_timestamp": deadline_timestamp
            }, admin_address
        )
        # Get the blockchain tender ID (sequential)
        if blockchain_tx:
            # The blockchain tender ID is the return value from createTender
            # We need to get it from the contract
            blockchain_tender_id = blockchain_manager.contract.functions.tenderCount().call()

    # Update MongoDB with blockchain info
    update_data = {"blockchain_hash": tender_hash}
    if blockchain_tx:
        update_data["blockchain_tx_hash"] = blockchain_tx
    if blockchain_tender_id:
        update_data["blockchain_tender_id"] = blockchain_tender_id

    tenders_collection.update_one({"_id": result.inserted_id}, {"$set": update_data})

    return {
        "message": "Tender created successfully",
        "tender_id": tender_id,
        "blockchain_hash": tender_hash,
        "blockchain_tx": blockchain_tx,
        "blockchain_tender_id": blockchain_tender_id
    }

@router.get("/")
async def get_tenders():
    db = get_database()
    tenders_collection = db["tenders"]
    tenders = list(tenders_collection.find({}))
    # Convert ObjectId to string for JSON serialization
    for tender in tenders:
        tender["_id"] = str(tender["_id"])
    return {"tenders": tenders}

@router.get("/{tender_id}")
async def get_tender(tender_id: str):
    db = get_database()
    tenders_collection = db["tenders"]
    try:
        tender = tenders_collection.find_one({"_id": ObjectId(tender_id)})
    except:
        tender = None
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")
    # Convert ObjectId to string for JSON serialization
    tender["_id"] = str(tender["_id"])
    return tender

@router.put("/{tender_id}/publish")
async def publish_tender(tender_id: str, current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.ADMIN, UserRole.ORGANIZER]:
        raise HTTPException(status_code=403, detail="Only admins and organizers can publish tenders")

    db = get_database()
    tenders_collection = db["tenders"]
    result = tenders_collection.update_one(
        {"_id": ObjectId(tender_id), "admin_id": str(current_user.id)},
        {"$set": {"status": TenderStatus.PUBLISHED}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Tender not found or not authorized")
    return {"message": "Tender published successfully"}

@router.put("/{tender_id}/close")
async def close_tender(tender_id: str, current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can close tenders")

    db = get_database()
    tenders_collection = db["tenders"]

    # Close tender in database
    result = tenders_collection.update_one(
        {"_id": ObjectId(tender_id)},
        {"$set": {"status": TenderStatus.CLOSED}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Tender not found")

    # Close tender on blockchain
    blockchain_tx = None
    if blockchain_manager.is_connected():
        admin_address = current_user.wallet_address or "0x713A6B63f783269F0AD6b31868B971FE116cC1D7"
        tender = tenders_collection.find_one({"_id": ObjectId(tender_id)})
        if tender and tender.get("blockchain_tender_id"):
            blockchain_tx = await blockchain_manager.close_tender_on_blockchain(
                tender["blockchain_tender_id"], admin_address
            )

    return {
        "message": "Tender closed successfully",
        "blockchain_tx": blockchain_tx
    }

@router.put("/{tender_id}/evaluate")
async def evaluate_tender(tender_id: str, evaluation_data: dict, current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can evaluate tenders")

    db = get_database()
    tenders_collection = db["tenders"]
    bids_collection = db["bids"]

    # Check if tender exists and is closed
    tender = tenders_collection.find_one({"_id": ObjectId(tender_id)})
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")
    if tender.get("status") != TenderStatus.CLOSED:
        raise HTTPException(status_code=400, detail="Tender must be closed before evaluation")

    # Check if there are any bids for this tender
    bids = list(bids_collection.find({"tender_id": tender_id}))
    if len(bids) == 0:
        raise HTTPException(status_code=400, detail="No bids submitted for this tender. Cannot evaluate.")

    # Get the winning bid ID from the request
    winning_bid_id = evaluation_data.get("winning_bid_id")
    if not winning_bid_id:
        raise HTTPException(status_code=400, detail="winning_bid_id is required")

    # Find the winning bid
    winning_bid = bids_collection.find_one({"_id": ObjectId(winning_bid_id), "tender_id": tender_id})
    if not winning_bid:
        raise HTTPException(status_code=404, detail="Winning bid not found for this tender")

    # Get bidder information
    users_collection = db["users"]
    bidder = users_collection.find_one({"_id": ObjectId(winning_bid["bidder_id"])})
    if not bidder:
        raise HTTPException(status_code=404, detail="Bidder not found")

    # Update tender with winner information and set status to evaluated
    tenders_collection.update_one(
        {"_id": ObjectId(tender_id)},
        {"$set": {
            "status": TenderStatus.EVALUATED,
            "winner_address": bidder.get("wallet_address"),
            "winning_amount": winning_bid["amount"],
            "winning_bid_id": winning_bid_id,
            "winner_bidder_id": str(bidder["_id"]),
            "evaluation_tx_hash": None  # For now, no blockchain tx
        }}
    )

    # Mark the winning bid
    bids_collection.update_one(
        {"_id": winning_bid["_id"]},
        {"$set": {"is_winner": True, "status": "selected"}}
    )

    # Mark other bids as rejected
    bids_collection.update_many(
        {"tender_id": tender_id, "_id": {"$ne": winning_bid["_id"]}},
        {"$set": {"status": "rejected"}}
    )

    return {
        "message": "Tender evaluation completed",
        "winner": {
            "bidder_name": bidder.get("username"),
            "bidder_email": bidder.get("email"),
            "winning_amount": winning_bid["amount"],
            "wallet_address": bidder.get("wallet_address")
        }
    }
