from app.database import SessionLocal
from app import crud, schemas


def seed_starters():
    db = SessionLocal()
    try:
        starters = [
            dict(name="Классическая ржаная", type="ржаная", emoji="🌾",
                 description="Классическая закваска на ржаной муке.",
                 feeding_schedule="Каждые 12 часов",
                 temperature=24.0, humidity=72.0,
                 properties='["Кислый вкус","Тёмный цвет","Плотный мякиш"]',
                 best_for="Ржаной хлеб, Бородинский"),
            dict(name="Итальянская пшеничная", type="пшеничная", emoji="🇮🇹",
                 description="Нежная закваска для итальянского хлеба.",
                 feeding_schedule="Каждые 8-10 часов",
                 temperature=23.0, humidity=68.0,
                 properties='["Эластичное тесто","Хрустящая корочка"]',
                 best_for="Пицца, Фокачча, Чиабатта"),
            dict(name="Сельская цельнозерновая", type="цельнозерновая", emoji="🏡",
                 description="Деревенская закваска из цельнозерновой муки.",
                 feeding_schedule="Каждые 6-8 часов",
                 temperature=27.0, humidity=78.0,
                 properties='["Насыщенный вкус","Плотный мякиш"]',
                 best_for="Деревенский хлеб, Бородинский"),
        ]
        for s in starters:
            crud.create_starter(db, schemas.StarterCreate(**s))
        print("✅ Закваски добавлены")
    except Exception as e:
        print(f"❌ {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_starters()