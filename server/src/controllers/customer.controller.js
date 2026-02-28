const CustomerModel = require("../models/customer.model");

exports.getCustomers = async (req, res, next) => {
  try {
    const customers = await CustomerModel.getAll();
    res.json(customers);
  } catch (err) {
    next(err);
  }
};

exports.createCustomer = async (req, res, next) => {
  try {
    const customer = await CustomerModel.create(req.body);
    res.status(201).json(customer);
  } catch (err) {
    next(err);
  }
};

exports.getCustomerOutstanding = async (req, res, next) => {
  try {
    const outstanding = await CustomerModel.getOutstanding(req.params.id);
    res.json(outstanding);
  } catch (err) {
    next(err);
  }
};
