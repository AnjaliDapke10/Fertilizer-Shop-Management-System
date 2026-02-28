const SupplierModel = require("../models/supplier.model");

exports.getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await SupplierModel.getAll();
    res.json(suppliers);
  } catch (err) {
    next(err);
  }
};

exports.createSupplier = async (req, res, next) => {
  try {
    const supplier = await SupplierModel.create(req.body);
    res.status(201).json(supplier);
  } catch (err) {
    next(err);
  }
};
