var APIKey = "379f3e88c2d4e573d740243459112fe3";
var city;
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
cityArray = ["New York City", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio"]

if(localStorage.getItem("weather-dashboard-current") === null){
    localStorage.setItem("weather-dashboard-current", cityArray[0]);
}

if(localStorage.getItem("weather-dashboard-shortcuts") === null){
    localStorage.setItem("weather-dashboard-shortcuts", JSON.stringify(cityArray));
}

function addShortcuts(){
    $(".btn-group-vertical").empty();
    for(let i = 0; i < JSON.parse(localStorage.getItem("weather-dashboard-shortcuts")).length; i++){
        $(".btn-group-vertical").append(`<btn id = "city-shortcut-${i}" type="button" class="btn btn-outline-secondary btn-block">${JSON.parse(localStorage.getItem("weather-dashboard-shortcuts"))[i]}</btn>`);
    }
}

function updateShortcuts(string){
    var array = JSON.parse(localStorage.getItem("weather-dashboard-shortcuts"));
    if(array.includes(string)){
        return;
    }else{
        array.pop();
        array.unshift(string);
        localStorage.setItem("weather-dashboard-shortcuts", JSON.stringify(array));
    }
};

function display(){
    city = localStorage.getItem("weather-dashboard-current");
    var locationURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + APIKey;
    fetch(locationURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if(data.length > 0){
                city = data[0].name;
                updateShortcuts(city);
                addShortcuts();
                var lat = data[0].lat
                var lon = data[0].lon
                var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=current,minutely,hourly,alerts&appid=" + APIKey;
                fetch(queryURL)
                    .then(function(response){
                        return response.json();
                    })
                    .then(function (data) {
                        $("#city-header").text(city);
                        for(let i = 0; i < 6; i++){
                            $("#day-" + i + "-logo").empty();
                            if(i == 0){
                                $("#uv-index").text(data.daily[i].uvi);
                                // Add UV Index color based on value
                                if(data.daily[i].uvi <= 3){
                                    $("#uv-index").css("color", "green")
                                }
                                if(data.daily[i].uvi > 3 && data.daily[i].uvi <= 6){
                                    $("#uv-index").css("color", "yellow")
                                }
                                if(data.daily[i].uvi > 6 && data.daily[i].uvi <= 9.5){
                                    $("#uv-index").css("color", "orange")
                                }
                                if(data.daily[i].uvi > 9.5){
                                    $("#uv-index").css("color", "red")
                                }
                                $("#date-" + i).text("(" + moment.unix(data.daily[i].dt).format("MMMM Do YYYY") + ")");
                            }else{
                                $("#date-" + i).text("(" + moment.unix(data.daily[i].dt).format("MM/DD/YYYY") + ")");
                            }
                            $("#day-" + i + "-temp").text(data.daily[i].temp.day + "\u00B0F")
                            // Add logo based on weather
                            if(data.daily[i].weather[0].main == "Clear"){
                                $("#day-" + i + "-logo").append('<i class="fa fa-sun"></i>');
                            }
                            if(data.daily[i].weather[0].main == "Rain"){
                                $("#day-" + i + "-logo").append('<i class="fa fa-cloud-rain"></i>');
                            }
                            if(data.daily[i].weather[0].main == "Clouds"){
                                $("#day-" + i + "-logo").append('<i class="fa fa-cloud"></i>');
                            }

                            $("#day-" + i + "-wind").text(data.daily[i].wind_speed + " MPH")
                            $("#day-" + i + "-humidity").text(data.daily[i].wind_speed + "%")
                        }
                    });
            }else{
                addShortcuts();
                $("#city-header").text("Invalid City");
                for(let i = 0; i < 6; i++){
                    $("#day-" + i + "-logo").empty();
                    if(i == 0){
                        $("#uv-index").text("NA");
                        // Add UV Index color based on value
                    }
                    $("#day-" + i + "-temp").text("NA")
                    // Add logo based on weather
                    $("#day-" + i + "-logo").append('<i class="fa fa-question-circle"></i>');
                    $("#day-" + i + "-wind").text("NA")
                    $("#day-" + i + "-humidity").text("NA")
                }
            }
        });
}

display();

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

