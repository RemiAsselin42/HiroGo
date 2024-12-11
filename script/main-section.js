$(document).ready(function () {
  const routeSelection = document.getElementById('routeSelection');
  let isDragging = false; // Indique si un drag est en cours
  let startY = 0; // Position de départ du doigt
  let startHeight = 0; // Hauteur initiale de la div

  // Fonction pour réinitialiser les classes
  const resetClasses = () => {
    routeSelection.classList.remove('expanded');
    routeSelection.classList.remove('full');
  };

  // Fonction pour "clipper" la hauteur à des valeurs spécifiques
  const clipHeight = (direction) => {
    const currentHeight = routeSelection.offsetHeight;

    if (direction === 'up') {
      if (currentHeight < 160) {
        resetClasses();
        routeSelection.style.height = '270px';
      } else if (currentHeight < 420) {
        resetClasses();
        routeSelection.classList.add('full');
        routeSelection.style.height = '565px';
      }
    } else if (direction === 'down') {
      if (currentHeight > 420) {
        resetClasses();
        routeSelection.classList.add('expanded');
        routeSelection.style.height = '270px';
      }
    }
  };

  // Gestion du "tap" pour basculer entre 50px et 270px
  routeSelection.addEventListener('click', () => {
    if (isDragging) return;

    const currentHeight = routeSelection.offsetHeight;

    if (currentHeight === 50) {
      resetClasses();
      routeSelection.classList.add('expanded');
      routeSelection.style.height = '270px';
    }
  });

  document.querySelector('#map').addEventListener('click', function () {
    resetClasses();
    routeSelection.style.height = '50px';
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
    if (newHeight >= 420) {
      routeSelection.classList.add('full');
    } else if (newHeight >= 160) {
      routeSelection.classList.add('expanded');
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