<?php
    header("Content-Type: application/json");
    require_once 'connect.php';

    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data['cart']) && isset($data['name']) && isset($data['phone_number']) && isset($data['address']) && isset($data['total_price'])) {
    
            $name = $data['name'];
            $phone_number = $data['phone_number'];
            $address = $data['address'];
            $total_price = $data['total_price'];
            $cart = $data['cart']; 

            // Begin Transaction
            $conn->begin_transaction();

            try {
                $stmt = $conn->prepare("INSERT INTO invoices (name, phone_number, address, total_price, buy_at) VALUES (?, ?, ?, ?, NOW())");
                $stmt->bind_param("sssd", $name, $phone_number, $address, $total_price);
                $stmt->execute();
                $invoice_id = $stmt->insert_id; // Get id of AUTO_INCREMENT 
                
                $stmt = $conn->prepare("INSERT INTO invoice_products (invoice_id, product_id, quantity) VALUES (?, ?, ?)");
                
                foreach ($cart as $product) {
                    $product_id = $product['id'];  
                    $quantity = $product['quantity']; 
                    
                    $stmt->bind_param("iii", $invoice_id, $product_id, $quantity);
                    $stmt->execute();
                }
                
                // Commit transaction
                $conn->commit();

                echo json_encode(["success" => true, "message" => "Payment successful"]);
            } catch (Exception $e) {
                // Rollback transaction on error
                $conn->rollback();
                // Handle error
                echo json_encode(["success" => false, "message" => "Payment failed: " . $e->getMessage()]);
            }
        
        } else {
            // Missing credentials
            echo json_encode(["success" => false, "message" => "Missing data"]);
        }
        
        $conn->close();

    }
?>