

$(document).ready(function() { 

    const background = document.querySelector('.container');

    
    $("#country").change(function() {
        if($("#country :selected").val() != "" ) {
            const country = $("#country :selected").val();
            $("#city").load(country + "-cities.html");
            $("#city").removeClass("hidden");
        } else {
            $("#city").addClass("hidden");
            $("#display").html("");
            background.style.backgroundImage = `url('./assets/default.jpeg')`;
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
                                console.log(data);
                                $("#display").html("");
                                const celsius  = Math.round(data.main.temp);
                                const fahrenheit = Math.round((data.main.temp * 9/5) + 32);
                                const feelsLike = Math.round(data.main.feels_like);
                                const sunrise =  convertHM(data.sys.sunrise);
                                const sunset =  convertHM(data.sys.sunset);
                                const speedMph = Math.round(data.wind.speed * 2.237);
                                const speedKmh = Math.round(data.wind.speed * 3.6);
                                const direction = typeof data.wind.deg == "undefined" ? "Currently Unavailable" : data.wind.deg + "&#176; | " + windDir(data.wind.deg);
                                const extemeTemp = severeTemp(celsius) !== "" ? `<p>${severeTemp(celsius)}</p>` :  `<p><span>Feels like:</span> ${feelsLike}&#8451;</p>`;
                                const extemeWind = severeWind(speedMph) !== "" ? `<p>${severeWind(speedMph)}</p>` : " ";

                                const timeOfDay = data.weather[0].icon;
                                const letter = timeOfDay.charAt(timeOfDay.length -1);

                                const backgroundImg = () => {
                                    if(letter === 'd') {
                                    background.style.backgroundImage = `url('./assets/weather.jpg')`;
                                    } else {
                                        background.style.backgroundImage = `url('./assets/night.jpg')`;
                                    }
                                };

                                backgroundImg();

            
                                currentCity = `
                                <div class="result">
                                    <div class="card__top">
                                        <h2>${data.name}</h2>
                                        <h4>${getDate(data.dt)}</h4>
                                        <div class="top__info">
                                        <i class="owf owf-${data.weather[0].id}"></i>
                                        <h3>${celsius}&#8451;</h3>
                                        <p>${fahrenheit}&#8457;</p>
                                        </div>
                                    </div>
                                    <div class="card__bottom">
                                        <div class="bottom__info">
                                        <p><span>Condition:</span> ${data.weather[0].main}</p>
                                        ${extemeTemp}
                                        ${extemeWind}
                                        <p><span>Wind Speed:</span> ${speedMph}mph | ${speedKmh}kmh</p>
                                        <p><span>Wind Direction:</span> ${direction}</p>
                                        <p><span>Sunrise:</span> ${sunrise}</p>
                                        <p><span>Sunset:</span> ${sunset}</p>
                                        </div>
                                    </div>

                                </div>`;
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
                    if(temperature >= 35) {
                        warning =  `Warning heat wave`;
                    } else if(temperature <= -1) {
                        warning = `Warning severe cold weather`;
                    } else {
                        warning = "";
                    }
                    return warning;
                };
            
                const severeWind = speed => {
                    let highWind;
                    if(speed > 50) {
                        highWind = `Warning high winds`;  
                    } else {
                        highWind = "";
                    }
                    return highWind;
                };

                // use when using different backgrounds for weather conditions
                const backdrop = condition => {
                    const img = condition.toLowerCase();
                    return img;
                };

                const convertHM = value => {
                    let date = new Date(value * 1000);
                    let timeStr = date.toLocaleTimeString().match(/\d{2}:\d{2}|[AMP]+/g).join(' ');
                    return timeStr;
                };
                
            },
            error: function(xhr, error) {
                $('#weather_error').append(`<h2>${error}</h2><p>${xhr.status}: Thats an error, please try again later</p>`);
            }
        });

    
});
