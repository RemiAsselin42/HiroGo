// document.querySelector('.route-selection').addEventListener('click', function () {
//   this.classList.add('expanded');
// });

// document.querySelector('#map').addEventListener('click', function () {
//   document.querySelector('.route-selection').classList.remove('expanded');
// });

// document.addEventListener('DOMContentLoaded', function () {
//   const routeSelection = document.querySelector('.route-selection');
//   let startY, startHeight;

//   routeSelection.addEventListener('click', function () {
//     if (!this.classList.contains('full')) {
//       this.classList.toggle('expanded');
//       this.classList.remove('full');
//     }
//   });

//   document.querySelector('#map').addEventListener('click', function () {
//     routeSelection.classList.remove('expanded');
//     routeSelection.classList.remove('full');
//   });

//   routeSelection.addEventListener('touchstart', function (e) {
//     startY = e.touches[0].clientY;
//     startHeight = routeSelection.offsetHeight;
//     routeSelection.style.transition = 'none'; // Désactive la transition pendant le drag
//   });

//   routeSelection.addEventListener('touchmove', function (e) {
//     const touchY = e.touches[0].clientY;
//     const newHeight = startHeight + (startY - touchY);
//     if (newHeight >= 50 && newHeight <= 565) { // Limite la hauteur entre 50px et 565px
//       routeSelection.style.height = `${newHeight}px`;
//     }
//   });

//   routeSelection.addEventListener('touchend', function () {
//     routeSelection.style.transition = 'height 0.5s'; // Réactive la transition après le drag
//     // Ajuste la hauteur finale à 50px, 270px ou 565px selon la position finale
//     if (routeSelection.offsetHeight < 160) {
//       routeSelection.classList.remove('expanded');
//       routeSelection.classList.remove('full');
//       routeSelection.style.height = '50px';
//     } else if (routeSelection.offsetHeight < 420) {
//       routeSelection.classList.add('expanded');
//       routeSelection.classList.remove('full');
//       routeSelection.style.height = '270px';
//     } else {
//       routeSelection.classList.remove('expanded');
//       routeSelection.classList.add('full');
//       routeSelection.style.height = '565px';
//     }
//   });

//   $(document).ready(function () {
//     $(".select2").select2({
//       dropdownParent: $(".route-selection"),
//       minimumResultsForSearch: Infinity,
//     });
//   });
// });
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
    let newHeight = Math.min(565, Math.max(50, startHeight + deltaY));

    routeSelection.style.height = `${newHeight}px`;

    // Ajuster les classes selon la hauteur
    resetClasses();
    if (newHeight >= 420) {
      routeSelection.classList.add('full');
    } else if (newHeight >= 160) {
      routeSelection.classList.add('expanded');
    }
  });

  routeSelection.addEventListener('touchend', () => {
    isDragging = false;

    // Rapprocher la hauteur à l'un des paliers après un drag
    const currentHeight = routeSelection.offsetHeight;

    if (currentHeight < 160) {
      resetClasses();
      routeSelection.style.height = '50px';
    } else if (currentHeight < 420) {
      resetClasses();
      routeSelection.classList.add('expanded');
      routeSelection.style.height = '270px';
    } else {
      resetClasses();
      routeSelection.classList.add('full');
      routeSelection.style.height = '565px';
    }
  });
});

$(document).ready(function () {
  $(".select2").select2({
    dropdownParent: $(".route-selection"),
    minimumResultsForSearch: Infinity,
  });
});
