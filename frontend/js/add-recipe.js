const API_URL = 'http://localhost:8000/api';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('recipeForm');
    const messageDiv = document.getElementById('message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Собираем данные из формы
        const formData = {
            title: document.getElementById('title').value.trim(),
            description: document.getElementById('description').value.trim(),
            ingredients: document.getElementById('ingredients').value.trim(),
            instructions: document.getElementById('instructions').value.trim(),
            prep_time: parseInt(document.getElementById('prep_time').value),
            cook_time: parseInt(document.getElementById('cook_time').value),
            difficulty: document.getElementById('difficulty').value,
            image_url: document.getElementById('image_url').value.trim() || null
        };

        // Валидация
        if (!formData.title || !formData.description || !formData.ingredients || !formData.instructions) {
            showMessage('Пожалуйста, заполните все обязательные поля!', 'error');
            return;
        }

        // Показываем загрузку
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '⏳ Отправка...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(`${API_URL}/recipes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Ошибка при создании рецепта');
            }

            const recipe = await response.json();
            showMessage(`✅ Рецепт "${recipe.title}" успешно создан!`, 'success');
            form.reset();
            
            // Через 2 секунды переходим на страницу рецептов
            setTimeout(() => {
                window.location.href = '/recipes.html';
            }, 2000);

        } catch (error) {
            console.error('Ошибка:', error);
            showMessage(`❌ ${error.message}`, 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        // Автоматически скрываем через 5 секунд
        clearTimeout(window.messageTimeout);
        window.messageTimeout = setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
});