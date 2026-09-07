const API_URL = 'http://localhost:8000/api';

// Все закваски с подробными данными
const ALL_STARTERS = [
    {
        id: 1,
        name: 'Классическая ржаная',
        type: 'ржаная',
        emoji: '🌾',
        badge: 'badge-rye',
        description: 'Классическая закваска на ржаной муке. Даёт хлебу приятную кислинку, тёмный цвет и плотный мякиш. Самая стабильная и прощает ошибки.',
        properties: ['Кислый вкус', 'Тёмный цвет', 'Плотный мякиш', 'Долго хранится'],
        temperature: '24-26°C',
        feeding: 'Каждые 12 часов',
        humidity: '70-75%',
        best_for: 'Ржаной хлеб, Бородинский, Дарницкий'
    },
    
    {
        id: 3,
        name: 'Итальянская пшеничная',
        type: 'пшеничная',
        emoji: '🇮🇹',
        description: 'Нежная закваска для итальянского хлеба. Создаёт идеальную текстуру для пиццы и фокаччи.',
        properties: ['Эластичное тесто', 'Хрустящая корочка', 'Нежный вкус', 'Ароматная'],
        temperature: '22-24°C',
        feeding: 'Каждые 8-10 часов',
        humidity: '65-70%',
        best_for: 'Пицца, Фокачча, Чиабатта, Гриссини'
    },
    {
        id: 4,
        name: 'Сельская цельнозерновая',
        type: 'цельнозерновая',
        emoji: '🏡',
        description: 'Деревенская закваска из цельнозерновой муки. Даёт хлеб с плотным мякишем и насыщенным вкусом.',
        properties: ['Насыщенный вкус', 'Плотный мякиш', 'Питательная', 'Долго хранится'],
        temperature: '26-28°C',
        feeding: 'Каждые 6-8 часов',
        humidity: '75-80%',
        best_for: 'Деревенский хлеб, Бородинский, Хлеб с отрубями'
    },
   
    
];

// Загрузка заквасок
async function loadStarters() {
    try {
        const response = await fetch(`${API_URL}/starters`);
        if (!response.ok) throw new Error('Ошибка загрузки заквасок');
        const starters = await response.json();
        if (starters.length > 0) {
            displayStarters(starters);
        } else {
            displayStarters(ALL_STARTERS);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        displayStarters(ALL_STARTERS);
    }
}

// Отображение заквасок (БЕЗ ФИЛЬТРОВ)
function displayStarters(starters) {
    const container = document.getElementById('starters-container');
    if (!container) return;
    
    container.innerHTML = starters.map(starter => `
        <div class="starter-card">
            <div class="starter-card-header">
                <div class="starter-emoji">${starter.emoji || '🌾'}</div>
                <div class="starter-title-group">
                    <h3>${starter.name}</h3>
                    <span class="starter-badge ${starter.badge || 'badge-rye'}">${starter.type || 'Закваска'}</span>
                </div>
            </div>
            <div class="starter-card-body">
                <p>${starter.description}</p>
                
                <div class="starter-properties">
                    ${starter.properties ? starter.properties.map(prop => 
                        `<span class="property-tag">${prop}</span>`
                    ).join('') : ''}
                </div>
                
                <div class="starter-details-grid">
                    <div class="detail-item">
                        <span class="detail-label">🌡️ Температура</span>
                        <span class="detail-value">${starter.temperature || '22-26°C'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">💧 Влажность</span>
                        <span class="detail-value">${starter.humidity || '65-75%'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">🔄 Кормление</span>
                        <span class="detail-value">${starter.feeding || 'Каждые 12 часов'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">✨ Идеально для</span>
                        <span class="detail-value">${starter.best_for || 'Разных видов хлеба'}</span>
                    </div>
                </div>
            </div>
            <div class="starter-card-footer">
              
                <button class="btn-small" onclick="showDetails('${starter.name}')">📖 Подробнее</button>
            </div>
        </div>
    `).join('');
}

// Функции для кнопок
function showRecipeFor(name) {
    window.location.href = `/recipes.html?starter=${encodeURIComponent(name)}`;
}

function showDetails(name) {
    const starter = ALL_STARTERS.find(s => s.name === name);
    if (!starter) return;
    
    alert(`
📖 ${starter.name}

${starter.description}

🌡️ Температура: ${starter.temperature}
💧 Влажность: ${starter.humidity}
🔄 Кормление: ${starter.feeding}
✨ Идеально для: ${starter.best_for}

Свойства:
${starter.properties.map(p => `• ${p}`).join('\n')}
    `);
}

// Анимация появления
function animateOnScroll() {
    const elements = document.querySelectorAll('.guide-step, .tip-card, .starter-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Калькулятор кормления
function calculateFeeding() {
    const starterAmount = parseInt(document.getElementById('starterAmount')?.value) || 100;
    const hydration = parseInt(document.getElementById('hydration')?.value) || 100;
    
    const keepPercent = 0.5;
    const keepAmount = Math.round(starterAmount * keepPercent);
    const discardAmount = starterAmount - keepAmount;
    const flourAmount = Math.round(keepAmount);
    const waterAmount = Math.round(keepAmount * (hydration / 100));
    
    const waterEl = document.getElementById('waterAmount');
    const flourEl = document.getElementById('flourAmount');
    const keepEl = document.getElementById('keepAmount');
    const discardEl = document.getElementById('discardAmount');
    
    if (waterEl) waterEl.textContent = `${waterAmount} г`;
    if (flourEl) flourEl.textContent = `${flourAmount} г`;
    if (keepEl) keepEl.textContent = `${keepAmount} г`;
    if (discardEl) discardEl.textContent = `${discardAmount} г`;
}

// Добавляем анимацию в CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(styleSheet);

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadStarters();
    animateOnScroll();
    
    // Автоматический расчет калькулятора
    setTimeout(calculateFeeding, 100);
});