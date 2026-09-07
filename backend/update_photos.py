from app.database import SessionLocal
from app import models

def update_recipe_photos():
    db = SessionLocal()
    
    # Список рецептов и их фото
    recipes_photos = [
        {"id": 1, "image_url": "/assets/images/111.jpg"},      # для рецепта с ID 1
        {"id": 2, "image_url": "/assets/images/222.jpg"},   # для рецепта с ID 2
        {"id": 3, "image_url": "/assets/images/333.jpg"},   # для рецепта с ID 3
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