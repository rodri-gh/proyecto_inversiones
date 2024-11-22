import express from 'express';
import { getHandleError } from '../helpers/handleExceptions.js';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { Mineral, ProjectMineral, OperatingExpense, 
  User,
  Project,
  Contract
} from '../models/mainExport.js';
import { verifyIfIdExists } from '../helpers/handleId.js';
import sequelize from '../database/connection.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const projectMinerals = ProjectMineral.findAll({
      include: [
        {
          model: User,
          required: false,
        }
      ]
    });
    getHandleSuccess(200)(res, projectMinerals);
  } catch (error) {
    getHandleError(error, res);
  }
});

router.get('/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const projectMineral = await ProjectMineral.findAll({
      where: { project_id: id }, 
      include: [{
        model: Mineral, 
        attributes: [
          'id','name', 'price', 'description', 'image']
      },
      {
        model: User,
        required: false,
      }]
     });
    verifyIfIdExists(projectMineral);
    getHandleSuccess(200)(res, projectMineral);id
  } catch (error) {
    getHandleError(error, res);
  }
});

router.post('/', async (req, res) => {
  const { projectId, mineralId, userId, weightOunces ,purchasePrice, prePurchase, estimatedPurchasePrice, exitPrice, salePrice } = req.body;
  if( await checkInsertioOfPriceFields(projectId, purchasePrice, prePurchase, exitPrice, salePrice) ) { 
    console.log('no estas afectando la logica del proceso puedes seguir!'); 
  } else {
    return res.status(400).json({ error: 'La meta de inversion no se ha alcanzado no puedes actulizar campos de precios de los minerales' });
  }
  let expenseMineral = 0;
  if(purchasePrice > 0 && weightOunces > 0) {
    expenseMineral = purchasePrice * weightOunces;
  }
  const transaction = await sequelize.transaction();
  try {
    const operatingExpense = await OperatingExpense.create({
      name: 'gasto de mineral', 
      description: 'se gasto en pago mineral', 
      expenses: expenseMineral, 
      projectId: projectId
    }, 
    {transaction});
    console.log(operatingExpense.id);
    const project = await ProjectMineral.create({ projectId, mineralId, userId,
       operatingExpenseId: operatingExpense.id, weightOunces, purchasePrice, prePurchase, 
       estimatedPurchasePrice, exitPrice, salePrice }, 
      { transaction });
    await transaction.commit();
    getHandleSuccess(201)(res, "Project mineral created successfully");
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    getHandleError(error, res);
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { projectId, mineralId, userId, operatingExpenseId ,weightOunces ,purchasePrice ,prePurchase, estimatedPurchasePrice, exitPrice, salePrice } = req.body;
  if( await checkInsertioOfPriceFields(projectId, purchasePrice, prePurchase, exitPrice, salePrice) ) {
    console.log('no estas afectando la logica del proceso puedes seguir!'); 
  } else {
    return res.status(422).json({ error: 'Error', message: 'La meta de inversion no se ha alcanzado no puedes actulizar campos de precios' });
  }
  let expenseMineral = 0;
  if(purchasePrice > 0 && weightOunces > 0) {
    expenseMineral = purchasePrice * weightOunces;
  }
  const transaction = await sequelize.transaction();
  try {
    const updatedCount = await ProjectMineral.update({ 
      projectId, mineralId, userId, operatingExpenseId, weightOunces, purchasePrice, prePurchase,
       estimatedPurchasePrice, exitPrice, salePrice
       }, { where: { id } }, {transaction} 
    );
    const operatingExpense = await OperatingExpense.update({
      name: 'gasto de mineral', 
      description: 'se gasto en mineral', 
      expenses: expenseMineral, 
      projectId: projectId
    }, { where : { id: operatingExpenseId }}, {transaction});
    if (updatedCount === 0) {
      return res.status(404).json({ error: 'No se encontró el registro con el ID proporcionado.' });
    }
    await transaction.commit();
    getHandleSuccess(201)(res, "Project mineral updated successfully");
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    getHandleError(error, res);
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction(); 
  try {
    const projectMineralDeleted = await ProjectMineral.update({ deleted: 1 }, {
      where: { id },
    }, { transaction});
    const projectMineralUpdated = await ProjectMineral.findOne({ where: { id }})
    const operatingExpense = await OperatingExpense.update({ deleted : 1}, 
      { where: { id: projectMineralUpdated.operatingExpenseId}}, { transaction});
    verifyIfIdExists(projectMineralDeleted);
    verifyIfIdExists(operatingExpense);
    await transaction.commit();
    getHandleSuccess(204)(res);
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    getHandleError(error, res);
  }
});

async function checkInsertioOfPriceFields(projectId, purchasePrice, prePurchase, exitPrice, salePrice) {
  if( purchasePrice > 0 || prePurchase > 0 || exitPrice > 0 || salePrice > 0) {
    return await verifiInvestmentGoal(projectId);
  }
  return true
}

async function verifiInvestmentGoal(idProject) {
  if (!idProject) {
    console.log('el idProject no existe');
    return false;
  }
  try { 
    const project = await Project.findOne({ where: { id: idProject, deleted: 0}});
    if (!project) {
      console.log('no se encontro el projecto con ese id y estado no eliminado!');
      return false;
    }
    const investmentGoalProject = parseFloat(project.investmentGoal) ||  0;
    const contracts = await Contract.findAll({ where: { projectId: idProject}});
    const totalInvestment = contracts.reduce((acc, item) => acc + (parseFloat(item.investmentAmount) || 0), 0);
    if (totalInvestment >= investmentGoalProject && investmentGoalProject > 0 && totalInvestment > 0) { 
      return true; 
    } else { 
      return false;
    }
  } catch(e) { 
    console.error(e);
    return false; 
  }
}


export default router;
