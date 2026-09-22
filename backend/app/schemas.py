from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime
from typing import Optional, List, Literal


class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr


class UserCreate(UserBase):
   
    password: str = Field(..., min_length=8, max_length=72)

    @field_validator('password')
    @classmethod
    def password_bytes_limit(cls, v: str) -> str:
       
        if len(v.encode('utf-8')) > 72:
            raise ValueError('Пароль слишком длинный (максимум 72 байта)')
        return v


class UserLogin(BaseModel):
    username: str
    password: str


class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
        
        
Difficulty = Literal["easy", "medium", "hard"]


class RecipeBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str
    ingredients: str
    instructions: str
    prep_time: int = Field(..., ge=1)
    cook_time: int = Field(..., ge=1)
    difficulty: Difficulty  # ✅ только 3 значения
    image_url: Optional[str] = None


class RecipeCreate(RecipeBase):
    pass


class CommentBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)
    rating: Optional[int] = Field(None, ge=1, le=5)


class CommentCreate(CommentBase):
    recipe_id: int
   


class Comment(CommentBase):
    id: int
    recipe_id: int
    author: str  
    created_at: datetime

    class Config:
        from_attributes = True



class RecipeShort(RecipeBase):
    id: int
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
    emoji: Optional[str] = None
    properties: Optional[str] = None
    best_for: Optional[str] = None


class StarterCreate(StarterBase):
    pass


class Starter(StarterBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True