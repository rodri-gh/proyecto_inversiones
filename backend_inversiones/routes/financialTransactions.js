import express from 'express';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { FinancialTransactions } from '../models/mainExport.js';
import { getHandleError } from '../helpers/handleExceptions.js';
import { verifyIfIdExists } from '../helpers/handleId.js';
import Op from 'sequelize';
import moment from 'moment';



const router = express.Router();

router.get('/', async function (req, res, next) {
  try {
    const projects = await FinancialTransactions.findAll();
    getHandleSuccess(200)(res, projects);
  } catch (error) {
    getHandleError(error, res);
  }
});

router.get('/:id', function (req, res, next) {
  const { id } = req.params;
  try {
    const project = FinancialTransactions.findOne({ where: { id } });
    verifyIfIdExists(project);
    getHandleSuccess(200)(res, project);
  } catch (error) {
    getHandleError(error, res);
  }

});

router.get('last7days/user/:id', function (req, res, next) {
  const { id } = req.params;
  try {
    const project = FinancialTransactions.findOne({ where: { id } });
    if (!project) {
      return res.status(404).json({ error: 'Proyecto no encontrado.' });
    }
    const twoWeeksAgo = moment().subtract(14, 'days').startOf('day').utc().toDate();
    console.log('Fecha límite (hace 14 días):', twoWeeksAgo);

    const filteredHistory = mineralPricesHistory.filter(record => {
      const recordDate = moment(record.datePrice); 
      return recordDate.isSameOrAfter(twoWeeksAgo);
    });
    getHandleSuccess(200)(res, filteredHistory);
  } catch (error) {
    getHandleError(error, res);
  }
});

router.post('/', async (req, res, next) => {
  const { userId, projectId, transactionType, amount, description, 
    status } = req.body;
  try {
    await FinancialTransactions.create({ userId, projectId, transactionType, amount, description, 
      status });
    getHandleSuccess(201)(res, "Project created successfully");
  } catch (error) {
    getHandleError(error, res);
  }
});

router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { name, description, investmentGoal, status,
    startDate, endDate, projectType, profitPercentage } = req.body;
  try {
    const [projectCount] = await FinancialTransactions.update({ name, description, investmentGoal, status,
      startDate, endDate, projectType, profitPercentage }, {
      where: { id }
    });
    verifyIfIdExists(projectCount);
    getHandleSuccess(204)(res);
  } catch (error) {
    getHandleError(error, res);
  }
});

router.patch('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const [projectDeleted] = await FinancialTransactions.update({ deleted: true }, {
      where: { id }
    });
    verifyIfIdExists(projectDeleted);
    getHandleSuccess(204)(res);
  } catch (error) {
    getHandleError(error, res);
  }
});

router.put('/status/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = FinancialTransactions.findOne({ where: { id } });
    verifyIfIdExists(project);
    let newStatus;
    switch (project.status) {
      case 'open':
        newStatus = 'in_transit';
        break;
      case 'in_transit':
        newStatus = 'closed';
        break;
      case 'closed':
      default:
        newStatus = 'open';
    }
    const [projectCount] = await FinancialTransactions.update({ status: newStatus }, {
      where: { id }
    });
    verifyIfIdExists(projectCount);
    getHandleSuccess(204)(res);
  } catch (error) {
    getHandleError(error, res);
  }
});

export default router;