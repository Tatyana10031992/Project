from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import SessionLocal

router = APIRouter(prefix="/api/starters", tags=["starters"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[schemas.Starter])
def read_starters(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    starters = crud.get_starters(db, skip=skip, limit=limit)
    return starters

@router.get("/{starter_id}", response_model=schemas.Starter)
def read_starter(starter_id: int, db: Session = Depends(get_db)):
    db_starter = crud.get_starter(db, starter_id)
    if db_starter is None:
        raise HTTPException(status_code=404, detail="Starter not found")
    return db_starter

@router.post("/", response_model=schemas.Starter)
def create_starter(starter: schemas.StarterCreate, db: Session = Depends(get_db)):
    return crud.create_starter(db, starter)