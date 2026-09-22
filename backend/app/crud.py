# backend/app/crud.py
from sqlalchemy.orm import Session
from . import models, schemas
import bcrypt



def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
   
    pwd = user.password.encode('utf-8')[:72]
    hashed = bcrypt.hashpw(pwd, bcrypt.gensalt()).decode('utf-8')
    db_user = models.User(
        username=user.username,
        email=user.email,
        password_hash=hashed,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return None
    pwd = password.encode('utf-8')[:72]
    if bcrypt.checkpw(pwd, user.password_hash.encode('utf-8')):
        return user
    return None



def get_recipes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Recipe).offset(skip).limit(limit).all()


def get_recipe(db: Session, recipe_id: int):
    return db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()


def create_recipe(db: Session, recipe: schemas.RecipeCreate):
    db_recipe = models.Recipe(**recipe.model_dump())
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe


def update_recipe(db: Session, recipe_id: int, recipe: schemas.RecipeCreate):
    db_recipe = get_recipe(db, recipe_id)
    if db_recipe:
        for k, v in recipe.model_dump().items():
            setattr(db_recipe, k, v)
        db.commit()
        db.refresh(db_recipe)
    return db_recipe


def delete_recipe(db: Session, recipe_id: int):
    db_recipe = get_recipe(db, recipe_id)
    if db_recipe:
        db.delete(db_recipe)
        db.commit()
    return db_recipe



def get_starters(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Starter).offset(skip).limit(limit).all()


def create_starter(db: Session, starter: schemas.StarterCreate):
    db_s = models.Starter(**starter.model_dump())
    db.add(db_s)
    db.commit()
    db.refresh(db_s)
    return db_s



def get_comment(db: Session, comment_id: int):
    return db.query(models.Comment).filter(models.Comment.id == comment_id).first()


def get_comments_by_recipe(db: Session, recipe_id: int):
    return (
        db.query(models.Comment)
        .filter(models.Comment.recipe_id == recipe_id)
        .order_by(models.Comment.created_at.desc())
        .all()
    )


def create_comment(db: Session, comment: schemas.CommentCreate, author: str):
  
    db_c = models.Comment(
        recipe_id=comment.recipe_id,
        author=author,
        content=comment.content,
        rating=comment.rating,
    )
    db.add(db_c)
    db.commit()
    db.refresh(db_c)
    return db_c


def delete_comment(db: Session, comment_id: int):
    c = get_comment(db, comment_id)
    if c:
        db.delete(c)
        db.commit()
    return c