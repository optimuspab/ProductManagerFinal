const { Router } = require('express');
const productManager = require('../manager/productManager');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        console.log(products);
        res.render('home', { products });
    } catch (error) {
        res.status(500).send('Error al cargar productos');
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).send('Error al cargar productos');
    }
});

module.exports = router;
