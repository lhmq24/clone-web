-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 02, 2025 at 09:03 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shop_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `acc_id` int(11) NOT NULL,
  `acc_username` varchar(60) NOT NULL,
  `acc_password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`acc_id`, `acc_username`, `acc_password`) VALUES
(3, 'admin', '$2y$10$iInUDmg.se5vu8De5yPOAe2x0XvEWbqZ0qyWdvhA1JMdytCkOXKlG'),
(7, '121', '$2y$10$.tPs47wdq5dxDgM.8KFPBuP60bdW9a5JjSSgm5CzN7j/2uwTWe1BS'),
(8, 'Minhquan', '$2y$10$JcR10jfs7IQSyV.Vg8E80OhotXYLJMQzxFEAMw.JY16UcYp4vjAPS');

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `cart_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` enum('active','completed') NOT NULL DEFAULT 'active',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`cart_id`, `user_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 3, 'completed', '2025-04-06 22:53:13', '2025-04-08 12:47:37'),
(3, 7, 'active', '2025-04-08 14:46:35', '2025-04-08 14:46:35'),
(4, 8, 'completed', '2025-04-08 16:43:41', '2025-04-08 16:44:36');

-- --------------------------------------------------------

--
-- Table structure for table `cart_products`
--

CREATE TABLE `cart_products` (
  `cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `added_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart_products`
--

INSERT INTO `cart_products` (`cart_id`, `product_id`, `quantity`, `added_at`) VALUES
(1, 16, 9, '2025-04-07 13:44:17'),
(1, 20, 1, '2025-04-08 12:40:42'),
(3, 18, 1, '2025-04-08 14:46:35'),
(4, 16, 2, '2025-04-08 16:43:41'),
(4, 20, 1, '2025-04-08 16:43:49');

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `buy_at` datetime DEFAULT current_timestamp(),
  `name` varchar(100) NOT NULL,
  `phone_number` varchar(13) NOT NULL,
  `address` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `total_price`, `buy_at`, `name`, `phone_number`, `address`) VALUES
(17, 51030000.00, '2025-04-01 08:18:25', 'bmq', '102300443', 'NK, CT'),
(18, 39720000.00, '2025-04-07 14:14:05', 'Quan', '1234567891', 'ewew, fsdfd'),
(19, 68390000.00, '2025-04-07 14:27:30', 'Quan', '1021254323', 'sasa32dsba'),
(20, 49600000.00, '2025-04-08 12:47:37', 'Minh Quan', '1111111111', 'Ninh Kieu, Can Tho'),
(21, 33010000.00, '2025-04-08 16:44:36', 'Quan', '1234567891', 'Ninh kieu, Can Tho');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `ram` varchar(50) DEFAULT NULL,
  `ssd` varchar(50) DEFAULT NULL,
  `price` int(11) NOT NULL,
  `cpu` varchar(100) DEFAULT NULL,
  `screen` varchar(100) DEFAULT NULL,
  `gpu` varchar(100) DEFAULT NULL,
  `weight` varchar(50) DEFAULT NULL,
  `material` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `image`, `ram`, `ssd`, `price`, `cpu`, `screen`, `gpu`, `weight`, `material`) VALUES
(16, 'Dell Inspiron 15 3520 i5 1235U ', '../assets/best-seller-img/dell-inspiron-15-3520-i5-25p231.jpg', '16 GB', '512 GB', 16490000, 'i5 1235U', '15,6 inches', 'None', '1,5 kg', 'Aluminum'),
(17, 'HP 15 fd0234TU i5 1334U (9Q969PA) ', '../assets/best-seller-img/hp-15-fd0234tu-i5-9q969pa.jpg', '16 GB', '512 GB', 15890000, 'i5 1334U', '15,5 inches', 'None', '1,6 kg', 'Aluminum'),
(18, 'Dell Inspiron 15 3520 i5 1235U (N5I5057W1)', '../assets/best-seller-img/dell-inspiron-15-3520-i5-n5i5057w1.jpg', '16 GB', '512 GB', 16490000, 'i5 1235U', '15,6 inches', 'None', '1,4 kg', 'Plastic'),
(19, 'Lenovo Gaming LOQ Essential 15IAX9E (83LK000BVN)', '../assets/best-seller-img/lenovo-loq-15iax9e-i5-83lk000bvn.jpg', '16 GB', '512 GB', 17690000, 'i5 12450HX', '15,6 inches FHD', '4GB RTX2050', '1,7 kg', 'Metal'),
(20, 'Laptop MacBook Air 13 inch M1 8GB/256GB', '../assets/best-seller-img/macbook-air-13.3-8gb-256gb.jpg', '8 GB', '256 GB', 16590000, ' Apple M1', '13.6\", Liquid Retina (2560 x 1664)', '7 cores GPU', '1,29 kg', 'Metal'),
(21, 'Laptop MacBook Pro 14 inch M4 16GB/512GB', '../assets/best-seller-img/macbook-pro-14-inch-m4.jpg', '16 GB', '512 GB', 39690000, ' Apple M4', '13.6\", 14.2\", Liquid Retina XDR display (3024 x 1964)', '10 cores GPU', '1,55 kg', 'Metal'),
(22, 'Laptop MSI Modern 15 B12MO i5 1235U/16GB/512GB/Win11 (628VN)', '../assets/best-seller-img/msi-modern-15-b12mo-i5-628vn.jpg', '16 GB', '512 GB', 39690000, ' i5 1235U', '15.6\", Full HD (1920 x 1080)', 'Intel Iris Xe', '1,7 kg', 'Plastic'),
(23, 'Laptop GIGABYTE G5 MF5 RC555 i7 13620H/16GB/512GB/6GB RTX4050/144Hz/Win11 (9RC55MF5FJIINIVN000)', '../assets/best-seller-img/gigabyte-g5-mf5-rc555-i7-9rc55mf5fjiinivn000.jpg', '16 GB', '512 GB', 39690000, 'i7, 13620H', '15.6\", Full HD (1920 x 1080)', 'RTX 4050 6GB', '2,2 kg', 'Plastic'),
(24, 'Laptop Asus Vivobook Go 15 E1504FA R5 7520U/16GB/512GB/Chuột/Win11 (NJ776W)', '../assets/best-seller-img/asus-vivobook-go-15-e1504fa-r5-nj776w.jpg', '16 GB', '512 GB', 39690000, 'Ryzen 5, 7520U', '15.6\", Full HD (1920 x 1080)', 'Radeon', '1,63 kg', 'Plastic'),
(25, 'Laptop Asus Zenbook 14 OLED UX3402VA i5 13500H/16GB/512GB/90Hz/Win11 (KM657W)', '../assets/best-seller-img/asus-zenbook-14-oled-i5-km657w.jpg', '16 GB', '512 GB', 23690000, 'i5, 13500H', '14 inches, 2.8K (2880 x 1800) - OLED 16:10, 90Hz', 'Intel Iris Xe', '1.7 kg', 'Metal - Aluminum'),
(26, 'Laptop Asus TUF Gaming A15 FA506NFR R7 7435HS/16GB/512GB/4GB RTX2050/144Hz/Win11 (HN113W)', '../assets/best-seller-img/asus-fa506nfr-r7-hn113w.jpg', '16 GB', '512 GB', 23690000, 'Ryzen 7, 7435HS, 3.1GHz', '15.6\", Full HD (1920 x 1080), 144Hz', 'RTX 2050 4GB', '2,3 kg', 'Plastic');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`acc_id`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `fk_user_id` (`user_id`);

--
-- Indexes for table `cart_products`
--
ALTER TABLE `cart_products`
  ADD PRIMARY KEY (`cart_id`,`product_id`),
  ADD KEY `fk_product_id` (`product_id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `acc_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `accounts` (`acc_id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_products`
--
ALTER TABLE `cart_products`
  ADD CONSTRAINT `fk_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
