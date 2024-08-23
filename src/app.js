const express = require("express");
const handlebars = require("express-handlebars");
const path = require("path");

const app = express();

const productRoutes = require('./routes/products.router');
const cartRoutes = require('./routes/carts.router');
const productManager = require('./manager/productManager');

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));

app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products: productManager.getProducts() });
});

app.get('/home', (req, res) => {
    const products = productManager.getProducts();
    res.render('home', { products });
});

module.exports = app;

