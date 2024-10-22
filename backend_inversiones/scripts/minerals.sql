CREATE DATABASE IF NOT EXISTS `minerals`;
USE `minerals`;

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


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




CREATE TABLE IF NOT EXISTS `minerals` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `price` decimal(20,6) NOT NULL,
  `description` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image` text COLLATE utf8mb4_general_ci,
  `deleted` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS `operating_expenses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `expenses` double(20,2) NOT NULL,
  `project_id` bigint(20) NOT NULL,
  `deleted` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_id_fk_5` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


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

CREATE TABLE IF NOT EXISTS `movements` (
  `movement_id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `description` TEXT NOT NULL,
  `type` ENUM('income', 'expense') NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `request_date` DATETIME NOT NULL,
  `disbursement_date` DATETIME DEFAULT NULL,
  `state` TINYINT(1) NOT NULL, 
  PRIMARY KEY (`movement_id`), 
  KEY `user_id_fk` (`user_id`),
  CONSTRAINT `FK_movements_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `contacts` (
  `contact_id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT DEFAULT NULL, 
  `name` VARCHAR(100) NOT NULL, 
  `lastname` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL, 
  `phone` VARCHAR(20) DEFAULT NULL,
  `comments` TEXT NOT NULL,
  `answer` TEXT DEFAULT NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 0,
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP, 
  PRIMARY KEY (`contact_id`),
  KEY `user_id_fk` (`user_id`), 
  CONSTRAINT `FK_contacts_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `faq` (
  `faq_id` INT NOT NULL AUTO_INCREMENT,
  `ask` TEXT NOT NULL, 
  `answer` TEXT NOT NULL,
  `status` TINYINT NOT NULL DEFAULT 1,
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP, 
  PRIMARY KEY (`faq_id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `category_posts` (
  `category_post_id` INT NOT NULL AUTO_INCREMENT, 
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`category_post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `posts` (
  `post_id` INT NOT NULL AUTO_INCREMENT,
  `category_post_id` INT NOT NULL,
  `user_id` BIGINT NOT NULL, 
  `title` VARCHAR(255) NOT NULL,
  `summary` TEXT NOT NULL, 
  `cover_image` VARCHAR(255) DEFAULT NULL,
  `content` TEXT NOT NULL,
  `status` TINYINT NOT NULL DEFAULT 1,
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
  `updated_date` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`),
  KEY `category_post_id` (`category_post_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `fk_category_post` FOREIGN KEY (`category_post_id`) REFERENCES `category_posts` (`category_post_id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `withdrawal_requests` (
  `withdrawal_requests_id` INT NOT NULL AUTO_INCREMENT, 
  `investment_id` BIGINT NOT NULL, 
  `user_id` BIGINT NOT NULL, 
  -- `type` ENUM('ganancias', 'type2', 'type3') NOT NULL,  el ipo de solicitud (ajustar los valores según lo que nesesitemos)
  `request_amount` DECIMAL(10,2) NOT NULL,
  `commission_apply` DECIMAL(10,2) NOT NULL, 
  `receive_amount` DECIMAL(10,2) NOT NULL,
  `request_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
  `approval_date` DATETIME DEFAULT NULL, 
  `photo_document` VARCHAR(255) DEFAULT NULL,
  `selfie_photo` VARCHAR(255) DEFAULT NULL, 
  `status` ENUM('pending', 'approved', 'rejected') NOT NULL,
  PRIMARY KEY (`withdrawal_requests_id`), 
  KEY `investment_id` (`investment_id`),
  KEY `user_id` (`user_id`), 
  CONSTRAINT `fk_investment` FOREIGN KEY (`investment_id`) REFERENCES `investments` (`id`), 
  CONSTRAINT `fk_user_withdrawal` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
