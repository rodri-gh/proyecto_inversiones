import express from 'express';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { Project, Investment,
   FinancialTransactions, OperatingExpense,
  ProjectPayment,
  Contract} from '../models/mainExport.js';
import { getHandleError } from '../helpers/handleExceptions.js';
import { Sequelize } from 'sequelize';
import { sequelize } from '../database/connection.js';

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

  router.get('/getMovementsFromLast7Days', async (req, res, next) => {
    try {
      const results = await sequelize.query('CALL getMovementsFromLast7Days()');
      if (results.length === 0) {
        console.log('Not found movements of the last 7 days.');
      }
      getHandleSuccess(200)(res, results);
    } catch (error) {
      console.error('Error to run store Procedure:', error);
      getHandleError(error, res);
    }
  });

  router.get('/GetUserFinancialSummary/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
      const results = await sequelize.query(`CALL GetUserFinancialSummary(${id})`);
      if (results.length === 0) {
        console.log('Not found balances .');
      }
      getHandleSuccess(200)(res, results);
    } catch (error) {
      console.error('Error to run store Procedure:', error);
      getHandleError(error, res);
    }
  });

  router.get('/GetUserClientSummary/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
      const results = await sequelize.query(`CALL GetUserClientSummary(${id})`);
      if (results.length === 0) {
        console.log('Not found balances .');
      }
      getHandleSuccess(200)(res, results);
    } catch (error) {
      console.error('Error to run store Procedure:', error);
      getHandleError(error, res);
    }
  });

  router.get('/totallyInvested/:id', async (req, res, next) => {
    const { id } = req.params;
    try { 
      const investments = await Investment.findAll({ where: { userId: id}})
      const totallyInvested = investments.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0);
      getHandleSuccess(200)(res, totallyInvested);
    } catch(e) { 
      console.error('Error get Balances for user:', error);
      getHandleError(error, res);
    }
  });

  router.get('/profitsOrlosses/:id', async (req, res, next) => {
    const { id } = req.params;
    try { 
      const projectPaymets = await ProjectPayment.findAll({ where: { userId: id, status: 'pending'}})
      const totallyInvested = projectPaymets.reduce((acc, item) => acc + (parseFloat(item.amountInvested) || 0), 0);
      const profitOrLosess = projectPaymets.reduce((acc, item) => acc + (parseFloat(item.amountEarned) || 0), 0);
      const results = {
        totallyInvested: totallyInvested, 
        profitOrLosess: profitOrLosess
      }
      getHandleSuccess(200)(res, results);
    } catch(e) { 
      console.error('Error get Balances for user:', error);
      getHandleError(error, res);
    }
  });

  router.get('/historyMovementsOfuser/:id', async (req, res, next) => {
    const { id } = req.params;
    try { 
      const results = await sequelize.query(`CALL getMovementsUserBalance(${id})`);
      getHandleSuccess(200)(res, results);
    } catch(e) { 
      console.error('Error get Balances for user:', error);
      getHandleError(error, res);
    }
  });


  router.get('/verifyProjectInvestmentGoal/:id', async (req, res, next) => {
    const { id } = req.params;
    try { 
      const project = await Project.findOne({ where: { id: id, deleted: 0 }}); 
      if (!project) { 
        return res.status(400).json({ error: 'error', message: 'No se encontro el Proyecto!' });
      }
      const investmentGoalOfProject = parseFloat(project.investmentGoal) || 0;
      const investmentsOfProject = await Investment.findAll({ where: { projectId: id }});
      if (!investmentsOfProject) { 
        return res.status(400).json({ error: 'error', message: 'No hay inversiones en el proyecto!' });
      }
      const totalInvestment = investmentsOfProject.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0); 
      const amountAvailableForInvestment = investmentGoalOfProject - totalInvestment;

      getHandleSuccess(200)(res, {
        investmentGoalOfProject: investmentGoalOfProject,
        totalInvestmentOfProject: totalInvestment,
        amountAvailableForInvestment: amountAvailableForInvestment
       });
    } catch(e) { 
      console.error('Error al obtener los montos disponibles para invertir:', e);
      getHandleError(e, res);
    }
  });

  router.get('/investmentOpportunities', async (req, res, next) => {
    try { 
      const projects = await Project.findAll({ 
          where: { status: 'open', deleted: 0 },
          include: [
            {
              model: Investment,
              required: false
            }
          ]
      }); 
      if( !projects || projects.length === 0) {
          return res.status(400).json({ error: 'error', message: 'No se encontraron proyectos!'});
      }
      for(let item of projects) { 
        const totalInvested = item.investments.reduce((sum, investment) => {
          return sum + (parseFloat(investment.amount) || 0);
          }, 0);
        const amountMissingForGoal = parseFloat(item.investmentGoal) - totalInvested || 0;
        item.setDataValue('amountMissingForGoal', amountMissingForGoal);
        item.setDataValue('totalInvested', totalInvested);
      } 
      getHandleSuccess(200)(res, projects);
    } catch(e) { 
      console.error('Error al obtener los montos disponibles para invertir:', e);
      getHandleError(e, res);
    }
  });

export default router;


