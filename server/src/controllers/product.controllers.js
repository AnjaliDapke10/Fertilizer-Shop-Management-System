const ProductModel = require("../models/product.model");

exports.getProducts = async (req,res,next)=>{

  try{

    const products = await ProductModel.getAll();

    res.status(200).json({
      success:true,
      count:products.length,
      data:products
    });

  }catch(err){

    next(err);

  }

};

exports.createProduct = async (req, res, next) => {
  try {
    console.log("REQ BODY:", req.body);

    const product = await ProductModel.create(req.body);

    res.status(201).json(product);
  } catch (err) {
    console.error("CREATE PRODUCT ERROR >>>", err.message);
    console.error(err.stack);
    res.status(500).json({
      error: err.message
    });
  }
};
