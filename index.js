const { createServer } = require('http');
const { Server } = require('socket.io');
const app = require('./src/app');
const productManager = require('./src/manager/productManager');
const viewsRouter = require('./src/routes/views.router');

const port = process.env.PORT || 8080;

const server = createServer(app);
const io = new Server(server);

app.use('/', viewsRouter);

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado, ID:', socket.id);

    const products = await productManager.getProducts();
    socket.emit('products', products.docs);

    socket.on('new-product', async (data) => {
        console.log('Datos del nuevo producto recibidos:', data);

        if (!data._id) {
            const newProduct = await productManager.addProduct(data.title, data.description, data.price, data.stock, data.category, data.thumbnails);
            if (newProduct.success) {
                console.log('Producto agregado correctamente:', newProduct.newProduct.title);
                const updatedProducts = await productManager.getProducts();
                io.emit('products', updatedProducts.docs);
            } else {
                console.error('Error al agregar el producto:', newProduct.message);
            }
        } else {
            console.log('Producto ya existente no se agregará de nuevo:', data.title);
        }
    });

    socket.on('delete-product', async (productId) => {
        const result = await productManager.deleteProduct(productId);
        if (result.success) {
            console.log('Producto eliminado correctamente:', productId);
            const updatedProducts = await productManager.getProducts();
            io.emit('products', updatedProducts.docs);
        } else {
            console.error('Error al eliminar el producto:', result.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado, ID:', socket.id);
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
