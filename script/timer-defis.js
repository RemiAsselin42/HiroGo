document.addEventListener("DOMContentLoaded", function () {
    function updateCountdown(elementId) {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0); // Set to midnight
        const diff = midnight - now;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById(elementId).textContent = `${hours}h ${minutes}m ${seconds}s`;
    }

    function startCountdown() {
        updateCountdown('countdown-easy');
        updateCountdown('countdown-medium');
        updateCountdown('countdown-hard');

        setInterval(() => {
            updateCountdown('countdown-easy');
            updateCountdown('countdown-medium');
            updateCountdown('countdown-hard');
        }, 1000);
    }

    startCountdown();
});