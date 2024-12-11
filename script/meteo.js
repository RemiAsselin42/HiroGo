import CONFIG from '../config.js';
document.addEventListener('DOMContentLoaded', function () {
    const weatherApiKey = CONFIG.WEATHER_API_KEY;

    const defaultCity = 'Saint-Etienne';
    const forecastContainer = document.getElementById('forecast');
    const cityInput = document.getElementById('city');
    const updateButton = document.getElementById('update-weather');

    function fetchWeather(city) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${weatherApiKey}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                forecastContainer.innerHTML = '';
                const dailyData = getDailyData(data.list);
                dailyData.forEach(day => {
                    const date = new Date(day.dt * 1000);
                    const dayLetter = getDayLetter(date);
                    const icon = getWeatherIcon(day.weather[0].main);
                    const windDirection = day.wind.deg;
                    const temperature = day.main.temp.toFixed(1); // Arrondir à une décimale
                    const windSpeed = (day.wind.speed * 3.6).toFixed(1); // Convertir en km/h et arrondir à une décimale
                    const forecastDay = document.createElement('div');
                    forecastDay.className = 'forecast-day';
                    forecastDay.innerHTML = `
                        <span class="day-letter">${dayLetter}</span>
                        <div class="forecast-day-div">
                            <i class="fas ${icon}"></i>
                            <div class="forecast-content">
                                <p>${temperature}°C</p>
                                <p>${windSpeed} km/h</p>
                                <i class="fa-solid fa-location-arrow wind-direction" style="transform: rotate(${windDirection}deg);"></i>
                            </div>
                        </div>
                    `;
                    forecastContainer.appendChild(forecastDay);
                });
            })
            .catch(error => console.error('Erreur:', error));
    }

    function getWeatherIcon(weather) {
        switch (weather) {
            case 'Clear':
                return 'fa-sun';
            case 'Clouds':
                return 'fa-cloud';
            case 'Rain':
                return 'fa-cloud-showers-heavy';
            case 'Snow':
                return 'fa-snowflake';
            case 'Thunderstorm':
                return 'fa-bolt';
            case 'Drizzle':
                return 'fa-cloud-rain';
            default:
                return 'fa-smog';
        }
    }

    function getDayLetter(date) {
        const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
        return days[date.getDay()];
    }

    function getDailyData(list) {
        const dailyData = [];
        const dates = new Set();
        list.forEach(item => {
            const date = new Date(item.dt * 1000).toLocaleDateString();
            if (!dates.has(date)) {
                dates.add(date);
                dailyData.push(item);
            }
        });
        return dailyData;
    }

    fetchWeather(defaultCity);

    updateButton.addEventListener('click', function () {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        }
    });
});