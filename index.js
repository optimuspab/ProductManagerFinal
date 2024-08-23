const { createServer } = require('http');
const { Server } = require('socket.io');
const app = require('./src/app');
const productManager = require('./src/manager/productManager');

const port = process.env.PORT || 8080;

const server = createServer(app);

const io = new Server(server);

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.emit('products', productManager.getProducts());

    socket.on('new-product', (data) => {
        const newProduct = productManager.addProduct(data.title, data.description, data.price, data.stock, data.category, data.thumbnails);
        if (newProduct.success) {
            io.emit('products', productManager.getProducts());
        } else {
            console.log(newProduct.message);
        }
    });    

    socket.on('delete-product', (productId) => {
        const success = productManager.deleteProduct(productId);
        if (success) {
            io.emit('products', productManager.getProducts());
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

