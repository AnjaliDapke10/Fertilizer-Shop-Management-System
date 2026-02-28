const express = require('express');
const cors = require('cors');
const authRoutes = require("./routes/auth.routes");
const productRoutes = require('./routes/product.routes');
const supplierRoutes = require("./routes/supplier.routes");
const customerRoutes = require("./routes/customer.routes");
const purchaseRoutes = require("./routes/purchase.routes");
const saleRoutes = require("./routes/sale.routes");
const paymentRoutes = require("./routes/payment.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const reportRoutes = require("./routes/report.routes");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/health",(req,res)=>{
    res.json({status:"ok",service:"Fertilizer Shop Backend"});
});

app.use("/api/auth", authRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products",productRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/reports", reportRoutes);

module.exports = app;