

$(document).ready(function() { 
    
    $("#country").change(function() {
        if($("#country :selected").val() != "" ) {
            const country = $("#country :selected").val();
            $("#city").load(country + "-cities.html");
            $("#city").removeClass("hidden");
        } else {
            $("#city").addClass("hidden");
            $("#display").html("");
        }
    });

        $.ajax({
            url: "./api.json",
            type: "GET",
            dataType: "json",
            success: function(response) {
                const weatherKey = response.ApiId; 
               
                $("#city").change(function() {
                    if($("#city :selected").val() != "" ) {
                        const city = $("#city :selected").val();
                        let currentCity = "";
                        const weatherApi = `https://api.openweathermap.org/data/2.5/weather?id=${city}&units=metric&appid=${weatherKey}`;
                        console.log(weatherKey + "inside");
                        const imgSrc = "https://openweathermap.org/img/wn/";
                        $.ajax({
                            url: weatherApi,
                            type: "GET",
                            dataType: "json",
                            success: function(data) {
                                $("#display").html("");
                                const celsius  = Math.round(data.main.temp);
                                const fahrenheit = Math.round((data.main.temp * 9/5) + 32);
                                const speedMph = Math.round(data.wind.speed * 2.237);
                                const speedKmh = Math.round(data.wind.speed * 3.6);
                                const direction = typeof data.wind.deg == "undefined" ? "Currently Unavailable" : data.wind.deg + "&#176; | " + windDir(data.wind.deg);
            
                                currentCity = `
                                <div class="alert">${severeTemp(celsius)}</div>
                                <div class="result">
                                <div class="card_top"><h2>${data.name}</h2>
                                <img src="${imgSrc}${data.weather[0].icon}@2x.png" alt="weather icon"/>
                                <h3>${celsius}&#8451;</h3><p>${fahrenheit}&#8457;</p></div>
                                <div class="card_bottom"><p><span>Date:</span> ${getDate(data.dt)}</p>
                                <p><span>Condition:</span> ${data.weather[0].description}</p>
                                <p><span>Wind Speed:</span> ${speedMph}mph | ${speedKmh}kmh</p>
                                <p><span>Wind Direction:</span> ${direction}</p></div>
                                </div>
                                <div class="warning">${severeWind(speedMph)}</div>`;
                                $("#display").append(currentCity);
                            },
                            error: function(xhr, error) {
                                $("#display").html("");
                                $('#display').append(`<div id="error"><h2>${error}</h2><p>${xhr.status}: Thats an error, please try again later</p></div>`);
                            }
                        });
                    } else {
                        $("#display").html("");
                    }
                });
            
                const windDir = (degree) => {
                    let result = "";
                    const num = Math.floor((degree / 45) +.5);
                    const cardinal = ["Northerly", "North Easterly", "Easterly", "South Easterly", "Southerly", "South Westerly", "Westerly", "North Westerly"]; 
                    if(degree != "") {
                        result = cardinal[num % 8];
                    }
                    return result;
                };
            
                const getDate = (value) => {
                    const buffer = (num) => {
                        let addZero = num <= 9 ? "0" + num : num;
                        return addZero; 
                    };
                    const time = new Date(value * 1000);
                    const year = time.getFullYear();
                    const month = buffer(time.getMonth() + 1);
                    const day = buffer(time.getDate());
                    const date = `${day}-${month}-${year}`;
                    return date;
                }
            
                const severeTemp = temperature => {
                    let warning;
                    if(temperature > 35) {
                        warning =  `<div class="warm content"><h2>Warning <span>Hot</span> Weather</h2>
                        <ul><li>&#9728; Stay hydrated and rest often</li>
                        <li>&#9728; Stay out of direct sun</li></ul></div>`;
                    } else if(temperature < -5) {
                        warning = `<div class="cold content"><h2>Warning <span>Cold</span> Weather</h2>
                        <ul><li>&#10052; Ice on road and pavement</li>
                        <li>&#10052; Wrap up and wear layers</li></ul></div>`;
                    } else {
                        warning = "";
                    }
                    return warning;
                };
            
                const severeWind = speed => {
                    let highWind;
                    if(speed > 50) {
                        highWind = `<div class="wind content"><h2>Warning <span>High</span> Winds</h2>
                        <ul><li>&#10148; During high winds take cover</li>
                        <li>&#10148; Watch for flying debris when walking and driving</li></ul><div>`;  
                    } else {
                        highWind = "";
                    }
                    return highWind;
                };
                
            },
            error: function(xhr, error) {
                $('#weather_error').append(`<h2>${error}</h2><p>${xhr.status}: Thats an error, please try again later</p>`);
            }
        });

    
});