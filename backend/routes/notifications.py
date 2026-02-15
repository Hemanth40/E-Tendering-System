from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models import Notification, NotificationType, User
from auth import get_current_user
from database import get_database
from datetime import datetime

router = APIRouter()

@router.get("/")
async def get_notifications(current_user: User = Depends(get_current_user)) -> List[Notification]:
    """Get all notifications for the current user"""
    db = get_database()
    notifications_collection = db["notifications"]
    notifications = list(notifications_collection.find({"user_id": str(current_user.id)}).sort("created_at", -1))
    return [Notification(**notification) for notification in notifications]

@router.get("/unread")
async def get_unread_notifications(current_user: User = Depends(get_current_user)) -> List[Notification]:
    """Get unread notifications for the current user"""
    db = get_database()
    notifications_collection = db["notifications"]
    notifications = list(notifications_collection.find({
        "user_id": str(current_user.id),
        "is_read": False
    }).sort("created_at", -1))
    return [Notification(**notification) for notification in notifications]

@router.put("/{notification_id}/read")
async def mark_notification_as_read(
    notification_id: str,
    current_user: User = Depends(get_current_user)
):
    """Mark a notification as read"""
    db = get_database()
    notifications_collection = db["notifications"]

    # Check if notification exists and belongs to user
    notification = notifications_collection.find_one({
        "_id": notification_id,
        "user_id": str(current_user.id)
    })

    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    # Mark as read
    notifications_collection.update_one(
        {"_id": notification_id},
        {"$set": {"is_read": True}}
    )

    return {"message": "Notification marked as read"}

@router.put("/read-all")
async def mark_all_notifications_as_read(current_user: User = Depends(get_current_user)):
    """Mark all notifications as read for the current user"""
    db = get_database()
    notifications_collection = db["notifications"]

    notifications_collection.update_many(
        {"user_id": str(current_user.id), "is_read": False},
        {"$set": {"is_read": True}}
    )

    return {"message": "All notifications marked as read"}

@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a notification"""
    db = get_database()
    notifications_collection = db["notifications"]

    # Check if notification exists and belongs to user
    result = notifications_collection.delete_one({
        "_id": notification_id,
        "user_id": str(current_user.id)
    })

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")

    return {"message": "Notification deleted"}

@router.post("/create")
async def create_notification(
    notification_data: dict,
    current_user: User = Depends(get_current_user)
):
    """Create a new notification (admin/system use)"""
    if current_user.role not in ["admin", "organizer"]:
        raise HTTPException(status_code=403, detail="Only admins and organizers can create notifications")

    db = get_database()
    notifications_collection = db["notifications"]

    notification = Notification(
        user_id=notification_data["user_id"],
        title=notification_data["title"],
        message=notification_data["message"],
        type=NotificationType(notification_data.get("type", "system")),
        related_tender_id=notification_data.get("related_tender_id"),
        related_bid_id=notification_data.get("related_bid_id")
    )

    result = notifications_collection.insert_one(notification.dict(by_alias=True, exclude={"id"}))
    return {
        "message": "Notification created successfully",
        "notification_id": str(result.inserted_id)
    }

@router.get("/count")
async def get_notification_count(current_user: User = Depends(get_current_user)):
    """Get notification counts for the current user"""
    db = get_database()
    notifications_collection = db["notifications"]

    total = notifications_collection.count_documents({"user_id": str(current_user.id)})
    unread = notifications_collection.count_documents({
        "user_id": str(current_user.id),
        "is_read": False
    })

    return {
        "total": total,
        "unread": unread
    }
