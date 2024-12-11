document.addEventListener('DOMContentLoaded', function () {
    const friendsContainer = document.querySelector('.amis-content');
    const friends = Array.from(document.querySelectorAll('.friend'));

    // Trier les amis par niveau
    friends.sort((a, b) => {
        const levelA = parseInt(a.getAttribute('data-level'));
        const levelB = parseInt(b.getAttribute('data-level'));
        return levelB - levelA; // Tri décroissant
    });

    // Réorganiser les amis dans le DOM
    friends.forEach(friend => {
        friendsContainer.appendChild(friend);
    });

    // Appliquer les couleurs et ajouter les événements de clic
    friends.forEach(friend => {
        const level = parseInt(friend.getAttribute('data-level'));
        const levelElement = friend.querySelector('.level');
        const color = getColorForLevel(level);
        levelElement.style.color = color;
        levelElement.style.borderColor = color;

        friend.addEventListener('click', function () {
            // Fermer toutes les autres divs d'amis
            friends.forEach(f => {
                if (f !== friend) {
                    f.classList.remove('expanded');
                }
            });
            // Ouvrir/fermer la div cliquée
            this.classList.toggle('expanded');
        });
    });

    function getColorForLevel(level) {
        const startColor = { r: 255, g: 124, b: 0 }; // #ff7c00
        const endColor = { r: 255, g: 215, b: 64 }; // #ffd740

        const r = startColor.r + (endColor.r - startColor.r) * (level / 100);
        const g = startColor.g + (endColor.g - startColor.g) * (level / 100);
        const b = startColor.b + (endColor.b - startColor.b) * (level / 100);

        return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    }
});