from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pymongo.collection import Collection
from models import User

SECRET_KEY = "your-secret-key-here"  # In production, use environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1000

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def authenticate_user(db: Collection, username_or_email: str, password: str):
    from passlib.exc import UnknownHashError
    # Try to find user by username first, then by email
    user = db.find_one({"$or": [{"username": username_or_email}, {"email": username_or_email}]})
    print(f"Found user: {user}")
    if not user:
        return False

    password_verified = False
    try:
        password_verified = verify_password(password, user["password"])
    except UnknownHashError:
        # This likely means the password is plain text.
        # Verify directly and update the hash if it matches.
        if password == user["password"]:
            hashed_password = get_password_hash(password)
            db.update_one({"_id": user["_id"]}, {"$set": {"password": hashed_password}})
            password_verified = True

    if not password_verified:
        return False
        
    # Convert ObjectId to string for Pydantic
    user["_id"] = str(user["_id"])
    return User(**user)

def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)):
    from database import get_database
    db = get_database()
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db["users"].find_one({"username": username})
    if user is None:
        raise credentials_exception
    # Convert ObjectId to string for Pydantic
    user["_id"] = str(user["_id"])
    return User(**user)
