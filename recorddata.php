<?php
// import the database.php to create database if not exist
include "database.php";
$servername = "localhost";
$username = "root";
$password = "";
$database = "weatherapp"; 

$conn = mysqli_connect($servername, $username, $password, $database);

if (!$conn) {
    echo "Sorry, we failed to connect";
} else {
    try {
        mysqli_select_db($conn, $database);
        
        // Get the data from the request body
        $data = json_decode(file_get_contents("php://input"));

        // Validate the data
        if (
            !isset($data->city) ||
            !isset($data->country) ||
            !isset($data->date) ||
            !isset($data->weatherCondition) ||
            !isset($data->weatherIcon) ||
            !isset($data->temperature) ||
            !isset($data->pressure) ||
            !isset($data->windSpeed) ||
            !isset($data->humidity)
        ) {
            http_response_code(400); // Bad Request
            echo json_encode(["error" => "Invalid data."]);
            exit();
        }

        // Process the data
        $city = mysqli_real_escape_string($conn, $data->city);
        $country = mysqli_real_escape_string($conn, $data->country);
        $date = mysqli_real_escape_string($conn, $data->date);
        $weatherCondition = mysqli_real_escape_string($conn, $data->weatherCondition);
        $weatherIcon = mysqli_real_escape_string($conn, $data->weatherIcon);
        $temperature = floatval($data->temperature);
        $pressure = intval($data->pressure);
        $windSpeed = floatval($data->windSpeed);
        $humidity = intval($data->humidity);

        // Create a prepared statement
        $stmt = mysqli_prepare($conn, "INSERT INTO weatherdata (city, country, date, weatherCondition, weatherIcon, temperature, pressure, windSpeed, humidity) 
                                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

        if (!$stmt) {
            http_response_code(500); // Internal Server Error
            echo json_encode(["error" => "Statement preparation failed."]);
            exit();
        }

        // Bind parameters and execute the statement
        mysqli_stmt_bind_param($stmt, "sssssdidi", $city, $country, $date, $weatherCondition, $weatherIcon, $temperature, $pressure, $windSpeed, $humidity);

        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(["message" => "Data inserted successfully."]);
        } else {
            http_response_code(500); // Internal Server Error
            echo json_encode(["error" => "An error occurred while inserting data: " . mysqli_error($conn)]);
        }

        // Close the statement
        mysqli_stmt_close($stmt);
    } catch (Exception $e) {
        http_response_code(500); // Internal Server Error
        echo json_encode(["error" => "An error occurred: " . $e->getMessage()]);
    }
}

mysqli_close($conn);
?>