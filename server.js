const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.static('public'));

let products = [];

// Load products from real API
async function loadProducts() {
    try {
        const res = await axios.get('https://dummyjson.com/products?limit=10');

        products = res.data.products.map(p => ({
            id: p.id,
            name: p.title,
            stock: p.stock,
            image: p.thumbnail
        }));

        console.log("✅ Products loaded from API");
    } catch (err) {
        console.log("❌ Error loading API:", err.message);
    }
}

// Initialize products before server starts
loadProducts();

// Get Products
app.get('/products', (req, res) => {
    res.json(products);
});

// Update Stock
app.post('/stock', (req, res) => {
    const { id, qty } = req.body;

    const product = products.find(p => p.id === Number(id));

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    product.stock += Number(qty);

    res.json({
        message: 'Stock updated successfully',
        product
    });
});

// Delete Product
app.delete('/products/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const deleted = products.splice(index, 1);

    res.json({
        message: 'Deleted successfully',
        product: deleted[0]
    });
});

// Low stock
app.get('/low-stock', (req, res) => {
    res.json(products.filter(p => p.stock < 10));
});

// Start server
app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});