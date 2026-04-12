-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 14, 2026 at 11:21 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `inventory_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `credits`
--

CREATE TABLE `credits` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `contact_number` varchar(11) DEFAULT NULL,
  `due_date` date NOT NULL,
  `status` enum('open','partial','paid') NOT NULL DEFAULT 'open',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `credits`
--

INSERT INTO `credits` (`id`, `customer_name`, `total_amount`, `contact_number`, `due_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 'test1', 88.00, '2323', '2026-02-20', 'partial', '2026-02-08 09:34:11', '2026-02-08 09:34:28'),
(2, '434', 102.00, '434', '2026-02-25', 'paid', '2026-02-08 12:08:35', '2026-02-08 12:43:33'),
(3, 'Achii chuuu', 2736.00, '0936444431', '2026-02-28', 'partial', '2026-02-08 12:39:04', '2026-02-08 12:40:15'),
(4, 'test1', 102.00, '2323', '2026-03-07', 'open', '2026-02-08 13:30:14', '2026-02-08 13:30:14'),
(5, 'Test 1', 613.00, '09123113', '2026-02-21', 'paid', '2026-02-08 13:44:51', '2026-02-08 13:46:15');

-- --------------------------------------------------------

--
-- Table structure for table `credit_items`
--

CREATE TABLE `credit_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `credit_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `credit_items`
--

INSERT INTO `credit_items` (`id`, `credit_id`, `product_id`, `quantity`, `unit_price`, `subtotal`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 1, 43.00, 43.00, '2026-02-08 09:34:11', '2026-02-08 09:34:11'),
(2, 1, 4, 1, 45.00, 45.00, '2026-02-08 09:34:11', '2026-02-08 09:34:11'),
(3, 2, 4, 1, 45.00, 45.00, '2026-02-08 12:08:35', '2026-02-08 12:08:35'),
(4, 2, 8, 1, 57.00, 57.00, '2026-02-08 12:08:35', '2026-02-08 12:08:35'),
(5, 3, 1, 12, 49.00, 588.00, '2026-02-08 12:39:04', '2026-02-08 12:39:04'),
(6, 3, 8, 12, 57.00, 684.00, '2026-02-08 12:39:04', '2026-02-08 12:39:04'),
(7, 3, 12, 12, 52.00, 624.00, '2026-02-08 12:39:04', '2026-02-08 12:39:04'),
(8, 3, 11, 12, 70.00, 840.00, '2026-02-08 12:39:04', '2026-02-08 12:39:04'),
(9, 4, 4, 1, 45.00, 45.00, '2026-02-08 13:30:14', '2026-02-08 13:30:14'),
(10, 4, 8, 1, 57.00, 57.00, '2026-02-08 13:30:14', '2026-02-08 13:30:14'),
(11, 5, 1, 1, 49.00, 49.00, '2026-02-08 13:44:51', '2026-02-08 13:44:51'),
(12, 5, 6, 12, 47.00, 564.00, '2026-02-08 13:44:51', '2026-02-08 13:44:51');

-- --------------------------------------------------------

--
-- Table structure for table `credit_payments`
--

CREATE TABLE `credit_payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `credit_id` bigint(20) UNSIGNED NOT NULL,
  `amount_paid` decimal(10,2) NOT NULL,
  `paid_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_method` varchar(50) DEFAULT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `credit_payments`
--

INSERT INTO `credit_payments` (`id`, `credit_id`, `amount_paid`, `paid_at`, `payment_method`, `reference`, `created_at`, `updated_at`) VALUES
(1, 1, 12.00, '2026-02-08 09:34:28', 'cash', 'PAY-698858A40432C', '2026-02-08 09:34:28', '2026-02-08 09:34:28'),
(2, 1, 12.00, '2026-02-08 09:36:28', 'cash', 'PAY-20260208-2', '2026-02-08 09:36:28', '2026-02-08 09:36:28'),
(3, 3, 221.00, '2026-02-08 12:40:15', 'cash', 'PAY-20260208-4', '2026-02-08 12:40:15', '2026-02-08 12:40:15'),
(4, 2, 102.00, '2026-02-08 12:43:33', 'cash', 'PAY-20260208-4', '2026-02-08 12:43:33', '2026-02-08 12:43:33'),
(5, 5, 200.00, '2026-02-08 13:45:20', 'cash', 'PAY-20260208-6', '2026-02-08 13:45:20', '2026-02-08 13:45:20'),
(6, 5, 413.00, '2026-02-08 13:46:15', 'cash', 'PAY-20260208-6', '2026-02-08 13:46:15', '2026-02-08 13:46:15');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_12_19_013518_create_personal_access_tokens_table', 1),
(5, '2025_12_19_123614_create_product_table', 1),
(6, '2026_01_03_035157_create_sales_table', 1),
(7, '2026_01_03_040243_add_columns_to_products_table', 1),
(8, '2026_01_03_064420_drop_product_id_from_sales_table', 2),
(13, '2026_01_03_064623_create_sale_items', 3),
(14, '2026_01_09_185644_add_cost_price_to_sale_items_table', 4),
(15, '2026_01_23_220644_create_credits_table', 4),
(16, '2026_01_23_220806_create_credit_items_table', 4),
(17, '2026_02_01_164533_remove_product_columns_from_sales_table', 5),
(18, '2026_02_08_135255_add_status_to_credits_table', 6),
(19, '2026_02_08_145149_create_table_credits_payment', 7),
(20, '2026_02_08_174048_add_role_to_users_table', 8);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(50, 'App\\Models\\User', 2, 'cashier-token', '09c9b45f6def6c6eee24d3a73037effee98b4b6ab0f46d9a849783aef05bb7b2', '[\"cashier\"]', '2026-02-08 09:55:33', NULL, '2026-02-08 09:55:01', '2026-02-08 09:55:33'),
(52, 'App\\Models\\User', 1, 'cashier-token', '055330dab25bd1b0c96d409cc099bb718104ef1734a3fcf188b7fcebb2c3ebf0', '[\"cashier\"]', '2026-02-08 10:04:53', NULL, '2026-02-08 09:56:17', '2026-02-08 10:04:53'),
(53, 'App\\Models\\User', 1, 'app-token', '81a859829867f3029ce14551ccd6c29654d2fe17c73da08d9d3d2e8041ef63e9', '[\"*\"]', NULL, NULL, '2026-02-08 10:07:15', '2026-02-08 10:07:15'),
(54, 'App\\Models\\User', 1, 'app-token', '185e7653543892ef31018513e69fd7d329494fe7b4f343ff8f350c156ed9352b', '[\"*\"]', NULL, NULL, '2026-02-08 10:07:16', '2026-02-08 10:07:16'),
(55, 'App\\Models\\User', 1, 'app-token', '525dff4f9f3cfb46f485461a6616ab960bbe568a56fc8da33aecd11899131ea2', '[\"*\"]', NULL, NULL, '2026-02-08 10:07:22', '2026-02-08 10:07:22'),
(57, 'App\\Models\\User', 2, 'app-token', '8744de91cc4d6a7980aec5853367f0f72407ed3148ffd4dec4f121211b04c45e', '[\"*\"]', NULL, NULL, '2026-02-08 10:33:14', '2026-02-08 10:33:14'),
(58, 'App\\Models\\User', 2, 'app-token', '27eb3083d497a9fb971983f8c388897765b635ae0bc7ba739bfa6a69b78354aa', '[\"*\"]', NULL, NULL, '2026-02-08 10:33:52', '2026-02-08 10:33:52'),
(60, 'App\\Models\\User', 1, 'app-token', 'd8043aef42259567e529575b1e615066459f4475956e147fdfaf8bceffd94217', '[\"*\"]', NULL, NULL, '2026-02-08 11:51:18', '2026-02-08 11:51:18'),
(62, 'App\\Models\\User', 2, 'app-token', '3eeb2023ba84ac63ec6a352d6df8f1fed0a58ebf4d3ae12de381121848bc653d', '[\"*\"]', NULL, NULL, '2026-02-08 11:51:30', '2026-02-08 11:51:30'),
(72, 'App\\Models\\User', 2, 'app-token', '8cf91805a95399515fbc47a8715eaed6ad9ce94ac3b559b4cebd3ea782dae02a', '[\"*\"]', NULL, NULL, '2026-02-08 13:11:54', '2026-02-08 13:11:54'),
(73, 'App\\Models\\User', 2, 'app-token', 'f6deed1b43fc7e78f40850055b03fb4e92be1d6614bb60e9b0fbc8e605f3fc9d', '[\"*\"]', NULL, NULL, '2026-02-08 13:11:58', '2026-02-08 13:11:58'),
(74, 'App\\Models\\User', 2, 'app-token', 'c63a50e51dde03915f1e15242eb9f1ac3099aa05318ab9bddcd1b924b86ba938', '[\"*\"]', NULL, NULL, '2026-02-08 13:12:05', '2026-02-08 13:12:05'),
(75, 'App\\Models\\User', 1, 'app-token', '3fe1812b032da2f6c7658badf34f2049e980187afd00379e4555be1d6e971833', '[\"*\"]', NULL, NULL, '2026-02-08 13:12:12', '2026-02-08 13:12:12'),
(76, 'App\\Models\\User', 2, 'app-token', 'ec7a7d546d270473bb7457345d7b724497fb914cff84570caf16a4a59aff4d65', '[\"*\"]', NULL, NULL, '2026-02-08 13:12:19', '2026-02-08 13:12:19'),
(77, 'App\\Models\\User', 2, 'app-token', 'd47786b3e7aee0448e344afc834e37005ca2ea86ff9ba4ca8ce95e48911b934d', '[\"*\"]', NULL, NULL, '2026-02-08 13:12:30', '2026-02-08 13:12:30'),
(78, 'App\\Models\\User', 2, 'app-token', '3f4c29c33d5d07d3970b77e2132d0ec27c4add312f08eb40cb4a870bc34e41ed', '[\"*\"]', NULL, NULL, '2026-02-08 13:12:37', '2026-02-08 13:12:37'),
(79, 'App\\Models\\User', 2, 'app-token', 'e21370cea6377e36b07cc7f9688ec4952af50947595f3851b3f0eb13a8ff76c1', '[\"*\"]', NULL, NULL, '2026-02-08 13:13:10', '2026-02-08 13:13:10'),
(80, 'App\\Models\\User', 2, 'app-token', 'b146678cc716295f3155a74e6531c782ed3db5d0be5a0676d1213caf75348106', '[\"*\"]', NULL, NULL, '2026-02-08 13:13:11', '2026-02-08 13:13:11'),
(81, 'App\\Models\\User', 2, 'app-token', '31dfdf59cdce23c5dc60e2260263f24f64fe5c7b41a5c937dce503922690474f', '[\"*\"]', NULL, NULL, '2026-02-08 13:13:22', '2026-02-08 13:13:22'),
(82, 'App\\Models\\User', 2, 'app-token', '7c5305601ffa1f81a4dc0b3de26befdf85b5118642e367f30cb260361a023b1c', '[\"*\"]', NULL, NULL, '2026-02-08 13:13:22', '2026-02-08 13:13:22'),
(83, 'App\\Models\\User', 1, 'app-token', 'a913ae1a36f2d72df19cb5f8906c52825e8a16a44fec1e56365a9d5707536dd6', '[\"*\"]', NULL, NULL, '2026-02-08 13:13:24', '2026-02-08 13:13:24'),
(85, 'App\\Models\\User', 1, 'app-token', '0e8fd1e94e605c7e53bfe45bfa313bc12a9a3b2b91e4697207958bee74a04c9a', '[\"*\"]', NULL, NULL, '2026-02-08 13:14:19', '2026-02-08 13:14:19'),
(86, 'App\\Models\\User', 1, 'app-token', '3a5275f033f12e3d262d959ecadaccd992008dd67e1e1ff3850e1abf62f8707c', '[\"*\"]', NULL, NULL, '2026-02-08 13:14:24', '2026-02-08 13:14:24'),
(87, 'App\\Models\\User', 1, 'app-token', '4ec1cbfe879424b96511e12d3fbb53d0f2578f9c4af1354b6328b32001c1309a', '[\"*\"]', NULL, NULL, '2026-02-08 13:14:26', '2026-02-08 13:14:26'),
(88, 'App\\Models\\User', 1, 'app-token', '2ad71855c272dcc009bc26439d29cb777c0cc47028e4a7036ff4bab6360b4428', '[\"*\"]', NULL, NULL, '2026-02-08 13:14:29', '2026-02-08 13:14:29'),
(89, 'App\\Models\\User', 1, 'app-token', '1629c767edf7d9b96b0c758ae2674aab24ff18b9fde13467b463be564d5646a3', '[\"*\"]', NULL, NULL, '2026-02-08 13:14:33', '2026-02-08 13:14:33'),
(90, 'App\\Models\\User', 1, 'app-token', '5ad0a2003d16479c0a5dfcd2c9e6bc711fd06436fbde2ae237b14b5f428138c5', '[\"*\"]', NULL, NULL, '2026-02-08 13:14:34', '2026-02-08 13:14:34'),
(91, 'App\\Models\\User', 1, 'app-token', 'f9237e259db0feff6dd23ae2467240c98f7e58547ec9c2c97bfc81b1ce14d261', '[\"*\"]', NULL, NULL, '2026-02-08 13:14:34', '2026-02-08 13:14:34'),
(92, 'App\\Models\\User', 1, 'app-token', 'bf0e0781127ae1527f1b1ece95919e719fc6376df9106f790493312dc4a8f1b9', '[\"*\"]', NULL, NULL, '2026-02-08 13:14:37', '2026-02-08 13:14:37'),
(93, 'App\\Models\\User', 1, 'app-token', '3465fe2f8bab12f624bbb94158a84cffe2f67e8b3e59ed60057d5c292142b753', '[\"*\"]', NULL, NULL, '2026-02-08 13:15:01', '2026-02-08 13:15:01'),
(94, 'App\\Models\\User', 1, 'app-token', 'eb2f820bc7772285d99f581de8dec0ecdf6b52953b95528ad4f0ef9fde32e379', '[\"*\"]', NULL, NULL, '2026-02-08 13:15:02', '2026-02-08 13:15:02'),
(95, 'App\\Models\\User', 1, 'app-token', 'b627be0b129434169e2fe057e5491552a8d9af2938201ecd9b5018f1c0fbdc30', '[\"*\"]', NULL, NULL, '2026-02-08 13:15:03', '2026-02-08 13:15:03'),
(96, 'App\\Models\\User', 1, 'app-token', '27daaf785a17157f1dac55b152efa0bc5bd68e8e3e4c845bfb0b16ec4c761ad9', '[\"*\"]', NULL, NULL, '2026-02-08 13:15:34', '2026-02-08 13:15:34'),
(97, 'App\\Models\\User', 1, 'app-token', 'bbfc074aa0debe8668c76505bb67fc5cd98d40319b69cc2e7521e0c1e372735c', '[\"*\"]', NULL, NULL, '2026-02-08 13:16:03', '2026-02-08 13:16:03'),
(98, 'App\\Models\\User', 1, 'app-token', '424f7ff37cfb289b6320ccbf10e79f6d95e55e3ddd1980f632a5cba91af92a5a', '[\"*\"]', NULL, NULL, '2026-02-08 13:16:07', '2026-02-08 13:16:07'),
(99, 'App\\Models\\User', 1, 'app-token', 'bd3af2d2b858a2fab4242828e606a0221203a7b24cb4457a71c62a4e44be075a', '[\"*\"]', NULL, NULL, '2026-02-08 13:16:08', '2026-02-08 13:16:08'),
(100, 'App\\Models\\User', 1, 'app-token', '7a9db345036d0156cc1b03df019f44ec83b638ff743ce5a97cfd6a010fab4c48', '[\"*\"]', NULL, NULL, '2026-02-08 13:16:09', '2026-02-08 13:16:09'),
(101, 'App\\Models\\User', 1, 'app-token', '0ec85b12339ea7364feaaf7d4d86fff87079aa240baa68c16355581319bc50b1', '[\"*\"]', NULL, NULL, '2026-02-08 13:17:07', '2026-02-08 13:17:07'),
(102, 'App\\Models\\User', 1, 'app-token', 'a4e485dee6cd08916e1677ce269a6dab3d306761ba13c1bb7416bdb181340be8', '[\"*\"]', NULL, NULL, '2026-02-08 13:18:17', '2026-02-08 13:18:17'),
(103, 'App\\Models\\User', 1, 'app-token', 'c164c2a2d0c9beecf33441eeb31e7830ce30ac7c20c71b1cfd590571b9d42080', '[\"*\"]', NULL, NULL, '2026-02-08 13:18:22', '2026-02-08 13:18:22'),
(104, 'App\\Models\\User', 1, 'app-token', 'bd794e61a796e3d311dbd58d047e004ee8b34a2580cdaf9271cada9ccb2623d4', '[\"*\"]', NULL, NULL, '2026-02-08 13:18:26', '2026-02-08 13:18:26'),
(105, 'App\\Models\\User', 1, 'app-token', '8e54333dca26c03335f6cba277e4701c0145bc075656f766be45560de32cc8f4', '[\"*\"]', NULL, NULL, '2026-02-08 13:19:52', '2026-02-08 13:19:52'),
(106, 'App\\Models\\User', 1, 'app-token', '8aeaf4f04d8ff7d3475f8876101d6ef9cd1c155abd48b5e2245ec67855fa92cd', '[\"*\"]', NULL, NULL, '2026-02-08 13:19:53', '2026-02-08 13:19:53'),
(107, 'App\\Models\\User', 1, 'app-token', '496bef807f6d6e50025f6f289ffc60d01aa186a0cfaca0ae84eac9c4d9335513', '[\"*\"]', NULL, NULL, '2026-02-08 13:19:58', '2026-02-08 13:19:58'),
(108, 'App\\Models\\User', 1, 'app-token', '3765535058894b90dc486a5e9051e64462d4a3cac4d9194b20d77ce2f20e124b', '[\"*\"]', NULL, NULL, '2026-02-08 13:20:04', '2026-02-08 13:20:04'),
(109, 'App\\Models\\User', 1, 'app-token', '8c5cf5cfef38edf5141810c3d872f0282958066bd65621ce0247c6449ae7d38f', '[\"*\"]', NULL, NULL, '2026-02-08 13:20:05', '2026-02-08 13:20:05'),
(110, 'App\\Models\\User', 1, 'app-token', '9110a28347bd3cd1770eabf046fd89d67a351de0cf1862c73ea9c88d069615c8', '[\"*\"]', NULL, NULL, '2026-02-08 13:20:06', '2026-02-08 13:20:06'),
(111, 'App\\Models\\User', 1, 'app-token', 'bdecb3eb407ed8b5bcbaa4e198b4521a3f3a92f70960cf1ed773889f984eabd0', '[\"*\"]', NULL, NULL, '2026-02-08 13:20:06', '2026-02-08 13:20:06'),
(112, 'App\\Models\\User', 1, 'app-token', '8f54a9d4e21a38de8b858bb3d96a97be76d6a0d1fa796061ed5255ab1b9f5703', '[\"*\"]', NULL, NULL, '2026-02-08 13:20:10', '2026-02-08 13:20:10'),
(113, 'App\\Models\\User', 1, 'app-token', 'cc2f9895d2980b377c09ed9c1505c8f15e0b63b43cdcd93359fb656b5ab45d1a', '[\"*\"]', NULL, NULL, '2026-02-08 13:22:28', '2026-02-08 13:22:28'),
(114, 'App\\Models\\User', 1, 'app-token', '0f61c93700d4f7b6dfdb84b609097935b61f05d43e9b2cbaee5be89761e9fede', '[\"*\"]', NULL, NULL, '2026-02-08 13:22:30', '2026-02-08 13:22:30'),
(115, 'App\\Models\\User', 1, 'app-token', '6cb7fd08c86ac321a92d210f451ac7299e9c16accfc95c9fc676efb8e2342cbf', '[\"*\"]', NULL, NULL, '2026-02-08 13:22:31', '2026-02-08 13:22:31'),
(116, 'App\\Models\\User', 1, 'app-token', '58b421f2d383b14ef24bdde67e9ed955a1f6126ee90b46f1f2a0d2e5f8085d26', '[\"*\"]', NULL, NULL, '2026-02-08 13:22:31', '2026-02-08 13:22:31'),
(118, 'App\\Models\\User', 1, 'app-token', '179ff97002b926c6dac65b3390a90ddb94bba694e59d8d2bea0f2040f5f528e2', '[\"*\"]', NULL, NULL, '2026-02-08 13:25:56', '2026-02-08 13:25:56'),
(119, 'App\\Models\\User', 1, 'app-token', '7bc49f732e8cb584c8e6325e12119337fbb90089a344727bfa44058e185eb815', '[\"*\"]', NULL, NULL, '2026-02-08 13:26:00', '2026-02-08 13:26:00'),
(120, 'App\\Models\\User', 1, 'app-token', 'e1aa92e8494ae0283e65e0963fcfe8e8fe0644dfe6cb0a80b3f1dc23f7efcc9d', '[\"*\"]', NULL, NULL, '2026-02-08 13:26:19', '2026-02-08 13:26:19'),
(121, 'App\\Models\\User', 1, 'app-token', '2e683080ea4622cd54897b12cbd9c67e1908891f43092503751eaf39fb3755d1', '[\"*\"]', NULL, NULL, '2026-02-08 13:26:21', '2026-02-08 13:26:21'),
(122, 'App\\Models\\User', 1, 'app-token', 'a8a8e83de7e179649e4dc1465cfb6b3271e821a5dc0c21b7a527927fa44e91c0', '[\"*\"]', '2026-02-08 13:28:36', NULL, '2026-02-08 13:27:17', '2026-02-08 13:28:36'),
(127, 'App\\Models\\User', 2, 'app-token', 'a6ef0b15d5689047360274d6ef917d16665e44e5c6dd83ff2f0774226303db4f', '[\"*\"]', '2026-02-08 13:44:52', NULL, '2026-02-08 13:44:01', '2026-02-08 13:44:52'),
(128, 'App\\Models\\User', 1, 'app-token', '13df2b9efc27c01f3002b4d1ff37239c8f09c8509257eef393a969dca3cd8023', '[\"*\"]', '2026-02-08 13:55:31', NULL, '2026-02-08 13:44:27', '2026-02-08 13:55:31');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `unit_type` enum('kg','pcs','pack') NOT NULL DEFAULT 'pcs',
  `cost_price` decimal(10,2) NOT NULL,
  `selling_price` decimal(10,2) NOT NULL,
  `stock_qty` decimal(10,3) NOT NULL DEFAULT 0.000,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `unit_type`, `cost_price`, `selling_price`, `stock_qty`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Pigro Premium Starter', 'kg', 40.00, 49.00, 186.000, NULL, '2026-01-03 04:06:40', '2026-02-08 13:44:51'),
(2, 'Pigro Vital Hog Gestation', 'kg', 38.00, 43.00, 177.000, NULL, '2026-01-03 04:06:40', '2026-02-08 09:32:05'),
(3, 'Pigro Vital Hog Gestation', 'kg', 38.00, 43.00, 198.000, NULL, '2026-01-03 04:06:40', '2026-02-08 09:34:11'),
(4, 'Pigro Vital Hog Grower', 'kg', 40.00, 45.00, 73.000, NULL, '2026-01-03 04:06:40', '2026-02-08 13:30:14'),
(5, 'Pigro Milkmaker', 'kg', 45.00, 50.00, 200.000, NULL, '2026-01-03 04:06:40', '2026-01-23 10:14:51'),
(6, 'Pigro Premium Finisher', 'kg', 42.00, 47.00, 188.000, NULL, '2026-01-03 04:06:40', '2026-02-08 13:44:51'),
(7, 'Early Wean', 'pack', 105.00, 110.00, 200.000, NULL, '2026-01-03 04:06:52', '2026-01-23 10:14:59'),
(8, 'BSB', 'pack', 52.00, 57.00, 173.000, NULL, '2026-01-03 04:06:52', '2026-02-08 13:30:14'),
(9, 'Stag Dev 1-4', 'pack', 58.00, 63.00, 200.000, NULL, '2026-01-03 04:06:52', '2026-01-03 18:26:15'),
(10, 'Stag Dev 4+', 'pack', 57.00, 62.00, 200.000, NULL, '2026-01-03 04:06:52', '2026-01-03 04:53:14'),
(11, 'Platinum', 'pack', 65.00, 70.00, 188.000, NULL, '2026-01-03 04:06:52', '2026-02-08 12:39:04'),
(12, 'Enertone (Pack)', 'pack', 47.00, 52.00, 188.000, NULL, '2026-01-03 04:06:52', '2026-02-08 12:39:04'),
(13, 'Enertone (Kg)', 'kg', 44.00, 49.00, 200.000, NULL, '2026-01-03 04:06:52', '2026-01-03 04:06:52'),
(14, 'Slasher', 'kg', 45.50, 50.50, 200.000, NULL, '2026-01-03 04:06:52', '2026-01-03 04:06:52'),
(15, 'Crack Corn', 'kg', 45.00, 50.00, 200.000, NULL, '2026-01-03 04:06:52', '2026-01-03 04:06:52'),
(16, 'Ready Mix', 'kg', 42.00, 47.00, 200.000, NULL, '2026-01-03 04:06:52', '2026-01-23 10:31:17'),
(17, '16 Kinds', 'kg', 40.00, 45.00, 200.000, NULL, '2026-01-03 04:06:52', '2026-01-02 23:00:12'),
(18, '7 Kinds', 'kg', 38.00, 43.00, 200.000, NULL, '2026-01-03 04:06:52', '2026-01-03 04:06:52'),
(19, 'GF 2k', 'kg', 42.00, 47.00, 200.000, NULL, '2026-01-03 04:06:52', '2026-02-08 07:57:23'),
(20, 'Galli 1', 'kg', 45.50, 50.50, 200.000, NULL, '2026-01-03 04:06:52', '2026-01-02 23:00:12'),
(21, 'Galli 2', 'kg', 44.50, 49.50, 200.000, NULL, '2026-01-03 04:06:52', '2026-01-03 04:06:52'),
(22, 'Galli 3', 'kg', 40.00, 45.00, 200.000, NULL, '2026-01-03 04:06:52', '2026-01-03 04:06:52'),
(23, 'B50', 'pcs', 9.00, 14.00, 200.000, NULL, '2026-01-03 04:07:07', '2026-01-03 04:07:07'),
(24, 'Amtyl', 'pcs', 10.00, 15.00, 200.000, NULL, '2026-01-03 04:07:07', '2026-01-10 02:17:45'),
(25, 'Doxilac', 'pcs', 10.00, 15.00, 200.000, NULL, '2026-01-03 04:07:07', '2026-01-03 04:07:07'),
(26, 'Vitmin Pro', 'pack', 25.00, 30.00, 200.000, NULL, '2026-01-03 04:07:07', '2026-01-03 04:07:07'),
(27, 'Ambroxtyl', 'pack', 35.00, 40.00, 200.000, NULL, '2026-01-03 04:07:07', '2026-01-03 04:07:07'),
(28, 'Vetracin Gold', 'pack', 25.00, 30.00, 200.000, NULL, '2026-01-03 04:07:07', '2026-01-03 18:26:15'),
(29, 'Vetracin Classic', 'pack', 25.00, 30.00, 200.000, NULL, '2026-01-03 04:07:07', '2026-01-03 04:07:07'),
(30, 'test', 'pcs', 123.00, 328.00, 200.000, NULL, '2026-01-09 11:48:14', '2026-01-09 11:48:14');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `cash_received` decimal(10,2) NOT NULL,
  `change_given` decimal(10,2) NOT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `total_price`, `cash_received`, `change_given`, `reference`, `created_at`, `updated_at`) VALUES
(1, 1081.00, 2000.00, 919.00, 'SALE-20260208-1', '2026-02-08 09:32:05', '2026-02-08 09:32:05'),
(2, 102.00, 122.00, 20.00, 'SALE-20260208-2', '2026-02-08 12:30:41', '2026-02-08 12:30:41'),
(3, 1224.00, 11111.00, 9887.00, 'SALE-20260208-3', '2026-02-08 12:34:09', '2026-02-08 12:34:09'),
(4, 4995.00, 11211.00, 6216.00, 'SALE-20260208-4', '2026-02-08 13:03:33', '2026-02-08 13:03:33');

-- --------------------------------------------------------

--
-- Table structure for table `sale_items`
--

CREATE TABLE `sale_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sales_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` decimal(10,3) NOT NULL,
  `cost_price` decimal(10,2) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sale_items`
--

INSERT INTO `sale_items` (`id`, `sales_id`, `product_id`, `quantity`, `cost_price`, `unit_price`, `subtotal`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1.000, 40.00, 49.00, 49.00, '2026-02-08 09:32:05', '2026-02-08 09:32:05'),
(2, 1, 2, 23.000, 38.00, 43.00, 989.00, '2026-02-08 09:32:05', '2026-02-08 09:32:05'),
(3, 1, 3, 1.000, 38.00, 43.00, 43.00, '2026-02-08 09:32:05', '2026-02-08 09:32:05'),
(4, 2, 4, 1.000, 40.00, 45.00, 45.00, '2026-02-08 12:30:41', '2026-02-08 12:30:41'),
(5, 2, 8, 1.000, 52.00, 57.00, 57.00, '2026-02-08 12:30:41', '2026-02-08 12:30:41'),
(6, 3, 4, 12.000, 40.00, 45.00, 540.00, '2026-02-08 12:34:09', '2026-02-08 12:34:09'),
(7, 3, 8, 12.000, 52.00, 57.00, 684.00, '2026-02-08 12:34:09', '2026-02-08 12:34:09'),
(8, 4, 4, 111.000, 40.00, 45.00, 4995.00, '2026-02-08 13:03:33', '2026-02-08 13:03:33');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'cashier',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@pos.local', NULL, '$2y$12$LCTMAFKrg.fAQBtkJ/JF.uSnNvoKd1oKzc7dNRCaia5bP1puR7eBS', 'admin', NULL, '2026-02-08 09:53:51', '2026-02-08 09:53:51'),
(2, 'cashier', 'cashier@pos.local', NULL, '$2y$12$1N/ip44QP41C5PTk4jRnJOae.ZowcAOXtMjCfGVkk7pOHLGm7A8ny', 'cashier', NULL, '2026-02-08 09:53:51', '2026-02-08 09:53:51');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `credits`
--
ALTER TABLE `credits`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `credit_items`
--
ALTER TABLE `credit_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `credit_items_credit_id_foreign` (`credit_id`),
  ADD KEY `credit_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `credit_payments`
--
ALTER TABLE `credit_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `credit_payments_credit_id_foreign` (`credit_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_items_sales_id_foreign` (`sales_id`),
  ADD KEY `sale_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `credits`
--
ALTER TABLE `credits`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `credit_items`
--
ALTER TABLE `credit_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `credit_payments`
--
ALTER TABLE `credit_payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=129;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `sale_items`
--
ALTER TABLE `sale_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `credit_items`
--
ALTER TABLE `credit_items`
  ADD CONSTRAINT `credit_items_credit_id_foreign` FOREIGN KEY (`credit_id`) REFERENCES `credits` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `credit_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `credit_payments`
--
ALTER TABLE `credit_payments`
  ADD CONSTRAINT `credit_payments_credit_id_foreign` FOREIGN KEY (`credit_id`) REFERENCES `credits` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD CONSTRAINT `sale_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sale_items_sales_id_foreign` FOREIGN KEY (`sales_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
