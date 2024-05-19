<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Weather Forecaster</title>
    <link rel="shortcut icon" href="assets/favicon.png" type="image/x-icon" />
    <link rel="stylesheet" href="style.css">
    
</head>
<body>
    <?php
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "weatherapp";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    echo "<h1 class='top'>Weather from Previous 7 days</h1>";
    // Calculate the date 7 days ago from today
    $sevenDaysAgo = date('Y-m-d', strtotime('-6 days'));

    // SQL query to select one data entry for each day in the past 7 days
    $sql = "SELECT city, country, date, weatherIcon, temperature
            FROM weatherdata
            WHERE city = 'Colchester' AND date >= '$sevenDaysAgo'
            GROUP BY date ";

    $result = $conn->query($sql);

    // Generate PHP array for JSON conversion
    $weatherDataArray = array();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $date = new DateTime($row["date"]);
            $dayOfWeek = $date->format('l');
            
            $weatherDataArray[] = array(
                "city" => $row["city"],
                "country" => $row["country"],
                "dayOfWeek" => $dayOfWeek,
                "weatherIcon" => $row["weatherIcon"],
                "temperature" => $row["temperature"],
                "date" => $row["date"]
            );
        }
    }

    $conn->close();

    // Convert PHP array to JSON for JavaScript
    $encodedWeatherData = json_encode($weatherDataArray);
    ?>

    <div id="weatherDataContainer" class="cityWeatherContainer2">
        <!-- Content will be populated by JavaScript -->
    </div>

    <script>
        // Function to display weather data
        function displayWeatherData(data) {
            var weatherDataContainer = document.getElementById('weatherDataContainer');
            var html = '';

            data.forEach(function(item) {
                html += `
                    <div class='cityWeather2'>
                        <div class='city2'>${item.city}, ${item.country}</div>
                        <div class='dayOfWeek2'>${item.dayOfWeek}</div>
                        <img class='weatherIcon2' src='http://openweathermap.org/img/w/${item.weatherIcon}.png' alt='Weather Icon' />
                        <div class='temperature2'>${item.temperature} &#8451;</div>
                        <div class='date2'>${item.date}</div>
                    </div>`;
            });

            weatherDataContainer.innerHTML = html;
        }

        // Check if there's locally stored data
        var storedWeatherData = localStorage.getItem('weatherData');

        if (storedWeatherData) {
            // If stored data is available, parse and display it
            var parsedWeatherData = JSON.parse(storedWeatherData);
            displayWeatherData(parsedWeatherData);
        } else {
            // If stored data is not available, display fetched data
            var fetchedWeatherData = <?php echo $encodedWeatherData; ?>;
            displayWeatherData(fetchedWeatherData);

            // Store fetched data in localStorage
            localStorage.setItem('weatherData', JSON.stringify(fetchedWeatherData));
        }
    </script>
</body>
</html>
