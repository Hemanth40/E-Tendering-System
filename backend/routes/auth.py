from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from models import User, UserRole
from auth import authenticate_user, create_access_token, get_password_hash, get_current_user
from datetime import timedelta
from database import get_database

router = APIRouter()

@router.post("/register")
async def register(user_data: dict):
    db = get_database()
    users_collection = db["users"]

    # Check if user already exists
    if users_collection.find_one({"username": user_data["username"]}):
        raise HTTPException(status_code=400, detail="Username already registered")

    # Hash password and create user
    hashed_password = get_password_hash(user_data["password"])
    user_data_dict = {
        "username": user_data["username"],
        "email": user_data["email"],
        "password": hashed_password,
        "role": UserRole(user_data.get("role", "bidder")),
        "wallet_address": user_data.get("wallet_address")
    }
    user = User(**user_data_dict)

    result = users_collection.insert_one(user.dict(by_alias=True, exclude={"id"}))
    return {"message": "User registered successfully", "user_id": str(result.inserted_id)}

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db = get_database()
    users_collection = db["users"]

    user = authenticate_user(users_collection, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user": user.dict()}

@router.get("/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user.dict()
