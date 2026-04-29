
/* ========================= */
/* 🔗 ELEMENTOS DEL DOM */
/* ========================= */

const form = document.querySelector(".search-box");
const input = document.querySelector("#cityInput");

const cityName = document.querySelector(".weather-card h2");
const temperature = document.querySelector(".temperature");
const status = document.querySelector(".status");

const detailValues = document.querySelectorAll(".detail p");

const weatherIcon = document.querySelector(".weather-icon");

const forecastCards = document.querySelector(".forecast-grid");



/* ========================= */
/* 🌤 ICONOS CLIMA */
/* ========================= */

function getIcon(code){

if(code === 0) return "☀";
if(code <= 3) return "☁";
if(code <= 48) return "🌫";
if(code <= 67) return "🌧";
if(code <= 77) return "❄";
if(code <= 82) return "🌦";
if(code <= 86) return "❄";
if(code >= 95) return "⛈";

return "🌤";
}



/* ========================= */
/* 🌍 GEOCODING */
/* ========================= */

async function getCoordinates(city){

const url =
`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=es&format=json`;

const res = await fetch(url);
const data = await res.json();

if(!data.results){
throw new Error("Ciudad no encontrada");
}

return {
lat: data.results[0].latitude,
lon: data.results[0].longitude,
name: data.results[0].name
};

}



/* ========================= */
/* 🌡 CLIMA PRINCIPAL */
/* ========================= */

async function getWeather(city){

try{

const location = await getCoordinates(city);


/* 🔥 API OPEN-METEO */
const url =
`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Europe/Madrid`;

const res = await fetch(url);
const data = await res.json();



/* ========================= */
/* 🖥 UI CLIMA ACTUAL */
/* ========================= */

cityName.textContent = location.name;

temperature.textContent =
Math.round(data.current_weather.temperature) + "°";

weatherIcon.textContent =
getIcon(data.current_weather.weathercode);

status.textContent = "Clima actual";



/* ========================= */
/* 📊 DETALLES */
/* ========================= */

/* humedad no disponible en este endpoint */
detailValues[0].textContent = "--%";

/* viento */
detailValues[1].textContent =
Math.round(data.current_weather.windspeed) + " km/h";

/* sensación (aproximada) */
detailValues[2].textContent =
Math.round(data.current_weather.temperature) + "°";



/* ========================= */
/* 📅 FORECAST 6 DÍAS */
/* ========================= */

forecastCards.innerHTML = "";

const days = data.daily.time.slice(0,6);

days.forEach((day, i) => {

const date = new Date(day);

const name = date.toLocaleDateString("es-ES", {
weekday:"short"
});

forecastCards.innerHTML += `
<div class="day-card">
<p>${name}</p>
<span>${getIcon(data.daily.weathercode[i])}</span>
<strong>${Math.round(data.daily.temperature_2m_max[i])}°</strong>
</div>
`;

});



}

catch(err){

console.log(err);
status.textContent = err.message;

}

}



/* ========================= */
/* 🔎 BUSCADOR */
/* ========================= */

form.addEventListener("submit",(e)=>{

e.preventDefault();

const city = input.value.trim();

if(city){
getWeather(city);
input.value = "";
}

});



/* ========================= */
/* 🚀 INICIO APP */
/* ========================= */

getWeather("Oviedo");



/* ========================= */
/* 📱 PWA - SERVICE WORKER */
/* ========================= */

if("serviceWorker" in navigator){

window.addEventListener("load", () => {

navigator.serviceWorker.register("./sw.js")
.then(() => {
console.log("✅ Service Worker registrado");
})
.catch(err => {
console.log("❌ Error SW:", err);
});

});

}