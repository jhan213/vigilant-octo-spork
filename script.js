// Open Weather API key
var APIKey = "379f3e88c2d4e573d740243459112fe3";
var city;
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

// default cities
var cityArray = ["Los Angeles", "Illinois", "Santa Barbara", "Las Vegas", "Seattle", "San Francisco", "Washington"];

// if user is a first time user (local storage is empty), create a local storage object and set a current city to display
if(localStorage.getItem("weather-dashboard-current") === null){
    localStorage.setItem("weather-dashboard-current", cityArray[0]);
}

// create local storage object for shortcut links to recently searched cities
if(localStorage.getItem("weather-dashboard-shortcuts") === null){
    localStorage.setItem("weather-dashboard-shortcuts", JSON.stringify(cityArray));
}

// function to display the shortcuts from the localStorage object
function addShortcuts(){
    $(".btn-group-vertical").empty();
    for(let i = 0; i < JSON.parse(localStorage.getItem("weather-dashboard-shortcuts")).length; i++){
        $(".btn-group-vertical").append(`<btn id = "city-shortcut-${i}" type="button" class="btn btn-primary btn-block">${JSON.parse(localStorage.getItem("weather-dashboard-shortcuts"))[i]}</btn>`);
    }
}

// function to update shortcuts after a user searches a city
function updateShortcuts(string){
    var array = JSON.parse(localStorage.getItem("weather-dashboard-shortcuts"));
    if(array.includes(string)){
        // does nothing if city is already in the search history
        return;
    }else{
        array.pop();
        array.unshift(string);
        localStorage.setItem("weather-dashboard-shortcuts", JSON.stringify(array));
    }
};

// function to display the weather data
function display(){
    city = localStorage.getItem("weather-dashboard-current");
    var locationURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + APIKey;
    // API call 
    fetch(locationURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if(data.length > 0){
                city = data[0].name;
                console.log(data); // console log location data from API call
                updateShortcuts(city);
                addShortcuts();
                var lat = data[0].lat;
                var lon = data[0].lon;
                var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=current,minutely,hourly,alerts&appid=" + APIKey;
                fetch(queryURL)
                    .then(function(response){
                        return response.json();
                    })
                    // display weather info such as temperature, wind speed, humidity, and UV using data from fetch request
                    // (updates HTML)
                    .then(function (data) {
                        console.log(data); // console log weather data from API call
                        $("#city-header").text(city);
                        // display weather info for six days (current day + next 5 days)
                        for(let i = 0; i < 6; i++){
                            $("#day-" + i + "-logo").empty();
                            // display data for UV index (for only current day) and date
                            if(i == 0){
                                $("#uv-index").text(data.daily[i].uvi);
                                if(data.daily[i].uvi <= 3){
                                    $("#uv-index").css("color", "green")
                                }
                                if(data.daily[i].uvi > 3 && data.daily[i].uvi <= 6){
                                    $("#uv-index").css("color", "#FFC300")
                                }
                                if(data.daily[i].uvi > 6 && data.daily[i].uvi <= 9.5){
                                    $("#uv-index").css("color", "orange")
                                }
                                if(data.daily[i].uvi > 9.5){
                                    $("#uv-index").css("color", "red")
                                }
                                $("#date-" + i).text(moment.unix(data.daily[i].dt).format("MMMM Do YYYY"));
                            }else{
                                $("#date-" + i).text(moment.unix(data.daily[i].dt).format("MM/DD/YYYY"));
                            }
                            
                            // display weather icon based on API data
                            switch (data.daily[i].weather[0].main){
                                case "Clear":
                                    $("#day-" + i + "-logo").append('<i class="fa fa-sun"></i>');
                                    break;
                                case "Rain":
                                    $("#day-" + i + "-logo").append('<i class="fa fa-cloud-rain"></i>');
                                    break;
                                case "Clouds":
                                    $("#day-" + i + "-logo").append('<i class="fa fa-cloud"></i>');
                                    break;
                            }

                            // display other data such as temperature, wind speed, and humidity
                            $("#day-" + i + "-temp").text(data.daily[i].temp.day + "\u00B0F");
                            $("#day-" + i + "-wind").text(data.daily[i].wind_speed + " MPH")
                            $("#day-" + i + "-humidity").text(data.daily[i].humidity + "%")
                        }
                    });
            }else{
                // if location inputted does not return a valid city, change all values to NA
                addShortcuts();
                $("#city-header").text("Invalid City");
                for(let i = 0; i < 6; i++){
                    $("#day-" + i + "-logo").empty();
                    if(i == 0){
                        $("#uv-index").text("NA");
                    }
                    $("#day-" + i + "-temp").text("NA")
                    $("#day-" + i + "-logo").append('<i class="fa fa-question-circle"></i>');
                    $("#day-" + i + "-wind").text("NA")
                    $("#day-" + i + "-humidity").text("NA")
                }
            }
        });
}

display();

// when a shortcut city is clicked, set weather-dashboard-current localStorage item to the city
// and display weather data for that city
$(".btn-group-vertical").on("click", "#city-shortcut-0", function(){
    localStorage.setItem("weather-dashboard-current", $(`#city-shortcut-0`).text());
    display();
});
$(".btn-group-vertical").on("click", "#city-shortcut-1", function(){
    localStorage.setItem("weather-dashboard-current", $(`#city-shortcut-1`).text());
    display();
});
$(".btn-group-vertical").on("click", "#city-shortcut-2", function(){
    localStorage.setItem("weather-dashboard-current", $(`#city-shortcut-2`).text());
    display();
});
$(".btn-group-vertical").on("click", "#city-shortcut-3", function(){
    localStorage.setItem("weather-dashboard-current", $(`#city-shortcut-3`).text());
    display();
});
$(".btn-group-vertical").on("click", "#city-shortcut-4", function(){
    localStorage.setItem("weather-dashboard-current", $(`#city-shortcut-4`).text());
    display();
});
$(".btn-group-vertical").on("click", "#city-shortcut-5", function(){
    localStorage.setItem("weather-dashboard-current", $(`#city-shortcut-5`).text());
    display();
});
$(".btn-group-vertical").on("click", "#city-shortcut-6", function(){
    localStorage.setItem("weather-dashboard-current", $(`#city-shortcut-6`).text());
    display();
});

$("#search-btn").on("click", function(){
    localStorage.setItem("weather-dashboard-current", $("input").val());
    display();
});


