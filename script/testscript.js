$(document).ready(function () {
    const routeSelection = document.getElementById('routeSelection');
    let isDragging = false; // Indique si un drag est en cours
    let startY = 0; // Position de départ du doigt
    let startHeight = 0; // Hauteur initiale de la div
    let minHeight = '75'; // Hauteur minimale de la div
    let mediumHeight = '310'; // Hauteur moyenne de la div
    let maxHeight = 'calc(100dvh - 138px)'; // Hauteur maximale de la div

    // Fonction pour réinitialiser les classes
    const resetClasses = () => {
        routeSelection.classList.remove('expanded');
        routeSelection.classList.remove('full');
    };

    // Fonction pour "clipper" la hauteur à des valeurs spécifiques
    const clipHeight = (direction) => {
        const currentHeight = routeSelection.offsetHeight;

        if (direction === 'up') {

            if (currentHeight >= minHeight && currentHeight < mediumHeight) {
                resetClasses();
                routeSelection.classList.add('expanded');
                routeSelection.style.height = `${mediumHeight}px`;

            } else if (currentHeight >= mediumHeight && currentHeight < maxHeight) {
                resetClasses();
                routeSelection.classList.add('full');
                routeSelection.style.height = maxHeight;
            }

        } else if (direction === 'down') {

            if (currentHeight <= maxHeight && currentHeight > mediumHeight) {
                iu
                resetClasses();
                routeSelection.classList.add('expanded');
                routeSelection.style.height = `${mediumHeight}px`;

            } else if (currentHeight > minHeight && currentHeight <= mediumHeight) {
                resetClasses();
                routeSelection.style.height = `${minHeight}px`;
            }
        }
    };

    // Gestion du "drag" pour ajuster la hauteur
    routeSelection.addEventListener('touchstart', (e) => {
        isDragging = true;
        startY = e.touches[0].clientY;
        startHeight = routeSelection.offsetHeight;
    });

    routeSelection.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        resetClasses();
        const touchY = e.touches[0].clientY;
        const deltaY = startY - touchY;
        let newHeight = startHeight + deltaY;

        routeSelection.style.height = `${newHeight}px`;
    });

    // Assurez-vous que la hauteur est toujours ajustée après un drag
    routeSelection.addEventListener('touchend', (e) => {
        isDragging = false;

        clipHeight(direction);
    });

    // Gestion du "tap" pour basculer entre 75px et 310px
    routeSelection.addEventListener('click', () => {
        if (isDragging) return;
        const currentHeight = routeSelection.offsetHeight;

        if (currentHeight == minHeight) {
            resetClasses();
            routeSelection.classList.add('expanded');
            routeSelection.style.height = `${mediumHeight}px`;
        } else if (currentHeight == maxHeight) {
            return;
        }
    });

    document.querySelector('#map').addEventListener('click', function () {
        resetClasses();
        routeSelection.style.height = `${minHeight}px`;
    });
});

$(document).ready(function () {
    $(".select2").select2({
        dropdownParent: $(".route-selection"),
        minimumResultsForSearch: Infinity,
    });
});