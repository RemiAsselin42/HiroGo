const routeSelection = document.getElementById('routeSelection');
let isDragging = false; // Indique si un drag est en cours
let startY = 0; // Position de départ du doigt/souris
let startHeight = 0; // Hauteur initiale de la div
const dragThreshold = 10; // Distance minimale pour considérer un drag
const minHeight = 75; // Hauteur minimale de la div
const mediumHeight = 310; // Hauteur moyenne de la div
const headerHeight = document.querySelector('header').offsetHeight;
const maxHeight = window.innerHeight - headerHeight;

let mouseDragging = false; // Indique si un drag à la souris est en cours
let startMouseY = 0; // Position initiale de la souris
let startMouseHeight = 0; // Hauteur initiale de la div

$(document).ready(function () {
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
        routeSelection.style.height = `${maxHeight}px`;
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

  // Gestion du drag tactile
  routeSelection.addEventListener('touchstart', (e) => {
    isDragging = false;
    startY = e.touches[0].clientY;
    startHeight = routeSelection.offsetHeight;
  });

  routeSelection.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const deltaY = Math.abs(startY - touchY);

    if (!isDragging && deltaY > dragThreshold) {
      isDragging = true;
    }

    if (!isDragging) return;

    let newHeight = startHeight + (startY - touchY);

    resetClasses();
    if (newHeight >= mediumHeight) {
      routeSelection.classList.add('expanded');
    }
    if (newHeight >= maxHeight) {
      routeSelection.classList.add('full');
    }

    routeSelection.style.height = `${Math.max(minHeight, Math.min(newHeight, maxHeight))}px`;
  });

  routeSelection.addEventListener('touchend', (e) => {
    if (!isDragging) return;

    const touchY = e.changedTouches[0].clientY;
    const deltaY = startY - touchY;
    const direction = deltaY > 0 ? 'up' : 'down';

    const currentHeight = routeSelection.offsetHeight;
    const closestHeight = findClosestHeight(currentHeight, direction);

    resetClasses();
    if (closestHeight === mediumHeight) {
      routeSelection.classList.add('expanded');
    } else if (closestHeight === parseInt(maxHeight)) {
      routeSelection.classList.add('full');
    }

    routeSelection.style.height = `${closestHeight}px`;
    isDragging = false; // Fin du drag tactile
  });

  // Gestion du drag souris
  routeSelection.addEventListener('mousedown', (e) => {
    mouseDragging = false;
    startMouseY = e.clientY;
    startMouseHeight = routeSelection.offsetHeight;
    e.preventDefault(); // Empêche la sélection de texte
  });

  document.addEventListener('mousemove', (e) => {
    const deltaY = Math.abs(startMouseY - e.clientY);

    if (!mouseDragging && deltaY > dragThreshold) {
      mouseDragging = true;
    }

    if (!mouseDragging) return;

    let newHeight = startMouseHeight + (startMouseY - e.clientY);

    resetClasses();
    if (newHeight >= mediumHeight) {
      routeSelection.classList.add('expanded');
    }
    if (newHeight >= maxHeight) {
      routeSelection.classList.add('full');
    }

    routeSelection.style.height = `${Math.max(minHeight, Math.min(newHeight, maxHeight))}px`;
  });

  document.addEventListener('mouseup', (e) => {
    if (!mouseDragging) return;

    const deltaY = startMouseY - e.clientY;
    const direction = deltaY > 0 ? 'up' : 'down';

    const currentHeight = routeSelection.offsetHeight;
    const closestHeight = findClosestHeight(currentHeight, direction);

    resetClasses();
    if (closestHeight === mediumHeight) {
      routeSelection.classList.add('expanded');
    } else if (closestHeight === parseInt(maxHeight)) {
      routeSelection.classList.add('full');
    }

    routeSelection.style.height = `${closestHeight}px`;
    mouseDragging = false; // Fin du drag souris
  });

  const findClosestHeight = (currentHeight, direction) => {
    const heights = [minHeight, mediumHeight, parseInt(maxHeight)];
    if (direction === 'up') {
      return heights.find((h) => h > currentHeight) || Math.max(...heights);
    } else if (direction === 'down') {
      return heights.reverse().find((h) => h < currentHeight) || Math.min(...heights);
    }
    return heights.reduce((prev, curr) =>
      Math.abs(curr - currentHeight) < Math.abs(prev - currentHeight) ? curr : prev
    );
  };
});


$(document).ready(function () {
  $(".select2").select2({
    dropdownParent: $(".route-selection"),
    minimumResultsForSearch: Infinity,
  });
});