from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    BIDDER = "bidder"
    ORGANIZER = "organizer"

class User(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    username: str
    email: str
    password: str
    role: UserRole
    wallet_address: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TenderStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    CLOSED = "closed"
    EVALUATED = "evaluated"

class BidStatus(str, Enum):
    PENDING = "pending"
    SELECTED = "selected"
    REJECTED = "rejected"

class Tender(BaseModel):
    id: Optional[str] = Field(default=None)
    title: str
    description: str
    budget: float
    deadline: datetime
    requirements: str
    status: TenderStatus = TenderStatus.DRAFT
    admin_id: str
    blockchain_tender_id: Optional[int] = None  # Sequential ID on blockchain
    blockchain_hash: Optional[str] = None
    blockchain_tx_hash: Optional[str] = None
    winner_address: Optional[str] = None
    winning_amount: Optional[float] = None
    evaluation_tx_hash: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Bid(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    tender_id: str
    bidder_id: str
    amount: float
    documents: Optional[List[str]] = []
    blockchain_hash: Optional[str] = None
    blockchain_tx_hash: Optional[str] = None
    is_winner: bool = False
    status: BidStatus = BidStatus.PENDING
    submitted_at: datetime = Field(default_factory=datetime.utcnow)

class TenderResult(BaseModel):
    id: Optional[str] = Field(alias="_id")
    tender_id: str
    winner_bid_id: str
    winner_bidder_id: str
    winning_amount: float
    blockchain_tx_hash: str
    evaluated_at: datetime = Field(default_factory=datetime.utcnow)

class NotificationType(str, Enum):
    TENDER_PUBLISHED = "tender_published"
    TENDER_CLOSED = "tender_closed"
    TENDER_EVALUATED = "tender_evaluated"
    BID_SUBMITTED = "bid_submitted"
    BID_WON = "bid_won"
    BID_LOST = "bid_lost"
    SYSTEM = "system"

class Notification(BaseModel):
    id: Optional[str] = Field(alias="_id")
    user_id: str
    title: str
    message: str
    type: NotificationType
    is_read: bool = False
    related_tender_id: Optional[str] = None
    related_bid_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
