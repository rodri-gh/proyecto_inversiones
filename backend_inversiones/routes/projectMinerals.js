import express from 'express';
import { getHandleError } from '../helpers/handleExceptions.js';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { Mineral, ProjectMineral, OperatingExpense } from '../models/mainExport.js';
import { verifyIfIdExists } from '../helpers/handleId.js';
import sequelize from '../database/connection.js';

const router = express.Router();
router.get('/', (req, res) => {
  try {
    const projectMinerals = ProjectMineral.findAll();
    getHandleSuccess(200)(res, projectMinerals);
  } catch (error) {
    getHandleError(error, res);
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const projectMineral = await ProjectMineral.findAll({
      where: { project_id: id }, 
      include: [{
        model: Mineral, 
        attributes: [
          'id','name', 'price', 'description', 'image']
      }]
     });
    verifyIfIdExists(projectMineral);
    getHandleSuccess(200)(res, projectMineral);id
  } catch (error) {
    getHandleError(error, res);
  }
});

router.post('/', async (req, res) => {
  const { projectId, mineralId, userId, purchasePrice, prePurchase, estimatedPurchasePrice, exitPrice, salePrice } = req.body;
  const transaction = await sequelize.transaction();
  try {
    const operatingExpense = await OperatingExpense.create({
      name: 'gasto de mineral', 
      description: 'se gasto en pago mineral', 
      expenses: purchasePrice ?? 0, 
      projectId: projectId
    }, 
    {transaction});
    console.log(operatingExpense.id);
    const project = await ProjectMineral.create({ projectId, mineralId, userId,
       operatingExpenseId: operatingExpense.id, purchasePrice, prePurchase, 
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
  const { projectId, mineralId, userId, operatingExpenseId ,purchasePrice, prePurchase, estimatedPurchasePrice, exitPrice, salePrice } = req.body;
  const transaction = await sequelize.transaction();
  try {
    const [updatedCount] = await ProjectMineral.update({ 
      projectId, mineralId, userId, operatingExpenseId, purchasePrice, prePurchase,
       estimatedPurchasePrice, exitPrice, salePrice
       }, { where: { id } }, {transaction} 
    );
    const operatingExpense = await OperatingExpense.update({
      name: 'gasto de mineral', 
      description: 'se gasto en mineral', 
      expenses: purchasePrice ?? 0, 
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


export default router;
