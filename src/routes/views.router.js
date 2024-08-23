import { Router } from 'express';
import productManager from '../manager/productManager.js';
import { io } from '../app.js';

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
        io.emit('products', productManager.getProducts());
    }

    res.redirect('/realtimeproducts');
});

export default router;
