
let allRecipes = [];

async function loadRecipes() {
    const container = document.getElementById('recipes-container');
    if (!container) return;

    container.innerHTML = '<div class="loading">⏳ Загрузка рецептов…</div>';

    try {
        const response = await fetch(`${API_URL}/recipes`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        allRecipes = await response.json();

        if (!allRecipes || allRecipes.length === 0) {
            container.innerHTML = `
                <div class="no-recipes">
                    <p style="font-size: 3rem;">🍞</p>
                    <p style="font-size: 1.2rem; color: #666;">Рецептов пока нет</p>
                    <a href="/add-recipe.html" class="btn btn-primary">➕ Добавить рецепт</a>
                </div>`;
            return;
        }

        renderRecipes(allRecipes);
    } catch (err) {
        console.error('Ошибка загрузки рецептов:', err);
        container.innerHTML = `
            <div class="no-recipes">
                <p style="font-size: 3rem;">⚠️</p>
                <p>Не удалось загрузить рецепты</p>
                <p style="color: #999; font-size: 0.9rem;">${escapeHtml(err.message)}</p>
                <button class="btn btn-primary" onclick="loadRecipes()">🔄 Повторить</button>
            </div>`;
    }
}

function renderRecipes(recipes) {
    const container = document.getElementById('recipes-container');
    if (!container) return;

    container.innerHTML = recipes.map(recipe => {
        const bg = recipe.image_url
            ? `background-image: url('${escapeHtml(fullImageUrl(recipe.image_url))}');`
            : '';

        return `
            <div class="recipe-card" onclick="location.href='/recipe-detail.html?id=${recipe.id}'" style="cursor: pointer;">
                <div class="recipe-image" style="${bg} background-size: cover; background-position: center;"></div>
                <div class="recipe-content">
                    <h3>${escapeHtml(recipe.title)}</h3>
                    <p>${escapeHtml(truncate(recipe.description, 120))}</p>
                    <div class="recipe-meta">
                        <span>⏱ ${recipe.prep_time + recipe.cook_time} мин</span>
                        <span class="difficulty ${escapeHtml(recipe.difficulty)}">${getDifficultyText(recipe.difficulty)}</span>
                    </div>
                </div>
            </div>`;
    }).join('');
}

function getDifficultyText(difficulty) {
    const map = {
        easy: '🍃 Легкий',
        medium: '⚖️ Средний',
        hard: '🔥 Сложный',
    };
    return map[difficulty] || difficulty;
}

document.addEventListener('DOMContentLoaded', loadRecipes);