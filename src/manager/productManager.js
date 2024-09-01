const Product = require('../models/products');
const fs = require('fs');
const path = require('path');

class ProductManager {
    async addProduct(title, description, price, stock, category, thumbnails = []) {
        console.log('Adding product:', { title, description, price, stock, category, thumbnails });
    
        const newProduct = new Product({ title, description, price, stock, category, thumbnails });
        
        try {
            const savedProduct = await newProduct.save();
            const successMsg = `Producto agregado con ID ${savedProduct._id}`;
            console.log('Product saved:', savedProduct);
            return { success: true, message: successMsg, newProduct: savedProduct };
        } catch (error) {
            console.error('Error saving product:', error.message);
            return { success: false, message: 'Error al agregar producto: ' + error.message };
        }
    }         

    //async getProducts(limit) {
    //    try {
    //        const products = limit ? await Product.find().limit(limit) : await Product.find();
    //        return products;
    //    } catch (error) {
    //        console.error('Error al obtener productos:', error);
    //        return [];
    //    }
    //}

    async getProducts(filter = {}, options = {}) {
        try {
            const products = await Product.paginate(filter, options);
            return {
                docs: products.docs,
                totalDocs: products.totalDocs,
                totalPages: products.totalPages,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevPage: products.prevPage,
                nextPage: products.nextPage
            };
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return { docs: [], totalDocs: 0, totalPages: 0, page: 1, hasPrevPage: false, hasNextPage: false };
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
            const product = await Product.findByIdAndDelete(id);
            if (!product) {
                console.log(`El producto con el ID ${id} no se encuentra.`);
                return false;
            }

            if (product.thumbnails && product.thumbnails.length > 0) {
                for (let thumbnail of product.thumbnails) {
                    if (thumbnail.startsWith('/files/uploads/')) {
                        const imagePath = path.join(__dirname, '..', 'public', thumbnail);
                        if (fs.existsSync(imagePath)) {
                            fs.unlinkSync(imagePath);
                        }
                    }
                }
            }

            console.log('Producto eliminado:', product);
            return true;
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            return false;
        }
    }
}

module.exports = new ProductManager();