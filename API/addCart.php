<?php
require_once 'connect.php';
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['username']) || !isset($data['cart'])) {
        echo json_encode(["success" => false, "error" => "Missing username or cart data"]);
        exit;
    }

    $username = $data['username'];
    $cart = $data['cart'];

    // Get account ID
    $stmt = $conn->prepare("SELECT acc_id FROM accounts WHERE acc_username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "error" => "Invalid username"]);
        exit;
    }

    $acc_id = $result->fetch_assoc()['acc_id'];

    // Check for active cart
    $stmt = $conn->prepare("SELECT cart_id FROM carts WHERE user_id = ? AND status = 'active'");
    $stmt->bind_param("i", $acc_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Existing cart
        $cart_id = $result->fetch_assoc()['cart_id'];
    } else {
        // Create new cart
        $stmt = $conn->prepare("INSERT INTO carts (user_id, status) VALUES (?, 'active')");
        $stmt->bind_param("i", $acc_id);
        $stmt->execute();
        $cart_id = $conn->insert_id;
    }

    // Loop through each product
    foreach ($cart as $product) {
        $product_id = $product['id'];
        $quantity = $product['quantity'];

        // Check if product already exists
        $stmt = $conn->prepare("SELECT quantity FROM cart_products WHERE cart_id = ? AND product_id = ?");
        $stmt->bind_param("ii", $cart_id, $product_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Update quantity
            $stmt = $conn->prepare("UPDATE cart_products SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?");
            $stmt->bind_param("iii", $quantity, $cart_id, $product_id);
        } else {
            // Insert new product
            $stmt = $conn->prepare("INSERT INTO cart_products (cart_id, product_id, quantity) VALUES (?, ?, ?)");
            $stmt->bind_param("iii", $cart_id, $product_id, $quantity);
        }
        $stmt->execute();
    }

    echo json_encode(["success" => true, "message" => "Cart updated successfully"]);
} else {
    echo json_encode(["success" => false, "error" => "Invalid request method"]);
}
?>
