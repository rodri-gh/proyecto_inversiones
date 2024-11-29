import express from "express";
import { getHandleSuccess } from "../helpers/handleSuccess.js";
import { OperatingExpense } from "../models/mainExport.js";
import { getHandleError } from "../helpers/handleExceptions.js";
import { verifyIfIdExists } from "../helpers/handleId.js";


const router = express.Router();
router.get("/", function (req, res) {
  try {
    const operatingExpenses = OperatingExpense.findAll();
    getHandleSuccess(200)(res, operatingExpenses);
  } catch (error) {
    getHandleError(error, res)
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const operatingExpense = await OperatingExpense.findOne({
      where: { id },
    });
    verifyIfIdExists(operatingExpense);
    getHandleSuccess(200)(res, operatingExpense);
  } catch (error) {
    getHandleError(error, res)
  }
});

router.get("/project/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const operatingExpenses = await OperatingExpense.findAll({
      where: { projectId: id },
    });
    getHandleSuccess(200)(res, operatingExpenses);
  } catch (error) {
    getHandleError(error, res)
  }
});

router.post("/", async (req, res) => {
  const { name, description, expenses, projectId } = req.body;
  try {
    await OperatingExpense.create({ name, description, expenses, projectId });
    getHandleSuccess(201)(res, "Operating Expenses created successfully");
  } catch (error) {
    getHandleError(error, res)
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, expenses, projectId } = req.body;
  try {
    await OperatingExpense.update({ name, description, expenses, projectId }, {
      where: { id },
    });
    getHandleSuccess(204)(res);
  } catch (error) {
    getHandleError(error, res)
  }
});

router.patch('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const operatingExpense = await OperatingExpense.findOne({ where: { id } });
    if (!operatingExpense) {
      return getHandleError(new Error('OperatingExpense not found'), res);
    }

    const newDeletedStatus = operatingExpense.deleted ? 0 : 1;
    await OperatingExpense.update({ deleted: newDeletedStatus }, { where: { id } });

    getHandleSuccess(200)(res, `OperatingExpense ${newDeletedStatus ? 'deleted' : 'restored'} successfully`);
  } catch (error) {
    getHandleError(error, res);
  }
});

export default router;
