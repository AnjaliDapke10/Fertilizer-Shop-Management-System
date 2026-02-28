const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");

router.get("/sales", reportController.salesReport);
router.get("/purchases", reportController.purchaseReport);
router.get("/stock-valuation", reportController.stockValuation);
router.get("/profit-loss", reportController.profitLoss);
router.get("/gst", reportController.gstSummary);

module.exports = router;
