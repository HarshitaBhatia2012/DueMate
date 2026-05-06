from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
import auth
from database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.middleware("http")
async def log_requests(request, call_next):
    print(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    print(f"Response status: {response.status_code}")
    return response

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://due-mate-pi.vercel.app"
    ],

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Authentication Dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Verify Clerk token
        token = credentials.credentials
        payload = await auth.verify_clerk_token(token)
        clerk_id: str = payload.get("sub")
        email: str = payload.get("email", "")
        
        if clerk_id is None:
            raise credentials_exception
            
        # 1. Try to find by clerk_id
        user = db.query(models.User).filter(models.User.clerk_id == clerk_id).first()
        
        # 2. If not found, try to find by email and link them (migration logic)
        if not user and email:
            user = db.query(models.User).filter(models.User.email == email).first()
            if user:
                user.clerk_id = clerk_id
                db.commit()
                db.refresh(user)
        
        # 3. If still not found, create a new user
        if not user:
            # Generate a unique username if not provided or taken
            base_username = email.split('@')[0] if email else f"user_{clerk_id[:8]}"
            username = base_username
            counter = 1
            while db.query(models.User).filter(models.User.username == username).first():
                username = f"{base_username}_{counter}"
                counter += 1
                
            user = models.User(
                clerk_id=clerk_id,
                email=email,
                username=username
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
        return user
        
    except Exception as clerk_err:
        print(f"Clerk verification failed or error: {clerk_err}")
        raise credentials_exception



@app.get("/users/me", response_model=schemas.UserResponse)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.put("/users/me", response_model=schemas.UserResponse)
async def update_user_me(user_update: schemas.UserUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user_update.username:
        # Check if username is already taken by someone else
        existing_user = db.query(models.User).filter(models.User.username == user_update.username, models.User.id != current_user.id).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already taken")
        current_user.username = user_update.username
    
    if user_update.email:
        # Check if email is already taken by someone else
        existing_user = db.query(models.User).filter(models.User.email == user_update.email, models.User.id != current_user.id).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        current_user.email = user_update.email
        
    db.commit()
    db.refresh(current_user)
    return current_user

# Assignment Endpoints
@app.post("/assignments/", response_model=schemas.AssignmentResponse)
def create_assignment(assignment: schemas.AssignmentCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_assignment = models.Assignment(**assignment.dict(), owner_id=current_user.id)
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment

@app.get("/assignments/", response_model=list[schemas.AssignmentResponse])
def read_assignments(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Assignment).filter(models.Assignment.owner_id == current_user.id).all()

@app.put("/assignments/{assignment_id}", response_model=schemas.AssignmentResponse)
def update_assignment(assignment_id: int, assignment: schemas.AssignmentCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_assignment = db.query(models.Assignment).filter(models.Assignment.id == assignment_id, models.Assignment.owner_id == current_user.id).first()
    if not db_assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    for key, value in assignment.dict().items():
        setattr(db_assignment, key, value)
    
    db.commit()
    db.refresh(db_assignment)
    return db_assignment

@app.delete("/assignments/{assignment_id}")
def delete_assignment(assignment_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_assignment = db.query(models.Assignment).filter(models.Assignment.id == assignment_id, models.Assignment.owner_id == current_user.id).first()
    if not db_assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    db.delete(db_assignment)
    db.commit()
    return {"message": "Assignment deleted successfully"}

@app.get("/")
def read_root():
    return {"message": "Welcome to DueMate API"}
