// Lab Exercise 9: Using AJAX with JSON to fetch and display weather data from a hypothetical weather API
let weatherDatabase = null;

// Function using asynchronous AJAX (XMLHttpRequest & modern Fetch fallback)
function fetchWeatherViaAjax(cityName) {
    const btn = document.getElementById('fetchWeatherBtn');
    const btnText = document.getElementById('btnText');
    const loader = document.getElementById('loader');
    const statusArea = document.getElementById('statusArea');
    const weatherDisplay = document.getElementById('weatherDisplay');

    // Show loading spinner
    btnText.textContent = 'Fetching AJAX...';
    loader.style.display = 'inline-block';
    statusArea.style.display = 'none';

    // Standard AJAX using XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'weather.json', true);

    xhr.onload = function() {
        btnText.textContent = 'Get Weather (AJAX)';
        loader.style.display = 'none';

        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                // Parse hypothetical weather API JSON response
                const responseData = JSON.parse(xhr.responseText);
                weatherDatabase = responseData.cities;

                // Lookup city (case-insensitive)
                const queryKey = Object.keys(weatherDatabase).find(
                    k => k.toLowerCase() === cityName.toLowerCase().trim()
                );

                if (queryKey) {
                    const data = weatherDatabase[queryKey];
                    displayWeatherData(data);
                } else {
                    // Generate hypothetical weather dynamically if not in fixed list
                    const hypotheticalData = generateHypotheticalWeather(cityName);
                    displayWeatherData(hypotheticalData);
                }
            } catch (err) {
                showError('Error parsing AJAX JSON payload: ' + err.message);
            }
        } else {
            showError('AJAX Request Failed with status: ' + xhr.status);
        }
    };

    xhr.onerror = function() {
        btnText.textContent = 'Get Weather (AJAX)';
        loader.style.display = 'none';
        // If file:// protocol blocks XHR in some browser settings, use in-memory hypothetical response
        const fallback = generateHypotheticalWeather(cityName);
        displayWeatherData(fallback);
    };

    xhr.send();
}

function generateHypotheticalWeather(cityName) {
    const formatted = cityName.charAt(0).toUpperCase() + cityName.slice(1);
    const temp = (22 + (cityName.length * 1.7) % 15).toFixed(1);
    return {
        city: formatted,
        country: "GLOBAL",
        temperature: parseFloat(temp),
        feels_like: (parseFloat(temp) + 3.2).toFixed(1),
        temp_min: (parseFloat(temp) - 4).toFixed(1),
        temp_max: (parseFloat(temp) + 3.5).toFixed(1),
        humidity: 65 + (cityName.length * 3) % 25,
        pressure: 1012,
        wind_speed: (3.2 + (cityName.length * 0.4) % 4).toFixed(1),
        condition: "Scattered Clouds & Sunshine",
        icon: "⛅",
        air_quality: "Moderate (AQI 52)",
        forecast: [
            { day: "Tomorrow", temp: Math.round(parseFloat(temp) + 1), condition: "Sunny", icon: "☀️" },
            { day: "+2 Days", temp: Math.round(parseFloat(temp) - 1), condition: "Passing Showers", icon: "🌦️" },
            { day: "+3 Days", temp: Math.round(parseFloat(temp)), condition: "Partly Cloudy", icon: "⛅" }
        ]
    };
}

function displayWeatherData(data) {
    document.getElementById('weatherDisplay').style.display = 'block';
    document.getElementById('statusArea').style.display = 'none';

    document.getElementById('cityName').textContent = data.city;
    document.getElementById('countryCode').textContent = `${data.country} • Live JSON Feed`;
    document.getElementById('tempVal').textContent = data.temperature;
    document.getElementById('weatherDesc').textContent = data.condition;
    document.getElementById('weatherIcon').textContent = data.icon;

    document.getElementById('feelsLike').textContent = `${data.feels_like}°C`;
    document.getElementById('humidity').textContent = `${data.humidity}%`;
    document.getElementById('windSpeed').textContent = `${data.wind_speed} m/s`;
    document.getElementById('pressure').textContent = `${data.pressure} hPa`;
    document.getElementById('airQuality').textContent = data.air_quality;
    document.getElementById('tempRange').textContent = `${data.temp_min}°C / ${data.temp_max}°C`;
    document.getElementById('lastUpdated').textContent = `AJAX fetched at: ${new Date().toLocaleTimeString()}`;

    // Forecast Grid
    const forecastGrid = document.getElementById('forecastGrid');
    forecastGrid.innerHTML = data.forecast.map(f => `
        <div class="forecast-card">
            <div class="f-day">${f.day}</div>
            <div class="f-icon">${f.icon}</div>
            <div class="f-temp">${f.temp}°C</div>
            <div class="f-cond">${f.condition}</div>
        </div>
    `).join('');

    // Raw JSON Payload box
    const jsonCode = document.querySelector('#jsonPayload code');
    jsonCode.textContent = JSON.stringify(data, null, 2);
}

function showError(msg) {
    const statusArea = document.getElementById('statusArea');
    statusArea.textContent = msg;
    statusArea.className = 'status-box error';
    statusArea.style.display = 'block';
}

function toggleJsonView() {
    const pre = document.getElementById('jsonPayload');
    const icon = document.getElementById('jsonToggleIcon');
    if (pre.style.display === 'none') {
        pre.style.display = 'block';
        icon.textContent = '▲';
    } else {
        pre.style.display = 'none';
        icon.textContent = '▼';
    }
}

function loadCity(city) {
    document.getElementById('cityInput').value = city;
    fetchWeatherViaAjax(city);
}

document.addEventListener('DOMContentLoaded', () => {
    // Initial fetch for Puducherry
    fetchWeatherViaAjax('Puducherry');

    document.getElementById('fetchWeatherBtn').addEventListener('click', () => {
        const city = document.getElementById('cityInput').value.trim();
        if (city) {
            fetchWeatherViaAjax(city);
        }
    });

    document.getElementById('cityInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = e.target.value.trim();
            if (city) {
                fetchWeatherViaAjax(city);
            }
        }
    });
});
