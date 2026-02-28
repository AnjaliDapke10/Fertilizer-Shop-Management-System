const express = require("express");
const router = express.Router();

const customerController = require("../controllers/customer.controller");

router.get("/", customerController.getCustomers);
router.post("/", customerController.createCustomer);
router.get("/:id/outstanding", customerController.getCustomerOutstanding);

module.exports = router;
