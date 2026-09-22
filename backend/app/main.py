from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine, Base
from .routers import recipes, starter, comments, auth, upload
import os

SECRET_KEY = os.getenv("SECRET_KEY", "")
if not SECRET_KEY or len(SECRET_KEY.encode()) < 32:
    raise RuntimeError(
        "SECRET_KEY не задан или короче 32 байт. "
        "Сгенерируйте: python -c \"import secrets; print(secrets.token_urlsafe(48))\""
    )

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Хлеб на закваске API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:8001",
        "http://127.0.0.1:8001",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router)
app.include_router(recipes.router)
app.include_router(starter.router)
app.include_router(comments.router)
app.include_router(upload.router)


@app.get("/")
def root():
    return {"message": "Добро пожаловать на сайт 'Хлеб на закваске'!"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
