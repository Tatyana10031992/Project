from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, models
from ..database import get_db
from .auth import get_current_user

router = APIRouter(prefix="/api/comments", tags=["comments"])


@router.get("/recipe/{recipe_id}", response_model=List[schemas.Comment])
def get_comments_for_recipe(recipe_id: int, db: Session = Depends(get_db)):
    if not crud.get_recipe(db, recipe_id):
        raise HTTPException(status_code=404, detail="Recipe not found")
    return crud.get_comments_by_recipe(db, recipe_id)




@router.post("", response_model=schemas.Comment)
def create_comment(
    comment: schemas.CommentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if not crud.get_recipe(db, comment.recipe_id):
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    return crud.create_comment(db, comment, author=current_user.username)




@router.delete("/{comment_id}")
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    comment = crud.get_comment(db, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
   
    if comment.author != current_user.username:
        raise HTTPException(status_code=403, detail="Not your comment")
    crud.delete_comment(db, comment_id)
    return {"message": "Comment deleted"}