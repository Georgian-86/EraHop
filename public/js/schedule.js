class ScheduleManager {
    constructor() {
        // Check if we're on the schedule page
        if (document.querySelector('.schedule-section')) {
            this.currentView = 'grid';
            this.currentDay = new Date();
            this.eventDate = new Date('2025-02-11T10:00:00');
            this.init();
        }
    }

    init() {
        this.setupTimeDisplay();
        this.setupViewControls();
        this.setupDayControls();
        this.setupEventCards();
        const filterContainer = document.querySelector('.schedule-filters');
        if (filterContainer) {
            this.setupFilters(filterContainer);
        }
    }

    setupTimeDisplay() {
        const timeDisplay = document.querySelector('.current-time');
        setInterval(() => {
            const now = new Date();
            timeDisplay.textContent = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }, 1000);
    }

    setupViewControls() {
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentView = btn.dataset.view;
                this.updateView();
            });
        });
    }

    setupDayControls() {
        const dayBtns = document.querySelectorAll('.control-btn[data-day]');
        dayBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const direction = btn.dataset.day;
                this.changeDay(direction);
            });
        });
    }

    changeDay(direction) {
        const date = new Date(this.currentDay);
        switch(direction) {
            case 'prev':
                date.setDate(date.getDate() - 1);
                break;
            case 'next':
                date.setDate(date.getDate() + 1);
                break;
            default:
                date.setDate(new Date().getDate());
        }
        this.currentDay = date;
        this.updateDateDisplay();
        this.loadEvents();
    }

    updateDateDisplay() {
        const dateDisplay = document.querySelector('.current-date');
        dateDisplay.textContent = this.currentDay.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    setupEventCards() {
        const cards = document.querySelectorAll('.event-card');
        cards.forEach(card => {
            card.querySelector('.info-btn').addEventListener('click', () => {
                this.showEventDetails(card.dataset.time);
            });

            card.querySelector('.book-btn').addEventListener('click', () => {
                this.bookEvent(card.dataset.time);
            });
        });
    }

    showEventDetails(time) {
        const modal = document.getElementById('eventModal');
        modal.style.display = 'block';
        // Load event details based on time
    }

    async bookEvent(time) {
        try {
            const card = document.querySelector(`.event-card[data-time="${time}"]`);
            if (!card) {
                throw new Error('Event card not found');
            }

            const eventName = card.querySelector('h3')?.textContent;
            const era = Array.from(card.classList)
                .find(cls => ['prehistoric', 'medieval', 'future'].includes(cls));

            if (!eventName || !era) {
                throw new Error('Missing event details');
            }

            console.log('Sending booking request:', {
                eventTime: time,
                eventName,
                era,
                userId: 'test-user'
            });

            const response = await fetch('/api/schedule/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    eventTime: time,
                    eventName,
                    era,
                    userId: 'test-user'
                })
            });

            // Check if response is ok before parsing JSON
            if (!response.ok) {
                const text = await response.text();
                console.error('Server response:', text);
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            console.log('Booking response:', data);
            
            if (data.success) {
                // Update UI to show booked status
                const statusBadge = card.querySelector('.status-badge');
                const bookBtn = card.querySelector('.book-btn');
                
                if (statusBadge && bookBtn) {
                    statusBadge.textContent = 'Booked';
                    statusBadge.className = 'status-badge booked';
                    bookBtn.disabled = true;
                }
                
                alert('Event booked successfully!');
            } else {
                throw new Error(data.message || 'Booking failed');
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert(`Failed to book event: ${error.message}`);
        }
    }

    setupFilters(filterContainer) {
        const eraFilter = filterContainer.querySelector('.era-filter');
        eraFilter.addEventListener('change', (e) => {
            this.filterEvents(e.target.value);
        });
    }

    filterEvents(era) {
        const cards = document.querySelectorAll('.event-card');
        cards.forEach(card => {
            if (era === 'all' || card.classList.contains(era)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    updateView() {
        const timeGrid = document.querySelector('.time-grid');
        timeGrid.className = `time-grid view-${this.currentView}`;
        // Update layout based on view type
    }

    loadEvents() {
        // Load events for the current day
        console.log(`Loading events for ${this.currentDay.toDateString()}`);
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    new ScheduleManager();
}); 