# 🍞 Хлеб на закваске

Веб-сайт для любителей домашнего хлебопечения: рецепты, информация о заквасках, комментарии и оценки.


## 📖 О проекте

**Хлеб на закваске** — полнофункциональный веб-сайт, где пользователи могут:

- Просматривать рецепты хлеба на закваске
- Добавлять свои рецепты с фото
- Оставлять комментарии и ставить оценки
- Изучать информацию о разных видах заквасок
- Пользоваться калькулятором кормления закваски

**Архитектура:** клиент-серверная. Бэкенд — FastAPI (Python), фронтенд — чистый HTML/CSS/JavaScript без фреймворков. База данных — SQLite.




## 🛠 Технологии

### Бэкенд
| Технология | Назначение |
|---|---|
| **FastAPI** | REST API сервер |
| **Uvicorn** | ASGI сервер |
| **SQLAlchemy 2.0** | ORM |
| **SQLite** | База данных |
| **Pydantic 2.5** | Валидация данных |
| **bcrypt** | Хеширование паролей |
| **PyJWT** | JWT-токены |
| **python-multipart** | Загрузка файлов |
| **email-validator** | Валидация email |

### Фронтенд
| Технология | Назначение |
|---|---|
| **HTML5** | Структура страниц |
| **CSS3** | Стилизация, адаптивная верстка |
| **JavaScript (ES6+)** | Клиентская логика |
| **Fetch API** | Запросы к API |

---

## 📁 Структура проекта

```
khleb-na-zakvaske/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py               # Точка входа, CORS, StaticFiles
│   │   ├── database.py           # Подключение к SQLite, get_db()
│   │   ├── models.py             # Модели SQLAlchemy
│   │   ├── schemas.py            # Pydantic схемы
│   │   ├── crud.py               # CRUD-операции
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── auth.py           # Регистрация, вход, JWT
│   │       ├── recipes.py        # Рецепты
│   │       ├── starter.py        # Закваски
│   │       ├── comments.py       # Комментарии
│   │       └── upload.py         # Загрузка фото
│   ├── uploads/                  # Загруженные фото
│   │   └── .gitkeep
│   ├── .env.example              # Шаблон переменных окружения
│   ├── .gitignore
│   ├── requirements.txt
│   ├── add_starters.py           # Заполнение БД заквасками
│   └── khleb.db                  # (создаётся автоматически)
│
├── frontend/
│   ├── index.html                # Главная
│   ├── recipes.html              # Список рецептов
│   ├── recipe-detail.html        # Детальная страница рецепта
│   ├── starter.html              # Всё о закваске
│   ├── add-recipe.html           # Добавление рецепта
│   ├── login.html                # Вход
│   ├── register.html             # Регистрация
│   ├── css/
│   │   ├── style.css             # Основные стили
│   │   ├── form.css              # Стили форм
│   │   ├── starter.css           # Стили страницы заквасок
│   │   ├── recipe-detail.css     # Стили детальной страницы
│   │   └── auth.css              # Стили авторизации
│   ├── js/
│   │   ├── config.js             # API_URL, BACKEND_URL, Auth, fullImageUrl
│   │   ├── utils.js              # escapeHtml, truncate
│   │   ├── auth-check.js         # Состояние входа в шапке
│   │   ├── main.js               # Главная
│   │   ├── recipes.js            # Рецепты
│   │   ├── recipe-detail.js      # Детальная страница + комментарии
│   │   ├── starter.js            # Закваски + калькулятор
│   │   ├── add-recipe.js         # Форма добавления рецепта
│   │   ├── login.js              # Вход
│   │   └── register.js           # Регистрация
│   └── assets/
│       └── images/               # Локальные изображения (опционально)
│
├── .gitignore                    # (для всего проекта, опционально)
└── README.md
```

---

## 🚀 Быстрый старт

### Требования

- Python **3.10+**
- pip
- Любой современный браузер (Chrome, Firefox, Safari, Edge)

### 1. Клонирование репозитория

```bash
git clone https://github.com/ваш-логин/khleb-na-zakvaske.git
cd khleb-na-zakvaske
```

### 2. Настройка бэкенда

```bash
cd backend

# Создаём виртуальное окружение
python -m venv venv

# Активируем:
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Windows (CMD):
venv\Scripts\activate.bat
# macOS / Linux:
source venv/bin/activate

# Устанавливаем зависимости
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Настройка переменных окружения

Скопируйте `.env.example` в `.env`:

```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

**Сгенерируйте `SECRET_KEY`** (минимум 32 байта):

```bash
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

Вставьте результат в `.env`:

```env
DATABASE_URL=sqlite:///./khleb.db
SECRET_KEY=сгенерированный_ключ
```

> ⚠️ **Без `SECRET_KEY` сервер не запустится** — при старте идёт проверка на длину ≥ 32 байта.

### 4. Запуск сервера

```bash
uvicorn app.main:app --reload
```

Сервер запустится на `http://localhost:8000`.

**Проверка:**
- [http://localhost:8000](http://localhost:8000) — приветствие
- [http://localhost:8000/docs](http://localhost:8000/docs) — Swagger UI

### 5. Заполнение базы заквасками

В **отдельном терминале** (не закрывая сервер):

```bash
cd backend
.\venv\Scripts\Activate.ps1     # Windows
# или
source venv/bin/activate        # macOS / Linux



### 6. Запуск фронтенда

В **третьем терминале**:

```bash
cd frontend
python -m http.server 8001
```




















