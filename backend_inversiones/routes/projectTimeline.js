import express from 'express';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { getHandleError } from '../helpers/handleExceptions.js';
import { ProjectTimeline } from '../models/mainExport.js';
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
    await ProjectTimeline.create({ projectId, phase, startDate, endDate, status, description, priceMineral1, priceMineral2 });
    getHandleSuccess(201)(res, created.projectTimeline);
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
