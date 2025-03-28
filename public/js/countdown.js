class TimeWarpCountdown {
  constructor(targetDate, elementId, miniElementId) {
    this.targetDate = new Date('2025-03-30T12:00:00');
    this.countdownElement = document.getElementById(elementId);
    this.miniCountdownElement = document.getElementById(miniElementId);
    this.init();
  }

  init() {
    this.updateCountdown();
    setInterval(() => this.updateCountdown(), 1000);

    if (this.countdownElement) {
      this.countdownElement.addEventListener('mouseover', () => {
        this.countdownElement.classList.add('warping');
      });

      this.countdownElement.addEventListener('mouseout', () => {
        this.countdownElement.classList.remove('warping');
      });
    }
  }

  updateCountdown() {
    const now = new Date();
    const distance = this.targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update main countdown
    if (this.countdownElement) {
      this.countdownElement.innerHTML = this.getMainCountdownHTML(
        days,
        hours,
        minutes,
        seconds
      );
    }

    // Update mini countdown
    if (this.miniCountdownElement) {
      this.miniCountdownElement.innerHTML = this.getMiniCountdownHTML(
        days,
        hours,
        minutes,
        seconds
      );
    }
  }

  getMainCountdownHTML(days, hours, minutes, seconds) {
    return `
            <div class="countdown-item">
                <span class="number">${days}</span>
                <span class="label">Days</span>
            </div>
            <div class="countdown-item">
                <span class="number">${hours}</span>
                <span class="label">Hours</span>
            </div>
            <div class="countdown-item">
                <span class="number">${minutes}</span>
                <span class="label">Minutes</span>
            </div>
            <div class="countdown-item">
                <span class="number">${seconds}</span>
                <span class="label">Seconds</span>
            </div>
        `;
  }

  getMiniCountdownHTML(days, hours, minutes, seconds) {
    return `
            <div class="countdown-item">
                <span class="number">${days}</span>d
            </div>
            <div class="countdown-item">
                <span class="number">${hours}</span>h
            </div>
            <div class="countdown-item">
                <span class="number">${minutes}</span>m
            </div>
            <div class="countdown-item">
                <span class="number">${seconds}</span>s
            </div>
            <span class="countdown-label">until Time Fest 2025</span>
        `;
  }
}
