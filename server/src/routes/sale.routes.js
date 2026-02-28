const express = require("express");
const router = express.Router();
const saleController = require("../controllers/sale.controller");

router.get("/", saleController.getSales);
router.post("/", saleController.createSale);
router.get("/:id", saleController.getSaleById);

module.exports = router;
