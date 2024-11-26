import express from 'express';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import {
  Project, Investment, Contract, ProjectMineral,
  ProjectTimeline, Mineral,
  OperatingExpense
} from '../models/mainExport.js';
import { getHandleError } from '../helpers/handleExceptions.js';
import { verifyIfIdExists } from '../helpers/handleId.js';


const router = express.Router();

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';

  try {

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    return 'N/A';
  }
};


router.get('/', async function (req, res, next) {
  try {
    const projects = await Project.findAll({
      order: [['startDate', 'ASC']],
      include: [
        {
          model: ProjectMineral,
          where: {
            deleted: 0
          },
          required: false,
          include: [
            {
              model: Mineral,
              required: false,
            }
          ]
        }
      ]
    });
    const formattedProjects = projects.map(project => ({
      ...project.toJSON(),
      startDate: formatDate(project.startDate),
      endDate: formatDate(project.endDate)
    }));

    getHandleSuccess(200)(res, formattedProjects);
  } catch (error) {
    getHandleError(error, res);
  }
});

router.get('/:id', async function (req, res, next) {
  const { id } = req.params;
  try {
    const project = await Project.findOne({
      where: { id: id },
      include: [
        {
          model: Investment,
          required: false,
        },
        {
          model: OperatingExpense,
          required: false,
        },
        {
          model: ProjectMineral,
          required: false,
        }
      ]
    });
    verifyIfIdExists(project);
    getHandleSuccess(200)(res, project);
  } catch (error) {
    getHandleError(error, res);
  }
});

router.get('/user/:id', async function (req, res) {
  const { id } = req.params;
  try {
    const investments = await Investment.findAll({
      where: { userId: id },
      include: [{ model: Project }],
      order: [[Project, 'startDate', 'ASC']]
    });
    const projects = investments.map(investment => investment.project);
    const uniqueProjects = projects
      .filter((project, index, self) =>
        index === self.findIndex((p) => p.id === project.id)
      )
      .map(project => ({
        ...project.toJSON(),
        startDate: formatDate(project.startDate),
        endDate: formatDate(project.endDate)
      }));

    getHandleSuccess(200)(res, uniqueProjects);
  } catch (error) {
    getHandleError(error, res);
  }
});

router.post('/', async (req, res, next) => {
  const { userId, name, description, investmentGoal, status, startDate,
    endDate, projectType, profitPercentage } = req.body;
  try {
    const project = await Project.create({
      userId, name, description, investmentGoal, status,
      startDate, endDate, projectType, profitPercentage
    });
    getHandleSuccess(201)(res, project);
  } catch (e) {
    console.error(e)
    getHandleError(e, res);
  }
});

router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { userId, name, description, investmentGoal, status,
    startDate, endDate, projectType, profitPercentage } = req.body;
  try {
    const [projectCount] = await Project.update({
      name, description, investmentGoal, status,
      startDate, endDate, projectType, profitPercentage
    }, {
      where: { id }
    });
    const projectId = { id: id, name: name };
    getHandleSuccess(201)(res, projectId);
  } catch (error) {
    getHandleError(error, res);
  }
});

router.patch('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = await Project.findOne({ where: { id } });
    if (!project) {
      return getHandleError(new Error('project not found'), res);
    }
    const newDeletedStatus = project.deleted ? 0 : 1;
    //await Project.destroy({ where: { id } });
    await Project.update({ deleted: newDeletedStatus }, { where: { id } });
    getHandleSuccess(200)(res, `User ${newDeletedStatus ? 'deleted' : 'restored'} successfully`);
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