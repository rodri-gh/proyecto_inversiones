import express from 'express';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import MineralPriceHistory from '../models/mineralPriceHistoryModel.js';
import Mineral from '../models/mineralModel.js';
import Op from 'sequelize';
import moment from 'moment';

const router = express.Router();

// precios de los minerales en dolares por onza
const mineralPrices = {
  zinc: { min: 65.1, max: 96.4 },
  plata: { min: 15, max: 35 },
  plomo: { min: 0.45, max: 2.25 },
  cobre: { min: 2.5, max: 6.5 },
  oro: { min: 1700, max: 2200 },
  platino: { min: 850, max: 1250 },
  hierro: { min: 76, max: 147 },
  nikel: { min: 0.22, max: 0.95 },
};

const getRandomPrice = ({ min, max }) => { 
    return (Math.random() * (max - min) + min).toFixed(2);
}

//todos los precios
router.get('/', async function (req, res, next) {
    const prices = Object.entries(mineralPrices).map(([name, range]) => ({
        name,
        price: parseFloat(getRandomPrice(range)),
      }));
    getHandleSuccess(200)(res, prices);
});

//por nombre
router.get('/mineral/:name', async function (req, res) {
    const { name } = req.params;
    const mineral = mineralPrices[name.toLowerCase()];
    if (!mineral) {
        return res.status(404).json({ error: `Mineral ${name} no encontrado` });
    }
    const price = getRandomPrice(mineral);
    getHandleSuccess(200)(res, price);
});

router.get('/historyOfAMonth', async function (req, res) {
    try { 
        const mineralPricesHistory = await MineralPriceHistory.findAll({
            include: [
                {
                  model: Mineral,
                  required: false,
                }
              ]
        });
        const oneMonthAgo = moment().subtract(5, 'months').startOf('day').utc().toDate();
        console.log('Fecha límite (hace un mes):', oneMonthAgo);

        const filteredHistory = mineralPricesHistory.filter(record => {
            const recordDate = moment(record.datePrice); 
            return recordDate.isSameOrAfter(oneMonthAgo);
        });

        getHandleSuccess(200)(res, filteredHistory);
    } catch(e) { 
        console.error(e); 
        getHandleError(e, res)
    }
});

export default router;