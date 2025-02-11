class ThemeManager {
    constructor() {
        this.themes = {
            prehistoric: {
                primary: '#8B4513',
                secondary: '#A0522D',
                font: 'Caveat',
                background: '/images/eras/prehistoric-bg.jpg'
            },
            medieval: {
                primary: '#4A1C1C',
                secondary: '#722F37',
                font: 'MedievalSharp',
                background: '/images/eras/medieval-bg.jpg'
            },
            future: {
                primary: '#1E3F66',
                secondary: '#2E5984',
                font: 'Orbitron',
                background: '/images/eras/future-bg.jpg'
            }
        };
        
        this.currentTheme = 'present';
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupParallaxEffect();
        this.setupThemeTransitions();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const era = entry.target.dataset.era;
                    if (era) {
                        this.setTheme(era);
                    }
                }
            });
        }, options);

        document.querySelectorAll('.era-section').forEach(section => {
            observer.observe(section);
        });
    }

    setupParallaxEffect() {
        window.addEventListener('scroll', () => {
            document.querySelectorAll('.parallax-bg').forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(window.scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    setupThemeTransitions() {
        const transitionElements = document.querySelectorAll('.theme-transition');
        
        transitionElements.forEach(element => {
            element.style.transition = 'all 0.5s ease';
        });
    }

    setTheme(theme) {
        if (this.currentTheme === theme) return;
        
        const themeData = this.themes[theme];
        if (!themeData) return;

        document.documentElement.style.setProperty('--primary-color', themeData.primary);
        document.documentElement.style.setProperty('--secondary-color', themeData.secondary);
        document.documentElement.style.setProperty('--theme-font', themeData.font);

        document.body.className = `theme-${theme}`;
        this.currentTheme = theme;

        // Trigger animations
        this.triggerThemeChangeAnimations();
    }

    triggerThemeChangeAnimations() {
        document.querySelectorAll('.animate-on-theme-change').forEach(element => {
            element.classList.remove('animate');
            void element.offsetWidth; // Trigger reflow
            element.classList.add('animate');
        });
    }
} 