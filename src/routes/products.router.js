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

        const totalPages = Math.ceil(products.totalDocs / options.limit);
        const prevPage = options.page > 1 ? options.page - 1 : null;
        const nextPage = options.page < totalPages ? options.page + 1 : null;

        const paginationPages = [];
        for (let i = 1; i <= totalPages; i++) {
            paginationPages.push({ number: i, active: i === options.page });
        }

        res.render('home', {
            products: products.docs,
            totalPages,
            hasPrevPage: prevPage !== null,
            hasNextPage: nextPage !== null,
            prevLink: prevPage ? `/products?page=${prevPage}&limit=${options.limit}&sort=${sort}&category=${category}&stock=${stock}` : null,
            nextLink: nextPage ? `/products?page=${nextPage}&limit=${options.limit}&sort=${sort}&category=${category}&stock=${stock}` : null,
            paginationPages,
            limit: options.limit
        });
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

router.get('/products/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const result = await productManager.getProductById(productId);
        if (result.success) {
            res.render('productDetail', { product: result.product });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error al cargar el producto');
    }
});

module.exports = router;
