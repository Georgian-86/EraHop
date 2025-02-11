// Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 1000,
    once: true
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Era filtering
const eraButtons = document.querySelectorAll('.era-btn');
const eraSections = document.querySelectorAll('.era-section');

eraButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        eraButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Show/hide sections
        const era = button.dataset.era;
        eraSections.forEach(section => {
            if (era === 'all' || section.id === era) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    });
});

// Mobile Dropdown Toggle
const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown-trigger');
    
    trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!e.target.closest('.nav-links') && !e.target.closest('.hamburger')) {
            navLinks.classList.remove('active');
        }
    }
});

// Update era indicator
function updateEraIndicator(era) {
    const eraIndicator = document.getElementById('current-era');
    if (eraIndicator) {
        eraIndicator.textContent = era.charAt(0).toUpperCase() + era.slice(1);
        eraIndicator.className = `era-${era}`;
    }
}

// Listen for theme changes
document.addEventListener('themeChange', (e) => {
    updateEraIndicator(e.detail.theme);
}); 