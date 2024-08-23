const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class Product {
    constructor(id, title, description, price, code, stock, category, thumbnails = []) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.status = true;
        this.code = code;
        this.stock = stock;
        this.category = category;
        this.thumbnails = thumbnails;
    }
}

class ProductManager {
    constructor() {
        this.products = [];
        this.filePath = path.join(__dirname, '..', 'data', 'productos.json');
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.log('No se encontraron datos existentes, comenzando con una lista de productos vacía.');
        }
    }

    saveProducts() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
    }

    addProduct(title, description, price, stock, category, thumbnails = []) {
        if (!title || !description || !price || !stock || !category) {
            const errorMsg = 'Todos los campos son obligatorios: title, description, price, stock y category.';
            return { success: false, message: errorMsg };
        }
    
        const code = uuidv4();
    
        const newProduct = new Product(uuidv4(), title, description, price, code, stock, category, thumbnails);
        this.products.push(newProduct);
        this.saveProducts();
        const successMsg = `Producto agregado con código ${code}`;
        return { success: true, message: successMsg, newProduct };
    }

    getProducts(limit) {
        if (limit) {
            return this.products.slice(0, limit);
        }
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            const errorMsg = `No existe producto con el ID ${id}.`;
            return { success: false, message: errorMsg };
        }
        return { success: true, product };
    }  

    updateProduct(id, updatedInfo) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            const errorMsg = `El producto con el ID ${id} no se encuentra.`;
            return { success: false, message: errorMsg };
        }
        
        this.products[productIndex] = { ...this.products[productIndex], ...updatedInfo };
        this.saveProducts();
        
        const successMsg = `Producto actualizado exitosamente.`;
        return { success: true, product: this.products[productIndex], message: successMsg };
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            console.log(`El producto con el ID ${id} no se encuentra.`);
            return false;
        }

        const removedProduct = this.products.splice(productIndex, 1);
        this.saveProducts();
        console.log('Producto eliminado:', removedProduct);
        return true;
    }
}

const productManager = new ProductManager();
module.exports = productManager;
