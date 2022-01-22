const form = document.getElementById('form-search');
const cityInputElement = document.getElementById('city-input');
const loaderContainer = document.querySelector('.loader');
const resultsContainer = document.querySelector('.results-container');
const errorContainer = document.querySelector('.error-container');

const datetimeText = document.getElementById('datetime');
const locationText = document.getElementById('location');
const temperatureText = document.getElementById('temperature');
const weatherText = document.getElementById('weather-main');
const weatherImage = document.getElementById('weather-icon');
const descriptionText = document.getElementById('description');
const humidityText = document.getElementById('humidity');
const windText = document.getElementById('wind');
const visibilityText = document.getElementById('visibility');

// API details
const apiKey = 'e3c76a146e33202f763c9aa54ab83577'
let apiResult = {};

// Show results container and hide others
function showResults() {
    resultsContainer.classList.remove('hidden');
    errorContainer.classList.add('hidden');
    loaderContainer.classList.add('hidden');
}

// Show error container and hide others
function showError() {
    resultsContainer.classList.add('hidden');
    errorContainer.classList.remove('hidden');
    loaderContainer.classList.add('hidden');
}

// Make API call to OpenWeather
async function getWeather() {

    // Hide existing results and show loader
    resultsContainer.classList.add('hidden');
    loaderContainer.classList.remove('hidden');

    // Make API call
    const cityName = form.city.value
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&mode=JSON&units=metric`
    console.log(apiUrl);

    try {
        const apiResponse = await fetch(apiUrl);
        apiResult = await apiResponse.json();
        console.log(apiResult);

        // If we get a successful response code
        if (apiResponse.status >= 200 && apiResponse.status <= 299) {

            // Set properties with formatting as applicable
            datetimeText.textContent = new Date().toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" })
            locationText.textContent = apiResult.name + ', ' + apiResult.sys.country;
            temperatureText.textContent = Math.round(apiResult.main.temp) + '°C / ' + Math.round(apiResult.main.temp + 273.15) + 'K'
            weatherText.textContent = apiResult.weather[0].main;
            
            const iconName = apiResult.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${iconName}@4x.png`;
            weatherImage.src = iconUrl;

            const descriptionString = apiResult.weather[0].description + '.';
            descriptionText.textContent = 'Feels like ' + Math.round(apiResult.main.feels_like) + '°C. ' + descriptionString.charAt(0).toUpperCase() + descriptionString.substring(1);
            humidityText.textContent = 'Humidity: ' + apiResult.main.humidity + '%';
            windText.textContent = 'Wind Speed: ' + parseFloat(apiResult.wind.speed).toFixed(1) + 'm/s';
            visibilityText.textContent = 'Visibility: ' + (apiResult.visibility / 1000) + 'km';;

            // Show results container
            showResults();

        } else {
            // Handle errors returned from API
            showError();
            console.log(apiResponse.status, apiResponse.statusText);
        }

    } catch (error) {
        // Handle errors if API fails completely
        console.log(error);
    }
}

// Process Submit event
function processForm(event) {
    // Prevent reloading of page / submission to server
    event.preventDefault();

    // Make API call
    getWeather();
}

// Event Listeners
form.addEventListener('submit', processForm)