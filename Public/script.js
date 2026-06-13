let allProducts = [];

// Load Products
async function loadProducts() {
    try {
        const res = await fetch('/products');
        allProducts = await res.json();

        updateDashboard();
        displayProducts(allProducts);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Update Dashboard
function updateDashboard() {

    document.getElementById('totalProducts').innerText =
        allProducts.length;

    document.getElementById('totalStock').innerText =
        allProducts.reduce(
            (sum, product) => sum + product.stock,
            0
        );

    document.getElementById('lowStock').innerText =
        allProducts.filter(
            product => product.stock < 10
        ).length;
}

// Display Product Cards
function displayProducts(products) {

    const container =
        document.getElementById('products');

    let html = '';

    products.forEach(product => {

        html += `
        <div class="card">

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <div class="content">

                <h3>${product.name}</h3>

                <p>
                    Stock:
                    <span class="${
                        product.stock < 10
                        ? 'low-stock'
                        : ''
                    }">
                        ${product.stock}
                    </span>
                </p>

                ${
                    product.stock < 10
                    ? '<p class="low-stock">⚠️ Low Stock Alert!</p>'
                    : ''
                }

                <button
                    class="add-btn"
                    onclick="updateStock(${product.id}, 1)">
                    Add Stock
                </button>

                <button
                    class="reduce-btn"
                    onclick="updateStock(${product.id}, -1)">
                    Reduce Stock
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteProduct(${product.id})">
                    Delete Product
                </button>

            </div>

        </div>
        `;
    });

    container.innerHTML = html;
}

// Update Stock
async function updateStock(id, qty) {

    try {
        await fetch('/stock', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id,
                qty
            })
        });

        loadProducts();

    } catch (error) {
        console.error('Error updating stock:', error);
    }
}

// Delete Product
async function deleteProduct(id) {

    const confirmDelete =
        confirm('Delete this product?');

    if (!confirmDelete) return;

    try {

        await fetch(`/products/${id}`, {
            method: 'DELETE'
        });

        loadProducts();

    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

// Search Products
document
    .getElementById('search')
    .addEventListener('input', (e) => {

        const value =
            e.target.value.toLowerCase();

        const filteredProducts =
            allProducts.filter(product =>
                product.name
                    .toLowerCase()
                    .includes(value)
            );

        displayProducts(filteredProducts);
    });

// Initial Load
loadProducts();