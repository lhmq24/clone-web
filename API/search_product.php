<?php
require_once 'connect.php';

header('Content-Type: application/json');

if($_SERVER['REQUEST_METHOD'] == 'GET'){
    $product = $_GET['product'];

    if($product == null || empty($product)) {
        echo json_encode([
            'success' => false,
            'message' => 'No product specified']);
        return;
    }

    // Query to fetch products with pagination
    $sql = "SELECT * FROM products WHERE name LIKE ?";
    $stmt = $conn->prepare($sql);
    $product_name = "%" . $product . "%";
    $stmt->bind_param("s", $product_name);
    $stmt->execute();
    $result = $stmt->get_result();
    $conn->close();

    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    echo json_encode($products);

} else{
    echo json_encode([
       'success' => false,
       'message' => 'Expect GET request, not '. $_SERVER['REQUEST_METHOD']]);
}
?>