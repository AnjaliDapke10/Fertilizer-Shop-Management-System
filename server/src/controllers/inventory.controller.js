const InventoryModel = require("../models/inventory.model");

exports.getLowStock = async (req, res, next) => {
    try {
    const lowStock = await InventoryModel.getLowStock();
    res.json(lowStock);
    } catch (error) {
    next(error);
    }
};

exports.getNearExpiry = async (req, res, next) => {
  try {
    const days = req.query.days || 30;
    const data = await InventoryModel.getNearExpiry(days);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getStockAging = async (req, res, next) => {
  try {
    const data = await InventoryModel.getStockAging();
    res.json(data);
  } catch (err) {
    next(err);
  }
};


exports.getAvailableProducts = async (req, res, next) => {
  try {
    const data = await InventoryModel.getAvailableProducts();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getInventorySummary = async (req, res, next) => {
  try {
    const data = await InventoryModel.getInventorySummary();
    res.json(data);
  } catch (err) {
    next(err);
  }
};