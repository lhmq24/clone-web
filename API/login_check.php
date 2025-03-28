<?php
session_start();
if (isset($_SESSION['username']) && isset($_COOKIE['username'])) {
    echo json_encode(["success" => true, 
                    "message" => "User is logged in",
                    "user" => $_SESSION['username']
                ]);
} else {
    header('Location: login.php');
    die();
}

?>
