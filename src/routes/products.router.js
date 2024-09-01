const express = require('express');
const router = express.Router();
const productManager = require('../manager/productManager');
const upload = require('../middlewares/multerConfig.js');

router.get('/', async (req, res) => {
    const { page = 1, limit = 10, sort, category, stock } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (stock !== undefined) filter.stock = { $gt: 0 };

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {}
    };

    try {
        const products = await productManager.getProducts(filter, options);

        const totalPages = Math.ceil(products.totalDocs / options.limit);
        const prevPage = options.page > 1 ? options.page - 1 : null;
        const nextPage = options.page < totalPages ? options.page + 1 : null;

        res.status(200).json({
            status: 'success',
            payload: products.docs,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: options.page,
            hasPrevPage: prevPage !== null,
            hasNextPage: nextPage !== null,
            prevLink: prevPage ? `/api/products?page=${prevPage}&limit=${options.limit}&sort=${sort}&category=${category}&stock=${stock}` : null,
            nextLink: nextPage ? `/api/products?page=${nextPage}&limit=${options.limit}&sort=${sort}&category=${category}&stock=${stock}` : null,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener productos: ' + error.message });
    }
});

router.get('/:pid', (req, res) => {
    const id = parseInt(req.params.pid);
    const result = productManager.getProductById(id);

    if (result.success) {
        res.status(200).json({ id: id, product: result.product });
    } else {
        res.status(404).send(result.message);
    }
});

router.post('/', upload.single('thumbnail'), async (req, res) => {
    const { title, description, price, stock, category } = req.body;
    const thumbnail = req.file ? `/files/uploads/${req.file.filename}` : req.body.thumbnail;

    if (!title || !description || !price || !stock || !category) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios excepto la imagen.' });
    }

    const thumbnails = thumbnail ? [thumbnail] : [];

    const result = await productManager.addProduct(title, description, price, stock, category, thumbnails);

    if (result.success) {
        return res.status(201).json({ message: result.message, product: result.newProduct });
    } else {
        return res.status(400).json({ message: result.message });
    }
});

router.put('/:pid', (req, res) => {
    const id = parseInt(req.params.pid);
    const updatedInfo = req.body;

    const result = productManager.updateProduct(id, updatedInfo);

    if (result.success) {
        res.status(200).json({ message: result.message, product: result.product });
    } else {
        res.status(404).send(result.message);
    }
});

router.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;
    console.log('Deleting product with ID:', productId);
    const result = await productManager.deleteProduct(productId);

    if (result) {
        res.status(204).send();
    } else {
        res.status(404).send('Producto no encontrado');
    }
});


module.exports = router;
