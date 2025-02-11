class GalleryManager {
    constructor() {
        this.currentFilter = 'all';
        this.currentIndex = 0;
        this.items = [];
        // Check if we're on the gallery page
        if (document.querySelector('.gallery-section')) {
            this.init();
        }
    }

    init() {
        this.setupFilters();
        this.setupModal();
        this.initializeAOS();
    }

    setupFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterGallery(btn.dataset.filter);
            });
        });
    }

    filterGallery(filter) {
        this.currentFilter = filter;
        const items = document.querySelectorAll('.gallery-item');
        items.forEach(item => {
            if (filter === 'all' || item.classList.contains(filter)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    setupModal() {
        const modalContainer = document.querySelector('.gallery-modal');
        if (modalContainer) {
            const modal = document.getElementById('galleryModal');
            const closeBtn = modal.querySelector('.close-modal');
            const prevBtn = modal.querySelector('.prev-btn');
            const nextBtn = modal.querySelector('.next-btn');

            closeBtn.addEventListener('click', () => this.closeModal());
            prevBtn.addEventListener('click', () => this.navigateGallery(-1));
            nextBtn.addEventListener('click', () => this.navigateGallery(1));

            document.addEventListener('keydown', (e) => {
                if (modal.style.display === 'block') {
                    if (e.key === 'Escape') this.closeModal();
                    if (e.key === 'ArrowLeft') this.navigateGallery(-1);
                    if (e.key === 'ArrowRight') this.navigateGallery(1);
                }
            });
        }
    }

    openModal(element) {
        const modal = document.getElementById('galleryModal');
        const modalImg = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalDesc = document.getElementById('modalDescription');
        const modalEra = document.getElementById('modalEra');

        const item = element.closest('.gallery-item');
        const img = item.querySelector('img');
        const title = item.querySelector('h3');
        const desc = item.querySelector('p');
        const era = item.querySelector('.era-badge');

        modalImg.src = img.src;
        modalTitle.textContent = title.textContent;
        modalDesc.textContent = desc.textContent;
        modalEra.textContent = era.textContent;
        modalEra.className = era.className;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Update current index
        this.items = Array.from(document.querySelectorAll('.gallery-item'));
        this.currentIndex = this.items.indexOf(item);
    }

    closeModal() {
        const modal = document.getElementById('galleryModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    navigateGallery(direction) {
        let newIndex = this.currentIndex + direction;
        if (newIndex >= this.items.length) newIndex = 0;
        if (newIndex < 0) newIndex = this.items.length - 1;

        const viewBtn = this.items[newIndex].querySelector('.view-btn');
        this.openModal(viewBtn);
    }

    initializeAOS() {
        AOS.init({
            duration: 1000,
            once: true
        });
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    new GalleryManager();
});

// Global function for opening modal
function openGalleryModal(element) {
    window.galleryManager = window.galleryManager || new GalleryManager();
    window.galleryManager.openModal(element);
} 