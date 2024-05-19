// Wait for the DOM content to load before executing the code

if (navigator.onLine){ 
  document.addEventListener("DOMContentLoaded", function () {
      // Get references to the required elements
      const searchResultContainer = document.querySelector(".searchResults");
      const apiKey = "d5c15ab887bf994a5d917e1a9889331b";
      const loader = document.getElementById("loader");
      const clear = document.getElementById("clear");
      const searchButton = document.querySelector(".searchBar button");
      const searchInput = document.querySelector(".searchBar input");
    
      // Function to fetch weather data for a given city
      async function fetchData(cityName) {
        searchResultContainer.innerHTML = ""; // Clear the previous data
        loader.style.display = "block";
    
        // Fetch weather data from the API
        const data = await fetchWeatherData(cityName);
    
        // Check if data is available
        if (data) {
          createWeatherElement(data);
          sendData(data);
        } else {
          // Display "City Not Found" if data is not available
          const cityNotFound = document.createElement("h1");
          cityNotFound.classList.add('error')
          cityNotFound.innerHTML = "City Not Found";
          searchResultContainer.appendChild(cityNotFound);
        }
        loader.style.display = "none";
        return data;
      }
      // Function to fetch weather data from the API
      async function fetchWeatherData(cityName) {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
          );
    
          // Check if the API response is successful
          if (response.ok) {
            const data = await response.json();
    
            // Extract required weather data from the API response
            return {
              cityName: data.name,
              country: data.sys.country,
              weatherDesription: data.weather[0].description,
              weatherIcon: data.weather[0].icon,
              temperature: kelvinToCelsius(data.main.temp),
              pressure: data.main.pressure,
              windSpeed: data.wind.speed,
              humidity: data.main.humidity,
              date: formatDateTime(data.dt),
              time: convertTime(data.dt),
              sunRise: convertTime(data.sys.sunrise),
              sunSet: convertTime(data.sys.sunset),
              feelsLikeTemp:
                kelvinToCelsius(data.main.feels_like) || "No Data found",
              visiblity: meterToKilometer(data.visibility) || "No Data Found",
            };
          } else {
            return null;
          }
        } catch (error) {
          console.log("Error fetching weather data:", error);
          return null;
        }
      }
    
      // Function to convert meter to kilometer
      function meterToKilometer(meter) {
        return meter / 1000;
      }
    
      // Function to convert kelvin to celsius
      function kelvinToCelsius(kelvin) {
        return (kelvin - 273.15).toFixed(2);
      }
    
      // Function to convert the time
      function convertTime(time) {
        const actualTime = new Date(time * 1000);
        return actualTime.toLocaleTimeString();
      }
    
     // Function to convert the date and time
    function formatDateTime(timestamp) {
      const date = new Date(timestamp * 1000);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    
      // Function to create weather element and display it in the search results container
      function createWeatherElement(data) {
  
        let ImageElement = document.getElementById('image')
          if (data.weatherIcon == "01d" || data.weatherIcon == "01n") {
              ImageElement.src = "images/sun.png"
          } else if (data.weatherIcon == "02d" || data.weatherIcon == "02n") {
              ImageElement.src = "images/mist.png"
          } else if (data.weatherIcon == "03d" || data.weatherIcon == "03n") {
              ImageElement.src = "images/clouds.png"
          } else if (data.weatherIcon == "04d" || data.weatherIcon == "04n") {
              ImageElement.src = "images/clouds.png"
          } else if (data.weatherIcon == "09d" || data.weatherIcon == "09n") {
              ImageElement.src = "images/rain.png"
          } else if (data.weatherIcon == "10d"  || data.weatherIcon == "10n") {
              ImageElement.src = "images/rain.png"
          }else if (data.weatherIcon == "11d" || data.weatherIcon == "11n") {
            ImageElement.src = "images/drizzle.png"
          }else if (data.weatherIcon == "13d" || data.weatherIcon == "13n" ) {
            ImageElement.src = "images/snow.png"
          }else if (data.weatherIcon == "50d" || data.weatherIcon == "50n") {
            ImageElement.src = "images/haze.png"
          }
          console.log(data.weatherIcon)
        document.getElementById('name').innerHTML = `${data.cityName}, ${data.country}`
        document.getElementById('temperature').innerHTML = `${data.temperature}°C`
        document.getElementById('date').innerHTML = `${data.date}`;
        document.getElementById('time').innerHTML = `${data.time}`;
        document.getElementById('wind-speed').innerHTML = `<span>Wind Speed:</span><br>${data.windSpeed} km/h`
        document.getElementById('pressure').innerHTML = `<span>Pressure:</span><br>${data.pressure} hPa`;
        document.getElementById('humidity').innerHTML = `<span>Humidity:</span><br>${data.humidity} hPa`;
        document.getElementById('description').innerHTML = `<br>${data.weatherDesription}`;
        console.log(data)
      }
    
      // Event listener for search input keyup
      if (searchInput) {
        searchInput.addEventListener("keyup", function (event) {
          if (event.keyCode === 13) {
            const cityName = searchInput.value;
            if (cityName.length !== 0) {
              fetchData(cityName);
            }
          }
        });
      }
    
      // Event listener for search button click
      if (searchButton) {
        searchButton.addEventListener("click", function () {
          const cityName = searchInput.value;
          if (cityName.length !== 0) {
            fetchData(cityName);
          }
        });
      }
    
      // Event listener for clear button click
      clear.addEventListener("click", function () {
        searchInput.value = "";
        clear.style.display = "none";
      });
    
      // hide cross while there is no input
      searchInput.addEventListener("input", function () {
        cityName = searchInput.value;
        if (cityName.length != 0) {
          clear.style.display = "block";
        } else {
          clear.style.display = "none";
        }
      });
    
      // hide cross while loading the page
      window.onload = () => {
        clear.style.display = "none";
      };
    
      fetchData("Colchester");
      async function sendData(data) {
        try {
            let weatherData = {
                city: data.cityName,
                country: data.country,
                date: data.date,
                weatherCondition: data.weatherDesription,
                weatherIcon: data.weatherIcon,
                temperature: data.temperature,
                pressure: data.pressure,
                windSpeed: data.windSpeed,
                humidity: data.humidity
            };
    
            const url = "http://localhost/weather/recorddata.php";
    
            const options = {
                method: "POST",
                body: JSON.stringify(weatherData),
                headers: {
                    "Content-Type": "application/json",
                },
            };
    
            const response = await fetch(url, options);
    
            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData);
            } else {
                console.log("Error: " + response.status);
            }
        } catch (error) {
            console.log("An error occurred:", error);
        }
    };
    
  });
  }else{
    // Get all elements with class name "container"
    const containers = document.getElementsByClassName('container');
  
    // Loop through the collection and set display to "none"
    for (const container of containers) {
      container.style.display = 'none';
    }
    // Create a div element for displaying offline message
    const offlineMessage = document.createElement("div");
    offlineMessage.classList.add("offline-message");
    offlineMessage.innerHTML = `
      <h3 class="error">Offline!</h3>
    `;
    // Append the offline message to the searchResultContainer
    const searchResultContainer = document.querySelector(".searchResults");
    searchResultContainer.appendChild(offlineMessage);
    }
  