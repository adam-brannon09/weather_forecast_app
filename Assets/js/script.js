//API Elements
var apiKey = '202feb99a1218137bb0b3c379ff2a746';
//Page Elements
var citySearchEl = document.querySelector('#city-search'); //user input
var searchBtnEl = document.querySelector('#search-btn');
var clearBtnEl = document.querySelector('#clear-btn');
var prevSearchEl = document.querySelector('#prev-search-container');//list of previous searches
var currentForecastEl = document.querySelector('#current-forecast-container');
var searchHistory = JSON.parse(localStorage.getItem("city")) || [];
var cityButton = document.querySelector('#prev-search')
var city = citySearchEl.value;
var fiveDayForecastEl = document.querySelector('#five-day-container');
//Global Variables
var lat;
var lon;
//Dayjs to display the current date
var date = dayjs().format('MMM D, YYYY');


function cityToCoordinates(city) {
    var coordinates = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city  + '&limit=1&appid=' + apiKey;
    fetch(coordinates)
        .then(response => {
            if (response.ok) {
                console.log(response);
                response.json().then(data => {
                    console.log(data);
                    var tempLat = data[0].lat;
                    lat = tempLat.toFixed(2);
                    var tempLon = data[0].lon;
                    lon = tempLon.toFixed(2);
                    getWeather(city);
                    getForecast();
                });
            } else {
                alert(`Error: ${response.statusText}`);
            }
        })
        .catch(err => {
            console.log(error.message);
        });
    
}

//Get the weather data from OpenWeather API
function getWeather(city) {
    var weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + apiKey;
    fetch(weatherUrl)
        .then(response => {
            if (response.ok) {
                console.log(response + 'getWeather()');
                return response.json().then(data => {
                    console.log(data);
                    
                    var temp = data.list[0].main.temp;
                    var wind = data.list[0].wind.speed;
                    var humidity = data.list[0].main.humidity;
                    var iconCode = data.list[0].weather[0].icon;
                    var icon = 'https://openweathermap.org/img/wn/' + iconCode + '@2x.png';
                    
                    // Clear HTML from the Current Forecast element
                    currentForecastEl.innerHTML = '';
                    //Call function to retrieve data to display
                    displayWeather(temp, wind, humidity, icon, city);
                    displaySearchHistory()
                });

            } else {
                alert(`Error: ${response.statusText}`);
            }
        })
        .catch(error => {
            console.log(error.message);
            
        });

}

// Display Current Forecast 
function displayWeather(temp, wind, humidity, icon, city) {
    currentForecastEl.innerHTML = `
         <h4>${city.toUpperCase()}</h4>
         <h3>${date}</h3>
         <img id="img1" src="${icon}" alt="" />
         <p>Temperature: ${temp} °F </p>
         <p>Wind Speed: ${wind} MPH</p>
         <p>Humidity: ${humidity} % </p>
    `;

}
//Get the 5 day forecast data
function getForecast() {
    var weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + apiKey;
    //Call the API
    fetch(weatherUrl)
        .then(response => {
            if (response.ok) {
                console.log(response);
                response.json().then(data => {
                    console.log(data);
                    // Clear HTML from the Current Forecast element
                    fiveDayForecastEl.innerHTML = '';

                    for (var i = 1; i < 6; i++) {
                        var temp = data.list[i].main.temp;
                        var wind = data.list[i].wind.speed;
                        var humidity = data.list[i].main.humidity;
                        var iconCode = data.list[i].weather[0].icon;
                        var icon = 'https://openweathermap.org/img/wn/' + iconCode + '@2x.png';
                        
                    
                        displayForecast(temp, wind, humidity, icon, i);
                    }

                });

            } else {
                alert(`Error: ${response.statusText}`);
            }
        })
        .catch(error => {
            console.log(error.message);
        });
}
//Display the 5 day forecast
function displayForecast(temp, wind, humidity, icon, i) {
    //Retrieve date from Day JS
    var forecastDate = dayjs().add(i, 'day').format('MMM D, YYYY');
    var forecastHtml = `
    <div class="card col l2 blue darken-1">
        <div id="card${i + 1}" class="card-content white-text">
            <span id="card-date${i + 1}" class="card-title">${forecastDate}</span>
            <img id="img${i + 1}" src="${icon}" alt="" />
            <p id="card${i + 1}-temp">${temp} °F</p>
            <p id="card${i + 1}-wind">${wind} MPH</p>
            <p id="card${i + 1}-humid">${humidity} %</p>
        </div>
    </div>
    `
    fiveDayForecastEl.innerHTML += forecastHtml;

}

//   //Function to display the buttons with the search history 
   function displaySearchHistory() {
      // Code to clear all the html from the element
       var prevCity = JSON.parse(localStorage.getItem("city")) || [];
       prevSearchEl.innerHTML =''
    //   var prevCity = localStorage.getItem('city');
      // Iteration to create the whole array of search history, limited to 5 so that the website won't load too many
       for (var i = 0; i < prevCity.length; i++){
           var cityBtn = `<div class="collection blue"> <a href="#!" id="prev-search" class="collection-item center-align white-text blue">${prevCity[i]}</a></div>`
           prevSearchEl.innerHTML += cityBtn;

        //    prevSearchEl.addEventListener('click', function (event) {
        //      console.log(event.target, "event.target");
        //     })
              
      }
      
} 
displaySearchHistory()





searchBtnEl.addEventListener("click", function (e) {
    e.preventDefault();
    searchHistory = JSON.parse(localStorage.getItem("city")) || [];

    // To get the value from the input the user gives
    var searchVal = citySearchEl.value.trim();
    // Add the most recent search to the beginning of the array
    searchHistory.unshift(searchVal);

    //To save the array to the local storage
    localStorage.setItem("city", JSON.stringify(searchHistory));
    


    // If user doesn't input anything this alert will apply
    if (!searchVal) {
        console.error('You need a search input value!');
        alert('Please enter a city!')
        return;
    }

    
    cityToCoordinates(searchVal);
    displaySearchHistory()
})
//Retrieve a Previous Search
prevSearchEl.addEventListener('click', function (event) {
    console.log(event.target, "event.target");
    cityToCoordinates(event.target.textContent);
   })
// Clear the history.
clearBtnEl.addEventListener('click', function () {
    localStorage.clear();
    prevSearchEl.innerHTML = '';

})