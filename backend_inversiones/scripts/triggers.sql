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


-- triger para limite de inversion por projecto segun su meta de inversion
DELIMITER $$

CREATE TRIGGER before_insert_contract_investment
BEFORE INSERT ON contracts
FOR EACH ROW
BEGIN
	DECLARE total_investment FLOAT DEFAULT 0;
	DECLARE investment_goal_project FLOAT DEFAULT 0;

    SELECT investment_goal INTO investment_goal_project
    FROM projects WHERE id = NEW.project_id AND deleted = 0;
   
   SELECT COALESCE(SUM(investment_amount), 0) INTO total_investment
   FROM contracts WHERE project_id = NEW.project_id;
  
   IF (total_investment + NEW.investment_amount) > investment_goal_project THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Límite de inversion del projecto se esta superando invierte menos!';
    END IF;
END $$

DELIMITER ;



-- insertar timeline despues de insertar un contrato
DELIMITER $$

CREATE TRIGGER after_project_contract_insert
AFTER INSERT ON contracts
FOR EACH ROW
BEGIN
    DECLARE timeline_start TIMESTAMP;
    DECLARE timeline_end TIMESTAMP;

    SELECT start_date, end_date
    INTO timeline_start, timeline_end
    FROM projects
    WHERE id = NEW.project_id;

    IF NEW.start_date <= timeline_start OR NEW.end_date >= timeline_end THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The contract dates are outside the project timeline range, contract has not been inserted.';
    ELSE
        INSERT INTO project_timelines (project_id, phase, start_date, end_date, description, price_mineral1, price_mineral2, status)
        VALUES (NEW.project_id, 'contrato', NEW.start_date, NEW.end_date, ' ', 0, 0, NEW.status);
    END IF;
END $$

DELIMITER ;


-- para el timeline del phase compra_de_mineral despues de  una insersion
DELIMITER $$

CREATE TRIGGER after_project_mineral_insert
AFTER INSERT ON project_minerals
FOR EACH ROW
BEGIN
	
    IF ( NEW.purchase_price > 0.00 AND NEW.sale_price <= 0.00 ) OR
    		(NEW.pre_purchase > 0.00 AND NEW.sale_price <= 0.00)
    THEN
        IF NOT EXISTS (
            SELECT 1
            FROM project_timelines
            WHERE project_id = NEW.project_id AND phase = 'compra_de_mineral'
        ) THEN
            INSERT INTO project_timelines (project_id, phase, description, price_mineral1, price_mineral2, status)
            VALUES (NEW.project_id, 'compra_de_mineral', 'Fase de compra de mineral', NEW.purchase_price, NEW.pre_purchase, 'open');
        END IF;
    END IF;
  
    IF NEW.sale_price > 0.00 AND NEW.purchase_price > 0.00 OR
    		(NEW.pre_purchase > 0.00 AND NEW.sale_price > 0.00)
    THEN
    
        IF NOT EXISTS (
            SELECT 1
            FROM project_minerals
            WHERE project_id = NEW.project_id AND sale_price <= 0.00 AND deleted = 0
        ) THEN
            IF NOT EXISTS (
                SELECT 1
                FROM project_timelines
                WHERE project_id = NEW.project_id AND phase = 'compra_de_mineral' 
            ) THEN
                INSERT INTO project_timelines (project_id, phase, description, price_mineral1, price_mineral2, status)
                VALUES (NEW.project_id, 'compra_de_mineral', 'Fase de compra de mineral', NEW.purchase_price, NEW.pre_purchase, 'closed');
            ELSE
                UPDATE project_timelines
                SET end_date = CURRENT_TIMESTAMP, status = 'closed'
                WHERE project_id = NEW.project_id AND phase = 'compra_de_mineral';
            END IF;
        END IF;
    END IF;
END $$

DELIMITER ;


-- para el timeline del phase compra_de_mineral despues de una actualizacion
DELIMITER $$

CREATE TRIGGER after_project_mineral_update
AFTER UPDATE ON project_minerals
FOR EACH ROW
BEGIN
	
    IF ( NEW.purchase_price > 0.00 AND NEW.sale_price <= 0.00 ) OR
    		(NEW.pre_purchase > 0.00 AND NEW.sale_price <= 0.00)
    THEN
        IF NOT EXISTS (
            SELECT 1
            FROM project_timelines
            WHERE project_id = NEW.project_id AND phase = 'compra_de_mineral'
        ) THEN
            INSERT INTO project_timelines (project_id, phase, description, price_mineral1, price_mineral2, status)
            VALUES (NEW.project_id, 'compra_de_mineral', 'Fase de compra de mineral', NEW.purchase_price, NEW.pre_purchase, 'open');
        END IF;
    END IF;
  
    IF NEW.sale_price > 0.00 AND NEW.purchase_price > 0.00 OR
    		(NEW.pre_purchase > 0.00 AND NEW.sale_price > 0.00)
    THEN
    
        IF NOT EXISTS (
            SELECT 1
            FROM project_minerals
            WHERE project_id = NEW.project_id AND sale_price <= 0.00 AND deleted = 0
        ) THEN
            IF NOT EXISTS (
                SELECT 1
                FROM project_timelines
                WHERE project_id = NEW.project_id AND phase = 'compra_de_mineral' 
            ) THEN
                INSERT INTO project_timelines (project_id, phase, description, price_mineral1, price_mineral2, status)
                VALUES (NEW.project_id, 'compra_de_mineral', 'Fase de compra de mineral', NEW.purchase_price, NEW.pre_purchase, 'closed');
            ELSE
                UPDATE project_timelines
                SET end_date = CURRENT_TIMESTAMP, status = 'closed'
                WHERE project_id = NEW.project_id AND phase = 'compra_de_mineral';
            END IF;
        END IF;
    END IF;

    IF (OLD.sale_price > 0 AND NEW.sale_price <= 0) OR
        (OLD.purchase_price > 0 AND NEW.purchase_price <= 0) 
    THEN
        IF EXISTS (
            SELECT 1
            FROM project_timelines
            WHERE project_id = NEW.project_id AND phase = 'compra_de_mineral'
        ) THEN
            UPDATE project_timelines
            SET status = 'open', end_date = NULL
            WHERE project_id = NEW.project_id AND phase = 'compra_de_mineral';
        END IF;
    END IF;
END $$

DELIMITER ;

-- trigger para insertar un timeline despues de insertar una inversion
DELIMITER $$

CREATE TRIGGER after_investments_insert
AFTER INSERT ON investments
FOR EACH ROW
BEGIN
    DECLARE existing_id INT;
   
    SELECT id
    INTO existing_id
    FROM project_timelines
    WHERE project_id = NEW.project_id AND phase = 'inversion'
    LIMIT 1;
    
    IF existing_id IS NOT NULL THEN
        UPDATE project_timelines
        SET end_date = CURRENT_TIMESTAMP
        WHERE id = existing_id;
    ELSE
        INSERT INTO project_timelines (project_id, phase, start_date, end_date, description, price_mineral1, price_mineral2, status)
        VALUES (NEW.project_id, 'inversion', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ' ', 0, 0, NEW.status);
    END IF;
END $$

DELIMITER ;