const BatchModel = require("../models/batch.model");

exports.getProductBatches = async (req, res, next) => {

  try {

    const productId = req.params.productId;

    const batches = await BatchModel.getByProduct(productId);

    res.json(batches);

  } catch (err) {

    next(err);

  }

};