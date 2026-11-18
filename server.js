
const express = require('express');
const http = require('http');
const EventEmitter = require('events');

const app = express();
const server = http.createServer(app);

// Event Emitter
const myEmitter = new EventEmitter();

// Product array
let products = [];

// Synchronous function
function calculateTotalValue() {
    let total = 0;

    products.forEach((p) => {
        total += Number(p.price);
    });

    return total;
}

// Event listeners
myEmitter.on('productAdded', (name) => {
    console.log(name + " added successfully!");
});

myEmitter.on('productDeleted', (id) => {
    console.log("Product " + id + " deleted!");
});

myEmitter.on('productUpdated', (id) => {
    console.log("Product " + id + " updated!");
});

// CREATE - Add Product
app.post('/add', (req, res) => {

    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', () => {

        const product = JSON.parse(body);

        // Check duplicate ID
        const existing = products.find(p => p.id == product.id);

        if (existing) {
            return res.status(400).json({
                message: "Product ID already exists!"
            });
        }

        products.push(product);

        myEmitter.emit('productAdded', product.name);

        res.json({
            message: "Product added successfully!"
        });
    });
});

// READ - Display Products
app.get('/products', (req, res) => {

    res.json({
        products: products,
        totalProducts: products.length,
        totalValue: calculateTotalValue()
    });

});

// UPDATE - Update Product
app.put('/update/:id', (req, res) => {

    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', () => {

        const id = req.params.id;

        const product = products.find(p => p.id == id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found!"
            });
        }

        const updated = JSON.parse(body);

        product.name = updated.name;
        product.price = updated.price;
        product.category = updated.category;

        myEmitter.emit('productUpdated', id);

        res.json({
            message: "Product updated successfully!"
        });
    });
});

// DELETE - Delete Product
app.delete('/delete/:id', (req, res) => {

    const id = req.params.id;

    const product = products.find(p => p.id == id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found!"
        });
    }

    products = products.filter(p => p.id != id);

    myEmitter.emit('productDeleted', id);

    res.json({
        message: "Product deleted successfully!"
    });

});

// Serve HTML page without express.static middleware
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/style.css', (req, res) => {
    res.sendFile(__dirname + '/public/style.css');
});

app.get('/script.js', (req, res) => {
    res.sendFile(__dirname + '/public/script.js');
});

// Start HTTP Server
server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
