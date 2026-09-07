const API_URL = 'http://localhost:8000/api';

// Фото для разных рецептов (по ID)
const RECIPE_IMAGES = {
    1: '/assets/images/333.jpg',
    2: '/assets/images/222.jpg',
    3: '/assets/images/111.jpg',
    // Добавьте другие ID и пути к фото
};

// Загрузка рецептов
async function loadRecipes() {
    try {
        const response = await fetch(`${API_URL}/recipes`);
        if (!response.ok) throw new Error('Ошибка загрузки рецептов');
        const recipes = await response.json();
        displayRecipes(recipes);
    } catch (error) {
        console.error('Ошибка:', error);
        displayDemoRecipes();
    }
}

// Отображение рецептов
function displayRecipes(recipes) {
    const container = document.getElementById('recipes-container');
    
    if (!recipes || recipes.length === 0) {
        container.innerHTML = `
            <div class="no-recipes">
                <p style="font-size: 3rem; margin-bottom: 1rem;">🍞</p>
                <p style="font-size: 1.2rem; color: #666;">Рецептов пока нет</p>
                <p style="color: #999;">Добавьте первый рецепт!</p>
                <a href="/add-recipe.html" class="btn btn-primary" style="margin-top: 1rem;">➕ Добавить рецепт</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recipes.map(recipe => {
        // ============ ВЫБИРАЕМ ФОТО ДЛЯ РЕЦЕПТА ============
        let imageStyle;
        
        // Если у рецепта есть своё фото в БД - используем его
        if (recipe.image_url) {
            imageStyle = `background-image: url('${recipe.image_url}');`;
        }
        // Иначе используем фото по ID из словаря
        else if (RECIPE_IMAGES[recipe.id]) {
            imageStyle = `background-image: url('${RECIPE_IMAGES[recipe.id]}');`;
        }
        // Иначе используем стандартное фото
        else {
            imageStyle = `background-image: url('/assets/images/default.jpg'); background-color: #f5d6b3;`;
        }
        
        return `
            <div class="recipe-card" onclick="window.location.href='/recipe-detail.html?id=${recipe.id}'" style="cursor: pointer;">
                <div class="recipe-image" style="${imageStyle} background-size: cover; background-position: center; font-size: 0;">
                </div>
                <div class="recipe-content">
                    <h3>${recipe.title}</h3>
                    <p>${recipe.description ? recipe.description.substring(0, 120) + '...' : ''}</p>
                    <div class="recipe-meta">
                        <span>⏱ ${recipe.prep_time + recipe.cook_time} мин</span>
                        <span class="difficulty ${recipe.difficulty}">${getDifficultyText(recipe.difficulty)}</span>
                        ${recipe.comments ? `<span>💬 ${recipe.comments.length}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function getDifficultyText(difficulty) {
    const map = {
        'easy': '🍃 Легкий',
        'medium': '⚖️ Средний',
        'hard': '🔥 Сложный'
    };
    return map[difficulty] || difficulty;
}

// Демо-рецепты для показа, если API не отвечает
function displayDemoRecipes() {
    const container = document.getElementById('recipes-container');
    
    const demoRecipes = [
        {
            id: 1,
            title: 'Классический ржаной хлеб',
            description: 'Ароматный хлеб с хрустящей корочкой и мягким мякишем. Готовится на ржаной закваске по традиционному рецепту.',
            difficulty: 'medium',
            prep_time: 30,
            cook_time: 45,
            comments: []
        },
        {
            id: 2,
            title: 'Пшеничный багет на закваске',
            description: 'Французский багет с хрустящей корочкой и воздушным мякишем. Идеальный завтрак с маслом и джемом.',
            difficulty: 'hard',
            prep_time: 45,
            cook_time: 25,
            comments: []
        },
        {
            id: 3,
            title: 'Цельнозерновой хлеб с семечками',
            description: 'Питательный хлеб из цельнозерновой муки с добавлением семян подсолнечника и льна.',
            difficulty: 'medium',
            prep_time: 40,
            cook_time: 50,
            comments: []
        }
    ];
    
    displayRecipes(demoRecipes);
}

document.addEventListener('DOMContentLoaded', loadRecipes);