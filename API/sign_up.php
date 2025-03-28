<?php
header("Content-Type: application/json");
require "connect.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data["username"]) && isset($data["password"])) {
        $username = $data["username"];
        $password = password_hash($data["password"], PASSWORD_BCRYPT); // Hash password

        $stmt = $conn->prepare("INSERT INTO accounts (acc_username, acc_password) VALUES (?, ?)");
        $stmt->bind_param("ss", $username, $password);

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true, 
                "message" => "User registered successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false, 
                "message" => "Username already exists"
            ]);
        }
        $stmt->close();
    } 
    $conn->close();
} else {
    echo json_encode([
        "success" => false, 
        "message" => "Expect POST request, not GET request!"
    ]);
}
?>
