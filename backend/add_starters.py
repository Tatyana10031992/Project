from app.database import SessionLocal
from app import models, schemas, crud

def add_starters_to_db():
    db = SessionLocal()
    
    starters_data = [
        {
            "name": "Классическая ржаная",
            "type": "ржаная",
            "description": "Классическая закваска на ржаной муке. Даёт хлебу приятную кислинку, тёмный цвет и плотный мякиш. Самая стабильная и прощает ошибки.",
            "feeding_schedule": "Каждые 12 часов",
            "temperature": 24.0,
            "humidity": 72.0
        },
        {
            "name": "Итальянская пшеничная",
            "type": "пшеничная",
            "description": "Нежная закваска для итальянского хлеба. Создаёт идеальную текстуру для пиццы и фокаччи.",
            "feeding_schedule": "Каждые 8-10 часов",
            "temperature": 23.0,
            "humidity": 68.0
        },
        {
            "name": "Сельская цельнозерновая",
            "type": "цельнозерновая",
            "description": "Деревенская закваска из цельнозерновой муки. Даёт хлеб с плотным мякишем и насыщенным вкусом.",
            "feeding_schedule": "Каждые 6-8 часов",
            "temperature": 27.0,
            "humidity": 78.0
        }
    ]
    
    for data in starters_data:
        # Проверяем, есть ли уже такая закваска
        existing = db.query(models.Starter).filter(models.Starter.name == data["name"]).first()
        if not existing:
            starter = schemas.StarterCreate(**data)
            crud.create_starter(db, starter)
            print(f"✅ Добавлена закваска: {data['name']}")
        else:
            print(f"⏭️ Закваска уже существует: {data['name']}")
    
    db.close()
    print("\n✅ Готово! Закваски добавлены в базу данных.")

if __name__ == "__main__":
    add_starters_to_db()