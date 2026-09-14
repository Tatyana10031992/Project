const API_URL = 'http://localhost:8000/api';


const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get('id');

document.addEventListener('DOMContentLoaded', () => {
    if (!recipeId) {
        window.location.href = '/recipes.html';
        return;
    }
    
    loadRecipe(recipeId);
    loadComments(recipeId);
    setupCommentForm(recipeId);
    setupRatingStars();
});

async function loadRecipe(id) {
    try {
        const response = await fetch(`${API_URL}/recipes/${id}`);
        if (!response.ok) throw new Error('Рецепт не найден');
        const recipe = await response.json();
        displayRecipe(recipe);
    } catch (error) {
        console.error('Ошибка:', error);
        document.getElementById('loading').textContent = '❌ Рецепт не найден';
        document.getElementById('loading').style.color = '#721c24';
    }
}

function displayRecipe(recipe) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('recipeContent').style.display = 'block';
    
    document.getElementById('recipeTitle').textContent = recipe.title;
    document.getElementById('recipeDescription').textContent = recipe.description;
    document.getElementById('recipeTime').textContent = recipe.prep_time + recipe.cook_time;
    
   
    const date = new Date(recipe.created_at);
    document.getElementById('recipeDate').textContent = date.toLocaleDateString('ru-RU');
    
  
    const difficultyMap = {
        'easy': '🍃 Легкий',
        'medium': '⚖️ Средний',
        'hard': '🔥 Сложный'
    };
    const difficultyEl = document.getElementById('recipeDifficulty');
    difficultyEl.textContent = difficultyMap[recipe.difficulty] || recipe.difficulty;
    difficultyEl.className = `difficulty-badge ${recipe.difficulty}`;
    

    const ingredients = recipe.ingredients.split('\n').filter(i => i.trim());
    const ingredientsHtml = ingredients.map(i => `<li>${i.trim()}</li>`).join('');
    document.getElementById('recipeIngredients').innerHTML = ingredientsHtml;
    
    
    const instructions = recipe.instructions.split('\n').filter(i => i.trim());
    const instructionsHtml = instructions.map((i, index) => 
        `<p><strong>Шаг ${index + 1}:</strong> ${i.trim()}</p>`
    ).join('');
    document.getElementById('recipeInstructions').innerHTML = instructionsHtml;
    
    
    if (recipe.image_url) {
        document.getElementById('recipeImage').innerHTML = 
            `<img src="${recipe.image_url}" alt="${recipe.title}" style="max-width: 100%; max-height: 300px; border-radius: 10px;">`;
    }
}






async function loadComments(recipeId) {
    try {
        const response = await fetch(`${API_URL}/comments/recipe/${recipeId}`);
        if (!response.ok) throw new Error('Ошибка загрузки комментариев');
        const comments = await response.json();
        displayComments(comments);
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

function displayComments(comments) {
    const container = document.getElementById('commentsContainer');
    const countEl = document.getElementById('commentCount');
    
    countEl.textContent = comments.length;
    
    if (comments.length === 0) {
        container.innerHTML = '<div class="no-comments">😊 Пока нет комментариев. Будьте первым!</div>';
        return;
    }
    
    container.innerHTML = comments.map(comment => `
        <div class="comment-item">
            <div class="comment-header">
                <span class="comment-author">${comment.author}</span>
                <div>
                    ${comment.rating ? '<span class="comment-rating">' + '⭐'.repeat(comment.rating) + '</span>' : ''}
                    <span class="comment-date">${new Date(comment.created_at).toLocaleDateString('ru-RU')}</span>
                </div>
            </div>
            <div class="comment-content">${comment.content}</div>
        </div>
    `).join('');
}

function setupCommentForm(recipeId) {
    const form = document.getElementById('commentForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const author = document.getElementById('commentAuthor').value.trim();
        const content = document.getElementById('commentContent').value.trim();
        const rating = parseInt(document.getElementById('commentRating').value) || null;
        
        if (!author || !content) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        const commentData = {
            recipe_id: parseInt(recipeId),
            author: author,
            content: content,
            rating: rating
        };
        
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = '⏳ Отправка...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(`${API_URL}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentData)
            });
            
            if (!response.ok) throw new Error('Ошибка при отправке комментария');
            
            
            form.reset();
            document.getElementById('commentRating').value = '0';
            document.querySelectorAll('.rating-stars span').forEach(el => el.classList.remove('active'));
            
            
            loadComments(recipeId);
            
            alert('✅ Комментарий успешно добавлен!');
        } catch (error) {
            console.error('Ошибка:', error);
            alert('❌ Не удалось отправить комментарий. Попробуйте позже.');
        } finally {
            submitBtn.textContent = 'Отправить комментарий';
            submitBtn.disabled = false;
        }
    });
}

function setupRatingStars() {
    const stars = document.querySelectorAll('.rating-stars span');
    const ratingInput = document.getElementById('commentRating');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            ratingInput.value = rating;
            
            stars.forEach(s => {
                if (parseInt(s.dataset.rating) <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
        
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            stars.forEach(s => {
                if (parseInt(s.dataset.rating) <= rating) {
                    s.style.opacity = '0.7';
                }
            });
        });
        
        star.addEventListener('mouseleave', function() {
            stars.forEach(s => {
                s.style.opacity = '';
            });
        });
    });
}