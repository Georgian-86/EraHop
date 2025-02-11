class TimeMap {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentEra = 'present';
        this.markers = [];
        this.init();
    }

    init() {
        // Initialize the map
        this.map = L.map(this.container).setView([your_lat, your_lng], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

        // Add era-specific markers
        this.addMarkers();
        this.addEraControls();
    }

    addMarkers() {
        const locations = {
            prehistoric: [
                { lat: your_lat1, lng: your_lng1, name: 'Cave Arena', icon: 'dinosaur' },
                // Add more prehistoric locations
            ],
            medieval: [
                { lat: your_lat2, lng: your_lng2, name: 'Castle Grounds', icon: 'castle' },
                // Add more medieval locations
            ],
            future: [
                { lat: your_lat3, lng: your_lng3, name: 'Tech Dome', icon: 'robot' },
                // Add more future locations
            ]
        };

        // Create custom icons for each era
        const icons = {
            prehistoric: L.divIcon({ className: 'map-icon prehistoric' }),
            medieval: L.divIcon({ className: 'map-icon medieval' }),
            future: L.divIcon({ className: 'map-icon future' })
        };

        // Add markers to map
        for (let era in locations) {
            locations[era].forEach(loc => {
                const marker = L.marker([loc.lat, loc.lng], { icon: icons[era] })
                    .bindPopup(`
                        <h3>${loc.name}</h3>
                        <p>Era: ${era}</p>
                        <button onclick="showEventDetails('${loc.name}')">View Events</button>
                    `);
                this.markers.push({ era, marker });
                marker.addTo(this.map);
            });
        }
    }

    changeEra(era) {
        this.currentEra = era;
        this.markers.forEach(({ era: markerEra, marker }) => {
            if (era === 'all' || markerEra === era) {
                marker.addTo(this.map);
            } else {
                marker.remove();
            }
        });
    }
} 