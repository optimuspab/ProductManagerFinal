const Product = require('../models/products');
const { v4: uuidv4 } = require('uuid');

class ProductManager {
    async addProduct(title, description, price, stock, category, thumbnails = []) {
        if (!title || !description || !price || !stock || !category) {
            const errorMsg = 'Todos los campos son obligatorios: title, description, price, stock y category.';
            return { success: false, message: errorMsg };
        }

        const code = uuidv4();

        const newProduct = new Product({
            title, description, price, code, stock, category, thumbnails
        });

        try {
            const savedProduct = await newProduct.save();
            const successMsg = `Producto agregado con código ${code}`;
            return { success: true, message: successMsg, newProduct: savedProduct };
        } catch (error) {
            return { success: false, message: 'Error al agregar producto: ' + error.message };
        }
    }

    async getProducts(limit) {
        try {
            const products = limit ? await Product.find().limit(limit) : await Product.find();
            return products;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const product = await Product.findById(id);
            if (!product) {
                const errorMsg = `No existe producto con el ID ${id}.`;
                return { success: false, message: errorMsg };
            }
            return { success: true, product };
        } catch (error) {
            return { success: false, message: 'Error al obtener producto: ' + error.message };
        }
    }

    async updateProduct(id, updatedInfo) {
        try {
            const product = await Product.findByIdAndUpdate(id, updatedInfo, { new: true });
            if (!product) {
                const errorMsg = `El producto con el ID ${id} no se encuentra.`;
                return { success: false, message: errorMsg };
            }
            return { success: true, product, message: 'Producto actualizado exitosamente.' };
        } catch (error) {
            return { success: false, message: 'Error al actualizar producto: ' + error.message };
        }
    }

    async deleteProduct(id) {
        try {
            const result = await Product.findByIdAndDelete(id);
            if (!result) {
                console.log(`El producto con el ID ${id} no se encuentra.`);
                return false;
            }
            console.log('Producto eliminado:', result);
            return true;
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            return false;
        }
    }
}

module.exports = new ProductManager();
