CREATE DATABASE IF NOT EXISTS `minerals`;
USE `minerals`;


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