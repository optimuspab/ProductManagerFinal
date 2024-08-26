const express = require('express');
const router = express.Router();
const productsRouter = require("./products.router");
const cartsRouter = require("./carts.router");
const viewsRouter = require("./views.router");


router.use("/api/products", productsRouter);
router.use("/api/carts", cartsRouter);
router.use("/", viewsRouter);

module.exports = router;

