

const recipeId = new URLSearchParams(window.location.search).get('id');


document.addEventListener('DOMContentLoaded', () => {
    if (!recipeId) {
        window.location.href = '/recipes.html';
        return;
    }

    loadRecipe(recipeId);
    loadComments(recipeId);
    setupCommentForm();
    setupRatingStars();
});


async function loadRecipe(id) {
    try {
        const response = await fetch(`${API_URL}/recipes/${id}`);
        if (!response.ok) throw new Error('Рецепт не найден');

        const recipe = await response.json();
        displayRecipe(recipe);
    } catch (err) {
        console.error(err);
        const loading = document.getElementById('loading');
        if (loading) {
            loading.textContent = `❌ ${err.message}`;
            loading.style.color = '#721c24';
        }
    }
}


function displayRecipe(recipe) {
    const loading = document.getElementById('loading');
    const content = document.getElementById('recipeContent');
    if (loading) loading.style.display = 'none';
    if (content) content.style.display = 'block';

    
    document.getElementById('recipeTitle').textContent = recipe.title;
    document.getElementById('recipeDescription').textContent = recipe.description;
    document.getElementById('recipeTime').textContent = recipe.prep_time + recipe.cook_time;

    const date = new Date(recipe.created_at);
    document.getElementById('recipeDate').textContent = date.toLocaleDateString('ru-RU');

  
    const difficultyMap = {
        easy: '🍃 Легкий',
        medium: '⚖️ Средний',
        hard: '🔥 Сложный',
    };
    const diffEl = document.getElementById('recipeDifficulty');
    diffEl.textContent = difficultyMap[recipe.difficulty] || recipe.difficulty;
    diffEl.className = `difficulty-badge ${recipe.difficulty}`;

   
    const ingredients = (recipe.ingredients || '').split('\n').filter(i => i.trim());
    document.getElementById('recipeIngredients').innerHTML =
        ingredients.map(i => `<li>${escapeHtml(i.trim())}</li>`).join('');

    
    const instructions = (recipe.instructions || '').split('\n').filter(i => i.trim());
    document.getElementById('recipeInstructions').innerHTML =
        instructions.map((i, idx) =>
            `<p><strong>Шаг ${idx + 1}:</strong> ${escapeHtml(i.trim())}</p>`
        ).join('');


    if (recipe.image_url) {
        document.getElementById('recipeImage').innerHTML =
            `<img src="${escapeHtml(fullImageUrl(recipe.image_url))}"
                alt="${escapeHtml(recipe.title)}"
                style="max-width: 100%; max-height: 400px; border-radius: 10px;">`;
    } else {
        document.getElementById('recipeImage').innerHTML = '🍞';
    }
}


async function loadComments(id) {
    try {
        const response = await fetch(`${API_URL}/comments/recipe/${id}`);
        if (!response.ok) throw new Error('Ошибка загрузки комментариев');

        const comments = await response.json();
        displayComments(comments);
    } catch (err) {
        console.error(err);
        const container = document.getElementById('commentsContainer');
        if (container) {
            container.innerHTML =
                `<div class="no-comments">⚠️ ${escapeHtml(err.message)}</div>`;
        }
    }
}


function displayComments(comments) {
    const container = document.getElementById('commentsContainer');
    const countEl = document.getElementById('commentCount');
    if (!container) return;

    if (countEl) countEl.textContent = comments.length;

    if (!comments || comments.length === 0) {
        container.innerHTML =
            '<div class="no-comments">😊 Пока нет комментариев. Будьте первым!</div>';
        return;
    }

    container.innerHTML = comments.map(c => `
        <div class="comment-item">
            <div class="comment-header">
                <span class="comment-author">${escapeHtml(c.author)}</span>
                <div>
                    ${c.rating ? `<span class="comment-rating">${'⭐'.repeat(c.rating)}</span>` : ''}
                    <span class="comment-date">
                        ${new Date(c.created_at).toLocaleDateString('ru-RU')}
                    </span>
                </div>
            </div>
            <div class="comment-content">${escapeHtml(c.content)}</div>
        </div>
    `).join('');
}


function setupCommentForm() {
    const form = document.getElementById('commentForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

       
        if (!Auth.isLoggedIn()) {
            alert('Войдите, чтобы оставить комментарий');
            window.location.href = '/login.html';
            return;
        }

        const content = document.getElementById('commentContent').value.trim();
        const rating = parseInt(document.getElementById('commentRating').value) || null;

        if (!content) {
            alert('Напишите комментарий');
            return;
        }

        const commentData = {
            recipe_id: parseInt(recipeId),
            content: content,
            rating: rating,
            
        };

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '⏳ Отправка…';
        submitBtn.disabled = true;

        try {
            const response = await fetch(`${API_URL}/comments`, {
                method: 'POST',
                headers: Auth.headers(),  // ✅ токен в заголовке
                body: JSON.stringify(commentData),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.detail || 'Ошибка отправки');
            }

            form.reset();
            document.getElementById('commentRating').value = '0';
            document.querySelectorAll('.rating-stars span')
                .forEach(s => s.classList.remove('active'));

            await loadComments(recipeId);
            alert('✅ Комментарий добавлен!');
        } catch (err) {
            console.error(err);
            alert(`❌ ${err.message}`);
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}


function setupRatingStars() {
    const stars = document.querySelectorAll('.rating-stars span');
    const ratingInput = document.getElementById('commentRating');
    if (!stars.length || !ratingInput) return;

    stars.forEach(star => {
        star.addEventListener('click', function () {
            const rating = parseInt(this.dataset.rating);
            ratingInput.value = rating;

            stars.forEach(s => {
                s.classList.toggle('active', parseInt(s.dataset.rating) <= rating);
            });
        });
    });
}