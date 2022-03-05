const cityInputEl = document.querySelector("#city-input")
const fiveDayForecastEl = document.querySelector("#five-day-forecast")
const searchedCitiesEl = document.querySelector("#searched-cities")
const searchFormEl = document.querySelector("#search-form")
const cityWeatherEl = document.querySelector("#city-weather")
let currentSearchContainerEl = document.querySelector("#current-search-sontainer")
let searchedCityArr = []


const today = moment().format("L");
console.log(today);

// Save city to local storage
let saveCity = (citySearch) => {
    localStorage.setItem("searchedCity", JSON.stringify(searchedCityArr));
};

let loadCity = () => {

    searchedCity = localStorage.getItem("searchedCity", searchedCityArr);

    if(!searchedCity) {
        console.log("No city saved to local storage.")
        return false;
    };

    searchedCity = JSON.parse(searchedCity);

    for( let i = 0; i < searchedCity.length; i++) {
        let searchedCityBtn = document.createElement("button");
        searchedCityBtn.classList="searched-btn col-3";
        searchedCityBtn.textContent = searchedCity[i];
        searchedCitiesEl.appendChild(searchedCityBtn);
    };
};

let currentWeather = (city) => {
    let api = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + "451c5c4eda0758c7a53f2fee96ca99f8";

    fetch(api)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                latitude = data.coord.lat;
                longitude = data.coord.lon;
                
                futureWeatherForecast(latitude,longitude);
                currentWeatherCard(data, city);
            });
        } else {
            alert("Error: " + response.statusText)
            console.log(response.statusText);
        };
    });
};

let formHandler = (event) => {
    event.preventDefault();

    let citySearch = cityInputEl.value.trim();

    if (!citySearch) {
        console.log('Please enter the city you would like to search for.')
    } else {
        currentWeather(citySearch);

        cityWeatherEl.innerHTML = "";
        fiveDayForecastEl.innerHTML = "";
        currentSearchContainerEl = "";
        cityInputEl.value = "";

        if(searchedCityArr.indexOf(citySearch) === -1) {
            searchedCityArr.push(citySearch);
            let newCityBttn = document.createElement("button");
            newCityBttn.className= "searched-btn"
            newCityBttn.textContent= citySearch;
            searchedCitiesEl.appendChild(newCityBttn);

            saveCity(citySearch);
        }

    }
}

let futureWeatherForecast = (lat,lon) => {
    let api = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&exclude=minutely,hourly,alerts&appid=451c5c4eda0758c7a53f2fee96ca99f8";

    fetch(api)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {

                futureWeatherCard(data);
            });
        } else {
            console.log(Error)
        }
    })
}

let currentWeatherCard = (data,city) => {

    //currentSearchContainerEl.setAttribute("class", "current-search-container col-9 current-border");

    let header = document.createElement("div");
    header.classList = "current-weather-title"
    header.textContent= city + "( " + today + " )";
    let headerImg = document.createElement("img");
    icon = data.weather[0].icon;
    headerImg.setAttribute("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");
    cityWeatherEl.appendChild(header);
    header.appendChild(headerImg)

    let tempEl = document.createElement("div"); 
    tempEl.classList = "day-info";
    tempEl.textContent = "Temp: " + data.main.temp + " °F"
    cityWeatherEl.appendChild(tempEl)
    
    let windEl = document.createElement("div"); 
    windEl.classList = "day-info";
    windEl.textContent = "Wind: " + data.wind.speed + " MPH";
    cityWeatherEl.appendChild(windEl)
    
    let humidityEl = document.createElement("div"); 
    humidityEl.classList = "day-info";
    humidityEl.textContent = "Humidity: " + data.main.humidity + "%";
    cityWeatherEl.appendChild(humidityEl);

    currentSearchContainerEl.appendChild(cityWeatherEl)


};

let futureWeatherCard = (data) => {

    let fiveDayHeader = document.createElement("div");
    fiveDayHeader.classList = "five-day-header";
    fiveDayHeader.textContent = "Your 5-Day Forecast";
    fiveDayForecastEl.appendChild(fiveDayHeader);

    for (let i = 1; i < 6; i++) {

        let dateTitle = moment().add(i, 'days').format("L")

        let dayCard = document.createElement("div");
        dayCard.classList = "day-card card col-2";
        let dayCardTitle = document.createElement("h4");
        dayCardTitle.textContent = dateTitle;
        dayCard.appendChild(dayCardTitle);

        let dayCardImg = document.createElement("img");
        dayCardImg.classList = "day-icon col-2"
        dayIcon = data.daily[i].weather[0].icon;
        dayCardImg.setAttribute("src", "http://openweathermap.org/img/wn/" + dayIcon + "@2x.png");
        dayCard.appendChild(dayCardImg)

        let tempEl = document.createElement("div");
        tempEl.classList = "day-temp card-text";
        tempEl.textContent = "Temp: " + data.daily[i].temp.day + " °F"
        dayCard.appendChild(tempEl)

        let windEl = document.createElement("div"); 
        windEl.classList = "day-wind card-text";
        windEl.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
        dayCard.appendChild(windEl)

        let humidityEl = document.createElement("div"); 
        humidityEl.classList = "day-humidity card-text";
        humidityEl.textContent = "Humidity: " + data.daily[i].humidity + "%";
        dayCard.appendChild(humidityEl)

    // append container to the dom
    fiveDayForecastEl.appendChild(dayCard);
    }
}

searchFormEl.addEventListener("submit", formHandler);

loadCity();