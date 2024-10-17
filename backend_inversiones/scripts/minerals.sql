-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.32-MariaDB - Source distribution
-- SO del servidor:              Linux
-- HeidiSQL Versión:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para minerals
CREATE DATABASE IF NOT EXISTS `minerals` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `minerals`;

-- Volcando estructura para tabla minerals.contracts
CREATE TABLE IF NOT EXISTS `contracts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `investment_id` bigint(20) NOT NULL DEFAULT 0,
  `contract_code` varchar(20) NOT NULL,
  `contract_date` date NOT NULL,
  `contract_file_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `contract_code` (`contract_code`),
  KEY `project_user` (`project_id`),
  KEY `user_id` (`user_id`),
  KEY `contract_id` (`investment_id`) USING BTREE,
  CONSTRAINT `investment` FOREIGN KEY (`investment_id`) REFERENCES `investments` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `project_id_fk_` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla minerals.contracts: ~0 rows (aproximadamente)

-- Volcando estructura para tabla minerals.investments
CREATE TABLE IF NOT EXISTS `investments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `investment_date` timestamp NULL DEFAULT current_timestamp(),
  `profit_percentage` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `project_id_inv` (`project_id`),
  KEY `user_id_inv` (`user_id`),
  CONSTRAINT `project_id_inv` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `user_id_inv` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla minerals.investments: ~0 rows (aproximadamente)

-- Volcando estructura para tabla minerals.minerals
CREATE TABLE IF NOT EXISTS `minerals` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `price` decimal(20,6) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `deleted` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla minerals.minerals: ~1 rows (aproximadamente)
INSERT INTO `minerals` (`id`, `name`, `price`, `description`, `image`, `deleted`) VALUES
	(1, 'zinc editado', 0.000000, NULL, NULL, 1);

-- Volcando estructura para tabla minerals.operating_expenses
CREATE TABLE IF NOT EXISTS `operating_expenses` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(200) NOT NULL,
  `expenses` double(20,2) NOT NULL,
  `project_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_id_fk_5` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla minerals.operating_expenses: ~0 rows (aproximadamente)

-- Volcando estructura para tabla minerals.projects
CREATE TABLE IF NOT EXISTS `projects` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `investment_goal` bigint(20) NOT NULL,
  `status` enum('open','in_transit','closed') NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `profit_percentage` decimal(10,2) DEFAULT NULL,
  `deleted` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla minerals.projects: ~0 rows (aproximadamente)

-- Volcando estructura para tabla minerals.project_minerals
CREATE TABLE IF NOT EXISTS `project_minerals` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) NOT NULL,
  `mineral_id` bigint(20) NOT NULL,
  `deleted` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `mineral_id` (`mineral_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `id_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `mineral_id` FOREIGN KEY (`mineral_id`) REFERENCES `minerals` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla minerals.project_minerals: ~0 rows (aproximadamente)

-- Volcando estructura para tabla minerals.project_timeline
CREATE TABLE IF NOT EXISTS `project_timeline` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) NOT NULL,
  `phase` varchar(50) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` varchar(50) NOT NULL,
  `description` varchar(200) NOT NULL,
  `price_mineral_1` decimal(10,2) NOT NULL,
  `price_mineral_2` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `project_id_fk` (`project_id`),
  CONSTRAINT `project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla minerals.project_timeline: ~0 rows (aproximadamente)

-- Volcando estructura para tabla minerals.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('super_user','admin','client') NOT NULL,
  `two_factor_enabled` tinyint(1) DEFAULT 0,
  `name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla minerals.users: ~0 rows (aproximadamente)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
