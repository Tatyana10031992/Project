
async function loadStarters() {
    const container = document.getElementById('starters-container');
    if (!container) return;

    container.innerHTML = '<div class="loading">⏳ Загрузка…</div>';

    try {
        const response = await fetch(`${API_URL}/starters`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const starters = await response.json();

        if (!starters || starters.length === 0) {
            container.innerHTML = `
                <div class="no-recipes">
                    <p style="font-size: 3rem;">🌾</p>
                    <p style="color: #666;">Закваски пока не добавлены</p>
                </div>`;
            return;
        }

        renderStarters(starters);
    } catch (err) {
        console.error('Ошибка загрузки заквасок:', err);
        container.innerHTML = `
            <div class="no-recipes">
                <p style="font-size: 3rem;">⚠️</p>
                <p style="color: #666;">Не удалось загрузить закваски</p>
                <p style="color: #999; font-size: 0.9rem;">${escapeHtml(err.message)}</p>
                <button class="btn btn-primary" style="margin-top: 1rem;" onclick="loadStarters()">🔄 Повторить</button>
            </div>`;
    }
}


function renderStarters(starters) {
    const container = document.getElementById('starters-container');
    if (!container) return;

    container.innerHTML = starters.map(starter => {
        // properties хранится как JSON-строка в БД
        let props = [];
        try {
            props = JSON.parse(starter.properties || '[]');
            if (!Array.isArray(props)) props = [];
        } catch {
            props = [];
        }

        const badgeClass = getBadgeClass(starter.type);

        return `
            <div class="starter-card">
                <div class="starter-card-header">
                    <div class="starter-emoji">${escapeHtml(starter.emoji || '🌾')}</div>
                    <div class="starter-title-group">
                        <h3>${escapeHtml(starter.name)}</h3>
                        <span class="starter-badge ${badgeClass}">${escapeHtml(starter.type)}</span>
                    </div>
                </div>
                <div class="starter-card-body">
                    <p>${escapeHtml(starter.description)}</p>

                    <div class="starter-properties">
                        ${props.map(p => `<span class="property-tag">${escapeHtml(p)}</span>`).join('')}
                    </div>

                    <div class="starter-details-grid">
                        <div class="detail-item">
                            <span class="detail-label">🌡️ Температура</span>
                            <span class="detail-value">${starter.temperature ?? '—'}°C</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">💧 Влажность</span>
                            <span class="detail-value">${starter.humidity ?? '—'}%</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">🔄 Кормление</span>
                            <span class="detail-value">${escapeHtml(starter.feeding_schedule)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">✨ Идеально для</span>
                            <span class="detail-value">${escapeHtml(starter.best_for || '—')}</span>
                        </div>
                    </div>
                </div>
            </div>`;
    }).join('');
}


function getBadgeClass(type) {
    const map = {
        'ржаная': 'badge-rye',
        'пшеничная': 'badge-wheat',
        'цельнозерновая': 'badge-whole',
        'фруктовая': 'badge-fruit',
    };
    return map[type] || 'badge-rye';
}


function calculateFeeding() {
    const starterAmount = parseInt(document.getElementById('starterAmount')?.value) || 100;
    const hydration = parseInt(document.getElementById('hydration')?.value) || 100;

    const keepAmount = Math.round(starterAmount * 0.5);
    const discardAmount = starterAmount - keepAmount;
    const flourAmount = Math.round(keepAmount);
    const waterAmount = Math.round(keepAmount * (hydration / 100));

    const set = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = `${val} г`;
    };

    set('waterAmount', waterAmount);
    set('flourAmount', flourAmount);
    set('keepAmount', keepAmount);
    set('discardAmount', discardAmount);
}


function animateOnScroll() {
    const elements = document.querySelectorAll('.guide-step, .tip-card, .starter-card');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    loadStarters();
    animateOnScroll();
    setTimeout(calculateFeeding, 100);
});