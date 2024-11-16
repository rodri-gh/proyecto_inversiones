-- eliminar toda fila d e projects
DELETE FROM projects;

-- probar que la insersion de 50 proyectos simultaneos es posible
INSERT INTO projects (name, description, investment_goal, status, project_type, profit_percentage)
SELECT 'Proyecto', 'Descripción del proyecto', 10000, 'open', 'minero', 10.50
FROM (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION 
      SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION 
      SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION 
      SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION SELECT 16 UNION 
      SELECT 17 UNION SELECT 18 UNION SELECT 19 UNION SELECT 20 UNION 
      SELECT 21 UNION SELECT 22 UNION SELECT 23 UNION SELECT 24 UNION 
      SELECT 25 UNION SELECT 26 UNION SELECT 27 UNION SELECT 28 UNION 
      SELECT 29 UNION SELECT 30 UNION SELECT 31 UNION SELECT 32 UNION 
      SELECT 33 UNION SELECT 34 UNION SELECT 35 UNION SELECT 36 UNION 
      SELECT 37 UNION SELECT 38 UNION SELECT 39 UNION SELECT 40 UNION 
      SELECT 41 UNION SELECT 42 UNION SELECT 43 UNION SELECT 44 UNION 
      SELECT 45 UNION SELECT 46 UNION SELECT 47 UNION SELECT 48  UNION SELECT 49  UNION SELECT 50) AS numbers;
     
 -- probar que no se puede crear mas de 50 projectos simultaneos
INSERT INTO projects (name, description, investment_goal, status, project_type, profit_percentage)
SELECT 'Proyecto', 'Descripción del proyecto', 10000, 'open', 'minero', 10.50
FROM (SELECT 1) AS numbers;


-- no puede haber dos projectos_timelines con el mismo valor de pase al mismo
--                tiempo los dos con el mismo valor en project_id
ALTER TABLE `project_timelines`
ADD CONSTRAINT `unique_project_phase` UNIQUE (`project_id`, `phase`);


