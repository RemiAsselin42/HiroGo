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

const markersData = [
    { color: '#bf1209', coordinates: [4.285, 45.652], title: 'Problème de voirie', description: 'Nid de poule sur la route' },
    { color: '#3b2ca9', coordinates: [4.275, 45.425], title: 'Information utilisateur', description: 'Route agréable pour les cyclistes' },
    { color: '#ffd518', coordinates: [4.304, 45.553], title: 'Alerte attention', description: 'Virage dangereux' },
    { color: '#ff4e00', coordinates: [4.348, 45.638], title: 'Lieu à voir', description: 'Château' },
    { color: '#bf1209', coordinates: [4.414, 45.549], title: 'Problème de voirie', description: 'Route en travaux' },
    { color: '#3b2ca9', coordinates: [4.177, 45.883], title: 'Information utilisateur', description: 'Belle vue sur la Loire' },
    { color: '#ffd518', coordinates: [4.158, 45.909], title: 'Alerte attention', description: 'Passage piéton fréquenté' },
    { color: '#ff4e00', coordinates: [4.185, 45.785], title: 'Lieu à voir', description: 'Lac' },
    { color: '#bf1209', coordinates: [4.185, 46.048], title: 'Problème de voirie', description: 'Panneau de signalisation manquant' },
    { color: '#3b2ca9', coordinates: [4.220, 45.745], title: 'Information utilisateur', description: 'Café sympa pour une pause' },
    { color: '#bf1209', coordinates: [4.191, 45.539], title: 'Problème de voirie', description: 'Route glissante' },
    { color: '#3b2ca9', coordinates: [4.525, 45.485], title: 'Information utilisateur', description: 'Chemin tranquille' },
    { color: '#ffd518', coordinates: [4.585, 45.514], title: 'Alerte attention', description: 'Travaux en cours' },
    { color: '#ff4e00', coordinates: [4.335, 45.310], title: 'Lieu à voir', description: 'Cascade' }
];

markersData.forEach(markerData => {
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundColor = markerData.color;
    el.style.width = '10px';
    el.style.height = '10px';
    el.style.borderRadius = '50%';


    new mapboxgl.Marker(el)
        .setLngLat(markerData.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 10 }).setHTML(`<span style="color: black;">${markerData.title}: ${markerData.description}</span>`))
        .addTo(map);
});


// Variable pour stocker les villes et les marqueurs
let cities = {};
let markers = {};

const overpassUrl = 'https://overpass-api.de/api/interpreter';
const query = `
[out:json];
area["name"="Loire"]["admin_level"="6"]->.searchArea;
(
  node["place"="city"](area.searchArea);
  node["place"="town"](area.searchArea);
  node["place"="village"](area.searchArea);
);
out body;
`;

fetch(overpassUrl, {
    method: 'POST',
    body: query,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})
    .then(response => response.json())
    .then(data => {
        data.elements.forEach(element => {
            const city = {
                name: toTitleCase(element.tags.name),
                latitude: element.lat,
                longitude: element.lon
            };
            cities[city.name] = [city.longitude, city.latitude];
            const marker = new mapboxgl.Marker()
                .setLngLat([city.longitude, city.latitude])
                .setPopup(new mapboxgl.Popup().setText(city.name));
            markers[city.name] = marker;
        });

        // Initialiser l'autocomplete après le chargement des villes
        initializeAutocomplete();
    })
    .catch(error => console.error('Erreur lors du chargement des villes:', error));

// Fonction pour initialiser l'autocomplete
function initializeAutocomplete() {
    const cityNames = Object.keys(cities);
    const startInput = document.getElementById("start");
    const endInput = document.getElementById("end");

    startInput.addEventListener("input", () => autocomplete(startInput, cityNames));
    endInput.addEventListener("input", () => autocomplete(endInput, cityNames));
}

function autocomplete(input, cityNames) {
    let currentFocus;
    input.addEventListener("input", function () {
        let list, item, val = this.value;
        closeAllLists();
        if (val.length < 3) return false;
        currentFocus = -1;
        list = document.createElement("DIV");
        list.setAttribute("id", this.id + "autocomplete-list");
        list.setAttribute("class", "autocomplete-items");
        list.style.position = "absolute";
        if (this.id === "start") {
            list.style.bottom = `${this.offsetTop + this.offsetHeight + 58}px`; // Adjusted to display from bottom to top for start input
        } else if (this.id === "end") {
            list.style.bottom = `${this.offsetTop + this.offsetHeight - 95}px`; // Adjusted to display from bottom to top for end input
        }
        list.style.left = `${this.offsetLeft}px`;
        list.style.width = `${this.offsetWidth}px`;
        this.parentNode.appendChild(list);
        let count = 0;
        cityNames.forEach(city => {
            if (city.substr(0, val.length).toUpperCase() == val.toUpperCase() && count < 3) {
                item = document.createElement("DIV");
                item.innerHTML = "<strong>" + city.substr(0, val.length) + "</strong>";
                item.innerHTML += city.substr(val.length);
                item.innerHTML += "<input type='hidden' value='" + city + "'>";
                item.addEventListener("click", function () {
                    input.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                list.appendChild(item);
                count++;
            }
        });
    });

    input.addEventListener("keydown", function (e) {
        let x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        const items = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < items.length; i++) {
            if (elmnt != items[i] && elmnt != input) {
                items[i].parentNode.removeChild(items[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

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
            let minutes = Math.round((duration - hours) * 60);
            if (minutes < 10) minutes = '0' + minutes;
            document.getElementById("duration-info").textContent = `${hours}h${minutes}`;

            document.getElementById("co2-info").textContent = `Soit ${(distance * 0.2).toFixed(2)}kg de CO2 économisés 🌿`;
        })
        .catch(error => console.error('Erreur lors de la récupération de l\'itinéraire:', error));
}

function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Écouteur pour le bouton
document.getElementById("show-route-button").addEventListener("click", showRoute);