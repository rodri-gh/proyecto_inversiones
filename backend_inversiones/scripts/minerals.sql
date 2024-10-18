-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for minerals
CREATE DATABASE IF NOT EXISTS `minerals` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `minerals`;

-- Dumping structure for table minerals.account
CREATE TABLE IF NOT EXISTS `account` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL DEFAULT '0',
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `FK_account_users` (`user_id`),
  CONSTRAINT `FK_account_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table minerals.account: ~0 rows (approximately)
REPLACE INTO `account` (`id`, `user_id`, `username`, `password`) VALUES
	(3, 5, 'admin', '$2b$10$ZWFoRCMtOqf8t2e9hZ/dke5KDqNnnYiJYeXCRaDB6CqKqmZdqrzUi');

-- Dumping structure for table minerals.contracts
CREATE TABLE IF NOT EXISTS `contracts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `investment_id` bigint NOT NULL DEFAULT '0',
  `contract_code` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `contract_date` date NOT NULL,
  `contract_file_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `contract_code` (`contract_code`),
  KEY `project_user` (`project_id`),
  KEY `user_id` (`user_id`),
  KEY `contract_id` (`investment_id`) USING BTREE,
  CONSTRAINT `investment` FOREIGN KEY (`investment_id`) REFERENCES `investments` (`id`),
  CONSTRAINT `project_id_fk_` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table minerals.contracts: ~0 rows (approximately)

-- Dumping structure for table minerals.investments
CREATE TABLE IF NOT EXISTS `investments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `investment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `profit_percentage` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `project_id_inv` (`project_id`),
  KEY `user_id_inv` (`user_id`),
  CONSTRAINT `project_id_inv` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `user_id_inv` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table minerals.investments: ~0 rows (approximately)

-- Dumping structure for table minerals.minerals
CREATE TABLE IF NOT EXISTS `minerals` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `price` decimal(20,6) NOT NULL,
  `description` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image` text COLLATE utf8mb4_general_ci,
  `deleted` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table minerals.minerals: ~0 rows (approximately)
REPLACE INTO `minerals` (`id`, `name`, `price`, `description`, `image`, `deleted`) VALUES
	(1, 'zinc editado', 0.000000, NULL, NULL, 1);

-- Dumping structure for table minerals.operating_expenses
CREATE TABLE IF NOT EXISTS `operating_expenses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `expenses` double(20,2) NOT NULL,
  `project_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_id_fk_5` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table minerals.operating_expenses: ~0 rows (approximately)

-- Dumping structure for table minerals.projects
CREATE TABLE IF NOT EXISTS `projects` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `investment_goal` bigint NOT NULL,
  `status` enum('open','in_transit','closed') COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `profit_percentage` decimal(10,2) DEFAULT NULL,
  `deleted` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table minerals.projects: ~0 rows (approximately)

-- Dumping structure for table minerals.project_minerals
CREATE TABLE IF NOT EXISTS `project_minerals` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `mineral_id` bigint NOT NULL,
  `deleted` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `mineral_id` (`mineral_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `id_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `mineral_id` FOREIGN KEY (`mineral_id`) REFERENCES `minerals` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table minerals.project_minerals: ~0 rows (approximately)

-- Dumping structure for table minerals.project_timeline
CREATE TABLE IF NOT EXISTS `project_timeline` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `phase` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `price_mineral_1` decimal(10,2) NOT NULL,
  `price_mineral_2` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `project_id_fk` (`project_id`),
  CONSTRAINT `project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table minerals.project_timeline: ~0 rows (approximately)

-- Dumping structure for table minerals.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` enum('super_user','admin','client') COLLATE utf8mb4_general_ci NOT NULL,
  `two_factor_enabled` tinyint(1) DEFAULT '0',
  `name` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `deleted` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table minerals.users: ~1 rows (approximately)
INSERT INTO `users` (`id`, `email`, `phone`, `role`, `two_factor_enabled`, `name`, `last_name`, `deleted`) VALUES
	(1, 'admin@gmail.com', '77777777', 'super_user', 0, 'admin', 'admin', 1);

INSERT INTO `account` (`id`, `user_id`, `username`, `password`) VALUES
	(1, 1, 'admin', '$2b$10$ZWFoRCMtOqf8t2e9hZ/dke5KDqNnnYiJYeXCRaDB6CqKqmZdqrzUi');
/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
