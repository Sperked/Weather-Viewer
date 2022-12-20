const tempFah = "&units=imperial";
let input = $("#userInput");
let localTime = moment().format('L');
let lat = 0;
let lon = 0;
let cityArray = [];
var currentSearches = JSON.parse(localStorage.getItem("searchHistory"));
if (currentSearches) {
    reloadThePage();
} else {
    $("#result-box").attr("style", "display:none");
}
//  Function to Reload the Page
function reloadThePage() {
    $("#errorMessage").attr("style", "display:none");
    $("#result-box").attr("style", "display:block");
    var history = JSON.parse(localStorage.getItem("searchHistory"));
    let cityHistory = history[history.length - 1];
    GetWeather(cityHistory)
    createList(cityHistory)
    $("#userInput").val("");
}
// Local Storage Function 
function handleLocalStorage(userInput) {
    var currentSearches = JSON.parse(localStorage.getItem("searchHistory"));
    if (currentSearches) {
        currentSearches.push(userInput);
        // Local Storage Index to prevent empty information
        if (userInput === "") {
            currentSearches.pop(userInput);
        }
        var strCurrentSearches = JSON.stringify(currentSearches);
        localStorage.setItem("searchHistory", strCurrentSearches);
    } else {
        var cityArray = [userInput];
        var strArray = JSON.stringify(cityArray);
        localStorage.setItem("searchHistory", strArray);
    }
}
// Click function for Search Button
$("#searchBtn").on("click", function (event) {
    event.preventDefault();
    let userInput = input.val();
    if (userInput != "") {
        handleLocalStorage(userInput)
        cityArray.push(userInput);
        // City Array Console Log;
        GetWeather(userInput)
        createList(userInput)
        $("#userInput").val("");
    }
    else {
        $("#errorMessage").attr("style", "display:block");
        $("#errorMessage").html("The Input Cannot Be Empty!");
    }
})
//Function for List 
$("#listBody").on("click", ".cityList", function (event) {
    event.preventDefault();
    cityName = $(this).text();
    GetWeather(cityName);
    handleLocalStorage(cityName)
})
// History List
function createList(userInput) {
    // User Input Console Log

    var newListItem = $("<li>").text(userInput);
    newListItem.addClass("list-group-item cityList");
    $("#listBody").append(newListItem);
}
// Function to grab Weather from City
function GetWeather(city) {
    $("#result-box").attr("style", "display:block");
    let urlCityBase = "https://api.openweathermap.org/data/2.5/weather?appid=b650042e3a82aa70290734a60a8cb3e3&q=" + city + tempFah;
    // City Base Console Log
    $.ajax({
        url: urlCityBase,
        type: "GET",
        success: function (weatherInfo) {
            $(".cityName").html("Location: " + weatherInfo.name + `<img src='https://openweathermap.org/img/w/${weatherInfo.weather[0].icon}.png'>` + "(" + localTime + ")");
            $(".weather").html(" Description : " + weatherInfo.weather[0].description);
            $(".tempature").html("Tempature: " + Math.floor(weatherInfo.main.temp) + "&#8457");
            $(".humidity").html("Humidity: " + JSON.stringify(weatherInfo.main.humidity) + "%");
            $(".wind").html("Wind speed : " + JSON.stringify(weatherInfo.wind.speed) + " m/s");
            lat = weatherInfo.coord.lat;
            lon = weatherInfo.coord.lon;
            // Lat. Console Log   
            // Long. Console Log
            uvIndexCall();
            
            GettingForecast(city)
        }
    });
}
// UVIndex Call
function uvINdexCall() {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/uvi?appid=b650042e3a82aa70290734a60a8cb3e3&lat=" + lat + "&lon=" + lon,
        type: "GET",
        success: function (uvIndexInfo) {
            $(".uvIndex").html(uvIndexInfo.value);
            var uvVal = uvIndexInfo.value;
            if (uvVal < 3) {
                $("#UV").attr("class", "uvIndex badge badge-primary");
            } else if (uvVal > 3 && uvVal < 5) {
                $("#UV").attr("class", "uvIndex badge badge-warning");
            }
            else {
                $("#UV").attr("class", "uvIndex badge badge-danger");

            }
        }
    })
}
//  5 Day Forecast
function GettingForecast(city) {
    let urlForecast = "https://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=b650042e3a82aa70290734a60a8cb3e3&q=";
    $.ajax({
        url: urlForecast + city + tempFah,
        type: "GET",
        success: function (forecastInfo) {
            // Forecast Console Log
            // 1st Day
            $("#date1").html(forecastInfo.list[5].dt_txt.slice(0, 10));
            $("#iconD1").html(`<img src='https://openweathermap.org/img/w/${forecastInfo.list[5].weather[0].icon}.png'>`);
            $("#tempD1").html("Tempature: " + Math.floor(forecastInfo.list[5].main.temp) + "&#8457");
            $("#humD1").html("Humidity: " + JSON.stringify(forecastInfo.list[5].main.humidity) + "%");
            // 2nd Day
            $("#date2").html(forecastInfo.list[12].dt_txt.slice(0, 10));
            $("#iconD2").html(`<img src='https://openweathermap.org/img/w/${forecastInfo.list[8].weather[0].icon}.png'>`);
            $("#tempD2").html("Tempature: " + Math.floor(forecastInfo.list[8].main.temp) + "&#8457");
            $("#humD2").html("Humidity: " + JSON.stringify(forecastInfo.list[8].main.humidity) + "%");
            // 3rd Day
            $("#date3").html(forecastInfo.list[20].dt_txt.slice(0, 10));
            $("#iconD3").html(`<img src='https://openweathermap.org/img/w/${forecastInfo.list[7].weather[0].icon}.png'>`);
            $("#tempD3").html("Tempature: " + Math.floor(forecastInfo.list[15].main.temp) + "&#8457");
            $("#humD3").html("Humidity: " + JSON.stringify(forecastInfo.list[15].main.humidity) + "%");
            // 4th Day
            $("#date4").html(forecastInfo.list[30].dt_txt.slice(0, 10));
            $("#iconD4").html(`<img src='https://openweathermap.org/img/w/${forecastInfo.list[23].weather[0].icon}.png'>`);
            $("#tempD4").html("Tempature: " + Math.floor(forecastInfo.list[23].main.temp) + "&#8457");
            $("#humD4").html("Humidity: " + JSON.stringify(forecastInfo.list[23].main.humidity) + "%");
            // 5th Day
            $("#date5").html(forecastInfo.list[39].dt_txt.slice(0, 10));
            $("#iconD5").html(`<img src='https://openweathermap.org/img/w/${forecastInfo.list[31].weather[0].icon}.png'>`);
            $("#tempD5").html("Tempature: " + Math.floor(forecastInfo.list[31].main.temp) + "&#8457");
            $("#humD5").html("Humidity: " + JSON.stringify(forecastInfo.list[31].main.humidity) + "%");
        }
    })
}
// API calling Current Location
$("#currentBtn").on("click", function () {
    $("#errorMessage").attr("style", "display:none");
    // Style Attribute
    function supportRequest() {
        if (navigator.getLocation) {
            navigator.geolocation.getCurrentPosition(getPosition);
        } else {
            alert("Geolocation is not supported by this browser !");
        }
    }
    function getPosition(success) {
        lat = success.coords.latitude;
        lon = success.coords.longitude;
        CurrentWeather(lat, lon)
    }
    navigator.geolocation.getCurrentPosition(getPosition);
    // Geo Location Console Log
})
function CurrentWeather(lat, lon) {
    $("#result-box").attr("style", "display:block");
    var CurrentUrlBase = "https://api.openweathermap.org/data/2.5/weather?appid=b650042e3a82aa70290734a60a8cb3e3&lat=" + lat + "&lon=" + lon + "&us" + "&units=imperial";
    console.log("current", CurrentUrlBase);
    $.ajax({
        url: CurrentUrlBase,
        type: "GET",
        success: function (weatherInfo) {
            handleLocalStorage(weatherInfo.name);
            $(".cityName").html("Location: " + weatherInfo.name + `<img src='https://openweathermap.org/img/w/${weatherInfo.weather[0].icon}.png'>` + "(" + localTime + ")");
            $(".weather").html(" Description : " + weatherInfo.weather[0].description);
            $(".tempature").html("Tempature: " + Math.floor(weatherInfo.main.temp) + "&#8457");
            $(".humidity").html("Humidity: " + JSON.stringify(weatherInfo.main.humidity) + "%");
            $(".wind").html("Wind speed : " + JSON.stringify(weatherInfo.wind.speed) + " m/s");
            let city = wetherInfo.name
            // City Console Log
            uvIndexCall(lat, lon)
            GettingForecast(city)
            createList(city)
        }
    });
};
