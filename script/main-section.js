$(document).ready(function () {
  const routeSelection = document.getElementById('routeSelection');
  let isDragging = false; // Indique si un drag est en cours
  let startY = 0; // Position de départ du doigt
  let startHeight = 0; // Hauteur initiale de la div
  const minHeight = 75; // Hauteur minimale de la div
  const mediumHeight = 310; // Hauteur moyenne de la div
  const maxHeight = 'calc(100dvh - 138px)'; // Hauteur maximale de la div

  // Fonction pour réinitialiser les classes
  const resetClasses = () => {
    routeSelection.classList.remove('expanded');
    routeSelection.classList.remove('full');
  };

  // Fonction pour "clipper" la hauteur à des valeurs spécifiques
  const clipHeight = (direction) => {
    const currentHeight = routeSelection.offsetHeight;

    if (direction === 'up') {
      if (currentHeight < mediumHeight) {
        resetClasses();
        routeSelection.classList.add('expanded');
        routeSelection.style.height = `${mediumHeight}px`;
      } else if (currentHeight < maxHeight) {
        resetClasses();
        routeSelection.classList.add('full');
        routeSelection.style.height = maxHeight;
      }
    } else if (direction === 'down') {
      if (currentHeight > mediumHeight) {
        resetClasses();
        routeSelection.classList.add('expanded');
        routeSelection.style.height = `${mediumHeight}px`;
      } else if (currentHeight > minHeight) {
        resetClasses();
        routeSelection.style.height = `${minHeight}px`;
      }
    }
  };

  // Gestion du "tap" pour basculer entre 75px et 310px
  routeSelection.addEventListener('click', () => {
    if (isDragging) return;

    const currentHeight = routeSelection.offsetHeight;

    if (currentHeight === minHeight) {
      resetClasses();
      routeSelection.classList.add('expanded');
      routeSelection.style.height = `${mediumHeight}px`;
    } else if (currentHeight === mediumHeight) {
      resetClasses();
      routeSelection.style.height = `${minHeight}px`;
    }
  });

  document.querySelector('#map').addEventListener('click', function () {
    resetClasses();
    routeSelection.style.height = `${minHeight}px`;
  });

  // Gestion du "drag" pour ajuster la hauteur
  routeSelection.addEventListener('touchstart', (e) => {
    isDragging = true;
    startY = e.touches[0].clientY;
    startHeight = routeSelection.offsetHeight;
  });

  routeSelection.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    const touchY = e.touches[0].clientY;
    const deltaY = startY - touchY;
    let newHeight = startHeight + deltaY;

    // Ajuster les classes selon la hauteur
    resetClasses();
    if (newHeight >= mediumHeight) {
      routeSelection.classList.add('expanded');
    }
    if (newHeight >= maxHeight) {
      routeSelection.classList.add('full');
    }

    routeSelection.style.height = `${newHeight}px`;
  });

  routeSelection.addEventListener('touchend', (e) => {
    isDragging = false;

    const touchY = e.changedTouches[0].clientY;
    const deltaY = startY - touchY;
    const direction = deltaY > 0 ? 'up' : 'down';

    clipHeight(direction);
  });
});

$(document).ready(function () {
  $(".select2").select2({
    dropdownParent: $(".route-selection"),
    minimumResultsForSearch: Infinity,
  });
});