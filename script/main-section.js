const routeSelection = document.getElementById('routeSelection');
let isDragging = false; // Indique si un drag est en cours
let startY = 0; // Position de départ du doigt
let startHeight = 0; // Hauteur initiale de la div
const minHeight = 75; // Hauteur minimale de la div
const mediumHeight = 310; // Hauteur moyenne de la div
const dragThreshold = 10; // Distance minimale pour considérer un drag

const headerHeight = document.querySelector('header').offsetHeight;
const maxHeight = window.innerHeight - headerHeight;
// const maxHeight = 'calc(100dvh - 138px)'; // Hauteur maximale de la div

let isMouseDragging = false; // Indique si un drag à la souris est en cours
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

  let lastMove = 0;
  routeSelection.addEventListener('touchmove', (e) => {
    if (!isDragging && deltaY > dragThreshold) {
      isDragging = true; // Activer le drag une fois le seuil dépassé
    } else if (!isDragging) {
      return;
    }
    const now = Date.now();
    if (now - lastMove < 50) return; // Limite à une fois tous les 50ms
    lastMove = now;

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
    const heights = [minHeight, mediumHeight, parseInt(maxHeight)]; // Liste des hauteurs possibles
    if (direction === 'up') {
      // Filtrer les hauteurs plus grandes que la hauteur actuelle, et prendre la plus petite d'entre elles
      return heights.find((height) => height > currentHeight) || Math.max(...heights);
    } else if (direction === 'down') {
      // Filtrer les hauteurs plus petites que la hauteur actuelle, et prendre la plus grande d'entre elles
      return heights.reverse().find((height) => height < currentHeight) || Math.min(...heights);
    }

    // Par défaut, retourne la hauteur la plus proche
    return heights.reduce((prev, curr) =>
      Math.abs(curr - currentHeight) < Math.abs(prev - currentHeight) ? curr : prev
    );
  };



  // GESTION DU DRAG SUR ORDINATEUR AVEC LA SOURIS


  // Début du drag à la souris
  routeSelection.addEventListener('mousedown', (e) => {
    isMouseDragging = true;
    startMouseY = e.clientY;
    startMouseHeight = routeSelection.offsetHeight;

    // Empêche le comportement par défaut (sélection de texte)
    e.preventDefault();
  });

  // Déplacement à la souris
  document.addEventListener('mousemove', (e) => {
    if (!isMouseDragging) return;

    const deltaY = startMouseY - e.clientY;
    let newHeight = startMouseHeight + deltaY;

    resetClasses();
    if (newHeight >= mediumHeight) {
      routeSelection.classList.add('expanded');
    }
    if (newHeight >= maxHeight) {
      routeSelection.classList.add('full');
    }

    routeSelection.style.height = `${newHeight}px`;
  });

  // Fin du drag à la souris
  document.addEventListener('mouseup', (e) => {
    if (!isMouseDragging) return;
    isMouseDragging = false;

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
  });
});

$(document).ready(function () {
  $(".select2").select2({
    dropdownParent: $(".route-selection"),
    minimumResultsForSearch: Infinity,
  });
});