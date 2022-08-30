function currentTime() {
  let h5 = document.querySelector("h5");
  let now = new Date();
  let weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let weekday = weekDays[now.getDay()];
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  } else {
    hours = `${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  h5.innerHTML = `${weekday} ${hours}:${minutes}`;
}

currentTime();

function search(city) {
  let apiKey = "8bf13fea7fc7416d4df009d0ae146aff";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

function searchForCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city").value;
  search(city);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", searchForCity);

function getForecast(coordinates) {
  let apiKey = "8bf13fea7fc7416d4df009d0ae146aff";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showWeather(response) {
  let city = document.querySelector("h1");
  city.innerHTML = response.data.name;
  let degrees = document.querySelector("#temp");
  celsiusTemperature = response.data.main.temp;
  degrees.innerHTML = Math.round(celsiusTemperature);
  let sky = document.querySelector("h4");
  sky.innerHTML = response.data.weather[0].description;
  let humidityWind = document.querySelector("h6");
  humidityWind.innerHTML = `Humidity: ${
    response.data.main.humidity
  }% </br> Wind: ${Math.round(response.data.wind.speed)} km/h`;
  let picture = document.querySelector("#icon");
  picture.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  getForecast(response.data.coord);
}

function findCurrentPlace(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey2 = "8bf13fea7fc7416d4df009d0ae146aff";
  let apiUrl2 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey2}&units=metric`;
  axios.get(apiUrl2).then(showWeather);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(findCurrentPlace);
}

let placeButton = document.querySelector("#place");
placeButton.addEventListener("click", getCurrentPosition);

function showFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temp");
  let temperature = celsiusTemperature;
  temperature = Number(temperature);
  temperatureElement.innerHTML = Math.round((temperature * 9) / 5 + 32);
  Cbutton.classList.remove("active");
  Fbutton.classList.add("active");
}

function showCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  Fbutton.classList.remove("active");
  Cbutton.classList.add("active");
}

let celsiusTemperature = null;

let Fbutton = document.querySelector("#Fahrenheit");
Fbutton.addEventListener("click", showFahrenheit);

let Cbutton = document.querySelector("#Celsius");
Cbutton.addEventListener("click", showCelsius);

function formatDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<ul>`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 7 && index > 0) {
      forecastHTML =
        forecastHTML +
        `<li>${formatDate(
          forecastDay.dt
        )}  <img src="http://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png" class="forecastIcon">   ${Math.round(
          forecastDay.temp.max
        )} &#176C</li>`;
    }
  });
  forecastHTML = forecastHTML + `</ul>`;
  forecastElement.innerHTML = forecastHTML;
}

search("New York");
