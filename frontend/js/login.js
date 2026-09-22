

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

   
    const token = localStorage.getItem('access_token');
    if (token) {
        window.location.href = '/';
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !password) {
            showMessage('Пожалуйста, заполните все поля', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = '⏳ Вход...';
        submitBtn.disabled = true;

        try {
            
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Ошибка входа');
            }

          
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('user_id', data.user_id);

            showMessage('✅ Вход выполнен успешно! Перенаправление...', 'success');
            
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);

        } catch (error) {
            console.error('Ошибка:', error);
            showMessage(`❌ ${error.message}`, 'error');
        } finally {
            submitBtn.textContent = 'Войти';
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