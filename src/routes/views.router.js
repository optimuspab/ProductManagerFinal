const { Router } = require('express');
const productManager = require('../manager/productManager');

const router = Router();

router.get('/', (req, res) => {
    const products = productManager.getProducts();
    res.render('home', { products });
});

router.get('/realtimeproducts', (req, res) => {
    const products = productManager.getProducts();
    res.render('realTimeProducts', { products });
});

router.post('/realtimeproducts', (req, res) => {
    const { title, price } = req.body;
    const newProduct = productManager.addProduct(title, 'Descripción', price, 'Código', 10, 'Categoría');
    
    if (newProduct.success) {
        req.io.emit('products', productManager.getProducts());
    }

    res.redirect('/realtimeproducts');
});

module.exports = (io) => {
    return (req, res, next) => {
        req.io = io;
        next();
    };
};

