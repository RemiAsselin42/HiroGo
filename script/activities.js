document.addEventListener('DOMContentLoaded', function () {
    const activities = document.querySelectorAll('.activity');

    activities.forEach(activity => {
        activity.addEventListener('click', function () {
            activities.forEach(act => {
                if (act !== this && act.classList.contains('expanded')) {
                    act.classList.remove('expanded');
                    act.style.flexDirection = "row";
                }
            });

            this.classList.toggle('expanded');
            this.style.flexDirection = "column";
        });
    });
});