const API_URL = 'http://localhost:8000/api';


async function loadStats() {
    try {
        const [recipesRes, startersRes] = await Promise.all([
            fetch(`${API_URL}/recipes`),
            fetch(`${API_URL}/starters`)
        ]);
        
        const recipes = await recipesRes.json();
        const starters = await startersRes.json();
        
        const recipeCount = document.getElementById('recipeCount');
        const starterCount = document.getElementById('starterCount');
        
   
        if (recipes && recipes.length > 0) {
            if (recipeCount) recipeCount.textContent = recipes.length;
        } else {
            if (recipeCount) recipeCount.textContent = '3+';
        }
        
   
        if (starters && starters.length > 0) {
            if (starterCount) starterCount.textContent = starters.length;
        } else {
            
            if (starterCount) starterCount.textContent = '3'; 
        }
    } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
      
        const recipeCount = document.getElementById('recipeCount');
        const starterCount = document.getElementById('starterCount');
        if (recipeCount) recipeCount.textContent = '3+';
        if (starterCount) starterCount.textContent = '3'; 
    }
}


function animateCards() {
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 + index * 100);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    console.log('🍞 Хлеб на закваске - сайт загружен!');
    loadStats();
    animateCards();
});




function updateAuthUI() {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('access_token');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    
    if (token && username) {
       
        loginLink.textContent = `👤 ${username}`;
        loginLink.href = '#';
        loginLink.onclick = (e) => {
            e.preventDefault();
            if (confirm('Выйти из аккаунта?')) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('username');
                localStorage.removeItem('user_id');
                window.location.reload();
            }
        };
        registerLink.textContent = 'Выйти';
        registerLink.href = '#';
        registerLink.onclick = (e) => {
            e.preventDefault();
            if (confirm('Выйти из аккаунта?')) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('username');
                localStorage.removeItem('user_id');
                window.location.reload();
            }
        };
    }
}


document.addEventListener('DOMContentLoaded', updateAuthUI);