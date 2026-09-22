
document.addEventListener('DOMContentLoaded', () => {
    const authLinks = document.querySelectorAll('.auth-links');
    if (!authLinks.length) return;

    authLinks.forEach(container => {
        if (Auth.isLoggedIn()) {
            const username = Auth.getUsername();
            container.innerHTML = `
                <span class="user-greeting">👤 ${escapeHtml(username)}</span>
                <a href="#" id="logoutLink">Выйти</a>
            `;
            document.getElementById('logoutLink')?.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Выйти из аккаунта?')) Auth.logout();
            });
        } else {
            container.innerHTML = `
                <a href="/login.html">Вход</a>
                <a href="/register.html">Регистрация</a>
            `;
        }
    });

   
    document.querySelectorAll('.requires-auth').forEach(el => {
        el.style.display = Auth.isLoggedIn() ? '' : 'none';
    });
});