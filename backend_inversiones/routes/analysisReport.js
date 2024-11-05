import express from 'express';
const router = express.Router();

router.get('/dashboard-stats', async (req, res) => { 
    const query = `SELECT p.name AS project_name, SUM(i.amount) AS total_investment 
        FROM projects p JOIN investments i 
        ON p.id = i.project_id GROUP BY p.name;`;
    connection.query(query, async (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({
                error: 'Error retrieving data'
            });
        } 
        res.status(200).json({
            data: results
        });
    })
});

router.get('/cash-flow', async (req, res) => { 
    const query = `SELECT
        (SELECT IFNULL(SUM(amount), 0) FROM investments) AS total_investments,
        (SELECT IFNULL(SUM(expenses), 0) FROM operating_expenses) AS total_operating_expenses,
        (SELECT IFNULL(SUM(amount), 0) FROM movements WHERE type = 'income') AS total_movements_income,
        (SELECT IFNULL(SUM(amount), 0) FROM movements WHERE type = 'expense') AS total_movements_expense,
        (
            (SELECT IFNULL(SUM(amount), 0) FROM investments) +
            (SELECT IFNULL(SUM(amount), 0) FROM movements WHERE type = 'income')
        ) AS total_income,
        (
            (SELECT IFNULL(SUM(expenses), 0) FROM operating_expenses) +
            (SELECT IFNULL(SUM(amount), 0) FROM movements WHERE type = 'expense')
        ) AS total_expenses`;
    connection.query(query, async (error, results) => {
        if (error) {
            console.error(error);   
            return res.status(500).json({
                error: 'Error retrieving data'
            });
        } 
        res.status(200).json({
            data: results
        });
    })
});

export default router;


