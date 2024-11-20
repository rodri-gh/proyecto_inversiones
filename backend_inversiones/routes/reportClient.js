import express from 'express';
import { Op } from 'sequelize';
import { Project, Investment, Contract, User } from '../models/mainExport.js';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { getHandleError } from '../helpers/handleExceptions.js';
import excel from 'xlsx';
import path from 'path';


const router = express.Router();

router.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  const { startDate, endDate, minAmount, maxAmount, status } = req.query;

  let where = { userId: id };

  if (startDate && endDate) {
    where.investmentDate = {
      [Op.between]: [new Date(startDate), new Date(endDate)]
    };
  }

  if (minAmount || maxAmount) {
    where.amount = {};
    if (minAmount) {
      where.amount[Op.gte] = parseFloat(minAmount);
    }
    if (maxAmount) {
      where.amount[Op.lte] = parseFloat(maxAmount);
    }
  }

  if (status) {
    where.status = status;
  }

  try {
    const investments = await Investment.findAll({
      where,
      include: [
        {
          model: Contract
        },
        {
          model: Project,
        }
      ],
      order: [['investmentDate', 'ASC']]
    });

    getHandleSuccess(200)(res, investments);
  } catch (error) {
    getHandleError(error, res);
  }
});

router.get('/user/:id/export', async (req, res) => {
  const { id } = req.params;
  const { startDate, endDate, minAmount, maxAmount, status } = req.query;

  let where = { userId: id };

  const user = await User.findByPk(id);

  console.log(user);

  // Aplicar los mismos filtros que el endpoint normal
  if (startDate && endDate) {
    where.investmentDate = {
      [Op.between]: [new Date(startDate), new Date(endDate)]
    };
  }

  if (minAmount || maxAmount) {
    where.amount = {};
    if (minAmount) {
      where.amount[Op.gte] = parseFloat(minAmount);
    }
    if (maxAmount) {
      where.amount[Op.lte] = parseFloat(maxAmount);
    }
  }

  if (status) {
    where.status = status;
  }

  try {
    const investments = await Investment.findAll({
      where,
      include: [
        {
          model: Contract
        },
        {
          model: Project,
        }
      ],
      order: [['investmentDate', 'ASC']]
    });

    console.log('Estados de inversiones:', investments.map(inv => ({
      id: inv.id,
      status: inv.status
    })));

    // Modificar la preparación de datos para Excel
    const data = investments.map(inv => ({
      'Proyecto': inv.project.name,
      'Código de Contrato': inv.contract.contractCode,
      'Monto': Number(inv.amount).toFixed(2),
      'Fecha': new Date(inv.investmentDate).toLocaleDateString(),
      'Porcentaje de Ganancia': `${inv.profitPercentage}%`,
      'Ganancias': inv.status === 'closed' ? Number(inv.earnings).toFixed(2) : '0.00',
      'Estado': inv.status === 'closed' ? 'Cerrado' : 'Pendiente'
    }));

    // Calcular totales (solo inversiones cerradas)
    const totalAmount = investments
      .filter(inv => inv.status === 'closed')
      .reduce((sum, inv) => sum + Number(inv.amount || 0), 0)
      .toFixed(2);

    const totalEarnings = investments
      .filter(inv => inv.status === 'closed')
      .reduce((sum, inv) => sum + Number(inv.earnings || 0), 0)
      .toFixed(2);

    // Agregar fila de totales
    data.push({
      'Proyecto': 'TOTALES',
      'Código de Contrato': '',
      'Monto': totalAmount,
      'Fecha': '',
      'Porcentaje de Ganancia': '',
      'Ganancias': totalEarnings,
      'Estado': ''
    });

    // Crear workbook
    const wb = excel.utils.book_new();
    const ws = excel.utils.json_to_sheet(data);

    // Formato para la última fila (totales)
    const lastRow = data.length;
    ws['!rows'] = [];
    ws['!rows'][lastRow - 1] = { bold: true };

    excel.utils.book_append_sheet(wb, ws, 'Reporte');

    // Generar archivo
    const timestamp = new Date().toISOString().split('T')[0];
    const sanitizedName = `${user.dataValues.name}_${user.dataValues.lastName}`.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `reporte_inversiones_${sanitizedName}_${timestamp}.xlsx`;

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    const buffer = excel.write(wb, { type: 'buffer' });
    res.send(buffer);

    console.log("nombre del archivo", fileName);

  } catch (error) {
    getHandleError(error, res);
  }
});

export default router;