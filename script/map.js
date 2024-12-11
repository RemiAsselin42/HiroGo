import CONFIG from '../config.js';
const mapboxApiKey = CONFIG.MAPBOX_API_KEY;

mapboxgl.accessToken = `${mapboxApiKey}`;
var map = new mapboxgl.Map({
    container: "map",
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [4.216149, 45.584764],
    zoom: 8,
});

// Ajouter les contrôles de zoom
map.addControl(new mapboxgl.NavigationControl(), 'top-right');