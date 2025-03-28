<?php
session_start();
if(isset($_SESSION['username']) && isset($_COOKIE['username'])){
    unset($_SESSION['username']);
    setcookie("username", "", time() - 3600, "/"); 
    echo json_encode([
        "success" => true,
        "message" => "Logged out successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "No user is currently logged in"
    ]);
}
?>