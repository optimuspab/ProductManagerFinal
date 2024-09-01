const { Router } = require('express');
const productManager = require('../manager/productManager');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, sort, category, stock } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (stock !== undefined) filter.stock = { $gt: 0 };

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {}
        };

        const products = await productManager.getProducts(filter, options);

        res.render('home', {
            products: products.docs,
            totalPages: products.totalPages,
            currentPage: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}&limit=${limit}&sort=${sort}&category=${category}&stock=${stock}` : null,
            nextLink: products.hasNextPage ? `/products?page=${products.nextPage}&limit=${limit}&sort=${sort}&category=${category}&stock=${stock}` : null,
        });
    } catch (error) {
        res.status(500).send('Error al cargar productos');
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const result = await productManager.getProductById(pid);

        if (result.success) {
            res.render('productDetail', { product: result.product });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error al cargar los detalles del producto');
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
