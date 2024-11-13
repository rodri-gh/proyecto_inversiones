import express from 'express';
import { getHandleError } from '../helpers/handleExceptions.js';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { Mineral, ProjectMineral } from '../models/mainExport.js';
import { verifyIfIdExists } from '../helpers/handleId.js';


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
  const { projectId, mineralId, userId, purchasePrice, prePurchase, estimatedPurchasePrice } = req.body;
  try {
    await ProjectMineral.create({ projectId, userId, mineralId, purchasePrice, prePurchase, estimatedPurchasePrice });
    getHandleSuccess(201)(res, "Project mineral created successfully");
  } catch (error) {
    getHandleError(error, res);
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { projectId, mineralId, userId, purchasePrice, prePurchase, estimatedPurchasePrice } = req.body;
  try {
    const [updatedCount] = await ProjectMineral.update({ 
      projectId, mineralId, userId, purchasePrice, prePurchase,
       estimatedPurchasePrice 
       }, { where: { id } } 
    );
    if (updatedCount === 0) {
      return res.status(404).json({ error: 'No se encontró el registro con el ID proporcionado.' });
    }
    getHandleSuccess(201)(res, "Project mineral updated successfully");
  } catch (error) {
    console.error(error);
    getHandleError(error, res);
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { projectId, mineralId } = req.body;
  try {
    const [projectMineralCount] = await ProjectMineral.update({ projectId, mineralId }, {
      where: { id },
    });
    verifyIfIdExists(projectMineralCount);
    getHandleSuccess(204)(res);
  } catch (error) {
    getHandleError(error, res);
  }
});

router.patch('/:id', (req, res) => {
  const { id } = req.params;
  try {
    const projectMineralDeleted = ProjectMineral.update({ deleted: true }, {
      where: { id },
    });
    verifyIfIdExists(projectMineralDeleted);
    getHandleSuccess(204)(res);
  } catch (error) {
    getHandleError(error, res);
  }
});

export default router;
