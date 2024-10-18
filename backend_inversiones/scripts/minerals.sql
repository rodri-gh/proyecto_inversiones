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



INSERT INTO `users` (`id`, `email`, `phone`, `role`, `two_factor_enabled`, `name`, `last_name`, `deleted`) VALUES
	(1, 'admin@gmail.com', '77777777', 'super_user', 0, 'admin', 'admin', 1);

INSERT INTO `account` (`id`, `user_id`, `username`, `password`) VALUES
	(1, 1, 'admin', '$2b$10$ZWFoRCMtOqf8t2e9hZ/dke5KDqNnnYiJYeXCRaDB6CqKqmZdqrzUi');

INSERT INTO `minerals` (`id`, `name`, `price`, `description`, `image`, `deleted`) VALUES
	(1, 'Zinc', 10.500000, 'descripcion del zinc', '1729202313914.jpg', 1),
	(2, 'Plata', 25.690000, 'Descripcion de la plata', '1729202372093.jpg', 1),
	(3, 'Plomo', 95.690000, 'Descripción del plomo', '1729202497906.jpeg', 1),
	(4, 'Cobre', 25.630000, 'Descripción del cobre', '1729202520309.jpeg', 0);


INSERT INTO `projects` (`id`, `name`, `description`, `investment_goal`, `status`, `created_at`, `profit_percentage`, `deleted`) VALUES
	(1, 'Hiram Craft', 'Mollit quae ut autem', 80, 'closed', '2024-10-18 14:31:58', 50.00, 0),
	(2, 'Chester Scott', 'Est autem et except', 97, 'open', '2024-10-18 15:22:37', 85.00, 1);

INSERT INTO `operating_expenses` (`id`, `name`, `description`, `expenses`, `project_id`, `deleted`) VALUES
	(1, 'gatos 1', 'dsada', 58.00, 1, 1),
	(2, 'gatos 2', 'dsada', 90.00, 1, 1);
