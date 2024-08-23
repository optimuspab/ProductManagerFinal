const express = require('express');
const router = express.Router();
const productManager = require('../manager/productManager');

router.get('/', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = productManager.getProducts(limit);
    res.status(200).json(products);
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

router.post('/', (req, res) => {
    const { title, description, price, code, stock, category, thumbnails } = req.body;
    const result = productManager.addProduct(title, description, price, code, stock, category, thumbnails);

    if (result.success) {
        res.status(201).json({ message: result.message, product: result.newProduct });
    } else {
        res.status(400).json({ message: result.message });
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

router.delete('/:pid', (req, res) => {
    const id = req.params.pid;
    const success = productManager.deleteProduct(id);

    if (success) {
        res.status(204).send();
    } else {
        res.status(404).send('Producto no encontrado');
    }
});
module.exports = router;
