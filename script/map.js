import CONFIG from '../config.js';
const mapboxApiKey = CONFIG.MAPBOX_API_KEY;

mapboxgl.accessToken = `${mapboxApiKey}`;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [4.387178, 45.439695], // Centré sur la Loire
    zoom: 8
});

// Ajouter les contrôles de zoom
map.addControl(new mapboxgl.NavigationControl(), 'top-right');

// Variable pour stocker les villes et les marqueurs
let cities = {};
let markers = {};

// Charger les villes depuis le fichier JSON
fetch('../json/villes.json')
    .then(response => response.json())
    .then(data => {
        // Stocker les villes dans un objet pour un accès rapide
        data.cities.forEach(city => {
            cities[city.name] = [city.longitude, city.latitude];
            // Créer un marqueur pour chaque ville mais ne pas l'ajouter à la carte
            const marker = new mapboxgl.Marker()
                .setLngLat([city.longitude, city.latitude])
                .setPopup(new mapboxgl.Popup().setText(city.name)); // Popup avec le nom de la ville
            markers[city.name] = marker;
        });
    })
    .catch(error => console.error('Erreur lors du chargement des villes:', error));

// Fonction pour afficher le trajet
function showRoute() {
    const startCity = document.getElementById("start").value;
    const endCity = document.getElementById("end").value;

    // Vérifier que les villes existent dans la liste
    if (!cities[startCity] || !cities[endCity]) {
        alert("Veuillez entrer des villes valides !");
        return;
    }

    const startCoords = cities[startCity];
    const endCoords = cities[endCity];

    // Supprimer les couches existantes si elles existent
    if (map.getLayer("route")) {
        map.removeLayer("route");
        map.removeSource("route");
    }

    // Utiliser l'API Directions de Mapbox pour obtenir l'itinéraire
    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/cycling/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?geometries=geojson&access_token=${mapboxApiKey}`;

    fetch(directionsUrl)
        .then(response => response.json())
        .then(data => {
            const route = data.routes[0].geometry;

            // Ajouter une source pour la ligne
            map.addSource("route", {
                type: "geojson",
                data: {
                    type: "Feature",
                    geometry: route
                }
            });

            // Ajouter la couche pour tracer la ligne
            map.addLayer({
                id: "route",
                type: "line",
                source: "route",
                layout: {},
                paint: {
                    "line-color": "#4d3adc", // Couleur de la ligne
                    "line-width": 4 // Épaisseur de la ligne
                }
            });

            // Centrer et ajuster le zoom sur l'itinéraire
            const bounds = new mapboxgl.LngLatBounds();
            route.coordinates.forEach(coord => bounds.extend(coord));
            map.fitBounds(bounds, { padding: 50 });

            // Afficher uniquement les marqueurs des villes sélectionnées
            Object.values(markers).forEach(marker => marker.remove());
            markers[startCity].addTo(map);
            markers[endCity].addTo(map);

            // Calculer la distance et la durée à partir des données de l'itinéraire
            const distance = data.routes[0].distance / 1000;
            const duration = (distance / 15).toFixed(2);

            document.getElementById("route-info").style.display = "flex";

            document.getElementById("trajet-info").textContent = `De ${startCity} vers ${endCity} 🏁`;

            // Afficher les informations de distance et de durée
            document.getElementById("distance-info").textContent = `${distance.toFixed(2)} km`;
            const hours = Math.floor(duration);
            const minutes = Math.round((duration - hours) * 60);
            document.getElementById("duration-info").textContent = `${hours}H${minutes}`;

            document.getElementById("co2-info").textContent = `Soit l'équivalent de ${(distance * 0.02).toFixed(2)}kg de CO2 économisés :)`;
        })
        .catch(error => console.error('Erreur lors de la récupération de l\'itinéraire:', error));
}

// Écouteur pour le bouton
document.getElementById("show-route-button").addEventListener("click", showRoute);