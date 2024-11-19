import express from 'express';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { getHandleError } from '../helpers/handleExceptions.js';
import { ProjectTimeline, ProjectMineral, OperatingExpense, Investment, ProjectPayment, Project } from '../models/mainExport.js';
import SiteSetting from '../models/siteSettingModel.js';
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
    const projecMinerals = await ProjectMineral.findAll({ where: { projectId: projectId, deleted: 0}});
    if (phase === 'ganancia') {
      console.log('entre al pase de ganancia');
      const allVerify = projecMinerals.every((mineral) => mineral.salePrice != null && mineral.salePrice > 0);
      console.log('despues de verificar los prices ');
      if (allVerify) {
        const createdTimeline = await ProjectTimeline.create({ projectId, phase, startDate, endDate, status, description, priceMineral1, priceMineral2 });
        return getHandleSuccess(201)(res, createdTimeline);
      } else {
        console.log('los minerales del projecto deben estar vendidos!');
        return res.status(400).json({ error: 'No se puede agregar esta etapa porque tus minerales deben estar vendidos!' });
      }
    }

    if (phase === 'pago') {
      const projectTimelines = await ProjectTimeline.findAll({ where: { projectId } });
      const phasePago = projectTimelines.some((timeline) => timeline.phase === 'ganancia');
      if (phasePago) {
        const createdTimeline = await ProjectTimeline.create({ projectId, phase, startDate, endDate, status, description, priceMineral1, priceMineral2 });
        await calculateReturnOnInvestment(projectId, projecMinerals);
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

async function calculateReturnOnInvestment(idProject, projecMinerals) {
  const opertingExpense = await OperatingExpense.findAll({ where: { projectId: idProject}});
  const siteSetings = await SiteSetting.findOne({ where: { id: 1 }});
  const appCommission = (siteSetings.appCommission) / 100;
  const investments = await Investment.findAll({ where: { projectId: idProject}});
  const totalInvestment = investments.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0);
  console.log("inversiones totales"+totalInvestment);
  const totalOperatingExpense = opertingExpense.reduce((acc, item) => acc + (parseFloat(item.expenses) || 0), 0);
  console.log("gastos opera total "+totalOperatingExpense);
  const totalSalePrice = projecMinerals.reduce((acc, item) => acc + (parseFloat(item.salePrice) || 0), 0);
  console.log("venta total "+totalSalePrice);
  var netProfit = totalSalePrice - totalOperatingExpense;
  netProfit = netProfit - (netProfit*appCommission);
  console.log("ganan total "+netProfit);
  const investmentReturn = (netProfit/totalInvestment) * 100; 
  console.log("ROI retorno de inversion "+investmentReturn);
  await paymentsToInvestors(investments, totalInvestment, netProfit);
  return;
}

async function paymentsToInvestors(investments, totalInvestment, netProfit) {
    for (var item of investments) { 
      var userId = item.userId;
      var projectId = item.projectId;
      var userInvestment = item.amount;
      var paymentToInvestor = (userInvestment/totalInvestment) * netProfit;
      console.log('pago al inversor '+' :'+userId+' :'+paymentToInvestor);
      await depositPayment(userId, projectId, userInvestment, paymentToInvestor);
    }
  return;
}

async function depositPayment(userId, projectId, amountInvested, amountEarned, ) {
  await ProjectPayment.create({userId, projectId, amountInvested, amountEarned});
  // arreglar 
  await Project.update({ userId, status:'closed' }, {
    where: { id: projectId }
  });
  return;
}


export default router;


//calculo del retorno de la inversion
//ROI = (Ganancia Neta / Monto total invertido)*100
//Ganancia Neta = ingresos totales(del projecto) - Costos operativos(todo costo)
//Monto total invertido = suma de todas las inversiones realizadas al projecto

//distribucion de ganancias o perdidas 
// las ganancias o perdidas netas se distribuiran propocionalmente entre
//  lo inversionistas dependiendo de su inversion
// Pago Al inversionista = (inversion del inversionista / monto total invertido en el projecto ) * Ganancia Neta
//  Ganancia Neta = ingresos totales(del projecto) - Costos operativos(todo costo)