document.addEventListener("DOMContentLoaded", function () {
    const rewardsContainer = document.querySelector('.rewards-container');

    let isDown = false;
    let startX;
    let scrollLeft;

    rewardsContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        rewardsContainer.classList.add('active');
        startX = e.pageX - rewardsContainer.offsetLeft;
        scrollLeft = rewardsContainer.scrollLeft;
    });

    rewardsContainer.addEventListener('mouseleave', () => {
        isDown = false;
        rewardsContainer.classList.remove('active');
    });

    rewardsContainer.addEventListener('mouseup', () => {
        isDown = false;
        rewardsContainer.classList.remove('active');
    });

    rewardsContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - rewardsContainer.offsetLeft;
        const walk = (x - startX) * 3; //scroll-fast
        rewardsContainer.scrollLeft = scrollLeft - walk;
    });

    // Touch events for mobile
    rewardsContainer.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - rewardsContainer.offsetLeft;
        scrollLeft = rewardsContainer.scrollLeft;
    });

    rewardsContainer.addEventListener('touchend', () => {
        isDown = false;
    });

    rewardsContainer.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - rewardsContainer.offsetLeft;
        const walk = (x - startX) * 3; //scroll-fast
        rewardsContainer.scrollLeft = scrollLeft - walk;
    });
});