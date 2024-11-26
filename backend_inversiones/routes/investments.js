import express from 'express';
import { getHandleError } from '../helpers/handleExceptions.js';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { Investment, Contract, Project, User, SiteSetting } from '../models/mainExport.js';
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


router.get('/', async (req, res, next) => {
  try {
    const investments = await Investment.findAll();
    getHandleSuccess(200)(res, investments);
  } catch (error) {
    getHandleError(error, res)
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const investments = await Investment.findAll({ where: { userId: id } });
    getHandleSuccess(200)(res, investments);
  } catch (error) {
    getHandleError(error, res)
  }
});

router.get('/formData/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const investments = await Investment.findAll({ where: { userId: id } });
    getHandleSuccess(200)(res, investments);
  } catch (error) {
    getHandleError(error, res)
  }
});

router.get('/user/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const siteSetting = await SiteSetting.findOne();
    const appCommission = siteSetting.appCommission;
    const investments = await Investment.findAll({
      where: { userId: id },
      include: [
        {
          model: Project,
          required: false
        }
      ],
      order: [['investmentDate', 'ASC']]
    });

    const investmentsWithContracts = await Promise.all(
      investments.map(async (investment) => {
        const contract = await Contract.findOne({
          where: { id: investment.contractId }
        });

        const investmentData = investment.toJSON();
        return {
          ...investmentData,
          investmentDate: formatDate(investmentData.investmentDate),
          contract: contract
        };
      })
    );


    getHandleSuccess(200)(res, investmentsWithContracts);
  } catch (error) {
    getHandleError(error, res);
  }
});



router.get('/project/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const investments = await Investment.findAll({
      where: { projectId: id },
      include: [{
        model: User,
        attributes: ['name', 'lastName'],
        as: 'user'
      }]
    });
    getHandleSuccess(200)(res, investments);
  } catch (error) {
    getHandleError(error, res)
  }
})

router.post('/', async (req, res, next) => {
  const { projectId, userId, amount, profitPercentage } = req.body;
  try {
    await Investment.create({ projectId, userId, amount, profitPercentage });
    getHandleSuccess(201)(res, "Investment created successfully");
  } catch (error) {
    getHandleError(error, res)
  }
});

router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { projectId, userId, amount, profitPercentage } = req.body;
  try {
    const [updatedCount] = await Investment.update({ projectId, userId, amount, profitPercentage }, {
      where: { id },
    });
    verifyIfIdExists(updatedCount);
    getHandleSuccess(204)(res);
  } catch (error) {
    getHandleError(error, res)
  }
});

export default router;
