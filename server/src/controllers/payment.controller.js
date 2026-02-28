const PaymentModel = require("../models/payment.model");

exports.createPayment = async (req, res, next) => {
  try {
    const payment = await PaymentModel.createPayment(req.body);
    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
};
