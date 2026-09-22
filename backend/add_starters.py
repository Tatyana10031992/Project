from app.database import SessionLocal
from app import models, schemas, crud


def add_starters_to_db():
    db = SessionLocal()
    try:
        starters_data = [
            {
                "name": "Классическая ржаная",
                "type": "ржаная",
                "emoji": "🌾",
                "description": "Классическая закваска на ржаной муке. Даёт хлебу приятную кислинку, тёмный цвет и плотный мякиш.",
                "feeding_schedule": "Каждые 12 часов",
                "temperature": 24.0,
                "humidity": 72.0,
                "properties": '["Кислый вкус","Тёмный цвет","Плотный мякиш"]',
                "best_for": "Ржаной хлеб, Бородинский"
            },
            {
                "name": "Итальянская пшеничная",
                "type": "пшеничная",
                "emoji": "🇮🇹",
                "description": "Нежная закваска для итальянского хлеба. Создаёт идеальную текстуру для пиццы и фокаччи.",
                "feeding_schedule": "Каждые 8-10 часов",
                "temperature": 23.0,
                "humidity": 68.0,
                "properties": '["Эластичное тесто","Хрустящая корочка"]',
                "best_for": "Пицца, Фокачча, Чиабатта"
            },
            {
                "name": "Сельская цельнозерновая",
                "type": "цельнозерновая",
                "emoji": "🏡",
                "description": "Деревенская закваска из цельнозерновой муки. Даёт хлеб с плотным мякишем и насыщенным вкусом.",
                "feeding_schedule": "Каждые 6-8 часов",
                "temperature": 27.0,
                "humidity": 78.0,
                "properties": '["Насыщенный вкус","Плотный мякиш"]',
                "best_for": "Деревенский хлеб, Бородинский"
            },
        ]

        for data in starters_data:
            existing = db.query(models.Starter).filter(
                models.Starter.name == data["name"]
            ).first()
            if not existing:
                starter = schemas.StarterCreate(**data)
                crud.create_starter(db, starter)
                print(f"✅ Добавлена: {data['name']}")
            else:
                print(f"⏭ Уже есть: {data['name']}")

        print("\n✅ Готово!")
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    add_starters_to_db()