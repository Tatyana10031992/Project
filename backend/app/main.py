from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import recipes, starter, comments, auth


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Хлеб на закваске API", version="1.0.0")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router) 
app.include_router(recipes.router)
app.include_router(starter.router)
app.include_router(comments.router)

@app.get("/")
def root():
    return {"message": "Добро пожаловать на сайт 'Хлеб на закваске'!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}