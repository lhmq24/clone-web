<?php
session_start();
header("Content-Type: application/json");

require_once "connect.php"; // Make sure you are including your database connection

// Check if user exists
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // Get the raw POST data
    $data = json_decode(file_get_contents("php://input"), true);

    // Check if the data is valid
    if ($data === null) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid JSON data received!"
        ]);
        return;
    }

    // Check if username and password are provided
    if (isset($data["username"]) && isset($data["password"])) {
        $username = $data['username'];
        $password = $data['password']; // Password from the request

        // Query to get the stored password hash for the user
        $query = "SELECT acc_password FROM accounts WHERE acc_username = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        // Check if the user exists in the database
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            // Verify the password with the hash stored in the database
            if (password_verify($password, $row["acc_password"])) {
                // Successful login
                echo json_encode([
                    "success" => true,
                    "message" => "Login successful!"
                ]);

                // Set cookie
                setcookie("username", $username, time() + (60 * 60 * 12),"/");
                //Start session
                $_SESSION['username'] = $username;

            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Password is incorrect!"
                ]);
            }

        } else {
            echo json_encode([
                "success" => false,
                "message" => "User does not exist!"
            ]);
        }
    } else {
        // If username or password is not provided
        echo json_encode([
            "success" => false,
            "message" => "Username or password is missing!"
        ]);
    }

} else {
    // If the request method is not POST
    echo json_encode([
        "success" => false,
        "message" => "No POST request is sent!"
    ]);
}
?>
