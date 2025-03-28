<?php
    // Connect to MySQL
    $conn = new mysqli("localhost", "root", "", "shop_db");
    if ($conn->connect_error) {
        die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}
?>