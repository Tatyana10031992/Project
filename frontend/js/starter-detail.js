
document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.tip-item, .comparison-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 150);
            }
        });
    }, {
        threshold: 0.1
    });
    
    items.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(-20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});