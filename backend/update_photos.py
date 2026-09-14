from app.database import SessionLocal
from app import models

def update_recipe_photos():
    db = SessionLocal()
    
    
    recipes_photos = [
        {"id": 1, "image_url": "/assets/images/111.jpg"},      
        {"id": 2, "image_url": "/assets/images/222.jpg"},   
        {"id": 3, "image_url": "/assets/images/333.jpg"},  
    ]
    
    try:
        for item in recipes_photos:
            recipe = db.query(models.Recipe).filter(models.Recipe.id == item["id"]).first()
            if recipe:
                recipe.image_url = item["image_url"]
                print(f"✅ Фото добавлено к рецепту: {recipe.title} -> {item['image_url']}")
            else:
                print(f"❌ Рецепт с ID {item['id']} не найден")
        
        db.commit()
        print("\n✅ Все фото успешно добавлены!")
        
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    update_recipe_photos()