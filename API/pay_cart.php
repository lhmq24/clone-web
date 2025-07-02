<?php
require_once 'connect.php';
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['username'], $data['name'], $data['phone_number'], $data['address'], $data['total_price'])) {
        echo json_encode(["success" => false, "message" => "Missing required fields."]);
        exit;
    }

    $username = $data['username'];
    $name = $data['name'];
    $phone_number = $data['phone_number'];
    $address = $data['address'];
    $total_price = $data['total_price'];

    $conn->begin_transaction();

    try {
        // Get user and cart
        $stmt = $conn->prepare("SELECT acc_id FROM accounts WHERE acc_username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $user_result = $stmt->get_result();

        if ($user_result->num_rows === 0) throw new Exception("User not found.");
        $acc_id = $user_result->fetch_assoc()['acc_id'];

        $stmt = $conn->prepare("SELECT cart_id FROM carts WHERE user_id = ? AND status = 'active'");
        $stmt->bind_param("i", $acc_id);
        $stmt->execute();
        $cart_result = $stmt->get_result();

        if ($cart_result->num_rows === 0) throw new Exception("No active cart found.");
        $cart_id = $cart_result->fetch_assoc()['cart_id'];

        // Create invoice
        $stmt = $conn->prepare("INSERT INTO invoices (total_price, name, phone_number, address) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("dsss", $total_price, $name, $phone_number, $address);
        $stmt->execute();
        $invoice_id = $stmt->insert_id;

        // Optional: insert into invoice_products if you plan to store that

        // Mark cart as completed
        $stmt = $conn->prepare("UPDATE carts SET status = 'completed' WHERE cart_id = ?");
        $stmt->bind_param("i", $cart_id);
        $stmt->execute();

        $conn->commit();
        echo json_encode(["success" => true, "message" => "Payment successful."]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["success" => false, "message" => "Payment failed: " . $e->getMessage()]);
    }

    $conn->close();
}
?>
