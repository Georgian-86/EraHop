class ThemeSwitcher {
    constructor() {
        this.currentTheme = 'present';
        this.themes = ['prehistoric', 'medieval', 'future'];
        this.init();
    }

    init() {
        // Auto switch theme every 10 seconds
        setInterval(() => this.cycleTheme(), 10000);
        
        // Switch theme on scroll based on section
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('.era-section');
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                    this.setTheme(section.dataset.era);
                }
            });
        });
    }

    setTheme(theme) {
        document.body.classList.remove(...this.themes.map(t => `${t}-theme`));
        document.body.classList.add(`${theme}-theme`);
        this.currentTheme = theme;
    }

    cycleTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.setTheme(this.themes[nextIndex]);
    }
} 