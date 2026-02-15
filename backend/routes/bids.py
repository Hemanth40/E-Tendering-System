from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from models import Bid, Tender, TenderStatus, User, UserRole
from auth import get_current_user
from datetime import datetime
from blockchain import blockchain_manager
from database import get_database
from typing import List
import json
import os

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/{tender_id}")
async def submit_bid(
    tender_id: str,
    bid_data: str = Form(...),
    documents: List[UploadFile] = File(None),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.BIDDER:
        raise HTTPException(status_code=403, detail="Only bidders can submit bids")

    db = get_database()
    tenders_collection = db["tenders"]
    bids_collection = db["bids"]

    # Check if tender exists and is published
    from bson import ObjectId
    try:
        tender = tenders_collection.find_one({"_id": ObjectId(tender_id)})
    except:
        tender = None
    if not tender or tender["status"] != TenderStatus.PUBLISHED.value:
        raise HTTPException(status_code=400, detail="Tender not found or not accepting bids")

    # Check deadline
    deadline = tender["deadline"]
    if isinstance(deadline, str):
        deadline_dt = datetime.fromisoformat(deadline)
    else:
        deadline_dt = deadline
    if datetime.utcnow() > deadline_dt:
        raise HTTPException(status_code=400, detail="Tender deadline has passed")

    # Save documents
    document_paths = []
    if documents:
        for doc in documents:
            file_path = os.path.join(UPLOAD_DIR, f"{current_user.id}_{tender_id}_{doc.filename}")
            with open(file_path, "wb") as f:
                f.write(await doc.read())
            document_paths.append(file_path)

    # Parse bid_data from JSON string
    try:
        bid_data_parsed = json.loads(bid_data)
    except json.JSONDecodeError:
        raise HTTPException(status_code=422, detail="Invalid bid data format")

    bid = Bid(
        tender_id=tender_id,
        bidder_id=str(current_user.id),
        amount=bid_data_parsed["amount"],
        documents=document_paths
    )

    # Store in MongoDB
    bid_dict = bid.dict(by_alias=True)
    # Remove _id if it's None to let MongoDB generate it
    if bid_dict.get('_id') is None:
        del bid_dict['_id']
    result = bids_collection.insert_one(bid_dict)
    bid_id = str(result.inserted_id)

    # Create blockchain hash and submit to blockchain
    bid_hash_data = {
        "tender_id": tender_id,
        "bidder_id": str(current_user.id),
        "amount": bid_data_parsed["amount"],
        "timestamp": datetime.utcnow().isoformat()
    }
    bid_hash = blockchain_manager.create_bid_hash(bid_hash_data)

    # Submit to blockchain if connected
    blockchain_tx = None
    if blockchain_manager.is_connected() and current_user.wallet_address:
        blockchain_tender_id = tender.get("blockchain_tender_id")
        if not blockchain_tender_id:
            raise HTTPException(status_code=400, detail="Tender has no blockchain counterpart.")

        blockchain_tx = await blockchain_manager.submit_bid_to_blockchain(
            blockchain_tender_id, int(bid_data_parsed["amount"]), current_user.wallet_address
        )

    # Update MongoDB with blockchain info
    update_data = {"blockchain_hash": bid_hash}
    if blockchain_tx:
        update_data["blockchain_tx_hash"] = blockchain_tx

    bids_collection.update_one({"_id": result.inserted_id}, {"$set": update_data})

    return {
        "message": "Bid submitted successfully",
        "bid_id": bid_id,
        "blockchain_hash": bid_hash,
        "blockchain_tx": blockchain_tx
    }

@router.get("/tender/{tender_id}")
async def get_bids_for_tender(tender_id: str, current_user: User = Depends(get_current_user)):
    db = get_database()
    bids_collection = db["bids"]

    if current_user.role == UserRole.ADMIN:
        # Admin can see all bids
        bids = list(bids_collection.find({"tender_id": tender_id}))
    else:
        # Bidders can only see their own bids
        bids = list(bids_collection.find({"tender_id": tender_id, "bidder_id": str(current_user.id)}))

    # Convert ObjectId to string for JSON serialization
    for bid in bids:
        bid["_id"] = str(bid["_id"])

    return {"bids": bids}

@router.get("/my-bids")
async def get_my_bids(current_user: User = Depends(get_current_user)):
    db = get_database()
    bids_collection = db["bids"]
    bids = list(bids_collection.find({"bidder_id": str(current_user.id)}))

    # Convert ObjectId to string for JSON serialization
    for bid in bids:
        bid["_id"] = str(bid["_id"])

    return {"bids": bids}

@router.get("/all")
async def get_all_bids(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can view all bids")

    db = get_database()
    bids_collection = db["bids"]
    bids = list(bids_collection.find())

    # Convert ObjectId to string for JSON serialization
    for bid in bids:
        bid["_id"] = str(bid["_id"])

    return {"bids": bids}

@router.put("/{bid_id}/reject")
async def reject_bid(bid_id: str, current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can reject bids")

    db = get_database()
    bids_collection = db["bids"]
    from bson import ObjectId

    # Update bid status to rejected
    result = bids_collection.update_one(
        {"_id": ObjectId(bid_id)},
        {"$set": {"status": "rejected"}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Bid not found")

    return {"message": "Bid rejected successfully"}
