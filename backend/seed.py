from app.database import SessionLocal
from app import models, schemas, crud
import json

def seed_database():
    db = SessionLocal()
    
    # Добавляем закваски
    starters_data = [
        {
            "name": "Классическая ржаная закваска",
            "type": "ржаная",
            "description": "🌾 Классическая закваска на ржаной муке. Даёт хлебу приятную кислинку, тёмный цвет и плотный мякиш. Самая стабильная и прощает ошибки.",
            "feeding_schedule": "Каждые 12 часов",
            "temperature": 24.0,
            "humidity": 72.0
        },
        {
            "name": "Пшеничная закваска для багетов",
            "type": "пшеничная",
            "description": "🌿 Нежная закваска на белой муке. Идеальна для багетов, круассанов и белого хлеба с воздушным мякишем и хрустящей корочкой.",
            "feeding_schedule": "Каждые 8-10 часов",
            "temperature": 23.0,
            "humidity": 68.0
        },
        {
            "name": "Цельнозерновая закваска",
            "type": "цельнозерновая",
            "description": "🌱 Богатая клетчаткой закваска из цельнозерновой муки. Очень активная и питательная. Даёт хлеб с ореховым вкусом и плотным мякишем.",
            "feeding_schedule": "Каждые 6-8 часов",
            "temperature": 27.0,
            "humidity": 78.0
        },
        {
            "name": "Виноградная закваска",
            "type": "фруктовая",
            "description": "🍇 Уникальная закваска на виноградном сусле. Даёт хлебу тонкий фруктовый аромат, нежный вкус и мягкий мякиш.",
            "feeding_schedule": "Каждые 8-12 часов",
            "temperature": 25.0,
            "humidity": 72.0
        }
    ]
    
    for data in starters_data:
        # Проверяем, существует ли уже такая закваска
        existing = db.query(models.Starter).filter(models.Starter.name == data["name"]).first()
        if not existing:
            starter = schemas.StarterCreate(**data)
            crud.create_starter(db, starter)
            print(f"✅ Добавлена закваска: {data['name']}")
    
    db.close()
    print("\n✨ База данных успешно заполнена!")

if __name__ == "__main__":
    seed_database()