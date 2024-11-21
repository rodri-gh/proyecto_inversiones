import express from 'express';
import { Op } from 'sequelize';
import { Project, Investment, OperatingExpense, ProjectMineral, Mineral, User } from '../models/mainExport.js';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { getHandleError } from '../helpers/handleExceptions.js';
import excel from 'xlsx';

const router = express.Router();

router.get('/projects', async (req, res) => {
  const { startDate, endDate, minAmount, maxAmount, status, mineralId } = req.query;

  try {
    let where = {};
    let projectIds = [];


    if (mineralId) {
      const projectMinerals = await ProjectMineral.findAll({
        where: { mineralId },
        attributes: ['projectId']
      });
      projectIds = projectMinerals.map(pm => pm.projectId);
      where.id = { [Op.in]: projectIds };
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + 1);

      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);

      where.startDate = {
        [Op.between]: [start, end]
      };
    }
    if (minAmount || maxAmount) {
      where.investmentGoal = {};
      if (minAmount) where.investmentGoal[Op.gte] = parseFloat(minAmount);
      if (maxAmount) where.investmentGoal[Op.lte] = parseFloat(maxAmount);
    }

    if (status) {
      where.status = status;
    }

    const projects = await Project.findAll({
      where,
      include: [
        {
          model: Investment,
          attributes: ['id', 'amount']
        },
        {
          model: OperatingExpense,
          attributes: ['expenses']
        },
        {
          model: ProjectMineral,
          include: [{
            model: Mineral,
            attributes: ['name']
          }]
        }
      ]
    });

    const formattedProjects = projects.map(project => {
      const totalInvestments = project.investments.length;
      const totalOperatingExpenses = project.operatingExpenses.reduce((sum, exp) => sum + Number(exp.expenses), 0);
      const profit = project.status === 'closed' ?
        (project.investmentGoal * (project.profitPercentage / 100)) - totalOperatingExpenses :
        0;

      const minerals = project.projectMinerals.map(pm => pm.mineral.name).join(', ');

      return {
        name: project.name,
        description: project.description,
        investmentGoal: Number(project.investmentGoal),
        profitPercentage: project.profitPercentage,
        operatingExpenses: totalOperatingExpenses,
        profit: profit,
        startDate: project.startDate,
        endDate: project.endDate,
        status: project.status,
        investors: totalInvestments,
        minerals: minerals
      };
    });


    const totals = formattedProjects
      .filter(p => p.status === 'closed')
      .reduce((acc, project) => ({
        totalInvestment: acc.totalInvestment + project.investmentGoal,
        totalExpenses: acc.totalExpenses + project.operatingExpenses,
        totalProfit: acc.totalProfit + project.profit
      }), { totalInvestment: 0, totalExpenses: 0, totalProfit: 0 });

    getHandleSuccess(200)(res, { projects: formattedProjects, totals });
  } catch (error) {
    getHandleError(error, res);
  }
});

router.get('/projects/export', async (req, res) => {
  const { startDate, endDate, minAmount, maxAmount, status, mineralId } = req.query;

  try {

    let where = {};
    let projectIds = [];

    if (mineralId) {
      const projectMinerals = await ProjectMineral.findAll({
        where: { mineralId },
        attributes: ['projectId']
      });
      projectIds = projectMinerals.map(pm => pm.projectId);
      where.id = { [Op.in]: projectIds };
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + 1);

      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);

      where.startDate = {
        [Op.between]: [start, end]
      };
    }

    if (minAmount || maxAmount) {
      where.investmentGoal = {};
      if (minAmount) where.investmentGoal[Op.gte] = parseFloat(minAmount);
      if (maxAmount) where.investmentGoal[Op.lte] = parseFloat(maxAmount);
    }

    if (status) {
      where.status = status;
    }

    const projects = await Project.findAll({
      where,
      include: [
        {
          model: Investment,
          attributes: ['id', 'amount']
        },
        {
          model: OperatingExpense,
          attributes: ['expenses']
        },
        {
          model: ProjectMineral,
          include: [{
            model: Mineral,
            attributes: ['name']
          }]
        }
      ]
    });

    const data = projects.map(project => {
      const totalInvestments = project.investments.length;
      const totalOperatingExpenses = project.operatingExpenses.reduce((sum, exp) => sum + Number(exp.expenses), 0);
      const profit = project.status === 'closed' ?
        (project.investmentGoal * (project.profitPercentage / 100)) - totalOperatingExpenses :
        0;
      const minerals = project.projectMinerals.map(pm => pm.mineral.name).join(', ');

      return {
        'Nombre': project.name,
        'Descripción': project.description,
        'Inversión': Number(project.investmentGoal).toFixed(2),
        'Porcentaje Ganancia': `${project.profitPercentage}%`,
        'Gastos Operativos': totalOperatingExpenses.toFixed(2),
        'Ganancia': profit.toFixed(2),
        'Fecha Inicio': new Date(project.startDate).toLocaleDateString(),
        'Fecha Fin': new Date(project.endDate).toLocaleDateString(),
        'Estado': project.status,
        'Inversores': totalInvestments,
        'Minerales': minerals
      };
    });


    const totals = projects
      .filter(p => p.status === 'closed')
      .reduce((acc, project) => {
        const expenses = project.operatingExpenses.reduce((sum, exp) => sum + Number(exp.expenses), 0);
        const profit = (project.investmentGoal * (project.profitPercentage / 100)) - expenses;
        return {
          totalInvestment: acc.totalInvestment + Number(project.investmentGoal),
          totalExpenses: acc.totalExpenses + expenses,
          totalProfit: acc.totalProfit + profit
        };
      }, { totalInvestment: 0, totalExpenses: 0, totalProfit: 0 });


    data.push({
      'Nombre': 'TOTALES',
      'Descripción': '',
      'Inversión': totals.totalInvestment.toFixed(2),
      'Porcentaje Ganancia': '',
      'Gastos Operativos': totals.totalExpenses.toFixed(2),
      'Ganancia': totals.totalProfit.toFixed(2),
      'Fecha Inicio': '',
      'Fecha Fin': '',
      'Estado': '',
      'Inversores': '',
      'Minerales': ''
    });


    const wb = excel.utils.book_new();
    const ws = excel.utils.json_to_sheet(data);
    excel.utils.book_append_sheet(wb, ws, 'Reporte Proyectos');

    const buffer = excel.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=reporte_proyectos.xlsx');
    res.send(buffer);

  } catch (error) {
    getHandleError(error, res);
  }
});

router.get('/users/search', async (req, res) => {
  const { search } = req.query;
  try {
    const users = await User.findAll({
      where: {
        deleted: 0,
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { lastName: { [Op.like]: `%${search}%` } }
        ]
      },
      attributes: ['id', 'name', 'lastName']
    });
    getHandleSuccess(200)(res, users);
  } catch (error) {
    getHandleError(error, res);
  }
});


router.get('/projects/search', async (req, res) => {
  const { search } = req.query;
  try {
    const projects = await Project.findAll({
      where: {
        deleted: 0,
        name: { [Op.like]: `%${search}%` }
      },
      attributes: ['id', 'name']
    });
    getHandleSuccess(200)(res, projects);
  } catch (error) {
    getHandleError(error, res);
  }
});


router.get('/investments', async (req, res) => {
  const { startDate, endDate, minAmount, maxAmount, mineralId, projectId, userId, status } = req.query;

  try {
    let where = {};

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + 1);
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      where.investmentDate = { [Op.between]: [start, end] };
    }

    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount) where.amount[Op.gte] = parseFloat(minAmount);
      if (maxAmount) where.amount[Op.lte] = parseFloat(maxAmount);
    }

    if (projectId) where.projectId = projectId;
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const investments = await Investment.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ['name', 'lastName']
        },
        {
          model: Project,
          include: [{
            model: ProjectMineral,
            include: [{
              model: Mineral,
              attributes: ['name']
            }]
          }]
        }
      ]
    });

    const formattedInvestments = investments.map(inv => {
      const minerals = inv.project.projectMinerals.map(pm => pm.mineral.name).join(', ');

      return {
        userName: `${inv.user.name} ${inv.user.lastName}`,
        projectName: inv.project.name,
        amount: Number(inv.amount),
        investmentDate: inv.investmentDate,
        status: inv.status === 'closed' ? 'Cerrado' : 'Pendiente',
        earnings: inv.status === 'closed' ? Number(inv.earnings) : 'Pendiente',
        minerals: minerals
      };
    });


    const totals = formattedInvestments
      .filter(inv => inv.status === 'Cerrado')
      .reduce((acc, inv) => ({
        totalInvestment: acc.totalInvestment + inv.amount,
        totalEarnings: acc.totalEarnings + (typeof inv.earnings === 'number' ? inv.earnings : 0)
      }), { totalInvestment: 0, totalEarnings: 0 });

    getHandleSuccess(200)(res, { investments: formattedInvestments, totals });
  } catch (error) {
    getHandleError(error, res);
  }
});

router.get('/investments/export', async (req, res) => {
  const { startDate, endDate, minAmount, maxAmount, mineralId, projectId, userId, status } = req.query;

  try {
    let where = {};

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + 1);
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      where.investmentDate = { [Op.between]: [start, end] };
    }

    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount) where.amount[Op.gte] = parseFloat(minAmount);
      if (maxAmount) where.amount[Op.lte] = parseFloat(maxAmount);
    }

    if (projectId) where.projectId = projectId;
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const investments = await Investment.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ['name', 'lastName']
        },
        {
          model: Project,
          include: [{
            model: ProjectMineral,
            include: [{
              model: Mineral,
              attributes: ['name']
            }]
          }]
        }
      ]
    });


    const data = investments.map(inv => {
      const minerals = inv.project.projectMinerals.map(pm => pm.mineral.name).join(', ');

      return {
        'Usuario': `${inv.user.name} ${inv.user.lastName}`,
        'Proyecto': inv.project.name,
        'Monto Inversión': Number(inv.amount).toFixed(2),
        'Fecha Inversión': new Date(inv.investmentDate).toLocaleDateString(),
        'Estado': inv.status === 'closed' ? 'Cerrado' : 'Pendiente',
        'Ganancia': inv.status === 'closed' ? Number(inv.earnings).toFixed(2) : 'Pendiente',
        'Minerales': minerals
      };
    });


    const totalClosed = investments
      .filter(inv => inv.status === 'closed')
      .reduce((sum, inv) => ({
        amount: sum.amount + Number(inv.amount),
        earnings: sum.earnings + Number(inv.earnings || 0)
      }), { amount: 0, earnings: 0 });


    data.push({
      'Usuario': 'TOTALES (Solo cerrados)',
      'Proyecto': '',
      'Monto Inversión': totalClosed.amount.toFixed(2),
      'Fecha Inversión': '',
      'Estado': '',
      'Ganancia': totalClosed.earnings.toFixed(2),
      'Minerales': ''
    });


    const wb = excel.utils.book_new();
    const ws = excel.utils.json_to_sheet(data);
    excel.utils.book_append_sheet(wb, ws, 'Reporte Inversiones');

    const buffer = excel.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=reporte_inversiones.xlsx');
    res.send(buffer);

  } catch (error) {
    getHandleError(error, res);
  }
});


export default router;