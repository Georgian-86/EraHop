class TimeZonePortals {
    constructor() {
        this.currentEra = null;
        // Check if we're on the timezones page
        if (document.querySelector('.timezone-section')) {
            this.init();
        }
    }

    init() {
        this.setupPortals();
        this.setupMapInteractions();
        this.setupCloseButtons();
    }

    setupPortals() {
        const portals = document.querySelectorAll('.portal');
        portals.forEach(portal => {
            portal.addEventListener('click', () => {
                const era = portal.dataset.era;
                this.openEraContent(era);
            });
        });
    }

    openEraContent(era) {
        const container = document.querySelector('.era-content-container');
        const content = document.querySelector(`.${era}-content`);
        
        // Hide all contents
        document.querySelectorAll('.era-content').forEach(c => {
            c.style.display = 'none';
        });

        // Show selected era
        container.style.display = 'block';
        content.style.display = 'block';
        this.currentEra = era;

        // Trigger entrance animation
        content.classList.add('era-enter');
        
        // Initialize map for this era
        this.initializeMap(era);
    }

    setupMapInteractions() {
        const markers = document.querySelectorAll('.map-marker');
        markers.forEach(marker => {
            marker.addEventListener('click', () => {
                const location = marker.dataset.location;
                this.showLocationInfo(location);
            });
        });
    }

    initializeMap(era) {
        const mapElement = document.getElementById(`${era}-map`);
        if (!mapElement) return;

        // Initialize map with era-specific markers and styling
        // This would integrate with a mapping service like Mapbox or Google Maps
    }

    showLocationInfo(location) {
        // Show modal or tooltip with location information
    }

    setupCloseButtons() {
        const portalContainer = document.querySelector('.portal-container');
        if (portalContainer) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'close-era-btn';
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
            
            portalContainer.appendChild(closeBtn);
            
            closeBtn.addEventListener('click', () => {
                document.querySelector('.era-content-container').style.display = 'none';
            });
        }
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    new TimeZonePortals();
}); 