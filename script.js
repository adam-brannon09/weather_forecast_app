//API VARIABLES
let weatherApiRootUrl = 'https://api.openweathermap.org';
let weatherApiKey = '';

//Page Elements
let searchBoxEl = document.querySelector('#textarea1');
let searchBtn = document.querySelector('#search_btn');
let todayContainer = document.querySelector('#todays_conditions');
let forecastContainer = document.querySelector('#forecast_container');
let historyContainer = document.querySelector('#history_container');

//Day.js 
let date = dayjs().format('M/DD/YYYY');