// let isMouseDragging = false; // Indique si un drag à la souris est en cours
// let startMouseY = 0; // Position initiale de la souris
// let startMouseHeight = 0; // Hauteur initiale de la div

// $(document).ready(function () {

//     // Début du drag à la souris
//     routeSelection.addEventListener('mousedown', (e) => {
//         isMouseDragging = true;
//         startMouseY = e.clientY;
//         startMouseHeight = routeSelection.offsetHeight;

//         // Empêche le comportement par défaut (sélection de texte)
//         e.preventDefault();
//     });

//     // Déplacement à la souris
//     document.addEventListener('mousemove', (e) => {
//         if (!isMouseDragging) return;

//         const deltaY = startMouseY - e.clientY;
//         let newHeight = startMouseHeight + deltaY;

//         resetClasses();
//         if (newHeight >= mediumHeight) {
//             routeSelection.classList.add('expanded');
//         }
//         if (newHeight >= maxHeight) {
//             routeSelection.classList.add('full');
//         }

//         routeSelection.style.height = `${newHeight}px`;
//     });

//     // Fin du drag à la souris
//     document.addEventListener('mouseup', (e) => {
//         if (!isMouseDragging) return;
//         isMouseDragging = false;

//         const deltaY = startMouseY - e.clientY;
//         const direction = deltaY > 0 ? 'up' : 'down';

//         clipHeight(direction);
//     });

//     document.addEventListener('keydown', (e) => {
//         const currentHeight = routeSelection.offsetHeight;

//         if (e.key === 'ArrowUp') {
//             console.log(e.key);

//             // Augmente la hauteur
//             if (currentHeight < mediumHeight) {
//                 resetClasses();
//                 routeSelection.classList.add('expanded');
//                 routeSelection.style.height = `${mediumHeight}px`;
//             } else if (currentHeight < maxHeight) {
//                 resetClasses();
//                 routeSelection.classList.add('full');
//                 routeSelection.style.height = maxHeight;
//             }
//         } else if (e.key === 'ArrowDown') {
//             console.log(e.key);

//             // Réduit la hauteur
//             if (currentHeight > mediumHeight) {
//                 resetClasses();
//                 routeSelection.classList.add('expanded');
//                 routeSelection.style.height = `${mediumHeight}px`;
//             } else if (currentHeight > minHeight) {
//                 resetClasses();
//                 routeSelection.style.height = `${minHeight}px`;
//             }
//         }
//     });
// });