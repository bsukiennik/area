import os
from datetime import datetime, timedelta, timezone

import jwt
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, EmailStr
from sqlalchemy import BigInteger, DateTime, String, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker

load_dotenv("../.env")

DATABASE_URL = os.getenv("DATABASE_URL", "")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = "postgresql://" + DATABASE_URL[len("postgres://"):]

JWT_SECRET = os.getenv("JWT_SECRET", "")
PORT = int(os.getenv("PORT", "8080"))

engine = create_engine(DATABASE_URL) if DATABASE_URL else None
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False) if engine else None


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    username: Mapped[str] = mapped_column(String(50))
    email: Mapped[str] = mapped_column(String(255))
    password: Mapped[str] = mapped_column("password_hash", String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: str
    created_at: datetime


app = FastAPI(
    title="AREA Backend API",
    description="Simple backend API for AREA POC.",
    version="1.0.0",
    docs_url="/swagger",
    openapi_tags=[
        {"name": "health", "description": "Service health checks."},
        {"name": "users", "description": "User listing."},
        {"name": "auth", "description": "Authentication and token generation."},
    ],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=400, content={"error": "Invalid request"})


def get_db():
    if SessionLocal is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get(
    "/health",
    tags=["health"],
    summary="Health check",
    description="Returns service health status.",
    responses={
        200: {
            "description": "Service is healthy",
            "content": {"application/json": {"example": {"status": "ok"}}},
        }
    },
)
def health():
    return {"status": "ok"}


@app.get(
    "/users",
    tags=["users"],
    summary="List users",
    description="Returns all users.",
    responses={
        200: {
            "description": "List of users",
            "content": {
                "application/json": {
                    "example": [
                        {
                            "id": 1,
                            "username": "user",
                            "email": "user@test.area",
                            "created_at": "2026-01-01T00:00:00Z",
                        }
                    ]
                }
            },
        },
        500: {
            "description": "Database error",
            "content": {"application/json": {"example": {"error": "database error"}}},
        },
    },
)
def get_users(db: Session = Depends(get_db)):
    try:
        users = db.execute(select(User)).scalars().all()
        return [UserResponse.model_validate(user).model_dump(mode="json") for user in users]
    except Exception as exc:
        return JSONResponse(status_code=500, content={"error": str(exc)})


@app.post(
    "/login",
    tags=["auth"],
    summary="Login",
    description="Authenticate a user and return a JWT.",
    responses={
        200: {
            "description": "Login successful",
            "content": {
                "application/json": {
                    "example": {
                        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        "user": {
                            "id": 1,
                            "username": "user",
                            "email": "user@test.area",
                        },
                    }
                }
            },
        },
        400: {
            "description": "Invalid request",
            "content": {"application/json": {"example": {"error": "Invalid request"}}},
        },
        401: {
            "description": "Invalid credentials",
            "content": {
                "application/json": {
                    "example": {"error": "Invalid username or password"}
                }
            },
        },
        500: {
            "description": "Server error",
            "content": {
                "application/json": {"example": {"error": "Could not generate token"}}
            },
        },
    },
)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    try:
        user = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()
    except Exception:
        return JSONResponse(status_code=500, content={"error": "Could not query user"})

    if user is None or user.password != payload.password:
        return JSONResponse(
            status_code=401,
            content={"error": "Invalid username or password"},
        )

    now = datetime.now(timezone.utc)
    claims = {
        "username": user.username,
        "sub": str(user.id),
        "exp": now + timedelta(hours=24),
        "iat": now,
    }

    try:
        token = jwt.encode(claims, JWT_SECRET, algorithm="HS256")
    except Exception:
        return JSONResponse(status_code=500, content={"error": "Could not generate token"})

    return {
        "token": token,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
        },
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=False)
