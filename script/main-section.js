const routeSelection = document.getElementById('routeSelection');
let isDragging = false; // Indique si un drag est en cours
let startY = 0; // Position de départ du doigt
let startHeight = 0; // Hauteur initiale de la div
const minHeight = 75; // Hauteur minimale de la div
const mediumHeight = 310; // Hauteur moyenne de la div
const dragThreshold = 10; // Distance minimale pour considérer un drag

const headerHeight = document.querySelector('header').offsetHeight;
const maxHeight = window.innerHeight - headerHeight;

let isMouseDragging = false; // Indique si un drag à la souris est en cours
let startMouseY = 0; // Position initiale de la souris
let startMouseHeight = 0; // Hauteur initiale de la div

$(document).ready(function () {
  // Fonction pour réinitialiser les classes
  const resetClasses = () => {
    routeSelection.classList.remove('expanded');
    routeSelection.classList.remove('full');
  };

  document.querySelector('#map').addEventListener('click', function () {
    resetClasses();
    routeSelection.style.height = `${minHeight}px`;
  });

  // Gestion du "drag" pour ajuster la hauteur
  routeSelection.addEventListener('touchstart', (e) => {
    if (document.activeElement.tagName === 'INPUT' || documentactiveElement.tagName === 'SELECT' || documentactiveElement.tagName === 'OPTION') {
      routeSelection.classList.add('full');
      routeSelection.style.height = `${maxHeight}px`;
      return;
    } // Prevent drag if an input is focused

    startY = e.touches[0].clientY;
    startHeight = routeSelection.offsetHeight;
  });

  routeSelection.addEventListener('touchmove', (e) => {
    if (!isDragging || document.activeElement.tagName === 'INPUT') return; // Prevent drag if an input is focused
    isDragging = true;

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
    if (document.activeElement.tagName === 'INPUT') return; // Prevent drag if an input is focused
    isDragging = false;

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
  });

  // GESTION DU DRAG SUR ORDINATEUR AVEC LA SOURIS

  // Début du drag à la souris
  routeSelection.addEventListener('mousedown', (e) => {
    if (document.activeElement.tagName === 'INPUT') return; // Prevent drag if an input is focused
    startMouseY = e.clientY;
    startMouseHeight = routeSelection.offsetHeight;
    isMouseDragging = false;
  });

  // Déplacement à la souris
  document.addEventListener('mousemove', (e) => {
    if (!isMouseDragging || document.activeElement.tagName === 'INPUT') return; // Prevent drag if an input is focused

    const deltaY = startMouseY - e.clientY;
    let newHeight = startMouseHeight + deltaY;

    if (Math.abs(deltaY) < dragThreshold) return;

    isMouseDragging = true;

    resetClasses();
    routeSelection.style.height = `${newHeight}px`;
  });

  // Fin du drag à la souris
  document.addEventListener('mouseup', (e) => {
    if (document.activeElement.tagName === 'INPUT') return; // Prevent drag if an input is focused
    isMouseDragging = false;

    const deltaY = startMouseY - e.clientY;
    if (Math.abs(deltaY) < dragThreshold) return;

    direction = '';

    if (deltaY > dragThreshold) {
      direction = 'up';
    } else if (deltaY < -dragThreshold) {
      direction = 'down';
    }

    const currentHeight = routeSelection.offsetHeight;
    const closestHeight = findClosestHeight(currentHeight, direction);

    resetClasses();
    if (closestHeight === mediumHeight) {
      routeSelection.classList.add('expanded');
    } else if (closestHeight === parseInt(maxHeight)) {
      routeSelection.classList.add('full');
    }

    routeSelection.style.height = `${closestHeight}px`;
  });

  const findClosestHeight = (currentHeight, direction) => {
    const heights = [minHeight, mediumHeight, parseInt(maxHeight)];
    if (direction === 'up') {
      return heights.find((height) => height > currentHeight) || Math.max(...heights);
    } else if (direction === 'down') {
      return heights.reverse().find((height) => height < currentHeight) || Math.min(...heights);
    }
  };
});

const inputSelection = routeSelection.getElementsByClassName('inputSelection');

inputSelection.addEventListener('click', function () {
  e.stopPropagation();
});

$(document).ready(function () {
  $(".select2").select2({
    dropdownParent: $(".route-selection"),
    minimumResultsForSearch: Infinity,
  });
});