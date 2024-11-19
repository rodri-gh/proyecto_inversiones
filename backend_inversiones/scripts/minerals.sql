  CREATE DATABASE IF NOT EXISTS `u488326007_hamilo_mineral`;
  USE `u488326007_hamilo_mineral`;

  CREATE TABLE IF NOT EXISTS `projects` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
    `description` text COLLATE utf8mb4_general_ci,
    `investment_goal` DECIMAL(15, 3) NOT NULL,
    `status` enum('open','in_transit','closed') COLLATE utf8mb4_general_ci NOT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `profit_percentage` decimal(10,2) DEFAULT NULL,
    `deleted` tinyint NOT NULL DEFAULT 0,
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
    `deleted` tinyint NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE KEY `email` (`email`),
    UNIQUE KEY `phone` (`phone`)
  ) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

  CREATE TABLE IF NOT EXISTS `accounts` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `user_id` bigint NOT NULL DEFAULT '0',
    `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
    `password` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `username` (`username`),
    KEY `FK_account_users` (`user_id`),
    CONSTRAINT `FK_account_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `investments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `contract_id` bigint(20) NOT NULL,
  `project_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `investment_date` timestamp NULL DEFAULT current_timestamp(),
  `profit_percentage` decimal(10,2) DEFAULT NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'USD',
  `status` enum('active','pending','closed') NOT NULL DEFAULT 'active',
  `earnings` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `project_id_inv` (`project_id`),
  KEY `user_id_inv` (`user_id`),
  KEY `fk_investments_contract_id` (`contract_id`),
  CONSTRAINT `fk_investments_contract_id` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`),
  CONSTRAINT `project_id_inv` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `user_id_inv` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

  CREATE TABLE IF NOT EXISTS `contracts` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `project_id` bigint NOT NULL,
    `user_id` bigint NOT NULL,
    `investment_id` bigint NOT NULL DEFAULT 0,
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
    `deleted` tinyint NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE KEY `name` (`name`)
  ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

  CREATE TABLE IF NOT EXISTS `operating_expenses` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
    `description` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
    `expenses` double(20,2) NOT NULL,
    `project_id` bigint(20) NOT NULL,
    `deleted` tinyint(4) NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `project_id` (`project_id`),
    CONSTRAINT `project_id_fk_5` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
  ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `project_minerals` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) NOT NULL,
  `mineral_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `purchase_price` decimal(20,3) NOT NULL,
  `pre_purchase` decimal(20,3) DEFAULT NULL,
  `estimated_purchase_price` decimal(20,3) DEFAULT NULL,
  `deleted` tinyint(4) NOT NULL DEFAULT 0,
  `exit_price` decimal(20,3) NOT NULL,
  `sale_price` decimal(20,3) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'open',
  PRIMARY KEY (`id`),
  KEY `mineral_id` (`mineral_id`),
  KEY `project_id` (`project_id`),
  KEY `fk_user_id` (`user_id`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `id_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `mineral_id` FOREIGN KEY (`mineral_id`) REFERENCES `minerals` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

  CREATE TABLE IF NOT EXISTS `project_timelines` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `project_id` bigint(20) NOT NULL,
    `phase` varchar(50) NOT NULL,
    `start_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `end_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `description` varchar(200) NOT NULL,
    `price_mineral1` decimal(10,2) NOT NULL,
    `price_mineral2` decimal(10,2) NOT NULL,
    `deleted` tinyint(4) NOT NULL DEFAULT 0,
    `status` varchar(255) NOT NULL,
    PRIMARY KEY (`id`) USING BTREE,
    KEY `project_id_fk` (`project_id`),
    CONSTRAINT `project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

  CREATE TABLE IF NOT EXISTS `movements` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `description` TEXT NOT NULL,
    `type` ENUM('income', 'expense') NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `request_date` DATETIME NOT NULL,
    `disbursement_date` DATETIME DEFAULT NULL,
    `state` TINYINT(1) NOT NULL, 
    PRIMARY KEY (`id`), 
    KEY `user_id_fk` (`user_id`),
    CONSTRAINT `FK_movements_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) 
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

  CREATE TABLE IF NOT EXISTS `contacts` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL, 
    `last_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL, 
    `phone` VARCHAR(20) DEFAULT NULL,
    `comment` TEXT NOT NULL,
    `answer` TEXT DEFAULT NULL,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,
    `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_date` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP, 
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

  CREATE TABLE IF NOT EXISTS `faqs` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `ask` TEXT NOT NULL, 
    `answer` TEXT NOT NULL,
    `deleted` tinyint(4) NOT NULL DEFAULT 0,
    `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_date` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP, 
    PRIMARY KEY (`id`) 
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

  CREATE TABLE IF NOT EXISTS `category_posts` (
    `id` INT NOT NULL AUTO_INCREMENT, 
    `name` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

  CREATE TABLE IF NOT EXISTS `posts` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `category_post_id` INT NOT NULL,
    `user_id` BIGINT NOT NULL, 
    `title` VARCHAR(255) NOT NULL,
    `summary` TEXT NOT NULL, 
    `cover_image` VARCHAR(255) DEFAULT NULL,
    `content` TEXT NOT NULL,
    `status` TINYINT NOT NULL DEFAULT 1,
    `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    `updated_date` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `category_post_id` (`category_post_id`),
    KEY `user_id` (`user_id`),
    CONSTRAINT `fk_category_post` FOREIGN KEY (`category_post_id`) REFERENCES `category_posts` (`id`),
    CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) 
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

  CREATE TABLE IF NOT EXISTS `withdrawal_requests` (
    `id` INT NOT NULL AUTO_INCREMENT, 
    `investment_id` BIGINT NOT NULL, 
    `user_id` BIGINT NOT NULL, 
    `request_amount` DECIMAL(10,2) NOT NULL,
    `commission_apply` DECIMAL(10,2) NOT NULL, 
    `receive_amount` DECIMAL(10,2) NOT NULL,
    `request_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    `approval_date` DATETIME DEFAULT NULL, 
    `photo_document` VARCHAR(255) DEFAULT NULL,
    `selfie_photo` VARCHAR(255) DEFAULT NULL, 
    `status` ENUM('pending', 'approved', 'rejected') NOT NULL,
    PRIMARY KEY (`id`), 
    KEY `investment_id` (`investment_id`),
    KEY `user_id` (`user_id`), 
    CONSTRAINT `fk_investment` FOREIGN KEY (`investment_id`) REFERENCES `investments` (`id`), 
    CONSTRAINT `fk_user_withdrawal` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) 
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `stage_project_minerals` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `project_minerals_id` bigint(20) NOT NULL,
  `stage_name` varchar(255) NOT NULL,
  `start_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `end_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_project_mineral_stage_name` (`project_minerals_id`,`stage_name`),
  CONSTRAINT `fk_project_minerals` FOREIGN KEY (`project_minerals_id`) REFERENCES `project_minerals` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `project_payments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `project_id` bigint(20) NOT NULL,
  `amount_invested` decimal(10,2) NOT NULL,
  `amount_earned` decimal(10,2) NOT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `payout_date` timestamp NULL DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `fk_project_payments_project_id` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `fk_project_payments_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `financial_transactions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `project_id` bigint(20) DEFAULT NULL,
  `transaction_type` enum('deposit','withdrawal','commission','income','expense') NOT NULL,
  `amount` decimal(20,3) NOT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `description` text NOT NULL,
  `status` enum('completed','pending','failed') NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_project_id` (`project_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_financial_transactions_project_id` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `fk_financial_transactions_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci



INSERT INTO `users` (`id`, `email`, `phone`, `role`, `two_factor_enabled`, `name`, `last_name`, `deleted`) VALUES
	(1, 'admin@gmail.com', '77777777', 'super_user', 0, 'admin', 'admin', 1);

INSERT INTO `accounts` (`id`, `user_id`, `username`, `password`) VALUES
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