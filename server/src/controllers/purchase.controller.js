const PurchaseModel = require("../models/purchase.model");

exports.createPurchase = async (req, res, next) => {
  try {
    const result = await PurchaseModel.createPurchase(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};
