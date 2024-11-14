import express from 'express';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { getHandleError } from '../helpers/handleExceptions.js';
import { ProjectTimeline, ProjectMineral } from '../models/mainExport.js';
import { verifyIfIdExists } from '../helpers/handleId.js';
import { created } from '../helpers/customMessage.js';


const router = express.Router();
router.get('/', async (req, res) => {
  try {
    const projectTimelines = await ProjectTimeline.findAll();
    getHandleSuccess(200)(res, projectTimelines);
  } catch (error) {
    getHandleError(error, res)
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const projectTimeline = await ProjectTimeline.findOne({ where: { id } });
    verifyIfIdExists(projectTimeline);
    getHandleSuccess(200)(res, projectTimeline);
  } catch (error) {
    getHandleError(error, res)
  }
});

router.get('/project/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const projectTimeline = await ProjectTimeline.findAll({ 
      where: { project_id: id }
     });
    //verifyIfIdExists(projectTimeline);
    getHandleSuccess(200)(res, projectTimeline);
  } catch (error) {
    console.error(error);
    getHandleError(error, res)
  }
});

router.post('/', async (req, res, next) => {
  const { projectId, phase, startDate, endDate, status, description, priceMineral1, priceMineral2 } = req.body;
  try {
    const projecMinerals = await ProjectMineral.findAll({ where: { projectId: projectId}});
    if (phase === 'pago') {
      const allVerify = projecMinerals.every((mineral) => mineral.salePrice != null && mineral.salePrice > 0);

      if (allVerify) {
        const createdTimeline = await ProjectTimeline.create({ projectId, phase, startDate, endDate, status, description, priceMineral1, priceMineral2 });
        return getHandleSuccess(201)(res, createdTimeline);
      } else {
        return res.status(400).json({ error: 'No se puede agregar esta etapa porque tus minerales deben estar vendidos!' });
      }
    }

    if (phase === 'ganancia') {
      const projectTimelines = await ProjectTimeline.findAll({ where: { projectId } });
      const phasePago = projectTimelines.some((timeline) => timeline.phase === 'pago');

      if (phasePago) {
        const createdTimeline = await ProjectTimeline.create({ projectId, phase, startDate, endDate, status, description, priceMineral1, priceMineral2 });
        return getHandleSuccess(201)(res, createdTimeline);
      } else {
        return res.status(400).json({ error: 'No se puede agregar esta etapa porque no existe una fase de pago!' });
      }
    }

    const createdTimeline = await ProjectTimeline.create({ projectId, phase, startDate, endDate, status, description, priceMineral1, priceMineral2 });
    return getHandleSuccess(201)(res, createdTimeline);

  } catch (error) {
    getHandleError(error, res)
  }
});

router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { projectId, phase, startDate, endDate, status, description, priceMineral1, priceMineral2 } = req.body;
  try {
    const projectTimeline = await ProjectTimeline.update({ projectId, phase, startDate, endDate, status, description, priceMineral1, priceMineral2 },{ 
      where: { id } 
    });
    verifyIfIdExists(projectTimeline);
    getHandleSuccess(204)(res, projectTimeline);
  } catch (error) {
    getHandleError(error, res)
  }
});

export default router;