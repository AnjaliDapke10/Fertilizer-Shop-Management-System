const express = require("express");
const router = express.Router();

const supplierController = require("../controllers/supplier.controller");

router.get("/", supplierController.getSuppliers);
router.post("/", supplierController.createSupplier);

module.exports = router;
