import express from 'express';
import { getHandleError } from '../helpers/handleExceptions.js';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { ProjectMineral } from '../models/mainExport.js';
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
    const projectMineral = await ProjectMineral.findOne({ where: { id } });
    verifyIfIdExists(projectMineral);
    getHandleSuccess(200)(res, projectMineral);
  } catch (error) {
    console.log(error);
    getHandleError(error, res);
  }
});

router.post('/', async (req, res) => {
  const { projectId, mineralId } = req.body;
  try {
    await ProjectMineral.create({ projectId, mineralId });
    getHandleSuccess(201)(res, "Project mineral created successfully");
  } catch (error) {
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
    const [projectMineralDeleted] = ProjectMineral.update({ deleted: true }, {
      where: { id },
    });
    verifyIfIdExists(projectMineralDeleted);
    getHandleSuccess(204)(res);
  } catch (error) {
    getHandleError(error, res);
  }
});

export default router;
