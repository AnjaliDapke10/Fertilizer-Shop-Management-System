const PurchaseModel = require("../models/purchase.model");

exports.createPurchase = async (req, res, next) => {
  try {
    const result = await PurchaseModel.createPurchase(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.getPurchases = async (req, res, next) => {
  try {
    const purchases = await PurchaseModel.getPurchases();
    res.json(purchases);
  } catch (err) {
    next(err);
  }
};

exports.getPurchaseDetails = async (req, res, next) => {
  try {

    const data = await PurchaseModel.getPurchaseDetails(req.params.id);

    res.json(data);

  } catch (err) {
    next(err);
  }
};

exports.deletePurchase = async (req, res, next) => {

  try {

    await PurchaseModel.deletePurchase(req.params.id);

    res.json({ message: "Purchase deleted" });

  } catch (err) {
    next(err);
  }

};

exports.updatePurchase = async (req, res, next) => {
  try {

    const result = await PurchaseModel.updatePurchase(
      req.params.id,
      req.body
    );

    res.json(result);

  } catch (err) {
    next(err);
  }
};