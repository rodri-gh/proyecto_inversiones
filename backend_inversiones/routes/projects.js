import express from 'express';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { Project } from '../models/mainExport.js';
import { getHandleError } from '../helpers/handleExceptions.js';
import { verifyIfIdExists } from '../helpers/handleId.js';


const router = express.Router();
router.get('/', async function (req, res, next) {
  try {
    const projects = await Project.findAll();
    getHandleSuccess(200)(res, projects);
  } catch (error) {
    getHandleError(error, res);
  }
});

router.get('/:id', function (req, res, next) {
  const { id } = req.params;
  try {
    const project = Project.findOne({ where: { id } });
    verifyIfIdExists(project);
    getHandleSuccess(200)(res, project);
  } catch (error) {
    getHandleError(error, res);
  }

});

router.post('/', async (req, res, next) => {
  const { name, description, investmentGoal, status, profitPercentage } = req.body;
  try {
    await Project.create({ name, description, investmentGoal, status, profitPercentage });
    getHandleSuccess(201)(res, "Project created successfully");
  } catch (error) {
    getHandleError(error, res);
  }
});

router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { name, description, investmentGoal, status, profitPercentage } = req.body;
  try {
    const [projectCount] = await Project.update({ name, description, investmentGoal, status, profitPercentage }, {
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
    const [projectDeleted] = await Project.update({ deleted: true }, {
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
    const project = Project.findOne({ where: { id } });
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
    const [projectCount] = await Project.update({ status: newStatus }, {
      where: { id }
    });
    verifyIfIdExists(projectCount);
    getHandleSuccess(204)(res);
  } catch (error) {
    getHandleError(error, res);
  }
});

export default router;