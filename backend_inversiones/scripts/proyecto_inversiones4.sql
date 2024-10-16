/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS `proyecto_inversiones` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `proyecto_inversiones`;

CREATE TABLE IF NOT EXISTS `ajustes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comision_fija_ganancia_inversionista` decimal(10,2) DEFAULT NULL,
  `comision_porcentual_ganancia_inversionista` decimal(5,2) DEFAULT NULL,
  `comision_fija_retiro_admin` decimal(10,2) DEFAULT NULL,
  `comision_porcentual_retiro_admin` decimal(5,2) DEFAULT NULL,
  `tiempo_minimo_inversion` int DEFAULT NULL,
  `tiempo_maximo_inversion` int DEFAULT NULL,
  `sancion_porcentual_retraso` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;

CREATE TABLE IF NOT EXISTS `categorias_minerales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `eliminado` enum('0','1') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE IF NOT EXISTS `categorias_posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `eliminado` enum('0','1') NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE IF NOT EXISTS `contacto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `comentarios` text NOT NULL,
  `respuesta` text NOT NULL,
  `eliminado` enum('0','1') NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE IF NOT EXISTS `faq` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pregunta` text NOT NULL,
  `respuesta` text NOT NULL,
  `eliminado` enum('0','1') NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE IF NOT EXISTS `informacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `codigo` varchar(255) NOT NULL,
  `imagen` text NOT NULL,
  `categoria_mineral_id` int NOT NULL DEFAULT '0',
  `descripcion` text NOT NULL,
  `monto_inversion` decimal(15,2) NOT NULL,
  `cantidad_maxima_inversiones` int NOT NULL,
  `vision` text NOT NULL,
  `eliminado` enum('0','1') NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `categoria_mineral_id` (`categoria_mineral_id`),
  CONSTRAINT `categoria_mineral_id` FOREIGN KEY (`categoria_mineral_id`) REFERENCES `categorias_minerales` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE IF NOT EXISTS `inversiones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int NOT NULL,
  `inversor_id` int NOT NULL,
  `monto` decimal(15,2) NOT NULL,
  `tipo_ganancia` enum('Monto fijo','Porcentual') NOT NULL,
  `ganancia_estimada` decimal(15,2) NOT NULL,
  `fecha_deposito` date NOT NULL,
  `eliminado` enum('0','1') NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `inversor_id` (`inversor_id`),
  CONSTRAINT `inversiones_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `inversiones_ibfk_2` FOREIGN KEY (`inversor_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

CREATE TABLE IF NOT EXISTS `links` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `link` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `eliminado` enum('0','1') NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `cliente_id` (`cliente_id`),
  CONSTRAINT `links_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;

CREATE TABLE IF NOT EXISTS `movimientos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo` enum('Ingreso','Egreso') NOT NULL,
  `monto` decimal(15,2) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_solicitud` date NOT NULL,
  `fecha_desembolso` date NOT NULL,
  `eliminado` enum('0','1') NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE IF NOT EXISTS `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `autor_id` int NOT NULL,
  `categoria_id` int NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `resumen` text NOT NULL,
  `imagen_portada` text NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `contenido` text NOT NULL,
  `eliminado` enum('0','1') NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_posts_usuarios` (`autor_id`),
  KEY `FK_posts_categorias_posts` (`categoria_id`),
  CONSTRAINT `FK_posts_categorias_posts` FOREIGN KEY (`categoria_id`) REFERENCES `categorias_posts` (`id`),
  CONSTRAINT `FK_posts_usuarios` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE IF NOT EXISTS `solicitudes_retiro` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo` enum('cliente','inversor') NOT NULL,
  `usuario_id` int NOT NULL,
  `monto_solicitud` decimal(15,2) NOT NULL,
  `comision_aplicar` decimal(10,2) NOT NULL,
  `monto_a_recibir` decimal(15,2) NOT NULL,
  `fecha_solicitud` date NOT NULL,
  `fecha_aprobacion` date NOT NULL,
  `foto_dni` text NOT NULL,
  `selfie_dni` text NOT NULL,
  `estado` enum('Pendiente','Aprobado') NOT NULL,
  `inversion_id` int NOT NULL,
  `eliminado` enum('0','1') NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `inversion_id` (`inversion_id`),
  KEY `fk_usuario_id` (`usuario_id`),
  CONSTRAINT `fk_usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `solicitudes_retiro_ibfk_2` FOREIGN KEY (`inversion_id`) REFERENCES `inversiones` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `codigo_pais` varchar(10) NOT NULL,
  `numero_telefono` varchar(20) NOT NULL,
  `username` varchar(50) NOT NULL,
  `pais_residencia` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `edad` int NOT NULL,
  `acepta_terminos` tinyint(1) NOT NULL DEFAULT '1',
  `imagen` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `rol` enum('Cliente','Inversor','Admin') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT 'Admin',
  `eliminado` enum('0','1') NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `numero_telefono` (`numero_telefono`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
