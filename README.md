# 🍞 Хлеб на закваске

Веб-сайт для любителей домашнего хлебопечения: рецепты, информация о заквасках, комментарии и оценки.

---

## 📋 Содержание

- [О проекте](#о-проекте)
- [Функционал](#функционал)
- [Технологии](#технологии)
- [Структура проекта](#структура-проекта)
- [Быстрый старт](#быстрый-старт)
- [Переменные окружения](#переменные-окружения)
- [API эндпоинты](#api-эндпоинты)
- [Работа с базой данных](#работа-с-базой-данных)
- [Безопасность](#безопасность)
- [Лицензия](#лицензия)

---

## 📖 О проекте

**Хлеб на закваске** — полнофункциональный веб-сайт, где пользователи могут:

- Просматривать рецепты хлеба на закваске
- Добавлять свои рецепты с фото
- Оставлять комментарии и ставить оценки
- Изучать информацию о разных видах заквасок
- Пользоваться калькулятором кормления закваски

**Архитектура:** клиент-серверная. Бэкенд — FastAPI (Python), фронтенд — чистый HTML/CSS/JavaScript без фреймворков. База данных — SQLite.

---

## ✨ Функционал

### Для всех посетителей
- ✅ Просмотр списка рецептов с фото
- ✅ Просмотр детальной страницы рецепта (ингредиенты, инструкция, фото)
- ✅ Просмотр комментариев и оценок
- ✅ Информация о видах заквасок (ржаная, пшеничная, цельнозерновая)
- ✅ Калькулятор кормления закваски
- ✅ Регистрация и вход

### Для авторизованных пользователей
- ✅ Добавление новых рецептов
- ✅ Загрузка фото к рецептам (файл или ссылка)
- ✅ Оставление комментариев и оценок (звёзды)
- ✅ Удаление своих комментариев
- ✅ Скрытие/показ кнопок управления в зависимости от авторизации

---

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

python add_starters.py
```

Должно вывести:

```
✅ Добавлена: Классическая ржаная
✅ Добавлена: Итальянская пшеничная
✅ Добавлена: Сельская цельнозерновая
```

### 6. Запуск фронтенда

В **третьем терминале**:

```bash
cd frontend
python -m http.server 8001
```

Или используйте **Live Server** в VS Code:
1. Правой кнопкой на `frontend/index.html`
2. **Open with Live Server**

Откройте в браузере: [http://localhost:8001](http://localhost:8001)

---

## 🔐 Переменные окружения

Файл `backend/.env`:

| Переменная | Обязательна | Описание |
|---|---|---|
| `DATABASE_URL` | ✅ | Путь к базе данных (`sqlite:///./khleb.db`) |
| `SECRET_KEY` | ✅ | Ключ для JWT, минимум 32 байта |

⚠️ **`.env` НЕ должен попадать в git.** Он добавлен в `.gitignore`.

Файл `.env.example` — шаблон без секретов, его можно коммитить.

---

## 🔗 API эндпоинты

### Авторизация

| Метод | Эндпоинт | Требует токен |
|---|---|---|
| `POST` | `/api/auth/register` | ❌ |
| `POST` | `/api/auth/login` | ❌ |
| `GET` | `/api/auth/me` | ✅ |
| `POST` | `/api/auth/logout` | ❌ |

### Рецепты

| Метод | Эндпоинт | Требует токен |
|---|---|---|
| `GET` | `/api/recipes` | ❌ |
| `GET` | `/api/recipes/{id}` | ❌ |
| `POST` | `/api/recipes` | ✅ |
| `PUT` | `/api/recipes/{id}` | ✅ |
| `DELETE` | `/api/recipes/{id}` | ✅ |

### Закваски

| Метод | Эндпоинт | Требует токен |
|---|---|---|
| `GET` | `/api/starters` | ❌ |
| `POST` | `/api/starters` | ✅ |

### Комментарии

| Метод | Эндпоинт | Требует токен |
|---|---|---|
| `GET` | `/api/comments/recipe/{id}` | ❌ |
| `POST` | `/api/comments` | ✅ |
| `DELETE` | `/api/comments/{id}` | ✅ |

### Загрузка фото

| Метод | Эндпоинт | Требует токен |
|---|---|---|
| `POST` | `/api/upload/image` | ✅ |
| `GET` | `/uploads/{filename}` | ❌ |

Полная интерактивная документация — на `http://localhost:8000/docs`.

---

## 🗄 Работа с базой данных

### Схема БД

- **`users`** — пользователи (`id`, `username`, `email`, `password_hash`, `is_active`, `created_at`)
- **`recipes`** — рецепты (`id`, `title`, `description`, `ingredients`, `instructions`, `prep_time`, `cook_time`, `difficulty`, `image_url`, `created_at`, `updated_at`)
- **`starters`** — закваски (`id`, `name`, `type`, `emoji`, `description`, `feeding_schedule`, `temperature`, `humidity`, `properties`, `best_for`, `created_at`)
- **`comments`** — комментарии (`id`, `recipe_id`, `author`, `content`, `rating`, `created_at`)

Таблицы создаются автоматически при запуске сервера (`Base.metadata.create_all`).

### Заполнение демо-данными

```bash
cd backend
python add_starters.py
```

### Просмотр БД через DBeaver

1. Установите [DBeaver Community](https://dbeaver.io/download/)
2. **New Database Connection** → **SQLite**
3. **Path:** `C:\путь\до\проекта\backend\khleb.db`
4. **Test Connection** → **Finish**

### Сброс БД

Удалите `khleb.db` и перезапустите сервер:

```bash
rm backend/khleb.db      # macOS / Linux
del backend\khleb.db     # Windows

uvicorn app.main:app --reload
```

Таблицы создадутся заново. Затем снова запустите `add_starters.py`.

---

## 🛡 Безопасность

Что **уже реализовано**:

- ✅ **JWT-токены** для авторизации (PyJWT)
- ✅ **bcrypt** для хеширования паролей (с ограничением на 72 байта)
- ✅ **Валидация** всех входных данных (Pydantic)
- ✅ **Проверка `SECRET_KEY`** при старте сервера (≥ 32 байта)
- ✅ **Защита CRUD** через `Depends(get_current_user)`
- ✅ **Экранирование HTML** во фронтенде (`escapeHtml`) — защита от XSS
- ✅ **Автор комментария берётся из токена**, а не из формы
- ✅ **CORS** ограничен конкретными доменами
- ✅ **`.env` и `khleb.db`** в `.gitignore`
- ✅ **`uploads/`** в `.gitignore` (файлы пользователей)

### Рекомендации для продакшена

- 🔸 Использовать **HTTPS**
- 🔸 Заменить SQLite на **PostgreSQL** или **MySQL**
- 🔸 Настроить **rate limiting**
- 🔸 Добавить **CSRF-защиту**
- 🔸 Включить **blacklist JWT** (для отзыва токенов при logout)
- 🔸 Хранить `SECRET_KEY` в **секретах CI/CD**, а не в `.env` на сервере
- 🔸 Настроить **бэкапы БД**
- 🔸 Использовать **reverse proxy** (nginx)

---

## 🧪 Тестирование

### Через Swagger UI

1. Откройте `http://localhost:8000/docs`
2. Нажмите на эндпоинт → **Try it out** → **Execute**

### Ручное тестирование

1. **Зарегистрируйтесь** на `/register.html`
2. **Войдите** на `/login.html`
3. **Добавьте рецепт** на `/add-recipe.html`
4. **Проверьте список** на `/recipes.html`
5. **Оставьте комментарий** на странице рецепта

---

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку: `git checkout -b feature/новая-фича`
3. Закоммитьте: `git commit -m "Добавил новую фичу"`
4. Запушьте: `git push origin feature/новая-фича`
5. Откройте **Pull Request**

---

## 📝 Лицензия

Этот проект распространяется под лицензией **MIT**.

---

## 👥 Авторы

- **Чернова Татьяна Николаевна** — разработчик
- **Чернов Максим Алексеевич** — QA-специалист

---

## 📞 Контакты

Если у вас есть вопросы или предложения — создайте [Issue](https://github.com/ваш-логин/khleb-na-zakvaske/issues) в репозитории.

---

**Приятного хлебопечения!** 🍞🌾