const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');

router.get('/low-stock', inventoryController.getLowStock);
router.get("/near-expiry", inventoryController.getNearExpiry);
router.get("/aging", inventoryController.getStockAging);

module.exports = router;