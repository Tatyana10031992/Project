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



document.addEventListener('DOMContentLoaded');