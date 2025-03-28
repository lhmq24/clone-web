<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once "connect.php";

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    
    $offset = isset($_GET["offset"]) && $_GET["offset"] > 0 ? $_GET["offset"] : 0;
    $limit = isset($_GET["limit"]) && $_GET["limit"] > 0 ? $_GET["limit"] : 5;

    // Query to fetch products with pagination
    $sql = "SELECT * FROM products LIMIT $limit OFFSET $offset";
    $result = $conn->query($sql);

    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    echo json_encode($products);
    $conn->close();
}
?>
