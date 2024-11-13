  CREATE DATABASE IF NOT EXISTS `u488326007_hamilo_mineral`;
  USE `u488326007_hamilo_mineral`;

  -- triger para no dejar crear mas de 50 proyecto como limite
DELIMITER $$

CREATE TRIGGER before_insert_project
BEFORE INSERT ON projects
FOR EACH ROW
BEGIN
	DECLARE projectCount INT DEFAULT 0;

    SELECT COUNT(*) INTO projectCount
    FROM projects WHERE deleted = 0;
   
    IF projectCount >= 50 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Límite de proyectos 50 no puedes crear más proyectos!';
    END IF;
END $$

DELIMITER ;


-- triger para limite de minerales 2 por projecto
DELIMITER $$

CREATE TRIGGER before_insert_mineral
BEFORE INSERT ON project_minerals
FOR EACH ROW
BEGIN
	DECLARE mineralCount INT DEFAULT 0;

    SELECT COUNT(*) INTO mineralCount
    FROM project_minerals WHERE project_id = NEW.project_id AND deleted = 0;
   
    IF mineralCount >= 2 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Límite de minerales es 2 por projecto no puedes agregar mas!';
    END IF;
END $$

DELIMITER ;