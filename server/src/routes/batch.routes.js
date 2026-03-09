const express = require("express");
const router = express.Router();

const batchController = require("../controllers/batch.controller");

router.get("/product/:productId", batchController.getProductBatches);

module.exports = router;