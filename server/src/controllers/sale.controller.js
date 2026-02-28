const SaleModel = require("../models/sale.model");

exports.createSale = async (req, res, next) => {
  try {
    const result = await SaleModel.createSale(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.getSales = async (req, res, next) => {
  try {
    const sales = await SaleModel.getAllSales();
    res.json(sales);
  } catch (err) {
    next(err);
  }
};

exports.getSaleById = async (req, res, next) => {
  try {
    const sale = await SaleModel.getSaleById(req.params.id);
    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }
    res.json(sale);
  } catch (err) {
    next(err);
  }
};

