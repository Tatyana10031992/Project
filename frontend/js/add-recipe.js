

document.addEventListener('DOMContentLoaded', () => {
  
    if (!Auth.isLoggedIn()) {
        alert('Войдите, чтобы добавить рецепт');
        window.location.href = '/login.html';
        return;
    }

    const form = document.getElementById('recipeForm');
    const messageDiv = document.getElementById('message');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

       
        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        const ingredients = document.getElementById('ingredients').value.trim();
        const instructions = document.getElementById('instructions').value.trim();
        const prep_time = parseInt(document.getElementById('prep_time').value);
        const cook_time = parseInt(document.getElementById('cook_time').value);
        const difficulty = document.getElementById('difficulty').value;

        let imageUrl = document.getElementById('image_url').value.trim();

      
        if (!title || !description || !ingredients || !instructions) {
            showMessage('Пожалуйста, заполните все обязательные поля!', 'error');
            return;
        }

        if (!prep_time || prep_time < 1) {
            showMessage('Время подготовки должно быть больше 0', 'error');
            return;
        }

        if (!cook_time || cook_time < 1) {
            showMessage('Время выпечки должно быть больше 0', 'error');
            return;
        }

        if (!['easy', 'medium', 'hard'].includes(difficulty)) {
            showMessage('Выберите корректную сложность', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '⏳ Отправка…';
        submitBtn.disabled = true;

        try {
            
            const imageFile = document.getElementById('imageFile')?.files[0];

            if (imageFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', imageFile);

                
                const uploadResponse = await fetch(`${API_URL}/upload/image`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${Auth.getToken()}`
                    },
                    body: uploadFormData
                });

                if (!uploadResponse.ok) {
                    const error = await uploadResponse.json().catch(() => ({}));
                    throw new Error(error.detail || 'Ошибка загрузки фото');
                }

                const uploadResult = await uploadResponse.json();
                imageUrl = uploadResult.url;
            }

           
            const recipeData = {
                title,
                description,
                ingredients,
                instructions,
                prep_time,
                cook_time,
                difficulty,
                image_url: imageUrl || null
            };

            const response = await fetch(`${API_URL}/recipes`, {
                method: 'POST',
                headers: Auth.headers(),   
                body: JSON.stringify(recipeData)
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.detail || 'Ошибка при создании рецепта');
            }

            const recipe = await response.json();

            showMessage(`✅ Рецепт «${recipe.title}» успешно создан!`, 'success');
            form.reset();

         
            const preview = document.getElementById('imagePreview');
            if (preview) {
                preview.innerHTML = '';
                preview.style.display = 'none';
            }

            setTimeout(() => {
                window.location.href = '/recipes.html';
            }, 2000);

        } catch (err) {
            console.error(err);
            showMessage(`❌ ${err.message}`, 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    
    function showMessage(text, type) {
        if (!messageDiv) return;
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';

        clearTimeout(window.__msgTimer);
        window.__msgTimer = setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
});


function previewImage(event) {
    const preview = document.getElementById('imagePreview');
    const file = event.target.files[0];
    if (!preview || !file) return;

  
    if (!file.type.startsWith('image/')) {
        alert('Можно загрузить только изображение');
        event.target.value = '';
        return;
    }

    
    if (file.size > 5 * 1024 * 1024) {
        alert('Файл слишком большой. Максимум 5 MB');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        preview.innerHTML = `
            <img src="${e.target.result}"
                 alt="Предпросмотр"
                 style="max-width: 300px; max-height: 200px; border-radius: 10px; object-fit: cover;">
        `;
        preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}