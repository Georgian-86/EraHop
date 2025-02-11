class AnimationController {
    constructor() {
        this.animations = {
            timeWarp: {
                in: [
                    { transform: 'scale(1) rotate(0deg)', opacity: 1 },
                    { transform: 'scale(1.2) rotate(10deg)', opacity: 0.5 },
                    { transform: 'scale(1) rotate(0deg)', opacity: 1 }
                ],
                options: {
                    duration: 1000,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }
            },
            timeSplit: {
                in: [
                    { transform: 'translateX(-100%)', opacity: 0 },
                    { transform: 'translateX(0)', opacity: 1 }
                ],
                options: {
                    duration: 800,
                    easing: 'ease-out'
                }
            }
        };

        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupTimelineAnimations();
    }

    setupScrollAnimations() {
        const options = {
            root: null,
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animation = element.dataset.animation;
                    if (animation && this.animations[animation]) {
                        element.animate(
                            this.animations[animation].in,
                            this.animations[animation].options
                        );
                    }
                }
            });
        }, options);

        document.querySelectorAll('[data-animation]').forEach(element => {
            observer.observe(element);
        });
    }

    setupHoverAnimations() {
        document.querySelectorAll('.hover-animate').forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.animate([
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.05)' }
                ], {
                    duration: 300,
                    easing: 'ease-out',
                    fill: 'forwards'
                });
            });

            element.addEventListener('mouseleave', () => {
                element.animate([
                    { transform: 'scale(1.05)' },
                    { transform: 'scale(1)' }
                ], {
                    duration: 300,
                    easing: 'ease-out',
                    fill: 'forwards'
                });
            });
        });
    }

    setupTimelineAnimations() {
        const timeline = document.querySelector('.time-travel-timeline');
        if (!timeline) return;

        const timelineItems = timeline.querySelectorAll('.timeline-item');
        let delay = 0;

        timelineItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';

            setTimeout(() => {
                item.animate([
                    { opacity: 0, transform: 'translateY(20px)' },
                    { opacity: 1, transform: 'translateY(0)' }
                ], {
                    duration: 500,
                    easing: 'ease-out',
                    fill: 'forwards'
                });
            }, delay);

            delay += 200;
        });
    }

    playAnimation(element, animationName) {
        if (!this.animations[animationName]) return;

        element.animate(
            this.animations[animationName].in,
            this.animations[animationName].options
        );
    }
} 