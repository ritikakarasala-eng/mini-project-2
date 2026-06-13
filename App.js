const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// Sample Product Database
let products = [
    {
        id: 1,
        name: 'Laptop',
        stock: 10,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
    },
    {
        id: 2,
        name: 'Phone',
        stock: 20,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
    },
    {
        id: 3,
        name: 'Headphones',
        stock: 15,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
    },
    {
        id: 4,
        name: 'Pendrive',
        stock: 30,
        image: 'https://via.placeholder.com/400x300?text=Pendrive'
    },
    {
        id: 5,
        name: 'Monitor',
        stock: 8,
        image: 'https://via.placeholder.com/400x300?text=Monitor'
    }
];

// GET all products
app.get('/products', (req, res) => {
    res.status(200).json(products);
});

// UPDATE stock
app.post('/stock', (req, res) => {
    const { id, qty } = req.body;

    if (!id || qty === undefined) {
        return res.status(400).json({
            message: 'Product ID and Quantity are required'
        });
    }

    const product = products.find(
        p => p.id === Number(id)
    );

    if (!product) {
        return res.status(404).json({
            message: 'Product not found'
        });
    }

    product.stock += Number(qty);

    res.status(200).json({
        message: 'Stock Updated Successfully',
        product
    });
});

// LOW STOCK ALERT
app.get('/low-stock', (req, res) => {
    const lowStockProducts = products.filter(
        p => p.stock < 10
    );

    res.status(200).json(lowStockProducts);
});

// ADD NEW PRODUCT
app.post('/products', (req, res) => {
    const { name, stock, image } = req.body;

    if (!name || stock === undefined) {
        return res.status(400).json({
            message: 'Name and stock are required'
        });
    }

    const newProduct = {
        id: products.length + 1,
        name,
        stock: Number(stock),
        image: image || 'https://via.placeholder.com/400x300?text=Product'
    };

    products.push(newProduct);

    res.status(201).json({
        message: 'Product Added Successfully',
        product: newProduct
    });
});

// DELETE PRODUCT
app.delete('/products/:id', (req, res) => {
    const id = Number(req.params.id);

    const productIndex = products.findIndex(
        p => p.id === id
    );

    if (productIndex === -1) {
        return res.status(404).json({
            message: 'Product not found'
        });
    }

    const deletedProduct = products.splice(productIndex, 1);

    res.status(200).json({
        message: 'Product Deleted Successfully',
        product: deletedProduct[0]
    });
});

// HOME ROUTE
app.get('/', (req, res) => {
    res.send('🚀 Inventory Management API Running Successfully');
});

// START SERVER
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});