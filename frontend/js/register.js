const API_URL = 'http://localhost:8000/api';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const messageDiv = document.getElementById('message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm_password').value;

        // Валидация
        if (!username || !email || !password || !confirmPassword) {
            showMessage('Пожалуйста, заполните все поля', 'error');
            return;
        }

        if (username.length < 3) {
            showMessage('Имя пользователя должно быть минимум 3 символа', 'error');
            return;
        }

        if (password.length < 6) {
            showMessage('Пароль должен быть минимум 6 символов', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showMessage('Пароли не совпадают', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = '⏳ Регистрация...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Ошибка регистрации');
            }

            showMessage('✅ Регистрация успешна! Перенаправление на вход...', 'success');
            
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 2000);

        } catch (error) {
            console.error('Ошибка:', error);
            showMessage(`❌ ${error.message}`, 'error');
        } finally {
            submitBtn.textContent = 'Зарегистрироваться';
            submitBtn.disabled = false;
        }
    });

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `auth-message ${type}`;
        messageDiv.style.display = 'block';
        
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
});