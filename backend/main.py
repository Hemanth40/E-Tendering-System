from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import get_database
from routes.auth import router as auth_router
from routes.tenders import router as tenders_router
from routes.bids import router as bids_router
from routes.notifications import router as notifications_router
from blockchain import blockchain_manager
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="E-Tendering System API", version="1.0.0")
@app.get("/health")
def health():
    return "OK"

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
db = get_database()

# Mount static files directory for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(tenders_router, prefix="/tenders", tags=["Tenders"])
app.include_router(bids_router, prefix="/bids", tags=["Bids"])
app.include_router(notifications_router, prefix="/notifications", tags=["Notifications"])

@app.get("/")
async def root():
    return {"message": "E-Tendering API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "blockchain": "connected" if blockchain_manager.is_connected() else "disconnected"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
