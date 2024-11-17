const apiKey = "ca07f4eaee94906a3603a5dedb04ac69"; // Your API Key
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('city');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const weatherIcon = document.getElementById('weatherIcon');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        alert("Please enter a city name.");
    }
});

function fetchWeather(city) {
    const encodedCity = encodeURIComponent(city);
    const apiURLGlobal = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${apiKey}&units=metric`;
    const apiURLIndia = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity},IN&appid=${apiKey}&units=metric`;

    console.log(`Fetching weather data for: ${encodedCity}`);

    // First, try the global query
    fetch(apiURLGlobal)
        .then(response => {
            if (!response.ok) {
                throw new Error('Global query failed. Response not OK');
            }
            return response.json();
        })
        .then(data => {
            console.log("Global API response:", data);
            if (data.cod === 200) {
                displayWeather(data);
            } else {
                console.log("Global query failed, trying India-specific query.");
                fetch(apiURLIndia)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('India-specific query failed. Response not OK');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log("India-specific API response:", data);
                        if (data.cod === 200) {
                            displayWeather(data);
                        } else {
                            alert("City not found. Please try again.");
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching India-specific data:", error);
                        alert("Error fetching weather data. Please try again.");
                    });
            }
        })
        .catch(error => {
            console.error("Error fetching global data:", error);
            console.log("Attempting India-specific query...");
            fetch(apiURLIndia)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('India-specific query failed. Response not OK');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("India-specific API response:", data);
                    if (data.cod === 200) {
                        displayWeather(data);
                    } else {
                        alert("City not found. Please try again.");
                    }
                })
                .catch(error => {
                    console.error("Error fetching India-specific data:", error);
                    alert("Error fetching weather data. Please try again.");
                });
        });
}

function displayWeather(data) {
    console.log("Displaying weather data:", data); // Log the weather data to see if it's correct

    cityName.textContent = `${data.name}, ${data.sys.country}`; // Show city and country
    temperature.textContent = `Temperature: ${data.main.temp}°C`;
    description.textContent = data.weather[0].description;

    const iconCode = data.weather[0].icon;
    weatherIcon.className = `fas fa-cloud-sun`; // Default icon

    if (iconCode.includes('01')) {
        weatherIcon.className = `fas fa-sun`; // Clear sky
    } else if (iconCode.includes('02')) {
        weatherIcon.className = `fas fa-cloud-sun`; // Few clouds
    } else if (iconCode.includes('03') || iconCode.includes('04')) {
        weatherIcon.className = `fas fa-cloud`; // Scattered or broken clouds
    } else if (iconCode.includes('09') || iconCode.includes('10')) {
        weatherIcon.className = `fas fa-cloud-showers-heavy`; // Rain
    } else if (iconCode.includes('11')) {
        weatherIcon.className = `fas fa-bolt`; // Thunderstorm
    } else if (iconCode.includes('13')) {
        weatherIcon.className = `fas fa-snowflake`; // Snow
    } else if (iconCode.includes('50')) {
        weatherIcon.className = `fas fa-smog`; // Mist
    } else {
        weatherIcon.className = `fas fa-question-circle`; // Fallback icon if no match
    }
}
