const ProductModel = require("../models/product.model");

exports.getProducts = async (req, res, next) => {

  try {

    const products = await ProductModel.getAll();

    res.json(products);

  } catch (err) {

    next(err);

  }

};

exports.createProduct = async (req, res, next) => {

  try {

    const product = await ProductModel.create(req.body);

    res.status(201).json(product);

  } catch (err) {

    next(err);

  }

};

exports.deleteProduct = async (req, res, next) => {

  try {

    await ProductModel.delete(req.params.id);

    res.json({ message: "Product deleted" });

  } catch (err) {

    next(err);

  }

};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await ProductModel.update(req.params.id, req.body);
    res.json(product);
  } catch (err) {
    next(err);
  }
};