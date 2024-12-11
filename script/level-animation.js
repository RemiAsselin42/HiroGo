document.addEventListener("DOMContentLoaded", function () {
    const progressCircle = document.getElementById('progress');
    const radius = progressCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const duration = 2000;

    progressCircle.style.strokeDasharray = `${circumference}`;
    progressCircle.style.strokeDashoffset = `${circumference}`;

    function setProgress(percent) {
        const offset = circumference - (percent / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
    }

    function animateProgress() {
        let start = null;
        const targetPercent = 66;

        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percent = Math.min((progress / duration) * 100, targetPercent);
            setProgress(percent);

            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        }

        window.requestAnimationFrame(step);
    }

    animateProgress();


    // XP Counter Animation
    const xpCounter = document.getElementById('xp-counter');
    const startXP = 1000;
    const endXP = 325;
    const xpDuration = 1400; // 1 second

    function animateXP() {
        let start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const currentXP = Math.max(startXP - Math.floor((progress / xpDuration) * (startXP - endXP)), endXP);
            xpCounter.textContent = `${currentXP}xp`;

            if (progress < xpDuration) {
                window.requestAnimationFrame(step);
            }
        }

        window.requestAnimationFrame(step);
    }

    animateXP();
});