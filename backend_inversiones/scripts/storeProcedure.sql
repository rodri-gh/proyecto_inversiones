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


-- procedure para ver balances de la parte del cliente
DELIMITER //

    CREATE PROCEDURE GetUserFinancialSummary(IN userId INT)
    BEGIN
        DECLARE currentBalance DECIMAL(18, 2) DEFAULT 0;
        DECLARE activeInvestments DECIMAL(18, 2) DEFAULT 0;
        DECLARE totalEarnings DECIMAL(18, 2) DEFAULT 0;
        DECLARE totalLosses DECIMAL(18, 2) DEFAULT 0;
        DECLARE totalInvestment DECIMAL(18, 2) DEFAULT 0;
        DECLARE roi DECIMAL(18, 2) DEFAULT 0;
        DECLARE totalProfitability DECIMAL(18, 2) DEFAULT 0;

        -- saldo Actual
        SELECT 
            IFNULL(SUM(CASE 
                WHEN transaction_type = 'deposit' THEN amount 
                WHEN transaction_type = 'withdrawal' OR transaction_type = 'investment' THEN -amount 
                ELSE 0 
            END), 0)
        INTO currentBalance
        FROM financial_transactions
        WHERE user_id = userId AND status = 'completed';

        -- inversiones Activas
        SELECT IFNULL(SUM(amount), 0)
        INTO activeInvestments
        FROM investments
        WHERE user_id = userId AND status = 'active';

        -- ganancias Totales
        SELECT IFNULL(SUM(amount_earned), 0)
        INTO totalEarnings
        FROM project_payments
        WHERE user_id = userId AND status = 'completed';

        -- perdidas Totales
        SELECT IFNULL(SUM(amount_invested - amount_earned), 0)
        INTO totalLosses
        FROM project_payments
        WHERE user_id = userId AND amount_earned < amount_invested;

        -- total de Inversiones
        SELECT IFNULL(SUM(amount), 0)
        INTO totalInvestment
        FROM investments
        WHERE user_id = userId;

        -- retorno de inversiion
        IF totalInvestment > 0 THEN
            SET roi = (totalEarnings / totalInvestment) * 100;
        ELSE
            SET roi = 0;
        END IF;

        -- rentabilidad Total
        SET totalProfitability = totalEarnings - totalLosses;

        SELECT 
            currentBalance AS saldo_actual,
            activeInvestments AS inversiones_activas,
            totalEarnings AS ganancias_totales,
            totalLosses AS perdidas_totales,
            roi AS retorno_inversion,
            totalProfitability AS rentabilidad_total;

        -- historia de Movimientos 
        SELECT 'financialTransactions' AS tipo, transaction_type AS descripcion, amount, transaction_date AS fecha
        FROM financial_transactions
        WHERE user_id = userId
        ORDER BY transaction_date DESC
        LIMIT 10;

        -- grafico de Flujo de caja de los últimos 30 días
        SELECT 
            DATE(transaction_date) AS fecha,
            IFNULL(SUM(CASE WHEN transaction_type = 'deposit' THEN amount ELSE 0 END), 0) AS ingresos,
            IFNULL(SUM(CASE WHEN transaction_type = 'withdrawal' THEN amount ELSE 0 END), 0) AS egresos
        FROM financial_transactions
        WHERE user_id = userId AND transaction_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY DATE(transaction_date)
        ORDER BY fecha;

        -- detalle inver Activas
        SELECT 
            project_id,
            amount,
            investment_date,
            currency,
            status
        FROM investments
        WHERE user_id = userId AND status = 'active';
        
    END //

DELIMITER ;


-- procedure para obtener el resumen de los usuarios cliente
DELIMITER //

CREATE PROCEDURE GetUserClientSummary(IN userId INT)
BEGIN
    DECLARE currentBalance DECIMAL(18, 2) DEFAULT 0;

    SELECT 
        IFNULL(SUM(CASE 
            WHEN transaction_type = 'deposit' THEN amount 
            WHEN transaction_type IN ('withdrawal', 'investment') THEN -amount 
            ELSE 0 
        END), 0)
    INTO currentBalance
    FROM financial_transactions
    WHERE user_id = userId AND status = 'completed';

    CREATE TEMPORARY TABLE recent_transactions AS
    SELECT 
        transaction_type AS tipo, 
        amount, 
        transaction_date AS fecha
    FROM financial_transactions
    WHERE user_id = userId
    ORDER BY transaction_date DESC
    LIMIT 10;

    CREATE TEMPORARY TABLE active_investments AS
    SELECT 
        i.project_id,
        i.amount AS monto_invertido,
        i.investment_date AS fecha_inversion,
        i.currency,
        i.status,
        COALESCE(p.amount_earned, 0) AS ganancias,
        COALESCE(p.amount_earned - i.amount, 0) AS perdidas,
        CASE WHEN i.amount > 0 THEN (p.amount_earned / i.amount) * 100 ELSE 0 END AS roi
    FROM investments i
    LEFT JOIN project_payments p ON i.project_id = p.project_id
    WHERE i.user_id = userId AND i.status = 'active';

    CREATE TEMPORARY TABLE transaction_history AS
    SELECT 
        id, 
        transaction_type, 
        amount, 
        transaction_date, 
        status
    FROM financial_transactions
    WHERE user_id = userId
    ORDER BY transaction_date DESC;

    SELECT currentBalance AS saldo_actual;

    SELECT * FROM recent_transactions;

    SELECT * FROM active_investments;

    SELECT * FROM transaction_history;

    DROP TEMPORARY TABLE IF EXISTS recent_transactions, active_investments, transaction_history;

END //

DELIMITER ;