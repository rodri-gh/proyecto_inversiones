-- PROCEDIMIENTOS ALMACENADOS EN LA BASE DE DATOS

-- procedimiento almacenado paaa obtener los ultimos movimientos 
DELIMITER //

    CREATE PROCEDURE getMovementsFromLast7Days()
        BEGIN
            SELECT 'financialTransactions' AS tipo, transaction_type AS descripcion, amount, transaction_date AS fecha
            FROM financial_transactions
            WHERE transaction_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)

            UNION ALL

            SELECT 'Investments' AS tipo, 'Inversión' AS descripcion, amount, investment_date AS fecha
            FROM investments
            WHERE investment_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)

            UNION ALL

            SELECT 'Projects' AS tipo, name AS descripcion, 0 AS amount, start_date AS fecha
            FROM projects
            WHERE start_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)

            ORDER BY fecha DESC;
    END //

DELIMITER ;
