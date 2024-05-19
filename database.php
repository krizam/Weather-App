<?php
$servername = "localhost"; 
$username = "root"; 
$password = ""; 
$database = "weatherapp"; 

// Create a connection
$conn = new mysqli($servername, $username, $password);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the database exists
$query = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '$database'";
$result = $conn->query($query);

if ($result->num_rows == 0) {
    // The database doesn't exist, so let's create it
    $createDatabaseQuery = "CREATE DATABASE $database";
    if ($conn->query($createDatabaseQuery) === TRUE) {
        echo "Database created successfully<br>";

        // Now, let's create the table to store weather data
        $conn->select_db($database); // Select the newly created database

        $createTableQuery = "
            CREATE TABLE weatherdata (
                id INT AUTO_INCREMENT PRIMARY KEY,
                city VARCHAR(255),
                country VARCHAR(255),
                date DATETIME,
                weatherCondition VARCHAR(255),
                weatherIcon VARCHAR(255),
                temperature FLOAT,
                pressure FLOAT,
                windSpeed FLOAT,
                humidity FLOAT
            )";
        
        if ($conn->query($createTableQuery) === TRUE) {
            echo "Table 'weather_data' created successfully";
        } else {
            echo "Error creating table: " . $conn->error;
        }
    } else {
        echo "Error creating database: " . $conn->error;
    }
} else {
    echo "Database already exists";
}

?>