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

exports.updateSupplier = async (req, res, next) => {
  try {

    const supplier = await SupplierModel.update(
      req.params.id,
      req.body
    );

    res.json(supplier);

  } catch (err) {
    next(err);
  }
};

exports.deleteSupplier = async (req, res, next) => {
  try {

    await SupplierModel.delete(req.params.id);

    res.json({ message: "Supplier deleted" });

  } catch (err) {
    next(err);
  }
};