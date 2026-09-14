from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List


class UserBase(BaseModel):
    username: str
    email: EmailStr



class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    username: str
    password: str



class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class RecipeBase(BaseModel):
    title: str
    description: str
    ingredients: str
    instructions: str
    prep_time: int
    cook_time: int
    difficulty: str
    image_url: Optional[str] = None



class RecipeCreate(RecipeBase):
    pass



class CommentBase(BaseModel):
    author: str
    content: str
    rating: Optional[int] = None



class CommentCreate(CommentBase):
    recipe_id: int



class Comment(CommentBase):
    id: int
    recipe_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True



class Recipe(RecipeBase):
    id: int
    created_at: datetime
    updated_at: datetime
    comments: List[Comment] = []
    
    class Config:
        from_attributes = True



class StarterBase(BaseModel):
    name: str
    type: str
    description: str
    feeding_schedule: str
    temperature: float
    humidity: Optional[float] = None



class StarterCreate(StarterBase):
    pass



class Starter(StarterBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True