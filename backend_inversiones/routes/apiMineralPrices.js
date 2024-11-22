import express from 'express';
import { getHandleSuccess } from '../helpers/handleSuccess.js';

const router = express.Router();

// precios de los minerales en dolares por onza
const mineralPrices = {
  oro: { min: 1700, max: 2200 },
  plata: { min: 15, max: 35 },
  platino: { min: 850, max: 1250 },
  cobre: { min: 3, max: 8 },
  hierro: { min: 80, max: 220 },
  nikel: { min: 20, max: 40 },
  zinc: { min: 1.1, max: 3.5 },
  plomo: { min: 0.7, max: 3.2 },
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
router.get('/:name', async function (req, res, next) {
    const { name } = req.params;
    const mineral = mineralPrices[name.toLowerCase()];
    if (!mineral) {
        return res.status(404).json({ error: `Mineral ${name} no encontrado` });
    }
    const price = getRandomPrice(mineral);
    getHandleSuccess(200)(res, price);
});

export default router;