const ReportModel = require("../models/report.model");

exports.salesReport = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const data = await ReportModel.getSalesReport(from, to);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.purchaseReport = async (req, res, next) => {
    try {
    const { from, to } = req.query;
    const data = await ReportModel.getPurchaseReport(from, to);
    res.json(data);
    } catch (err) {
    next(err);
    }
};

exports.stockValuation = async (req, res, next) => {    
    try {
    const data = await ReportModel.getStockValuation();
    res.json(data);
    } catch (err) {
    next(err);
    }
};

exports.profitLoss = async (req, res, next) => {
    try {
        const data = await ReportModel.getProfitLoss();
    res.json(data);
    } catch (err) {
    next(err);
    }
};

exports.gstSummary = async (req, res, next) => {
    try {
        const data = await ReportModel.getGstSummary();
    res.json(data);
    } catch (err) {
    next(err);
    }
};

