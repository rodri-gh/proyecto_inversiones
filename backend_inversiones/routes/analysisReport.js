import express from 'express';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { Project, Investment, FinancialTransactions, OperatingExpense} from '../models/mainExport.js';
import { getHandleError } from '../helpers/handleExceptions.js';
import { Sequelize } from 'sequelize';

const router = express.Router();
router.get('/projectsStatus', async (req, res, next) => {
  try {
    const projectsStatus = await Investment.findAll({ 
        include: [ 
            {
                model: Project, 
                attributes: ['name'],
            }
        ], 
        attributes: ['amount', 'project_id'],
        logging: console.log,
    });
    if (projectsStatus.length === 0) {
        console.log('No se encontraron proyectos con inversiones.');
      }
      console.log(projectsStatus)
    getHandleSuccess(200)(res, projectsStatus)
  } catch (error) {
    getHandleError(error, res)
  }
});

router.get('/totalInvestmentVsReturn/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
      const projectsStatus = await Project.findAll({
        where: { id: id },
        attributes: [
            'id',
            [Sequelize.fn('SUM', Sequelize.col('investments.amount')), 'totalInvestmentsAmount'],
            [Sequelize.fn('SUM', Sequelize.col('financialTransactions.amount')), 'totalTransactionsIncome'],
            [Sequelize.fn('SUM', Sequelize.col('operatingExpenses.expenses')), 'totalOperatingExpenses']
        ],
        include: [
            {
                model: Investment,
                attributes: [],
            },
            {
                model: FinancialTransactions,
                attributes: [],
                where: {
                    transaction_type: 'income'
                }
            },
            {
                model: OperatingExpense,
                attributes: []
            }
        ],
        group: ['project.id'],
        logging: console.log
      });
      if (projectsStatus.length === 0) {
          console.log('No se encontraron proyectos con inversiones.');
        }
      getHandleSuccess(200)(res, projectsStatus)
    } catch (error) {
        console.log(error);
      getHandleError(error, res)
    }
  });

  router.get('/cashFlow', async (req, res, next) => {
    try {
      const projectsStatus = await Project.findAll({
        attributes: [
            'id',
            [Sequelize.fn('SUM', Sequelize.col('investments.amount')), 'totalInvestmentsAmount'],
            [Sequelize.fn('SUM', Sequelize.col('financialTransactions.amount')), 'totalTransactionsIncome'],
            [Sequelize.fn('SUM', Sequelize.col('operatingExpenses.expenses')), 'totalOperatingExpenses']
        ],
        include: [
            {
                model: Investment,
                attributes: [],
            },
            {
                model: FinancialTransactions,
                attributes: [],
                where: {
                    transaction_type: 'income'
                }
            },
            {
                model: OperatingExpense,
                attributes: []
            }
        ],
        group: ['project.id'],
        logging: console.log
      });
      if (projectsStatus.length === 0) {
          console.log('No se encontraron proyectos con inversiones.');
        }
      getHandleSuccess(200)(res, projectsStatus)
    } catch (error) {
        console.log(error);
      getHandleError(error, res)
    }
  });

export default router;


